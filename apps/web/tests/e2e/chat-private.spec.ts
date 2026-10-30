import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test.use({actionTimeout:15000});

// This suite creates synthetic accounts. Never target the historical production project.
test.beforeAll(() => {
  const target = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (process.env.FITSYNC_E2E_LOCAL_DB !== "true" || !target || !["localhost", "127.0.0.1"].includes(new URL(target).hostname)) {
    throw new Error("Chat acceptance requires explicit FITSYNC_E2E_LOCAL_DB=true and a loopback Supabase test stack. Start the app with that same test configuration and FITSYNC_CHAT_ENABLED=true.");
  }
});

test("linked PT and trainee exchange persisted messages; outsider cannot open thread", async ({ browser }) => {
  test.slow();
  const run = Date.now();
  const password = "Synthetic-Chat-2026-Only!";
  const pt = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const learner = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const outsider = await browser.newContext();
  const a = await pt.newPage(), b = await learner.newPage(), c = await outsider.newPage();
  try {
    console.info("[chat-acceptance] register PT and create invitation");
    await a.goto("/register");
    await a.getByLabel("Tên hiển thị").fill("Chat PT synthetic");
    await a.getByLabel("Email", {exact:true}).fill(`chat-pt-${run}@example.test`);
    await a.getByLabel("Mật khẩu", {exact:true}).fill(password);
    await a.getByRole("button", {name:"Tạo workspace PT"}).click();
    await expect(a).toHaveURL(/\/workspace$/);
    await a.getByLabel("Tên hiển thị").fill("Chat learner synthetic");
    await a.getByLabel("Email nhận lời mời").fill(`chat-learner-${run}@example.test`);
    await a.getByLabel("Mục tiêu chính").selectOption("recomp");
    await a.getByLabel("Tổng số buổi").fill("12");
    await a.getByLabel("Số buổi còn lại").fill("12");
    await a.getByRole("button", {name:"Tạo học viên",exact:true}).click();
    const invitation = await a.getByTestId("invitation-link").inputValue();
    console.info("[chat-acceptance] accept invitation as learner");
    await b.goto(invitation);
    await b.getByLabel("Tạo mật khẩu").fill(password);
    await b.getByRole("button", {name:"Chấp nhận lời mời"}).click();
    await expect(b).toHaveURL(/\/workspace$/);
    console.info("[chat-acceptance] open thread and send PT message");
    await a.goto("/workspace/chat");
    await a.getByRole("link", {name:/Chat learner synthetic/}).click();
    const thread = new URL(a.url()).pathname;
    const message = `Synthetic hello ${run}`;
    await a.getByLabel("Tin nhắn", {exact:true}).fill(message);
    await a.getByRole("button", {name:"Gửi tin nhắn",exact:true}).click();
    await expect(a.getByText(message,{exact:true})).toBeVisible();
    console.info("[chat-acceptance] learner reads and replies");
    await b.goto("/workspace/chat");
    await expect(b).toHaveURL(new RegExp(thread+"$"));
    await expect(b.getByText(message,{exact:true})).toBeVisible();
    const reply = `Synthetic reply ${run}`;
    await b.getByLabel("Tin nhắn", {exact:true}).fill(reply);
    await b.getByRole("button", {name:"Gửi tin nhắn",exact:true}).click();
    await expect(b.getByText(reply,{exact:true})).toBeVisible();
    await a.reload();
    await expect(a.getByText(reply,{exact:true})).toBeVisible();
    await expect(a.getByText(message,{exact:true})).toHaveCount(1);
    console.info("[chat-acceptance] persisted exchange verified; test outsider denial");
    expect(await b.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await mkdir("test-results/chat-proof", {recursive:true});
    await a.screenshot({path:"test-results/chat-proof/pt.png",fullPage:true});
    await b.screenshot({path:"test-results/chat-proof/trainee.png",fullPage:true});
    await c.goto("/register");
    await c.getByLabel("Tên hiển thị").fill("Other PT synthetic");
    await c.getByLabel("Email", {exact:true}).fill(`chat-other-${run}@example.test`);
    await c.getByLabel("Mật khẩu", {exact:true}).fill(password);
    await c.getByRole("button", {name:"Tạo workspace PT"}).click();
    await expect(c).toHaveURL(/\/workspace$/);
    const denied = await c.goto(thread);
    expect(denied?.status()).toBe(404);
    await expect(c.getByText(message,{exact:true})).toHaveCount(0);
  } catch (error) {
    await mkdir("test-results/chat-proof", {recursive:true});
    await Promise.allSettled([a.screenshot({path:"test-results/chat-proof/failure-pt.png",timeout:1000}),b.screenshot({path:"test-results/chat-proof/failure-learner.png",timeout:1000})]);
    throw error;
  } finally { await Promise.allSettled([pt.close(),learner.close(),outsider.close()]); }
});
