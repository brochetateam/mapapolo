import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # Test 1: viewport estándar 1440x900
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto("http://127.0.0.1:8765/index.html", wait_until="networkidle", timeout=20000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="v1_1440x900.png", full_page=False)
        print(f"  v1 1440x900: viewport_height=900")

        # Test 2: viewport alto 1440x1100
        page2 = await browser.new_page(viewport={"width": 1440, "height": 1100})
        await page2.goto("http://127.0.0.1:8765/index.html", wait_until="networkidle", timeout=20000)
        await page2.wait_for_timeout(2000)
        await page2.screenshot(path="v2_1440x1100.png", full_page=False)
        print(f"  v2 1440x1100: viewport_height=1100")

        # Test 3: ultrawide 1920x1080
        page3 = await browser.new_page(viewport={"width": 1920, "height": 1080})
        await page3.goto("http://127.0.0.1:8765/index.html", wait_until="networkidle", timeout=20000)
        await page3.wait_for_timeout(2000)
        await page3.screenshot(path="v3_1920x1080.png", full_page=False)
        print(f"  v3 1920x1080")

        # Test 4: OF2 click + screenshot
        await page2.click("#svgHost svg #of2")
        await page2.wait_for_timeout(800)
        await page2.screenshot(path="v4_of2_list.png", full_page=False)
        print(f"  v4 of2_lista")

        # Test 5: OF2 + click empresa
        emp = page2.locator('.empresa-tech [data-empresa-id]').first
        if await emp.count() > 0:
            await emp.click()
            await page2.wait_for_timeout(800)
            await page2.screenshot(path="v5_emp_clicked.png", full_page=False)
            print(f"  v5 emp clicked")

        await browser.close()

asyncio.run(main())
