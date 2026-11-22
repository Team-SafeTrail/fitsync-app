import {test,expect,type Page} from "@playwright/test";
import {createClient} from "@supabase/supabase-js";
import {mkdir} from "node:fs/promises";
import {randomUUID} from "node:crypto";
import {getApplicationDate,addCalendarDays} from "../../src/features/engagement/calendar";
import {scheduleWeek} from "../../src/features/scheduling/calendar";
import type {Database} from "../../src/types/database";

test.beforeAll(()=>{const url=process.env.NEXT_PUBLIC_SUPABASE_URL;if(process.env.FITSYNC_E2E_LOCAL_DB!=="true"||!url||!["127.0.0.1","localhost"].includes(new URL(url).hostname))throw Error("Coaching completion requires the disposable loopback database.");});
test("learner proposes changes, PT resolves conflicts, and session completion/reversal persists",async({browser})=>{
 test.slow();
 const run=Date.now(),password="Synthetic-Calendar-Ledger-2026!";
 const options={auth:{persistSession:false,autoRefreshToken:false}};
 const setup=createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,options);
 const ptEmail=`workflow-pt-${run}@example.test`,learnerEmail=`workflow-learner-${run}@example.test`;
 const pt=await setup.auth.admin.createUser({email:ptEmail,password,email_confirm:true,user_metadata:{display_name:"Workflow PT synthetic",synthetic:true}});expect(pt.error).toBeNull();
 const learner=await setup.auth.admin.createUser({email:learnerEmail,password,email_confirm:true,user_metadata:{display_name:"Workflow learner synthetic",synthetic:true}});expect(learner.error).toBeNull();
 expect((await setup.from("profiles").update({role:"trainee"}).eq("id",learner.data.user!.id)).error).toBeNull();
 const relation=await setup.from("trainee_profiles").insert({assigned_pt_id:pt.data.user!.id,profile_id:learner.data.user!.id,display_name:"Workflow learner synthetic",primary_goal:"recomp",total_sessions:2,remaining_sessions:2}).select("id").single();expect(relation.error).toBeNull();
 const api=createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,options);expect((await api.auth.signInWithPassword({email:ptEmail,password})).error).toBeNull();
 const day=addCalendarDays(getApplicationDate(),2),week=scheduleWeek(day)!;
 async function book(title:string,start:string,end:string){const r=await api.from("coaching_appointments").insert({trainee_id:relation.data!.id,pt_id:pt.data.user!.id,learner_id:learner.data.user!.id,client_request_id:randomUUID(),title,kind:"training",starts_at:`${day}T${start}:00+07:00`,ends_at:`${day}T${end}:00+07:00`}).select("id").single();expect(r.error).toBeNull();return r.data!.id;}
 const changeTitle=`Synthetic change ${run}`,completeTitle=`Synthetic complete ${run}`;
 const changeId=await book(changeTitle,"09:00","10:00"),completeId=await book(completeTitle,"11:00","12:00");
 const pc=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:"test-results/final-product-video",size:{width:1440,height:1000}}});
 const lc=await browser.newContext({viewport:{width:390,height:844},recordVideo:{dir:"test-results/final-product-video",size:{width:390,height:844}}});
 const a=await pc.newPage(),b=await lc.newPage();
 async function login(page:Page,email:string){await page.goto("/login");await page.getByLabel("Email",{exact:true}).fill(email);await page.getByLabel("Mật khẩu",{exact:true}).fill(password);await page.getByRole("button",{name:"Vào workspace",exact:true}).click();await expect(page).toHaveURL(/\/workspace$/);}
 const url=`/workspace/calendar?week=${week.monday}`;
 try{
  await login(a,ptEmail);await login(b,learnerEmail);await a.goto(url);await b.goto(url);
  const studentCard=b.locator(`article[id="${changeId}"]`),coachCard=a.locator(`article[id="${changeId}"]`);
  async function propose(start:string,end:string,reason:string){await studentCard.getByText("Đề nghị đổi hoặc hủy",{exact:true}).click();const f=studentCard.getByRole("form",{name:"Thay đổi cuộc hẹn"});await f.getByLabel("Bắt đầu mới").fill(`${day}T${start}`);await f.getByLabel("Kết thúc mới").fill(`${day}T${end}`);await f.getByLabel("Lý do thay đổi").fill(reason);await f.getByRole("button",{name:"Gửi đề nghị",exact:true}).click();await expect(studentCard.getByRole("region",{name:"Đề nghị đang chờ"})).toBeVisible();}
  await propose("11:00","12:00","SYNTHETIC: request busy slot");
  const before=await api.from("coaching_appointments").select("starts_at,version").eq("id",changeId).single();expect(before.data!.version).toBe(1);expect(Date.parse(before.data!.starts_at)).toBe(Date.parse(`${day}T09:00:00+07:00`));
  await a.reload();const decision=coachCard.getByRole("form",{name:"Xử lý đề nghị"});await decision.getByRole("button",{name:"Chấp nhận đề nghị",exact:true}).click();await expect(decision.getByRole("alert")).toContainText("trùng lịch");
  await studentCard.getByRole("button",{name:"Rút đề nghị",exact:true}).click();await expect(studentCard.getByRole("region",{name:"Đề nghị đang chờ"})).toHaveCount(0);
  await propose("14:00","15:00","SYNTHETIC: choose available slot");await a.reload();await coachCard.getByRole("button",{name:"Chấp nhận đề nghị",exact:true}).click();await expect(coachCard.locator(".calendar-time")).toContainText("14:00");
  await b.reload();await expect(studentCard.locator(".calendar-time")).toContainText("14:00");
  await studentCard.getByText("Đề nghị đổi hoặc hủy",{exact:true}).click();const cancel=studentCard.getByRole("form",{name:"Thay đổi cuộc hẹn"});await cancel.getByLabel("Thao tác").selectOption("cancel");await cancel.getByLabel("Lý do thay đổi").fill("SYNTHETIC: cancellation request");await cancel.getByRole("button",{name:"Gửi đề nghị",exact:true}).click();await expect(studentCard.getByRole("region",{name:"Đề nghị đang chờ"})).toBeVisible();
  await a.reload();await coachCard.getByRole("button",{name:"Chấp nhận đề nghị",exact:true}).click();await expect(coachCard).toHaveAttribute("data-testid","calendar-retired-appointment");
  expect((await api.from("trainee_profiles").select("remaining_sessions").eq("id",relation.data!.id).single()).data!.remaining_sessions).toBe(2);
  // Isolated clock fixture only: simulate an elapsed appointment without waiting days.
  const fixture=await setup.from("coaching_appointments").update({starts_at:new Date(Date.now()-7200000).toISOString(),ends_at:new Date(Date.now()-3600000).toISOString()}).eq("id",completeId);expect(fixture.error).toBeNull();
  await a.goto("/workspace/calendar");const completed=a.locator(`article[id="${completeId}"]`);await completed.getByText("Xác nhận hoàn thành buổi",{exact:true}).click();const finish=completed.getByRole("form",{name:"Hoàn thành cuộc hẹn"});await finish.getByLabel("Sử dụng buổi PT").selectOption("yes");await finish.getByLabel("Ghi chú xác nhận").fill("SYNTHETIC: elapsed appointment confirmed");await finish.getByRole("checkbox").check();await finish.getByRole("button",{name:"Xác nhận hoàn thành",exact:true}).click();await expect(completed.getByRole("status")).toContainText("Đã trừ 1 buổi PT");
  const balance=()=>api.from("trainee_profiles").select("remaining_sessions,session_version").eq("id",relation.data!.id).single();expect((await balance()).data).toEqual({remaining_sessions:1,session_version:1});
  await completed.getByText("Đảo xác nhận hoàn thành",{exact:true}).click();const reverse=completed.getByRole("form",{name:"Đảo buổi hoàn thành"});await reverse.getByLabel("Lý do sửa sai").fill("SYNTHETIC: mistaken completion corrected");await reverse.getByRole("checkbox").check();await reverse.getByRole("button",{name:"Ghi bút toán đảo buổi",exact:true}).click();await expect(completed.getByRole("status")).toContainText("Đã đảo xác nhận hoàn thành");expect((await balance()).data).toEqual({remaining_sessions:2,session_version:2});
  await b.goto("/workspace");await expect(b.locator(".workspace-session-stat strong")).toHaveText("2");await expect(b.getByTestId("session-ledger-entry")).toHaveCount(3);
  await mkdir("test-results/chat-proof",{recursive:true});for(const width of [1440,390]){await a.setViewportSize({width,height:1000});expect(await a.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await a.screenshot({path:`test-results/chat-proof/final-calendar-ledger-${width}.png`,fullPage:true});}
 }catch(error){await mkdir("test-results/chat-proof",{recursive:true});await Promise.allSettled([a.screenshot({path:"test-results/chat-proof/calendar-workflow-failure-pt.png"}),b.screenshot({path:"test-results/chat-proof/calendar-workflow-failure-learner.png"})]);throw error;}
 finally{await Promise.allSettled([pc.close(),lc.close()]);}
});
