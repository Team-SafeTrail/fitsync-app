import {expect,test,type Page} from "@playwright/test";
import {randomUUID} from "node:crypto";
import {mkdir} from "node:fs/promises";
import {createClient} from "@supabase/supabase-js";
import {addCalendarDays,getApplicationDate} from "../../src/features/engagement/calendar";
import type {Database} from "../../src/types/database";

test.use({actionTimeout:15000});
test.beforeAll(()=>{
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  if(process.env.FITSYNC_E2E_LOCAL_DB!=="true"||!url||!["127.0.0.1","localhost"].includes(new URL(url).hostname)) throw new Error("Calendar acceptance requires the explicit disposable loopback test stack.");
});

test("shared calendar persists, rejects overlapping/racing bookings and does not debit PT sessions",async({browser})=>{
  test.slow();
  const run=Date.now(); const password="Synthetic-Calendar-2026-Only!";
  const pt=await browser.newContext({viewport:{width:1440,height:1000}});
  const learner=await browser.newContext({viewport:{width:390,height:844}});
  const other=await browser.newContext();
  const a=await pt.newPage(),b=await learner.newPage(),c=await other.newPage();
  async function register(page:Page,email:string) {
    await page.goto("/register"); await page.getByLabel("Tên hiển thị").fill("Calendar PT synthetic");
    await page.getByLabel("Email",{exact:true}).fill(email); await page.getByLabel("Mật khẩu",{exact:true}).fill(password);
    await page.getByRole("button",{name:"Tạo workspace PT",exact:true}).click(); await expect(page).toHaveURL(/\/workspace$/);
  }
  try {
    console.info("[calendar-acceptance] register linked participants");
    await register(a,`calendar-pt-${run}@example.test`);
    await a.getByLabel("Tên hiển thị").fill("Calendar learner synthetic");
    await a.getByLabel("Email nhận lời mời").fill(`calendar-learner-${run}@example.test`);
    await a.getByLabel("Mục tiêu chính").selectOption("recomp");
    await a.getByLabel("Tổng số buổi").fill("12"); await a.getByLabel("Số buổi còn lại").fill("8");
    await a.getByRole("button",{name:"Tạo học viên & link mời",exact:true}).click();
    await b.goto(await a.getByTestId("invitation-link").inputValue());
    await b.getByLabel("Tạo mật khẩu").fill(password); await b.getByRole("button",{name:"Chấp nhận lời mời",exact:true}).click();
    await expect(b).toHaveURL(/\/workspace$/);
    await b.getByRole("navigation",{name:"Điều hướng chính trên điện thoại"}).getByRole("link",{name:"Lịch của bạn",exact:true}).click();
    await expect(b).toHaveURL(/\/workspace\/calendar$/);
    await expect(b.getByRole("form",{name:"Xếp cuộc hẹn"})).toHaveCount(0);
    await a.goto("/workspace/calendar");
    const entry=a.getByRole("form",{name:"Xếp cuộc hẹn"});
    const day=addCalendarDays(getApplicationDate(),2);
    async function fill(title:string,start:string,end:string) {
      await entry.getByLabel("Học viên",{exact:true}).selectOption({label:"Calendar learner synthetic"});
      await entry.getByLabel("Tên cuộc hẹn",{exact:true}).fill(title);
      await entry.getByLabel("Bắt đầu",{exact:true}).fill(`${day}T${start}`);
      await entry.getByLabel("Kết thúc",{exact:true}).fill(`${day}T${end}`);
    }
    const first=`Synthetic appointment ${run}`;
    await fill(first,"09:00","10:00"); await entry.getByRole("button",{name:"Thêm cuộc hẹn",exact:true}).click();
    await expect(entry.getByRole("status")).toContainText("Không trừ buổi PT");
    await expect(a).toHaveURL(/\/workspace\/calendar\?week=/);
    await expect(a.getByRole("heading",{name:first,exact:true})).toBeVisible();
    const calendarUrl=a.url();
    await b.goto(calendarUrl); await expect(b.getByRole("heading",{name:first,exact:true})).toBeVisible();
    await a.reload(); await b.reload();
    await expect(a.getByRole("heading",{name:first,exact:true})).toBeVisible();
    await expect(b.getByRole("heading",{name:first,exact:true})).toBeVisible();
    console.info("[calendar-acceptance] UI overlap, adjacent appointment and lost acknowledgment");
    await fill(`Synthetic overlap ${run}`,"09:30","10:30");
    await entry.getByRole("button",{name:"Thêm cuộc hẹn",exact:true}).click();
    await expect(entry.getByRole("alert")).toContainText("trùng lịch");
    await expect(entry.getByLabel("Bắt đầu",{exact:true})).toHaveValue(`${day}T09:30`);
    await expect(a.getByTestId("calendar-appointment")).toHaveCount(1);
    await fill(`Synthetic adjacent ${run}`,"10:00","11:00");
    await entry.getByRole("button",{name:"Thêm cuộc hẹn",exact:true}).click();
    await expect(a.getByTestId("calendar-appointment")).toHaveCount(2);
    const api=createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
    const login=await api.auth.signInWithPassword({email:`calendar-pt-${run}@example.test`,password}); expect(login.error).toBeNull();
    const relation=await api.from("trainee_profiles").select("id,profile_id,remaining_sessions").eq("assigned_pt_id",login.data.user!.id).single();
    expect(relation.error).toBeNull(); expect(relation.data!.remaining_sessions).toBe(8);
    let dropped=false;
    const loseAck=async(route:import("@playwright/test").Route)=>{
      if(!dropped&&route.request().method()==="POST"&&route.request().headers()["next-action"]) {dropped=true; await route.fetch(); await route.abort("failed");}
      else await route.continue();
    };
    await a.route("**/workspace/calendar**",loseAck);
    const retry=`Synthetic retry appointment ${run}`;
    await fill(retry,"11:00","12:00"); const nonce=await entry.locator('input[name="clientRequestId"]').inputValue();
    await entry.getByRole("button",{name:"Thêm cuộc hẹn",exact:true}).click();
    await expect(entry.getByRole("alert")).toContainText("Kết nối bị gián đoạn");
    await expect(entry.getByLabel("Tên cuộc hẹn",{exact:true})).toHaveValue(retry);
    await expect(entry.locator('input[name="clientRequestId"]')).toHaveValue(nonce);
    const committed=await api.from("coaching_appointments").select("id").eq("pt_id",login.data.user!.id).eq("client_request_id",nonce);
    expect(committed.error).toBeNull(); expect(committed.data).toHaveLength(1);
    await a.unroute("**/workspace/calendar**",loseAck);
    await entry.getByRole("button",{name:"Thêm cuộc hẹn",exact:true}).click();
    await expect(a.getByTestId("calendar-appointment")).toHaveCount(3);
    console.info("[calendar-acceptance] simultaneous direct authenticated inserts; same range");
    const payload={trainee_id:relation.data!.id,learner_id:relation.data!.profile_id!,pt_id:login.data.user!.id,title:`Synthetic race ${run}`,kind:"training",starts_at:`${day}T13:00:00+07:00`,ends_at:`${day}T14:00:00+07:00`};
    const race=await Promise.all([api.from("coaching_appointments").insert({...payload,client_request_id:randomUUID()}),api.from("coaching_appointments").insert({...payload,client_request_id:randomUUID()})]);
    expect(race.filter(result=>!result.error)).toHaveLength(1); expect(race.find(result=>result.error)?.error?.code).toBe("23P01");
    const balance=await api.from("trainee_profiles").select("remaining_sessions").eq("id",relation.data!.id).single();
    expect(balance.error).toBeNull(); expect(balance.data!.remaining_sessions).toBe(8);
    await a.reload(); await b.goto(calendarUrl);
    await expect(a.getByTestId("calendar-appointment")).toHaveCount(4); await expect(b.getByTestId("calendar-appointment")).toHaveCount(4);
    expect(await b.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await mkdir("test-results/chat-proof",{recursive:true});
    await a.screenshot({path:"test-results/chat-proof/calendar-pt.png",fullPage:true}); await b.screenshot({path:"test-results/chat-proof/calendar-trainee.png",fullPage:true});
    await a.setViewportSize({width:390,height:844});
    await expect(a.getByRole("navigation",{name:"Điều hướng chính trên điện thoại"})).toBeVisible();
    expect(await a.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await register(c,`calendar-other-${run}@example.test`); await c.goto(calendarUrl);
    await expect(c.getByTestId("calendar-appointment")).toHaveCount(0); await expect(c.getByText(first,{exact:true})).toHaveCount(0);
  } catch(error) {
    await mkdir("test-results/chat-proof",{recursive:true});
    await Promise.allSettled([a.screenshot({path:"test-results/chat-proof/calendar-failure-pt.png",timeout:1000}),b.screenshot({path:"test-results/chat-proof/calendar-failure-trainee.png",timeout:1000})]); throw error;
  } finally {await Promise.allSettled([pt.close(),learner.close(),other.close()]);}
});
