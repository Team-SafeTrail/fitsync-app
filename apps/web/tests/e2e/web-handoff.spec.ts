import {expect,test,type Page} from "@playwright/test";
import {randomUUID} from "node:crypto";
import {mkdir} from "node:fs/promises";
import {createClient} from "@supabase/supabase-js";
import type {Database} from "../../src/types/database";
import {getApplicationDate,addCalendarDays} from "../../src/features/engagement/calendar";

async function capture(page:Page,path:string) {
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path,fullPage:(page.viewportSize()?.width??1440)>900});
}
test.use({actionTimeout:15000});
test.beforeAll(()=>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 if(process.env.FITSYNC_E2E_LOCAL_DB!=="true"||!url||!['127.0.0.1','localhost'].includes(new URL(url).hostname)) throw new Error("Handoff acceptance requires the explicitly isolated loopback database.");
});
test("handoff web: profile context, membership revisions, private/shared notes and responsive role surfaces",async({browser})=>{
 test.slow();const run=Date.now(),password="Synthetic-Handoff-2026-Only!";
 const pt=await browser.newContext({viewport:{width:1440,height:1000}}),learner=await browser.newContext({viewport:{width:390,height:844}}),other=await browser.newContext({viewport:{width:1440,height:1000}});
 const a=await pt.newPage(),b=await learner.newPage(),c=await other.newPage();
 const root="test-results/chat-proof";await mkdir(root,{recursive:true});
 const runtime:string[]=[];a.on("pageerror",error=>runtime.push(error.message));b.on("pageerror",error=>runtime.push(error.message));
 try {
  console.info("[handoff-acceptance] PT roster, private intake and linked learner");
  await a.goto("/register");await a.getByLabel("Tên hiển thị").fill("PT synthetic handoff");await a.getByLabel("Email",{exact:true}).fill(`handoff-pt-${run}@example.test`);await a.getByLabel("Mật khẩu",{exact:true}).fill(password);await a.getByRole("button",{name:"Tạo workspace PT",exact:true}).click();await expect(a).toHaveURL(/\/workspace$/);
  await a.getByLabel("Tên hiển thị").fill("Học viên synthetic handoff");await a.getByLabel("Email nhận lời mời").fill(`handoff-learner-${run}@example.test`);await a.getByLabel("Mục tiêu chính").selectOption("recomp");await a.getByLabel("Tổng số buổi").fill("12");await a.getByLabel("Số buổi còn lại").fill("10");await a.getByRole("button",{name:"Tạo học viên & link mời",exact:true}).click();
  const invitation=await a.getByTestId("invitation-link").inputValue();
  const row=a.getByRole("link",{name:/Học viên synthetic handoff/});await expect(row).toBeVisible();const dossier=await row.getAttribute("href");expect(dossier).toMatch(/^\/workspace\/trainees\/[0-9a-f-]{36}$/);
  await capture(a,`${root}/handoff-pt-roster.png`);await row.click();await expect(a).toHaveURL(new RegExp(dossier!+"$"));
  await a.getByRole("tab",{name:"Ghi chú",exact:true}).click();
  let note=a.getByRole("form",{name:"Thêm ghi chú",exact:true});
  const intakePrivate=`Synthetic intake private ${run}`;await note.getByLabel("Nội dung ghi chú").fill(intakePrivate);await note.getByRole("button",{name:"Lưu ghi chú",exact:true}).click();await expect(a.getByTestId("coaching-note")).toContainText(intakePrivate);
  await b.goto(invitation);await capture(b,`${root}/handoff-invitation.png`);await b.getByLabel("Tạo mật khẩu").fill(password);await b.getByRole("button",{name:"Chấp nhận lời mời",exact:true}).click();await expect(b).toHaveURL(/\/workspace$/);
  await a.reload();note=a.getByRole("form",{name:"Thêm ghi chú",exact:true});
  console.info("[handoff-acceptance] membership date versions and explicit note visibility");
  await a.getByRole("tab",{name:"Membership & buổi",exact:true}).click();
  const today=getApplicationDate();const end=addCalendarDays(today,30);
  let membership=a.getByRole("form",{name:"Điều chỉnh membership",exact:true});
  await membership.getByLabel("Tên membership",{exact:true}).fill("Membership synthetic");await membership.getByLabel("Ngày bắt đầu",{exact:true}).fill(today);await membership.getByLabel("Ngày kết thúc",{exact:true}).fill(end);await membership.getByRole("button",{name:"Lưu membership",exact:true}).click();await expect(a.getByTestId("membership-summary")).toContainText("Membership synthetic");await expect(a.getByTestId("membership-summary")).toContainText("31");
  await a.getByText("Điều chỉnh thời hạn",{exact:true}).click();membership=a.getByRole("form",{name:"Điều chỉnh membership",exact:true});await membership.getByLabel("Ngày kết thúc",{exact:true}).fill(addCalendarDays(today,60));await membership.getByRole("button",{name:"Lưu membership",exact:true}).click();await expect(a.getByTestId("membership-summary")).toContainText("61");
  await a.getByRole("tab",{name:"Ghi chú",exact:true}).click();
  const shared=`Synthetic shared guidance ${run}`;await note.getByLabel("Nội dung ghi chú").fill(shared);await note.getByLabel("Ai có thể đọc?").selectOption("shared");await note.getByRole("button",{name:"Lưu ghi chú",exact:true}).click();await expect(a.getByTestId("coaching-note")).toHaveCount(2);
  await note.getByLabel("Nội dung ghi chú").fill("Synthetic unsaved note");
  await a.getByRole("tab",{name:"Tổng quan",exact:true}).click();await a.getByRole("tab",{name:"Ghi chú",exact:true}).click();await expect(note.getByLabel("Nội dung ghi chú")).toHaveValue("Synthetic unsaved note");await note.getByLabel("Nội dung ghi chú").fill("");
  await a.getByRole("tab",{name:"Ghi chú",exact:true}).focus();await a.keyboard.press("ArrowLeft");await expect(a.getByRole("tab",{name:"Membership & buổi",exact:true})).toHaveAttribute("aria-selected","true");await a.keyboard.press("ArrowRight");
  const privateBody=`Synthetic PT private ${run}`;await note.getByLabel("Nội dung ghi chú").fill(privateBody);await note.getByLabel("Ai có thể đọc?").selectOption("private");await note.getByRole("button",{name:"Lưu ghi chú",exact:true}).click();await expect(a.getByTestId("coaching-note")).toHaveCount(3);
  await b.reload();await expect(b.getByTestId("coaching-note")).toHaveCount(1);await expect(b.getByTestId("coaching-note")).toContainText(shared);await expect(b.getByText(intakePrivate,{exact:true})).toHaveCount(0);await expect(b.getByText(privateBody,{exact:true})).toHaveCount(0);await expect(b.getByTestId("membership-summary")).toContainText("61");
  console.info("[handoff-acceptance] verified records, metric switch and phone dossier");
  await a.getByRole("tab",{name:"Nhập số đo",exact:true}).click();
  const intake=a.locator("#intake");await expect(intake.locator('input[name="weightKg"]')).toBeVisible();
  await intake.getByLabel("Cân nặng (kg)",{exact:true}).fill("70");await intake.getByLabel("Khối cơ xương (kg)",{exact:true}).fill("30");await intake.getByLabel("Khối mỡ (kg)",{exact:true}).fill("14");await intake.getByLabel("Tỷ lệ mỡ (%)",{exact:true}).fill("20");await intake.locator('input[name="confirmed"]').check();await intake.getByRole("button",{name:"Xác nhận và lưu",exact:true}).click();await expect(a.getByTestId("verified-record")).toHaveCount(1);
  await intake.getByLabel("Cân nặng (kg)",{exact:true}).fill("69");await intake.getByLabel("Khối cơ xương (kg)",{exact:true}).fill("30.2");await intake.getByLabel("Khối mỡ (kg)",{exact:true}).fill("13.8");await intake.getByLabel("Tỷ lệ mỡ (%)",{exact:true}).fill("20");await intake.locator('input[name="confirmed"]').check();await intake.getByRole("button",{name:"Xác nhận và lưu",exact:true}).click();await expect(a.getByTestId("verified-record")).toHaveCount(2);
  await b.reload();await b.getByRole("button",{name:"Khối cơ xương",exact:true}).click();await expect(b.getByRole("button",{name:"Khối cơ xương",exact:true})).toHaveAttribute("aria-pressed","true");
  await a.getByRole("tab",{name:"Tiến trình",exact:true}).click();await expect(a.getByTestId("verified-record").first()).toBeVisible();
  await capture(a,`${root}/handoff-pt-progress.png`);
  await a.getByRole("tab",{name:"Membership & buổi",exact:true}).click();await capture(a,`${root}/handoff-pt-membership.png`);
  await a.getByRole("tab",{name:"Ghi chú",exact:true}).click();await capture(a,`${root}/handoff-pt-notes.png`);
  await a.getByRole("tab",{name:"Tổng quan",exact:true}).click();
  await capture(a,`${root}/handoff-pt-dossier.png`);await capture(b,`${root}/handoff-trainee-home.png`);
  await b.getByRole("navigation",{name:"Điều hướng chính trên điện thoại"}).getByRole("link",{name:"Tiến trình",exact:true}).click();await expect(b).toHaveURL(/\/workspace\/progress$/);await expect(b.getByTestId("verified-record")).toHaveCount(2);await capture(b,`${root}/handoff-trainee-progress.png`);
  for(const width of [768,390,320]) {await a.setViewportSize({width,height:900});expect(await a.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
  await expect(a.getByRole("navigation",{name:"Điều hướng chính trên điện thoại"})).toBeVisible();await capture(a,`${root}/handoff-pt-dossier-mobile.png`);
  await a.getByRole("navigation",{name:"Điều hướng chính trên điện thoại"}).getByRole("link",{name:"Hôm nay",exact:true}).click();await expect(a).toHaveURL(/\/workspace\/today$/);await expect(a.getByRole("heading",{name:"Một ngày đồng hành tốt hơn.",exact:true})).toBeVisible();expect(await a.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await a.setViewportSize({width:1440,height:1000});await capture(a,`${root}/handoff-pt-today.png`);
  console.info("[handoff-acceptance] membership race through ordinary authenticated RPC");
  const api=createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});const login=await api.auth.signInWithPassword({email:`handoff-pt-${run}@example.test`,password});expect(login.error).toBeNull();const traineeId=dossier!.split("/").at(-1)!;
  const args={target_trainee:traineeId,membership_label:"Membership synthetic",starts_on:today,ends_on:addCalendarDays(today,90),expected_revision:2};
  const race=await Promise.all([api.rpc("save_coaching_membership",{...args,request_id:randomUUID()}),api.rpc("save_coaching_membership",{...args,request_id:randomUUID()})]);expect(race.filter(result=>!result.error)).toHaveLength(1);expect(race.find(result=>result.error)?.error?.code).toBe("40001");
  const balance=await api.from("trainee_profiles").select("remaining_sessions").eq("id",traineeId).single();expect(balance.data?.remaining_sessions).toBe(10);expect(balance.error).toBeNull();
  await c.goto("/register");await c.getByLabel("Tên hiển thị").fill("Other synthetic PT");await c.getByLabel("Email",{exact:true}).fill(`handoff-other-${run}@example.test`);await c.getByLabel("Mật khẩu",{exact:true}).fill(password);await c.getByRole("button",{name:"Tạo workspace PT",exact:true}).click();await expect(c).toHaveURL(/\/workspace$/);const denied=await c.goto(dossier!);expect(denied?.status()).toBe(404);await expect(c.getByTestId("coaching-note")).toHaveCount(0);
  expect(runtime).toEqual([]);
 } catch(error) {console.error("[handoff-acceptance] "+String(error).replace(/eyJ[A-Za-z0-9_.-]+|(?:sb_secret_|sb_publishable_|sbp_)[A-Za-z0-9_-]+/g,"[REDACTED]"));await Promise.allSettled([a.screenshot({path:`${root}/handoff-failure-pt.png`,timeout:1000}),b.screenshot({path:`${root}/handoff-failure-trainee.png`,timeout:1000}),c.screenshot({path:`${root}/handoff-failure-other.png`,timeout:1000})]);throw error;} finally {await Promise.allSettled([pt.close(),learner.close(),other.close()]);}
});

test("handoff admin is a guarded system/demo surface on desktop and phone",async({page})=>{
 const email=`handoff-admin-${Date.now()}@example.test`,password="Synthetic-Admin-2026-Only!";
 // This test-only privilege is restricted by beforeAll to the disposable local DB.
 const setup=createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 const user=await setup.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{display_name:"Admin synthetic handoff",role:"trainee"}});expect(user.error).toBeNull();
 const role=await setup.from("profiles").update({role:"admin"}).eq("id",user.data.user!.id);expect(role.error).toBeNull();
 await page.goto("/login");await page.getByLabel("Email",{exact:true}).fill(email);await page.getByLabel("Mật khẩu",{exact:true}).fill(password);await page.getByRole("button",{name:"Vào workspace",exact:true}).click();await expect(page).toHaveURL(/\/(workspace|admin)/);
 await mkdir("test-results/chat-proof",{recursive:true});
 for(const width of [1440,390]) {await page.setViewportSize({width,height:900});await page.goto("/admin");await expect(page.getByText("Dữ liệu demo OC2:",{exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await capture(page,`test-results/chat-proof/handoff-admin-${width}.png`);}
});

test("handoff public page inventory renders at desktop and phone widths",async({page})=>{
 await mkdir("test-results/chat-proof",{recursive:true});
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:900});
  for(const [name,path] of [["landing","/"],["login","/login"],["register","/register"],["privacy","/privacy"],["terms","/terms"],["tour-pt","/app/dashboard"],["tour-learner","/app/trainee"]]) {
   const response=await page.goto(path);expect(response?.ok()).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await capture(page,`test-results/chat-proof/handoff-${name}-${width}.png`);
  }
 }
});
