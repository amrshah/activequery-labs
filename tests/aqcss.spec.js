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

test("AQCSS tablet typography activates at 600px but mobile-hide media query is ignored", async ({ page }) => {
  const sample = async width => {
    await page.setViewportSize({ width, height: 800 });
    return page.evaluate(() => {
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
  };

  const at599 = await sample(599);
  const at600 = await sample(600);
  const at601 = await sample(601);

  expect(at599.text).toBeCloseTo(at599.root, 1);
  expect(at600.text).toBeGreaterThan(at600.root);
  expect(at601.text).toBeGreaterThan(at601.root);
  // The pinned rule uses malformed media syntax: and(max-width:600px).
  // Both engines ignore the condition, so this helper never hides.
  expect(at599.hidden).not.toBe("none");
  expect(at600.hidden).not.toBe("none");
  expect(at601.hidden).not.toBe("none");
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

test("AQCSS hover color alpha accepts explicit percentages but rejects inherit", async ({ page }) => {
  const result = await page.evaluate(() => ({
    invalidAlpha: CSS.supports("background-color", "rgb(from green r g b / inherit)"),
    explicitPercentage: CSS.supports("background-color", "rgb(from green r g b / 100%)")
  }));
  expect(result.invalidAlpha).toBe(false);
  expect(result.explicitPercentage).toBe(true);
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
    wrapper.style.cssText = "display:inline-block;width:100px;height:30px";
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


test("AQCSS dropdown hover opens on pointer hover but click variant has no click-to-open behavior", async ({ page }) => {
  await page.evaluate(() => {
    const hover = document.createElement("div");
    hover.id = "dropdown-hover";
    hover.className = "aq-fleek--dropdown-hover";
    hover.tabIndex = 0;
    hover.style.cssText = "width:120px;height:30px";
    const hoverContent = document.createElement("div");
    hoverContent.id = "dropdown-hover-content";
    hoverContent.className = "aq-fleek--dropdown-content";
    hoverContent.textContent = "Hover menu";
    hover.appendChild(hoverContent);
    document.body.appendChild(hover);

    const click = document.createElement("div");
    click.id = "dropdown-click";
    click.className = "aq-fleek--dropdown-click";
    click.tabIndex = 0;
    click.style.cssText = "width:120px;height:30px";
    const clickContent = document.createElement("div");
    clickContent.id = "dropdown-click-content";
    clickContent.className = "aq-fleek--dropdown-content";
    clickContent.textContent = "Click menu";
    click.appendChild(clickContent);
    document.body.appendChild(click);
  });

  await page.locator("#dropdown-hover").focus();
  const focusDisplay = await page.locator("#dropdown-hover-content").evaluate(node => getComputedStyle(node).display);
  await page.locator("#dropdown-hover").hover();
  const hoverDisplay = await page.locator("#dropdown-hover-content").evaluate(node => getComputedStyle(node).display);

  await page.locator("#dropdown-click").click();
  const clickDisplay = await page.locator("#dropdown-click-content").evaluate(node => getComputedStyle(node).display);

  expect({ focusDisplay, hoverDisplay, clickDisplay }).toEqual({
    focusDisplay: "none",
    hoverDisplay: "block",
    clickDisplay: "none"
  });
});


test("AQCSS desktop and large-screen prefixes activate while range-hide helpers are ignored", async ({ page }) => {
  const sample = async (width, textClass, hideClass) => {
    await page.setViewportSize({ width, height: 900 });
    return page.evaluate(({ textClass, hideClass }) => {
      const text = document.createElement("div");
      text.className = textClass;
      document.body.appendChild(text);
      const hidden = document.createElement("div");
      hidden.className = hideClass;
      document.body.appendChild(hidden);
      return {
        root: parseFloat(getComputedStyle(document.documentElement).fontSize),
        text: parseFloat(getComputedStyle(text).fontSize),
        hidden: getComputedStyle(hidden).display
      };
    }, { textClass, hideClass });
  };

  const tablet601 = await sample(601, "aq-d-text--large", "aq-facet-hide-on-tablet");
  const tablet992 = await sample(992, "aq-d-text--large", "aq-facet-hide-on-tablet");
  const desktop993 = await sample(993, "aq-d-text--large", "aq-facet-hide-on-desktop");
  const desktop1439 = await sample(1439, "aq-d-text--large", "aq-facet-hide-on-desktop");
  const large1439 = await sample(1439, "aq-s-text--large", "aq-facet-hide-on-screen");
  const large1440 = await sample(1440, "aq-s-text--large", "aq-facet-hide-on-screen");

  expect(tablet601.text).toBeCloseTo(tablet601.root, 1);
  expect(tablet992.text).toBeCloseTo(tablet992.root, 1);
  expect(desktop993.text).toBeGreaterThan(desktop993.root);
  expect(desktop1439.text).toBeGreaterThan(desktop1439.root);
  expect(large1439.text).toBeCloseTo(large1439.root, 1);
  expect(large1440.text).toBeGreaterThan(large1440.root);

  // Tablet/desktop range media preludes also omit whitespace around "and".
  expect(tablet601.hidden).not.toBe("none");
  expect(tablet992.hidden).not.toBe("none");
  expect(desktop993.hidden).not.toBe("none");
  expect(desktop1439.hidden).not.toBe("none");
  // The simple min-width:1440px screen helper remains valid.
  expect(large1439.hidden).not.toBe("none");
  expect(large1440.hidden).toBe("none");
});


test("AQCSS short-landscape overlay has browser-specific parsing at 550px height", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 800, height: 550 });
  const at550 = await page.evaluate(() => {
    const sheet = [...document.styleSheets].find(item => item.href?.includes("ActiveQuery.css"));
    const media = [...(sheet?.cssRules ?? [])].find(rule =>
      rule.type === CSSRule.MEDIA_RULE && rule.conditionText.includes("max-height")
    );
    const pseudoRuleParsed = [...(media?.cssRules ?? [])].some(rule => rule.selectorText === "body::after");
    return {
      mediaMatches: matchMedia("(max-height: 550px) and (orientation: landscape)").matches,
      pseudoRuleParsed,
      content: getComputedStyle(document.body, "::after").content,
      display: getComputedStyle(document.body, "::after").display
    };
  });

  await page.setViewportSize({ width: 800, height: 551 });
  const at551 = await page.evaluate(() => getComputedStyle(document.body, "::after").content);

  expect(at550.mediaMatches).toBe(true);
  if (browserName === "chromium") {
    expect(at550.pseudoRuleParsed).toBe(false);
    expect(at550.content).toBe("none");
    expect(at550.display).not.toBe("flex");
  } else {
    expect(at550.pseudoRuleParsed).toBe(true);
    expect(at550.content).toContain("Turn Holding Position");
    expect(at550.display).toBe("flex");
  }
  expect(at551).toBe("none");
});
test("AQCSS input animation retains its transition under prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const result = await page.evaluate(() => {
    const input = document.createElement("input");
    input.className = "input-animate";
    input.style.width = "120px";
    document.body.appendChild(input);
    input.focus();
    return {
      reducedMotionMatches: matchMedia("(prefers-reduced-motion: reduce)").matches,
      transitionDuration: getComputedStyle(input).transitionDuration,
      transitionTiming: getComputedStyle(input).transitionTimingFunction
    };
  });
  expect(result.reducedMotionMatches).toBe(true);
  expect(result.transitionDuration).toBe("0.4s");
  expect(result.transitionTiming).toBe("ease-in-out");
});
