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


test("AQX-001 border reset wins over the base border utility", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-border aq-border--no";
    node.style.setProperty("--aq-swatch-secondary", "231,234,246");
    document.body.appendChild(node);
    const style = getComputedStyle(node);
    return { width: style.borderTopWidth, style: style.borderTopStyle, color: style.borderTopColor };
  });
  expect(result.width).toBe("0px");
  expect(result.style).toBe("none");
  expect(result.color).toBeTruthy();
});

test("AQX-002 primary border swatch changes color without supplying border geometry", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-border aq-swatch-border--primary";
    node.style.setProperty("--aq-swatch-secondary", "231,234,246");
    document.body.appendChild(node);
    const style = getComputedStyle(node);
    return { width: style.borderTopWidth, style: style.borderTopStyle, color: style.borderTopColor };
  });
  expect(result.width).toBe("1px");
  expect(result.style).toBe("solid");
  expect(result.color).not.toBe("rgba(0, 0, 0, 0)");
});

test("AQX-003 border color swatch cannot recreate a border after border reset", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-border aq-border--no aq-swatch-border--primary";
    node.style.setProperty("--aq-swatch-secondary", "231,234,246");
    document.body.appendChild(node);
    const style = getComputedStyle(node);
    return { width: style.borderTopWidth, style: style.borderTopStyle };
  });
  expect(result.width).toBe("0px");
  expect(result.style).toBe("none");
});

test("AQX-004 full facet plus width-auto overrides width but preserves full height", async ({ page }) => {
  const result = await page.evaluate(() => {
    const parent = document.createElement("div");
    parent.style.cssText = "width:300px;height:120px";
    const child = document.createElement("div");
    child.className = "aq-facet--full aq-facet--w-auto";
    child.style.display = "inline-block";
    child.textContent = "short";
    parent.appendChild(child);
    document.body.appendChild(parent);
    const style = getComputedStyle(child);
    return {
      width: parseFloat(style.width),
      parentWidth: parseFloat(getComputedStyle(parent).width),
      height: parseFloat(style.height),
      parentHeight: parseFloat(getComputedStyle(parent).height)
    };
  });
  expect(result.width).toBeLessThan(result.parentWidth);
  expect(result.height).toBeCloseTo(result.parentHeight, 1);
});

test("AQX-005 full-screen facet plus width-auto overrides viewport width but keeps viewport height", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  const result = await page.evaluate(() => {
    const parent = document.createElement("div");
    parent.style.cssText = "width:300px;height:120px";
    const child = document.createElement("div");
    child.className = "aq-facet--full-screen aq-facet--w-auto";
    child.style.display = "inline-block";
    child.textContent = "short";
    parent.appendChild(child);
    document.body.appendChild(parent);
    const style = getComputedStyle(child);
    return {
      width: parseFloat(style.width),
      parentWidth: parseFloat(getComputedStyle(parent).width),
      height: parseFloat(style.height)
    };
  });
  expect(result.width).toBeLessThan(result.parentWidth);
  expect(result.height).toBe(600);
});

test("AQX-006 all-margin and left-margin utilities resolve all four longhands", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq--margin-all aq--margin-left";
    document.body.appendChild(node);
    const style = getComputedStyle(node);
    return {
      root: getComputedStyle(document.documentElement).fontSize,
      top: style.marginTop,
      right: style.marginRight,
      bottom: style.marginBottom,
      left: style.marginLeft
    };
  });
  expect([result.top, result.right, result.bottom, result.left]).toEqual([result.root, result.root, result.root, result.root]);
});

test("AQX-007 all-padding and left-padding utilities resolve all four longhands", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq--padding-all aq--padding-left";
    document.body.appendChild(node);
    const style = getComputedStyle(node);
    return {
      root: getComputedStyle(document.documentElement).fontSize,
      top: style.paddingTop,
      right: style.paddingRight,
      bottom: style.paddingBottom,
      left: style.paddingLeft
    };
  });
  expect([result.top, result.right, result.bottom, result.left]).toEqual([result.root, result.root, result.root, result.root]);
});


