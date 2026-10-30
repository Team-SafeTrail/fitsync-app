import { expect, test } from "@playwright/test";

for (const width of [1440, 390, 320]) {
  test(`approved coaching language and sample review work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Cùng tập/ })).toBeVisible();
    await page.getByRole("button", { name: "Học viên", exact: true }).click();
    await expect(page.locator("[data-pt-only]")).not.toBeVisible();
    await expect(page.locator("[data-trainee-only]")).toBeVisible();
    await page.getByRole("button", { name: "Huấn luyện viên", exact: true }).click();
    await expect(page.locator("[data-pt-only]")).toBeVisible();
    await page.getByRole("button", { name: "Thử mở bản nháp" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    const confirm = sheet.getByRole("button", { name: "Xác nhận bản mẫu" });
    await expect(confirm).toBeDisabled();
    await sheet.getByRole("checkbox").check();
    await confirm.click();
    await expect(sheet.getByRole("status")).toContainText("Không lưu");
    await page.keyboard.press("Escape");
    await expect(sheet).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Thử mở bản nháp" })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto("/app/dashboard");
    await page.getByRole("textbox", { name: "Tìm học viên" }).fill("khánh linh");
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("Khánh Linh");
    await page.getByRole("button", { name: "Đọc phiếu mẫu", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Đọc phiếu mẫu", exact: true })).toBeFocused();
    await page.goto("/app/trainee");
    await expect(page.getByRole("heading", { name: "Hôm nay của Linh" })).toBeVisible();
    await page.getByRole("button", { name: /Ghi bữa trưa/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

test("public auth, invitation and legal surfaces retain shared navigation", async ({ page }) => {
  for (const route of ["/login", "/register", "/invite/invalid", "/privacy", "/terms"]) {
    await page.goto(route);
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.getByRole("link", {name:/FitSync|Trang giới thiệu|trang chủ/i}).first()).toHaveAttribute("href", "/");
  }
  await page.goto("/workspace");
  await expect(page).toHaveURL(/\/login/);
});

test("real chat routes retain authentication guards", async ({page}) => {
  for (const route of ["/workspace/chat", "/workspace/chat/ac000000-0000-0000-0000-000000000001"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator(".chat-history")).toHaveCount(0);
  }
});

for (const width of [1440, 768, 390, 320]) {
  test(`restored content and editable review at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.goto("/");
    await expect(page.getByRole("heading",{name:/Từ buổi đầu/})).toBeVisible();
    await expect(page.locator("#tinh-nang")).toContainText("Đang lên kế hoạch");
    await page.getByText("Nguồn và giới hạn khảo sát",{exact:true}).click();
    await expect(page.locator(".research-snapshot")).toContainText("không đại diện");
    await page.getByRole("button",{name:"Thử mở bản nháp"}).click();
    const dialog = page.getByRole("dialog");
    const confirm = dialog.getByRole("button",{name:"Xác nhận bản mẫu"});
    const weight = dialog.getByRole("spinbutton");
    await dialog.getByRole("checkbox").check();
    await weight.fill("71");
    await expect(confirm).toBeDisabled();
    await weight.fill("");
    await expect(weight).toHaveAttribute("aria-invalid","true");
    await expect(dialog.getByRole("checkbox")).toBeDisabled();
    await dialog.getByRole("combobox").selectOption("1");
    await expect(weight).toHaveValue("65.8");
    await dialog.getByRole("checkbox").check();
    await confirm.click();
    await expect(dialog.getByRole("status")).toContainText("65,8 kg");
    await dialog.getByRole("button",{name:"Đặt lại bản mẫu"}).click();
    await expect(confirm).toBeDisabled();
    await page.keyboard.press("Escape");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
}

for (const width of [1440,768,390,320]) {
 test(`sample dossier and role identity at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto("/app/dashboard");
  if(width<700) await page.locator(".mobile-client-row").first().click();else await page.locator(".profile-name-action").first().click();
  const sheet=page.getByRole("dialog");await expect(sheet).toBeVisible();await expect(sheet).toContainText("Không lưu hồ sơ thật");await expect(sheet).toContainText("Gói buổi PT");await page.keyboard.press("Escape");await expect(sheet).toHaveCount(0);
  if(width===1440){await page.getByRole("button",{name:"Thu gọn điều hướng"}).click();await expect(page.getByRole("link",{name:"Góc học viên",exact:true})).toBeVisible();}
  await page.goto("/app/trainee");await expect(page.locator(".trainee-companion")).toContainText("PT Anh Nam");if(width<700) await expect(page.locator("header")).toContainText("Khánh Linh");
 });
}
