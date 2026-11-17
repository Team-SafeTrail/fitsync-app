import {expect,test,type Page} from "@playwright/test";
import {readFile,mkdir} from "node:fs/promises";
import {resolve} from "node:path";
import {createClient} from "@supabase/supabase-js";
import type {Database} from "../../src/types/database";

const privateRoot=resolve(process.cwd(),"../../../outputs/local-demo-private");
type Account={id:string;email:string;password:string;name:string};
type Manifest={namespace:string;seedComplete:boolean;accounts:Record<string,Account>;trainees:{id:string;accountId:string;ptId:string}[]};
let manifest:Manifest;
test.beforeAll(async()=>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 if(process.env.FITSYNC_E2E_LOCAL_DB!=="true"||!url||!["127.0.0.1","localhost"].includes(new URL(url).hostname))throw new Error("Demo acceptance requires the disposable loopback stack.");
 manifest=JSON.parse(await readFile(resolve(privateRoot,"credentials.json"),"utf8"));
 expect(manifest.namespace).toBe("exe201-local-demo-v1");expect(manifest.seedComplete).toBe(true);
 await mkdir("test-results/local-demo-proof",{recursive:true});
});
async function login(page:Page,label:string){
 const account=manifest.accounts[label];
 await page.goto("/login");await page.getByLabel("Email",{exact:true}).fill(account.email);await page.getByLabel("Mật khẩu",{exact:true}).fill(account.password);await page.getByRole("button",{name:"Vào workspace",exact:true}).click();await expect(page).toHaveURL(label==="admin"?/\/admin$/:/\/workspace$/);
 await expect(page.getByText("DỮ LIỆU MÔ PHỎNG · EXE201",{exact:true})).toBeVisible();
}
async function capture(page:Page,name:string){
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/local-demo-proof/${name}.png`,fullPage:true});
}

test("demo admin keeps actual revenue zero and reconciles labelled simulation",async({page})=>{
 await login(page,"admin");
 const api=createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 const account=manifest.accounts.admin;expect((await api.auth.signInWithPassword({email:account.email,password:account.password})).error).toBeNull();
 const result=await api.rpc("get_admin_overview");expect(result.error).toBeNull();
 const overview=result.data as {paidCustomers:number;recordedRevenueVnd:number;recordedCostVnd:number};
 expect(overview.paidCustomers).toBe(0);expect(overview.recordedRevenueVnd).toBe(0);expect(overview.recordedCostVnd).toBe(0);
 const summary=page.getByTestId("demo-finance-summary");await summary.locator("summary").click();
 for(const value of ["20","3.980.000","3.339.800","640.200"])await expect(summary).toContainText(value);
 await expect(page.getByRole("region",{name:"Sổ thu chi",exact:true})).toContainText("DỮ LIỆU MÔ PHỎNG");
 const row=page.getByRole("row").filter({hasText:"demo-exe201-pt01"});await expect(row).toContainText("Dữ liệu thử");
 const url=await row.getByRole("link",{name:"Tải chứng từ riêng",exact:true}).getAttribute("href");expect(url).toBeTruthy();
 const response=await page.request.get(url!);expect(response.ok()).toBe(true);expect((await response.body()).toString("ascii")).toContain("NOT A REAL PAYMENT RECEIPT");
 const unsigned=new URL(url!);unsigned.pathname=unsigned.pathname.replace("/object/sign/","/object/public/");unsigned.search="";expect((await page.request.get(unsigned.href)).ok()).toBe(false);
 for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await capture(page,`admin-${width}`);}
});

test("demo Pro roster has five persisted profiles and a shared dossier",async({page})=>{
 await login(page,"pt01");
 for(let i=1;i<=5;i++)await expect(page.getByRole("link",{name:new RegExp(`DEMO · Học viên 0${i}`)}).first()).toBeVisible();
 await capture(page,"pt-pro-roster");
 const trainee=manifest.trainees.find(t=>t.accountId===manifest.accounts.learner01.id)!;
 await page.goto(`/workspace/trainees/${trainee.id}#progress`);await expect(page.getByTestId("verified-record")).toHaveCount(3);await capture(page,"pt-progress");
 await page.getByRole("tab",{name:"Membership & buổi",exact:true}).click();await expect(page.getByTestId("membership-summary")).toContainText("DEMO · Membership 30 ngày");await capture(page,"pt-membership");
 await page.getByRole("tab",{name:"Ghi chú",exact:true}).click();await expect(page.getByTestId("coaching-note")).toHaveCount(2);await capture(page,"pt-notes");
 await page.goto("/workspace/calendar");await capture(page,"pt-calendar");
});

test("demo Free reserves three slots and learner sees only shared coaching data",async({page,browser})=>{
 await login(page,"pt02");
 for(let i=6;i<=8;i++)await expect(page.getByRole("link",{name:new RegExp(`DEMO · Học viên 0${i}`)}).first()).toBeVisible();
 await page.goto("/workspace/billing");await expect(page.locator("main")).toContainText("3");await capture(page,"pt-free-billing");
 const context=await browser.newContext({viewport:{width:390,height:844},recordVideo:{dir:"test-results/local-demo",size:{width:390,height:844}}});
 try{
  const learner=await context.newPage();await login(learner,"learner01");await expect(learner.getByTestId("coaching-note")).toHaveCount(1);await expect(learner.getByTestId("coaching-note")).toContainText("chia sẻ với học viên");await expect(learner.getByText(/Ghi chú riêng cho PT/)).toHaveCount(0);await capture(learner,"learner-home-mobile");
  await learner.goto("/workspace/progress");await expect(learner.getByTestId("verified-record")).toHaveCount(3);await capture(learner,"learner-progress-mobile");
 }finally{await context.close();}
});