test("AQX-008 fixed positioning remains fixed when combined with the top helper", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-affix--fixed aq-affix--top";
    document.body.appendChild(node);
    const style = getComputedStyle(node);
    return { position: style.position, top: style.top };
  });
  expect(result).toEqual({ position: "fixed", top: "0px" });
});

test("AQX-009 sticky mode wins over the top helper and retains its inset", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-affix--sticky aq-affix--top";
    document.body.appendChild(node);
    const style = getComputedStyle(node);
    return { position: style.position, top: style.top };
  });
  expect(result).toEqual({ position: "sticky", top: "0px" });
});

test("AQX-010 flex column and center-top compose into the expected alignment", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-flexon aq-flexon--column aq-flexon--center-top";
    document.body.appendChild(node);
    const style = getComputedStyle(node);
    return {
      display: style.display,
      direction: style.flexDirection,
      alignItems: style.alignItems,
      justifyContent: style.justifyContent
    };
  });
  expect(result).toEqual({
    display: "flex",
    direction: "column",
    alignItems: "flex-start",
    justifyContent: "center"
  });
});

test("AQX-011 hover swatch overrides the base swatch only while hovered", async ({ page }) => {
  await page.evaluate(() => {
    const node = document.createElement("div");
    node.id = "swatch-composition";
    node.className = "aq-swatch--primary aq-swatch--accent-hover";
    node.style.cssText = "width:100px;height:40px";
    document.body.appendChild(node);
  });
  const before = await page.locator("#swatch-composition").evaluate(node => getComputedStyle(node).backgroundColor);
  await page.locator("#swatch-composition").hover();
  const during = await page.locator("#swatch-composition").evaluate(node => getComputedStyle(node).backgroundColor);
  expect(before).toBeTruthy();
  expect(during).toBeTruthy();
  expect(during).not.toBe(before);
});

test("AQX-012 grayscale and invert utilities replace rather than compose the filter property", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.className = "aq-fleek--grayscale aq-fleek--invert";
    document.body.appendChild(node);
    return getComputedStyle(node).filter;
  });
  expect(result).toContain("invert");
  expect(result).not.toContain("grayscale");
});

test("AQX-013 zero opacity preserves layout while hide removes layout participation", async ({ page }) => {
  const result = await page.evaluate(() => {
    const transparent = document.createElement("div");
    transparent.className = "aq-fleek--opacity-max";
    transparent.style.cssText = "width:40px;height:20px";
    const hidden = document.createElement("div");
    hidden.className = "hide";
    hidden.style.cssText = "width:40px;height:20px";
    document.body.append(transparent, hidden);
    return {
      opacity: getComputedStyle(transparent).opacity,
      transparentDisplay: getComputedStyle(transparent).display,
      transparentRectCount: transparent.getClientRects().length,
      hiddenDisplay: getComputedStyle(hidden).display,
      hiddenRectCount: hidden.getClientRects().length
    };
  });
  expect(result.opacity).toBe("0");
  expect(result.transparentDisplay).not.toBe("none");
  expect(result.transparentRectCount).toBe(1);
  expect(result.hiddenDisplay).toBe("none");
  expect(result.hiddenRectCount).toBe(0);
});

test("AQX-014 wide-screen facet width on an image is capped by the global image max-width", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  const result = await page.evaluate(async () => {
    const container = document.createElement("div");
    container.style.width = "300px";
    const image = document.createElement("img");
    image.className = "aq-facet--wide-screen";
    image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='50'%3E%3C/svg%3E";
    container.appendChild(image);
    document.body.appendChild(container);
    await image.decode();
    const style = getComputedStyle(image);
    return {
      maxWidth: style.maxWidth,
      width: image.getBoundingClientRect().width,
      height: image.getBoundingClientRect().height,
      containerWidth: container.getBoundingClientRect().width
    };
  });
  expect(result.maxWidth).toBe("100%");
  expect(result.width).toBeCloseTo(result.containerWidth, 1);
  expect(result.width).toBeLessThan(800);
  expect(result.height).toBeCloseTo(150, 1);
});


