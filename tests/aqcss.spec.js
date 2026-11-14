import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 599, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => window.fixtureReady === true);
});

test("AQCSS typography and border primitives apply", async ({ page }) => {
  const result = await page.evaluate(() => ({
    align: getComputedStyle(document.querySelector("#single")).textAlign,
    radius: getComputedStyle(document.querySelector("#circle")).borderRadius
  }));
  expect(result.align).toBe("center");
  expect(result.radius).not.toBe("0px");
});

test("tablet-prefixed typography activates at the 600px threshold", async ({ page }) => {
  const at599 = await page.locator("#responsive").evaluate(node => getComputedStyle(node).fontSize);
  await page.setViewportSize({ width: 600, height: 800 });
  const at600 = await page.locator("#responsive").evaluate(node => getComputedStyle(node).fontSize);
  expect(at600).not.toBe(at599);
});

test("known third-width anomaly is captured without silently normalizing it", async ({ page }) => {
  const width = await page.locator("#third").evaluate(node => getComputedStyle(node).width);
  const parentWidth = await page.locator("#fixture").evaluate(node => getComputedStyle(node).width);
  expect(Number.parseFloat(width)).toBeGreaterThan(0);
  expect(Number.parseFloat(width)).toBeLessThan(Number.parseFloat(parentWidth) * 0.1);
});

test("known xlarge row-gap declaration does not resolve to 2px", async ({ page }) => {
  const gap = await page.locator("#gap").evaluate(node => getComputedStyle(node).rowGap);
  expect(gap).not.toBe("2px");
});

test("paragraph size token defaults to invalid unitless font-size and inherits", async ({ page }) => {
  const result = await page.evaluate(() => {
    const paragraph = document.createElement("p");
    paragraph.textContent = "Paragraph token test";
    document.body.appendChild(paragraph);
    return {
      root: parseFloat(getComputedStyle(document.documentElement).fontSize),
      paragraph: parseFloat(getComputedStyle(paragraph).fontSize)
    };
  });
  expect(Math.abs(result.paragraph - result.root)).toBeLessThan(0.2);
});

test("large-screen fs-2 and fs-3 lowercase classes miss uppercase selectors", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const result = await page.evaluate(() => {
    const values = {};
    for (const size of [1, 2, 3, 4, 5]) {
      const node = document.createElement("div");
      node.className = `aq-s-text--fs-${size}`;
      document.body.appendChild(node);
      values[size] = parseFloat(getComputedStyle(node).fontSize);
    }
    return values;
  });
  expect(result[1]).toBeGreaterThan(result[2]);
  expect(result[2]).toBeCloseTo(result[3], 1);
  expect(result[4]).toBeGreaterThan(result[2]);
  expect(result[5]).toBeGreaterThan(result[2]);
});

test("AQCSS facet third width is 3.33333 percent rather than one third", async ({ page }) => {
  const result = await page.evaluate(() => {
    const container = document.createElement("div");
    container.style.width = "300px";
    const child = document.createElement("div");
    child.className = "aq-facet--third";
    container.appendChild(child);
    document.body.appendChild(container);
    return {
      width: parseFloat(getComputedStyle(child).width),
      containerWidth: parseFloat(getComputedStyle(container).width)
    };
  });
  expect(result.width).toBeCloseTo(result.containerWidth / 30, 1);
  expect(result.width).toBeLessThan(result.containerWidth / 10);
});

test("AQCSS row-gap xlarge unitless value is discarded by the browser", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-flexon aq-flexon--row-gap-xlarge";
    document.body.appendChild(node);
    return getComputedStyle(node).rowGap;
  });
  expect(result).not.toBe("2px");
  expect(result).toBe("normal");
});

test("AQCSS tablet utility activates at 600px while mobile hide still includes 600px", async ({ page }) => {
  await page.setViewportSize({ width: 599, height: 800 });
  const at599 = await page.evaluate(() => {
    const text = document.createElement("div");
    text.className = "aq-t-text--large";
    document.body.appendChild(text);
    const hidden = document.createElement("div");
    hidden.className = "aq-facet-hide-on-mobile";
    document.body.appendChild(hidden);
    return {
      root: parseFloat(getComputedStyle(document.documentElement).fontSize),
      text: parseFloat(getComputedStyle(text).fontSize),
      hidden: getComputedStyle(hidden).display
    };
  });

  await page.setViewportSize({ width: 600, height: 800 });
  const at600 = await page.evaluate(() => {
    const text = document.createElement("div");
    text.className = "aq-t-text--large";
    document.body.appendChild(text);
    const hidden = document.createElement("div");
    hidden.className = "aq-facet-hide-on-mobile";
    document.body.appendChild(hidden);
    return {
      root: parseFloat(getComputedStyle(document.documentElement).fontSize),
      text: parseFloat(getComputedStyle(text).fontSize),
      hidden: getComputedStyle(hidden).display
    };
  });

  expect(at599.text).toBeCloseTo(at599.root, 1);
  expect(at599.hidden).toBe("none");
  expect(at600.text).toBeGreaterThan(at600.root);
  expect(at600.hidden).toBe("none");

  await page.setViewportSize({ width: 601, height: 800 });
  const at601 = await page.evaluate(() => {
    const hidden = document.createElement("div");
    hidden.className = "aq-facet-hide-on-mobile";
    document.body.appendChild(hidden);
    return getComputedStyle(hidden).display;
  });
  expect(at601).not.toBe("none");
});

test("AQCSS base border token requires channel values rather than the default hex value", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-border";
    document.body.appendChild(node);
    const defaultStyle = getComputedStyle(node).borderTopStyle;
    node.style.setProperty("--aq-swatch-secondary", "231,234,246");
    const overrideStyle = getComputedStyle(node).borderTopStyle;
    return { defaultStyle, overrideStyle };
  });
  expect(result.defaultStyle).toBe("none");
  expect(result.overrideStyle).toBe("solid");
});

test("AQCSS hover color alpha fallback is invalid until explicit percentages are supplied", async ({ page }) => {
  const result = await page.evaluate(() => {
    const plain = document.createElement("button");
    plain.id = "plain-hover";
    plain.className = "button";
    plain.textContent = "Plain";
    document.body.appendChild(plain);
    const configured = document.createElement("button");
    configured.id = "configured-hover";
    configured.className = "button";
    configured.textContent = "Configured";
    configured.style.setProperty("--aq-swatch-hover-text-opacity", "100%");
    configured.style.setProperty("--aq-swatch-hover-button-opacity", "100%");
    document.body.appendChild(configured);
    return {
      plainBefore: getComputedStyle(plain).backgroundColor,
      configuredBefore: getComputedStyle(configured).backgroundColor
    };
  });
  await page.locator("#plain-hover").hover();
  const plainAfter = await page.locator("#plain-hover").evaluate(node => getComputedStyle(node).backgroundColor);
  await page.locator("#configured-hover").hover();
  const configuredAfter = await page.locator("#configured-hover").evaluate(node => getComputedStyle(node).backgroundColor);
  expect(plainAfter).toBe(result.plainBefore);
  expect(configuredAfter).not.toBe(result.configuredBefore);
});
