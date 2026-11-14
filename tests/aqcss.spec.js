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

test("AQCSS third-width facet is 3.33333 percent at all responsive prefixes", async ({ page }) => {
  const configs = [
    { width: 599, className: "aq-m-facet--third" },
    { width: 600, className: "aq-t-facet--third" },
    { width: 993, className: "aq-d-facet--third" },
    { width: 1440, className: "aq-s-facet--third" }
  ];
  for (const config of configs) {
    await page.setViewportSize({ width: config.width, height: 900 });
    const result = await page.evaluate(className => {
      const container = document.createElement("div");
      container.style.width = "300px";
      const child = document.createElement("div");
      child.className = className;
      container.appendChild(child);
      document.body.appendChild(container);
      return {
        width: parseFloat(getComputedStyle(child).width),
        containerWidth: parseFloat(getComputedStyle(container).width)
      };
    }, config.className);
    expect(result.width, config.className).toBeCloseTo(result.containerWidth / 30, 1);
  }
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

test("1rem margin/padding left aliases are missing at all responsive prefixes", async ({ page }) => {
  const configs = [
    { width: 599, prefix: "aq-m" },
    { width: 600, prefix: "aq-t" },
    { width: 993, prefix: "aq-d" },
    { width: 1440, prefix: "aq-s" }
  ];
  for (const config of configs) {
    await page.setViewportSize({ width: config.width, height: 900 });
    const result = await page.evaluate(prefix => {
      const marginLeft = document.createElement("div");
      marginLeft.className = `${prefix}--margin-left`;
      const marginRight = document.createElement("div");
      marginRight.className = `${prefix}--margin-right`;
      const paddingLeft = document.createElement("div");
      paddingLeft.className = `${prefix}--padding-left`;
      const paddingRight = document.createElement("div");
      paddingRight.className = `${prefix}--padding-right`;
      document.body.append(marginLeft, marginRight, paddingLeft, paddingRight);
      const style = node => getComputedStyle(node);
      return {
        marginLeft: parseFloat(style(marginLeft).marginLeft),
        marginRightLeft: parseFloat(style(marginRight).marginLeft),
        marginRightRight: parseFloat(style(marginRight).marginRight),
        paddingLeft: parseFloat(style(paddingLeft).paddingLeft),
        paddingRightLeft: parseFloat(style(paddingRight).paddingLeft),
        paddingRightRight: parseFloat(style(paddingRight).paddingRight)
      };
    }, config.prefix);
    expect(result.marginLeft, `left margin alias at ${config.width}px`).toBe(0);
    expect(result.marginRightLeft).toBeGreaterThan(0);
    expect(result.marginRightRight).toBeGreaterThan(0);
    expect(result.paddingLeft).toBe(0);
    expect(result.paddingRightLeft).toBeGreaterThan(0);
    expect(result.paddingRightRight).toBeGreaterThan(0);
  }
});

test("AQCSS flex modifiers need the base flexon class to establish display flex", async ({ page }) => {
  const result = await page.evaluate(() => {
    const modifierOnly = document.createElement("div");
    modifierOnly.className = "aq-flexon--column";
    const baseAndModifier = document.createElement("div");
    baseAndModifier.className = "aq-flexon aq-flexon--column";
    document.body.append(modifierOnly, baseAndModifier);
    return {
      modifierOnlyDisplay: getComputedStyle(modifierOnly).display,
      baseDisplay: getComputedStyle(baseAndModifier).display,
      baseDirection: getComputedStyle(baseAndModifier).flexDirection
    };
  });
  expect(result.modifierOnlyDisplay).not.toBe("flex");
  expect(result.baseDisplay).toBe("flex");
  expect(result.baseDirection).toBe("column");
});

test("AQCSS mobile middle alignment alias requires a second class", async ({ page }) => {
  const result = await page.evaluate(() => {
    const middle = document.createElement("div");
    middle.className = "aq-flexon aq-m-flexon--middle";
    const center = document.createElement("div");
    center.className = "aq-flexon aq-m-flexon--center";
    document.body.append(middle, center);
    const style = node => {
      const value = getComputedStyle(node);
      return { alignItems: value.alignItems, justifyContent: value.justifyContent };
    };
    return { middle: style(middle), center: style(center) };
  });
  expect(result.middle.alignItems).not.toBe("center");
  expect(result.middle.justifyContent).not.toBe("center");
  expect(result.center.alignItems).toBe("center");
  expect(result.center.justifyContent).toBe("center");
});

test("AQCSS removes visible outline from focused anchors and buttons", async ({ page }) => {
  const result = await page.evaluate(() => {
    const anchor = document.createElement("a");
    anchor.href = "#";
    anchor.textContent = "Focus link";
    document.body.appendChild(anchor);
    const button = document.createElement("button");
    button.textContent = "Focus button";
    document.body.appendChild(button);
    anchor.focus();
    const anchorOutline = getComputedStyle(anchor).outlineStyle;
    button.focus();
    const buttonOutline = getComputedStyle(button).outlineStyle;
    return { anchorOutline, buttonOutline };
  });
  expect(result.anchorOutline).toBe("none");
  expect(result.buttonOutline).toBe("none");
});

test("AQCSS disabled descendant rule styles children but not the disabled wrapper/control itself", async ({ page }) => {
  const result = await page.evaluate(() => {
    const wrapper = document.createElement("div");
    wrapper.className = "disabled";
    const child = document.createElement("button");
    child.textContent = "Child";
    wrapper.appendChild(child);
    const disabledButton = document.createElement("button");
    disabledButton.disabled = true;
    document.body.append(wrapper, disabledButton);
    const wrapperStyle = getComputedStyle(wrapper);
    const childStyle = getComputedStyle(child);
    const disabledStyle = getComputedStyle(disabledButton);
    return {
      wrapperOpacity: wrapperStyle.opacity,
      childOpacity: childStyle.opacity,
      childPointerEvents: childStyle.pointerEvents,
      disabledOpacity: disabledStyle.opacity,
      disabledPointerEvents: disabledStyle.pointerEvents
    };
  });
  expect(result.wrapperOpacity).toBe("1");
  expect(result.childOpacity).toBe("0.3");
  expect(result.childPointerEvents).toBe("none");
  expect(result.disabledOpacity).toBe("1");
  expect(result.disabledPointerEvents).not.toBe("none");
});

test("AQCSS tooltip text opens on hover but not keyboard focus", async ({ page }) => {
  const result = await page.evaluate(() => {
    const wrapper = document.createElement("div");
    wrapper.id = "tooltip-test";
    wrapper.className = "tooltip";
    wrapper.tabIndex = 0;
    const text = document.createElement("span");
    text.className = "text";
    text.textContent = "Tooltip";
    wrapper.appendChild(text);
    document.body.appendChild(wrapper);
    wrapper.focus();
    return getComputedStyle(text).display;
  });
  expect(result).toBe("none");
  await page.locator("#tooltip-test").hover();
  const hovered = await page.locator("#tooltip-test .text").evaluate(node => getComputedStyle(node).display);
  expect(hovered).toBe("inline-block");
});