test("AQX-015 tablet padding overrides base small padding at 600px", async ({ page }) => {
  const at = async width => {
    await page.setViewportSize({ width, height: 800 });
    return page.evaluate(() => {
      const node = document.createElement("div");
      node.className = "aq--padding-all-small aq-t--padding-all";
      document.body.appendChild(node);
      return {
        root: parseFloat(getComputedStyle(document.documentElement).fontSize),
        padding: parseFloat(getComputedStyle(node).paddingTop)
      };
    });
  };
  const below = await at(599);
  const atBreakpoint = await at(600);
  expect(below.padding).toBeCloseTo(below.root * 0.5, 1);
  expect(atBreakpoint.padding).toBeCloseTo(atBreakpoint.root, 1);
});

test("AQX-016 desktop margin utility becomes eligible at 993px", async ({ page }) => {
  const at = async width => {
    await page.setViewportSize({ width, height: 800 });
    return page.evaluate(() => {
      const node = document.createElement("div");
      node.className = "aq-t--margin-all aq-d--margin-all-large";
      document.body.appendChild(node);
      return {
        root: parseFloat(getComputedStyle(document.documentElement).fontSize),
        margin: parseFloat(getComputedStyle(node).marginTop)
      };
    });
  };
  const below = await at(992);
  const atBreakpoint = await at(993);
  expect(below.margin).toBeCloseTo(below.root, 1);
  expect(atBreakpoint.margin).toBeCloseTo(atBreakpoint.root * 2, 1);
});

test("AQX-017 screen spacing wins over tablet and desktop utilities at 1440px", async ({ page }) => {
  const at = async width => {
    await page.setViewportSize({ width, height: 800 });
    return page.evaluate(() => {
      const node = document.createElement("div");
      node.className = "aq-t--padding-all-small aq-d--padding-all aq-s--padding-all-large";
      document.body.appendChild(node);
      return {
        root: parseFloat(getComputedStyle(document.documentElement).fontSize),
        padding: parseFloat(getComputedStyle(node).paddingTop)
      };
    });
  };
  const below = await at(1439);
  const atBreakpoint = await at(1440);
  expect(below.padding).toBeCloseTo(below.root, 1);
  expect(atBreakpoint.padding).toBeCloseTo(atBreakpoint.root * 2, 1);
});

test("AQX-018 desktop flex column overrides the base flex row at 993px", async ({ page }) => {
  const at = async width => {
    await page.setViewportSize({ width, height: 800 });
    return page.evaluate(() => {
      const node = document.createElement("div");
      node.className = "aq-flexon aq-flexon--row aq-d-flexon--column";
      document.body.appendChild(node);
      return getComputedStyle(node).flexDirection;
    });
  };
  expect(await at(992)).toBe("row");
  expect(await at(993)).toBe("column");
});

test("AQX-019 screen typography activation preserves uppercase selector mismatch", async ({ page }) => {
  const at = async width => {
    await page.setViewportSize({ width, height: 800 });
    return page.evaluate(() => {
      const large = document.createElement("div");
      const lower = document.createElement("div");
      const upper = document.createElement("div");
      large.className = "aq-s-text--large";
      lower.className = "aq-s-text--fs-2";
      upper.className = "aq-S-text--fs-2";
      document.body.append(large, lower, upper);
      return {
        root: parseFloat(getComputedStyle(document.documentElement).fontSize),
        large: parseFloat(getComputedStyle(large).fontSize),
        lower: parseFloat(getComputedStyle(lower).fontSize),
        upper: parseFloat(getComputedStyle(upper).fontSize)
      };
    });
  };
  const below = await at(1439);
  const atBreakpoint = await at(1440);
  expect(below.large).toBeCloseTo(below.root, 1);
  expect(below.lower).toBeCloseTo(below.root, 1);
  expect(below.upper).toBeCloseTo(below.root, 1);
  expect(atBreakpoint.large).toBeCloseTo(atBreakpoint.root * 1.2, 1);
  expect(atBreakpoint.lower).toBeCloseTo(atBreakpoint.root, 1);
  expect(atBreakpoint.upper).toBeCloseTo(atBreakpoint.root * 1.4, 1);
});

