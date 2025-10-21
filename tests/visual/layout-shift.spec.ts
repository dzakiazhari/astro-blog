import { expect, test } from "@playwright/test";

const CLS_THRESHOLD = 0.05;

test.describe("SPA navigation layout stability", () => {
  test("key navigations remain within CLS budget", async ({ page }) => {
    await page.goto("/");

    const runNavigation = async (
      description: string,
      navigate: () => Promise<void>
    ) => {
      await page.evaluate(() => {
        if (window.__clsObserver) {
          window.__clsObserver.disconnect();
        }

        window.__clsValue = 0;
        window.__clsObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) {
              continue;
            }
            window.__clsValue += entry.value;
          }
        });
        window.__clsObserver.observe({ type: "layout-shift", buffered: true });

        window.__navDone = false;
        const markComplete = () => {
          window.__navDone = true;
          document.removeEventListener("astro:page-load", markComplete);
        };
        document.addEventListener("astro:page-load", markComplete, {
          once: true,
        });
      });

      await page.evaluate(() => {
        document.documentElement.dataset.navOpen = "true";
        const disclosure = document.querySelector("[data-nav-disclosure]");
        if (disclosure instanceof HTMLDetailsElement) {
          disclosure.setAttribute("open", "");
        }
      });

      await navigate();
      await page.waitForFunction(() => window.__navDone === true);
      await page.waitForTimeout(200);

      const cls = await page.evaluate(() => window.__clsValue ?? 0);
      expect(cls, `${description} CLS`).toBeLessThan(CLS_THRESHOLD);
    };

    await runNavigation("home → posts", async () => {
      await page
        .locator("header")
        .getByRole("link", { name: "Posts", exact: true })
        .click();
    });

    await runNavigation("posts → article", async () => {
      await page.locator("a[data-card-variant]").first().click();
    });

    await runNavigation("article → tags", async () => {
      await page
        .locator("header")
        .getByRole("link", { name: "Tags", exact: true })
        .click();
    });

    await runNavigation("tags → archives", async () => {
      await page
        .locator("header")
        .getByRole("link", { name: "Archives", exact: true })
        .click();
    });

    await runNavigation("archives → home", async () => {
      await page.locator("header").getByRole("link").first().click();
    });
  });
});

declare global {
  interface Window {
    __clsObserver: PerformanceObserver | undefined;
    __clsValue: number;
    __navDone: boolean;
  }
}
