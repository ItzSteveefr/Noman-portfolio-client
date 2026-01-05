from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_viewport_size({"width": 1280, "height": 800})

    page.goto("http://localhost:8000")
    # Wait for splash screen to start disappearing
    page.wait_for_selector("body:not(.overflow-hidden)")
    # Wait for the animation to complete
    page.wait_for_timeout(1000)

    # Light mode
    page.screenshot(path="light-mode.png", full_page=True)

    # Dark mode
    page.click("#theme-toggle")
    page.wait_for_timeout(1000)
    page.screenshot(path="dark-mode.png", full_page=True)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