test("AQCSS pointer visibility helpers follow their exact combined media conditions", async ({ page }) => {
  const result = await page.evaluate(() => {
    const touch = document.createElement("div");
    touch.className = "aq-facet-hide-on-touch";
    const noTouch = document.createElement("div");
    noTouch.className = "aq-facet-hide-on-no-touch";
    document.body.append(touch, noTouch);

    const touchCondition = matchMedia("(pointer: coarse) and (hover: none)").matches;
    const noTouchCondition = matchMedia("(pointer: fine) and (hover: hover)").matches;

    return {
      coarse: matchMedia("(pointer: coarse)").matches,
      fine: matchMedia("(pointer: fine)").matches,
      hoverNone: matchMedia("(hover: none)").matches,
      hover: matchMedia("(hover: hover)").matches,
      touchCondition,
      noTouchCondition,
      touchDisplay: getComputedStyle(touch).display,
      noTouchDisplay: getComputedStyle(noTouch).display
    };
  });

  expect(result.touchDisplay === "none").toBe(result.touchCondition);
  expect(result.noTouchDisplay === "none").toBe(result.noTouchCondition);
});

test("AQCSS touch helper follows coarse primary pointer in Chromium mobile emulation", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "Playwright mobile device emulation is validated in Chromium; Firefox touch hardware is not emulated equivalently.");

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  try {
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForFunction(() => window.fixtureReady === true);

    const result = await page.evaluate(() => {
      const touch = document.createElement("div");
      touch.className = "aq-facet-hide-on-touch";
      const noTouch = document.createElement("div");
      noTouch.className = "aq-facet-hide-on-no-touch";
      document.body.append(touch, noTouch);
      return {
        coarse: matchMedia("(pointer: coarse)").matches,
        hoverNone: matchMedia("(hover: none)").matches,
        touchDisplay: getComputedStyle(touch).display,
        noTouchDisplay: getComputedStyle(noTouch).display
      };
    });

    expect(result.coarse).toBe(true);
    expect(result.hoverNone).toBe(true);
    expect(result.touchDisplay).toBe("none");
    expect(result.noTouchDisplay).not.toBe("none");
  } finally {
    await context.close();
  }
});



test("AQCSS flex base display, stretch-grow and mobile shrink aliases preserve documented selector defects", async ({ page }) => {
  const result = await page.evaluate(() => {
    const modifierOnly = document.createElement("div");
    modifierOnly.className = "aq-flexon--column";
    const baseAndModifier = document.createElement("div");
    baseAndModifier.className = "aq-flexon aq-flexon--column";
    const stretch = document.createElement("div");
    stretch.className = "aq-flexon--stretch";
    const mobileShrinkNo = document.createElement("div");
    mobileShrinkNo.className = "aq-m-flexon--shrink-no";
    const mobileNoShrink = document.createElement("div");
    mobileNoShrink.className = "aq-m-flexon--no-shrink";
    document.body.append(modifierOnly, baseAndModifier, stretch, mobileShrinkNo, mobileNoShrink);
    const style = node => getComputedStyle(node);
    return {
      modifierOnlyDisplay: style(modifierOnly).display,
      modifierOnlyFlow: style(modifierOnly).flexFlow,
      baseAndModifierDisplay: style(baseAndModifier).display,
      baseAndModifierFlow: style(baseAndModifier).flexFlow,
      stretchGrow: style(stretch).flexGrow,
      stretchAlignment: style(stretch).alignItems,
      mobileShrinkNo: style(mobileShrinkNo).flexShrink,
      mobileNoShrink: style(mobileNoShrink).flexShrink
    };
  });
  // The upstream reset styles div as inline-block; the flex modifier still does not activate flex display.\n  expect(result.modifierOnlyDisplay).toBe("inline-block");
  expect(result.modifierOnlyFlow).toBe("column");
  expect(result.baseAndModifierDisplay).toBe("flex");
  expect(result.baseAndModifierFlow).toBe("column");
  expect(result.stretchGrow).toBe("0");
  expect(result.stretchAlignment).toBe("stretch");
  expect(result.mobileShrinkNo).toBe("1");
  expect(result.mobileNoShrink).toBe("0");
});
