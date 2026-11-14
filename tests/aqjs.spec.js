import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => window.fixtureReady === true);
});

test("DOM returns null, Element and NodeList according to match count", async ({ page }) => {
  const result = await page.evaluate(() => ({
    none: window.AQ.DOM(".missing"),
    one: window.AQ.DOM("#single")?.id,
    many: window.AQ.DOM(".target")?.length
  }));
  expect(result.none).toBeNull();
  expect(result.one).toBe("single");
  expect(result.many).toBe(3);
});

test("nestedDOM returns a single descendant and preserves context on no match", async ({ page }) => {
  const result = await page.evaluate(() => {
    const scope = document.querySelector("#scope-b");
    return {
      one: window.AQ.nestedDOM.call(scope, "#target-c")?.id,
      nonePreservesContext: window.AQ.nestedDOM.call(scope, ".missing") === scope
    };
  });
  expect(result.one).toBe("target-c");
  expect(result.nonePreservesContext).toBe(true);
});

test("nestedDOM flattens descendants from NodeList contexts", async ({ page }) => {
  const result = await page.evaluate(() => {
    const scopes = document.querySelectorAll(".scope");
    const matches = window.AQ.nestedDOM.call(scopes, ".target");
    return {
      isArray: Array.isArray(matches),
      ids: matches.map(node => node.id)
    };
  });
  expect(result.isArray).toBe(true);
  expect(result.ids).toEqual(["target-a", "target-b", "target-c"]);
});

test("Element class helpers mutate and inspect classes", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.querySelector("#event-target");
    node.setClasses(["alpha", "beta"]);
    const all = node.getClasses(["alpha", "beta"]);
    node.removeClasses(["alpha"]);
    return { all, remaining: node.className };
  });
  expect(result.all).toBe(true);
  expect(result.remaining).toBe("beta");
});

test("Element event helper registers a native event listener", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.querySelector("#event-target");
    let calls = 0;
    node.on("click", () => calls++);
    node.dispatchEvent(new Event("click"));
    return calls;
  });
  expect(result).toBe(1);
});

test("default constructor triggers alias/prototype mutation through null coercion", async ({ page }) => {
  const result = await page.evaluate(() => {
    const before = {
      windowNull: Object.prototype.hasOwnProperty.call(window, "null"),
      objectZero: Object.prototype.hasOwnProperty.call(Object.prototype, "0"),
      elementZero: Object.prototype.hasOwnProperty.call(Element.prototype, "0"),
      nodeListZero: Object.prototype.hasOwnProperty.call(NodeList.prototype, "0")
    };
    new window.AQ();
    return {
      before,
      after: {
        windowNull: Object.prototype.hasOwnProperty.call(window, "null"),
        objectZero: Object.prototype.hasOwnProperty.call(Object.prototype, "0"),
        elementZero: Object.prototype.hasOwnProperty.call(Element.prototype, "0"),
        nodeListZero: Object.prototype.hasOwnProperty.call(NodeList.prototype, "0")
      },
      objectZeroEnumerable: Object.prototype.propertyIsEnumerable("0"),
      inheritedKeys: (() => { const value = { own: true }; const keys = []; for (const key in value) keys.push(key); return keys; })(),
      aliasType: typeof window.null
    };
  });
  expect(result.before).toEqual({ windowNull: false, objectZero: false, elementZero: false, nodeListZero: false });
  expect(result.after).toEqual({ windowNull: true, objectZero: true, elementZero: true, nodeListZero: true });
  expect(result.objectZeroEnumerable).toBe(true);
  expect(result.inheritedKeys).toContain("0");
  expect(result.aliasType).toBe("function");
});

test("explicit empty-string constructor avoids the default alias side effect", async ({ page }) => {
  const result = await page.evaluate(() => {
    new window.AQ("");
    return {
      windowNull: Object.prototype.hasOwnProperty.call(window, "null"),
      objectZero: Object.prototype.hasOwnProperty.call(Object.prototype, "0"),
      elementZero: Object.prototype.hasOwnProperty.call(Element.prototype, "0"),
      nodeListZero: Object.prototype.hasOwnProperty.call(NodeList.prototype, "0")
    };
  });
  expect(result).toEqual({ windowNull: false, objectZero: false, elementZero: false, nodeListZero: false });
});

test("nestedDOM returns an HTMLCollection unchanged instead of querying descendants", async ({ page }) => {
  const result = await page.evaluate(() => {
    const collection = document.getElementsByClassName("scope");
    const returned = window.AQ.nestedDOM.call(collection, ".target");
    return {
      isSameCollection: returned === collection,
      isHTMLCollection: returned instanceof HTMLCollection
    };
  });
  expect(result).toEqual({ isSameCollection: true, isHTMLCollection: true });
});

test("instance created after document load does not replay initlog callbacks", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    let calls = 0;
    instance.initlog.push(() => calls++);
    window.lateInitCalls = () => calls;
    return { readyState: document.readyState, initialCalls: calls };
  });
  await page.waitForTimeout(50);
  const calls = await page.evaluate(() => window.lateInitCalls());
  expect(result.readyState).toBe("complete");
  expect(result.initialCalls).toBe(0);
  expect(calls).toBe(0);
});

test("sift returns before installing a handler for a normal selector", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.querySelector("#event-target");
    const before = node.onkeyup;
    const returned = node.sift(".target");
    return { sameNode: returned === node, before, after: node.onkeyup };
  });
  expect(result.sameNode).toBe(true);
  expect(result.before).toBeNull();
  expect(result.after).toBeNull();
});

test("setHtml and setAdjacent skip ordinary truthy arguments", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.querySelector("#event-target");
    node.innerHTML = "<b>original</b>";
    const child = document.createElement("i");
    node.setHtml("<em>replacement</em>");
    node.setAdjacent("atend", child);
    return { html: node.innerHTML, childCount: node.children.length };
  });
  expect(result.html).toBe("<b>original</b>");
  expect(result.childCount).toBe(1);
});

test("defer passes the remaining callback array to setTimeout without a synchronous throw", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    let timer;
    try {
      timer = instance.defer([() => true, 60]);
      clearTimeout(timer);
      return { threw: false, timerType: typeof timer };
    } catch (error) {
      return { threw: true, error: error.name, timerType: typeof timer };
    }
  });
  expect(result).toEqual({ threw: false, timerType: "number" });
});

test("defer stringifies callback arrays instead of invoking the callback", async ({ page }) => {
  await page.evaluate(() => {
    window.deferCalls = 0;
    const instance = new window.AQ("");
    instance.defer([() => window.deferCalls++, 0.01]);
  });
  await page.waitForTimeout(60);
  const calls = await page.evaluate(() => window.deferCalls);
  expect(calls).toBe(0);
});

test("suspect type predicates expose their source-level edge cases", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    let objectLikeError = null;
    let nodeListError = null;
    try { instance.isObjectLike({}); } catch (error) { objectLikeError = error.name; }
    try { instance.isNodeList(document.querySelectorAll(".target")); } catch (error) { nodeListError = error.name; }
    return {
      isNaSPrimitive: instance.isNaS("value"),
      isNaSBoxed: instance.isNaS(new String("value")),
      isSetEmptyArray: instance.isSet([]),
      isSetNonEmptyArray: instance.isSet([1]),
      isJSONNull: instance.isJSON(null),
      objectLikeError,
      nodeListError
    };
  });
  expect(result.isNaSPrimitive).toBe(true);
  expect(result.isNaSBoxed).toBe(true);
  expect(result.isSetEmptyArray).toBe(false);
  expect(result.isSetNonEmptyArray).toBe(true);
  expect(result.isJSONNull).toBe(true);
  expect(result.objectLikeError).toBe("ReferenceError");
  expect(result.nodeListError).toBe("ReferenceError");
});

test("late lifecycle registration does not replay ready or init events", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    window.lifecycleCounts = { ready: 0, init: 0 };
    instance.on("ready", () => window.lifecycleCounts.ready++);
    instance.on("init", () => window.lifecycleCounts.init++);
    return { readyState: document.readyState, ...window.lifecycleCounts };
  });
  await page.waitForTimeout(50);
  const later = await page.evaluate(() => window.lifecycleCounts);
  expect(result.readyState).toBe("complete");
  expect(result.ready).toBe(0);
  expect(result.init).toBe(0);
  expect(later).toEqual({ ready: 0, init: 0 });
});

test("isObjectLiteral throws for null before reaching its null guard", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    try {
      return { threw: false, value: instance.isObjectLiteral(null) };
    } catch (error) {
      return { threw: true, error: error.name };
    }
  });
  expect(result).toEqual({ threw: true, error: "TypeError" });
});

test("isEmpty uses recursive and zero-as-empty semantics", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    return {
      zero: instance.isEmpty(0),
      emptyArray: instance.isEmpty([]),
      nestedNull: instance.isEmpty([1, null]),
      zeroException: instance.isEmpty("0", ["0"])
    };
  });
  expect(result).toEqual({ zero: true, emptyArray: false, nestedNull: true, zeroException: false });
});

test("Element siblings next/prev work but all-siblings branch throws", async ({ page }) => {
  const result = await page.evaluate(() => {
    const element = document.querySelector("#target-a");
    let allError = null;
    try { element.siblings(); } catch (error) { allError = error.name; }
    return {
      next: element.siblings("next")?.id,
      prev: element.siblings("prev"),
      allError
    };
  });
  expect(result.next).toBe("target-b");
  expect(result.prev).toBeNull();
  expect(result.allError).toBe("ReferenceError");
});

test("NodeList siblings methods throw due to double indexing", async ({ page }) => {
  const result = await page.evaluate(() => {
    const list = document.querySelectorAll(".target");
    let nextError = null;
    let allError = null;
    try { list.siblings("next"); } catch (error) { nextError = error.name; }
    try { list.siblings(); } catch (error) { allError = error.name; }
    return { nextError, allError };
  });
  expect(result.nextError).toBe("TypeError");
  expect(result.allError).toBe("TypeError");
});

test("AQJS overwrites native String.prototype.trim while retaining native descriptor flags", async ({ page }) => {
  const result = await page.evaluate(() => {
    const descriptor = Object.getOwnPropertyDescriptor(String.prototype, "trim");
    return {
      sameAsNative: String.prototype.trim === window.nativeStringTrim,
      writable: descriptor.writable,
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable
    };
  });
  expect(result.sameAsNative).toBe(false);
  expect(result.writable).toBe(true);
  expect(result.configurable).toBe(true);
  expect(result.enumerable).toBe(false);
});

test("Array.setSort throws in strict module code because comparator assigns undeclared variables", async ({ page }) => {
  const result = await page.evaluate(() => {
    const values = [{ score: 2 }, { score: 1 }];
    try {
      values.setSort("score");
      return { threw: false, error: null };
    } catch (error) {
      return { threw: true, error: error.name };
    }
  });
  expect(result).toEqual({ threw: true, error: "ReferenceError" });
});

test("Array.getIndex equals branch assigns instead of comparing", async ({ page }) => {
  const result = await page.evaluate(() => {
    const values = [{ id: 1 }, { id: 2 }];
    const index = values.getIndex("id", "=", 99);
    return { index, ids: values.map(item => item.id) };
  });
  expect(result).toEqual({ index: 0, ids: [99, 2] });
});

test("Array.setItem skips ordinary truthy index and value", async ({ page }) => {
  const result = await page.evaluate(() => {
    const values = [1, 2];
    const returned = values.setItem(1, 3);
    // Array.prototype.then makes returning an Array from page.evaluate thenable.
    return { values: [...values], returnedSame: returned === values };
  });
  expect(result).toEqual({ values: [1, 2], returnedSame: true });
});

test("Array.i fails because ActiveQuery.isNaN is not defined", async ({ page }) => {
  const result = await page.evaluate(() => {
    try {
      return { threw: false, value: [10, 20].i(0) };
    } catch (error) {
      return { threw: true, error: error.name };
    }
  });
  expect(result).toEqual({ threw: true, error: "TypeError" });
});

test("Object setValues and hasValues call a missing static predicate", async ({ page }) => {
  const result = await page.evaluate(() => {
    const value = { existing: 1 };
    let setError = null;
    let getError = null;
    try { value.setValues("newKey", 2); } catch (error) { setError = error.name; }
    try { value.hasValues("existing"); } catch (error) { getError = error.name; }
    return { value, setError, getError };
  });
  expect(result).toEqual({ value: { existing: 1 }, setError: "TypeError", getError: "TypeError" });
});

test("nestedDOM rejects Array contexts and returns the original array unchanged", async ({ page }) => {
  const result = await page.evaluate(() => {
    const manyInput = [document.querySelector("#scope-a"), document.querySelector("#scope-b")];
    const oneInput = [document.querySelector("#scope-b")];
    const emptyInput = [document.createElement("div")];
    return {
      manySame: window.AQ.nestedDOM.call(manyInput, ".target") === manyInput,
      oneSame: window.AQ.nestedDOM.call(oneInput, "#target-c") === oneInput,
      emptySame: window.AQ.nestedDOM.call(emptyInput, ".target") === emptyInput
    };
  });
  expect(result).toEqual({ manySame: true, oneSame: true, emptySame: true });
});

test("custom String.trim differs from native Unicode whitespace semantics", async ({ page }) => {
  const result = await page.evaluate(() => ({
    bomCustom: "\uFEFFvalue\uFEFF".trim(),
    zeroWidthCustom: "\u200Bvalue\u200B".trim(),
    bomNative: window.nativeStringTrim.call("\uFEFFvalue\uFEFF"),
    zeroWidthNative: window.nativeStringTrim.call("\u200Bvalue\u200B")
  }));
  expect(result.bomCustom).toBe("\uFEFFvalue\uFEFF");
  expect(result.zeroWidthCustom).toBe("value");
  expect(result.bomNative).toBe("value");
  expect(result.zeroWidthNative).toBe("\u200Bvalue\u200B");
});

test("Element getValue mode flag inverts found/missing results", async ({ page }) => {
  const result = await page.evaluate(() => {
    const input = document.createElement("input");
    input.value = "abc";
    return {
      found: input.getValue("abc"),
      missing: input.getValue("z"),
      foundMode: input.getValue("abc", true),
      missingMode: input.getValue("z", true),
      noArgReturnsElement: input.getValue() === input
    };
  });
  expect(result).toEqual({
    found: true,
    missing: false,
    foundMode: false,
    missingMode: true,
    noArgReturnsElement: true
  });
});

test("Element setText cannot clear text with an empty string", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.textContent = "original";
    node.setText("");
    return node.textContent;
  });
  expect(result).toBe("original");
});

test("NodeList getter and content helpers include no-op stubs", async ({ page }) => {
  const result = await page.evaluate(() => {
    const list = document.querySelectorAll(".target");
    const before = [...list].map(node => node.textContent);
    const styles = list.getStyles();
    const classes = list.getClasses();
    list.setText("changed");
    list.setHtml("<b>changed</b>");
    list.setContent(document.createElement("i"));
    return {
      stylesUndefined: styles === undefined,
      classesSame: classes === list,
      textUnchanged: [...list].map(node => node.textContent).every((value, i) => value === before[i])
    };
  });
  expect(result).toEqual({ stylesUndefined: true, classesSame: true, textUnchanged: true });
});

test("NodeList setValue updates form controls in the collection", async ({ page }) => {
  const result = await page.evaluate(() => {
    const form = document.createElement("div");
    form.innerHTML = '<input><input>';
    const inputs = form.querySelectorAll("input");
    inputs.setValue("batch");
    const afterSet = [...inputs].map(input => input.value);
    inputs.setValue("");
    const afterClear = [...inputs].map(input => input.value);
    return { afterSet, afterClear };
  });
  expect(result).toEqual({ afterSet: ["batch", "batch"], afterClear: ["", ""] });
});

test("Document and Window on helpers register native listeners", async ({ page }) => {
  const result = await page.evaluate(() => {
    let documentCalls = 0;
    let windowCalls = 0;
    document.on("aq-custom-event", () => documentCalls++);
    window.on("aq-custom-event", () => windowCalls++);
    document.dispatchEvent(new Event("aq-custom-event"));
    window.dispatchEvent(new Event("aq-custom-event"));
    return { documentCalls, windowCalls };
  });
  expect(result).toEqual({ documentCalls: 1, windowCalls: 1 });
});

test("Function.then and Number.trim extensions execute", async ({ page }) => {
  const result = await page.evaluate(() => {
    const fn = () => true;
    return {
      then: fn.then(value => value === fn),
      numberTrim: (123).trim()
    };
  });
  expect(result).toEqual({ then: true, numberTrim: "123" });
});

test("keepOn returns only empty collections outside debug mode", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    const empty = [];
    const nonEmpty = [1];
    const emptyResult = instance.keepOn(empty);
    const nonEmptyResult = instance.keepOn(nonEmpty);
    window.debug = true;
    const debugResult = instance.keepOn([]);
    delete window.debug;
    return {
      emptySame: emptyResult === empty,
      nonEmptyUndefined: nonEmptyResult === undefined,
      debugUndefined: debugResult === undefined
    };
  });
  expect(result).toEqual({ emptySame: true, nonEmptyUndefined: true, debugUndefined: true });
});

test("sancha static mode works but data mode throws in strict module code", async ({ page }) => {
  const result = await page.evaluate(() => {
    const root = document.createElement("ul");
    root.sancha({ static: true, template: "<li>static</li>", swap: true });
    const staticHtml = root.innerHTML;
    root.innerHTML = "<li>{{name}}</li>";
    let dataError = null;
    try {
      root.sancha({ data: [{ name: "Ada" }], swap: true });
    } catch (error) {
      dataError = error.name;
    }
    return { staticHtml, dataError };
  });
  expect(result).toEqual({ staticHtml: "<li>static</li>", dataError: "ReferenceError" });
});

test("watch callback fails on undefined this and does not invoke the user callback", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.name));
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    let calls = 0;
    const observerResult = node.watch({
      children: true,
      then: () => calls++
    });
    node.appendChild(document.createElement("span"));
    window.watchCalls = () => calls;
    return { observerResult, resultType: typeof observerResult };
  });
  await page.waitForTimeout(50);
  const calls = await page.evaluate(() => window.watchCalls());
  expect(result.resultType).toBe("undefined");
  expect(calls).toBe(0);
  expect(pageErrors).toContain("TypeError");
});

test("extend dom registers valid autonomous custom elements", async ({ page }) => {
  const result = await page.evaluate(() => {
    class AqValidElement extends HTMLElement {}
    const returned = window.AQ.extend("dom", "x-aq-valid", AqValidElement);
    return {
      registered: customElements.get("x-aq-valid") === AqValidElement,
      returnsClass: returned === window.AQ
    };
  });
  expect(result).toEqual({ registered: true, returnsClass: true });
});

test("extend dom accepts a name without a hyphen then browser registration rejects it", async ({ page }) => {
  const result = await page.evaluate(() => {
    class AqInvalidElement extends HTMLElement {}
    try {
      window.AQ.extend("dom", "foo", AqInvalidElement);
      return { threw: false, registered: Boolean(customElements.get("foo")) };
    } catch (error) {
      return { threw: true, error: error.name, registered: Boolean(customElements.get("foo")) };
    }
  });
  expect(result).toEqual({ threw: true, error: "SyntaxError", registered: false });
});


test("nestedDOM supports Document contexts with polymorphic descendant results", async ({ page }) => {
  const result = await page.evaluate(() => {
    const many = window.AQ.nestedDOM.call(document, ".target");
    const one = window.AQ.nestedDOM.call(document, "#target-c");
    const none = window.AQ.nestedDOM.call(document, ".missing");
    return {
      manyIsNodeList: many instanceof NodeList,
      manyLength: many.length,
      oneId: one.id,
      noneIsDocument: none === document
    };
  });
  expect(result).toEqual({
    manyIsNodeList: true,
    manyLength: 3,
    oneId: "target-c",
    noneIsDocument: true
  });
});

test("Array query helpers implement loose, strict, substring and first-index contracts", async ({ page }) => {
  const result = await page.evaluate(() => {
    const values = [{ key: 1 }, { key: "1" }, { key: "abc" }, { key: "abcd" }];
    const strings = [{ key: "abc" }, { key: "abcd" }];
    return {
      looseCount: values.getCount("key", "==", 1),
      looseIndex: values.getIndex("key", "==", 1),
      strictCount: values.getCount("key", "===", 1),
      substringCount: strings.getCount("key", "*", "bc"),
      hasExact: values.has("key", "abc"),
      foundIndex: values.getIndexs("key", "abcd"),
      missingIndex: values.getIndexs("key", "missing"),
      thenValue: values.then(list => list.length)
    };
  });
  expect(result).toEqual({
    looseCount: 2,
    looseIndex: 0,
    strictCount: 1,
    substringCount: 2,
    hasExact: true,
    foundIndex: 3,
    missingIndex: false,
    thenValue: 4
  });
});

test("Element attributes and inline styles expose early-stop and parsing behavior", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.setAttributes(["data-first", "one", "data-stop", "", "data-after", "three"]);
    node.setAttributeName(["hidden", "inert"]);
    node.removeAttributes(["inert"]);
    node.setStyles(["color: red", "marginTop: 2px"]);
    return {
      first: node.getAttribute("data-first"),
      stopped: node.hasAttribute("data-stop"),
      after: node.hasAttribute("data-after"),
      hidden: node.hasAttribute("hidden"),
      inert: node.hasAttribute("inert"),
      inlineStyles: node.getStyles(["color", "marginTop", true])
    };
  });
  expect(result).toEqual({
    first: "one",
    stopped: false,
    after: false,
    hidden: true,
    inert: false,
    inlineStyles: ["red", "2px"]
  });
});

test("Element content helpers distinguish HTML, text and substring modes", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.createElement("div");
    node.innerHTML = "<b>Hello</b>";
    const before = {
      html: node.getHtml(),
      htmlContains: node.getHtml("Hello"),
      text: node.getText(),
      textContains: node.getText("ell"),
      missingText: node.getText("missing")
    };
    const child = document.createElement("i");
    child.textContent = "replacement";
    node.setContent([child]);
    const after = node.innerHTML;
    return { before, after };
  });
  expect(result).toEqual({
    before: {
      html: "<b>Hello</b>",
      htmlContains: true,
      text: "Hello",
      textContains: true,
      missingText: false
    },
    after: "<i>replacement</i>"
  });
});

test("NodeList bulk attribute, style and class mutators apply to each member", async ({ page }) => {
  const result = await page.evaluate(() => {
    const nodes = document.querySelectorAll(".target");
    nodes.setAttributes(["data-batch", "yes"]);
    nodes.setStyles(["color: blue"]);
    nodes.setClasses(["batched"]);
    return {
      attributes: [...nodes].map(node => node.getAttribute("data-batch")),
      colors: [...nodes].map(node => node.style.color),
      classes: [...nodes].map(node => node.classList.contains("batched"))
    };
  });
  expect(result).toEqual({
    attributes: ["yes", "yes", "yes"],
    colors: ["blue", "blue", "blue"],
    classes: [true, true, true]
  });
});

test("Element parent and name getters return DOM relationships", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.querySelector("#single");
    return {
      parentId: node.parent.id,
      parentIsNativeParent: node.parent === node.parentNode,
      name: node.name
    };
  });
  expect(result).toEqual({ parentId: "fixture", parentIsNativeParent: true, name: "DIV" });
});


test("Array.setItem inserts only when both arguments are falsy", async ({ page }) => {
  const result = await page.evaluate(() => {
    const values = [1, 2];
    const returned = values.setItem(0, 0);
    return { values: [...values], returnedSame: returned === values };
  });
  expect(result).toEqual({ values: [0, 1, 2], returnedSame: true });
});

test("type predicate families expose positive, negative and broken array-like checks", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    let arrayLikeError = null;
    let negativeArrayLikeError = null;
    let negativeNodeListError = null;
    try { instance.isArrayLike([1]); } catch (error) { arrayLikeError = error.name; }
    try { instance.isNaAL([1]); } catch (error) { negativeArrayLikeError = error.name; }
    try { instance.isNaNL(document.querySelectorAll(".target")); } catch (error) { negativeNodeListError = error.name; }
    return {
      isArray: instance.isArray([1]),
      isNaA: instance.isNaA([1]),
      isArraySet: instance.isArraySet(new Set([1])),
      isNaAS: instance.isNaAS(new Set([1])),
      isObjectMap: instance.isObjectMap(new Map()),
      isNaOM: instance.isNaOM(new Map()),
      isString: instance.isString("value"),
      isObject: instance.isObject({ value: 1 }),
      isNaO: instance.isNaO({ value: 1 }),
      isNaM: instance.isNaM(new Map()),
      isFunction: instance.isFunction(function named() { return true; }),
      isClass: instance.isClass(class Example {}),
      isArgumentEmpty: instance.isArgument(""),
      isArgumentNull: instance.isArgument(null),
      isJSONArbitraryText: instance.isJSON("not valid JSON"),
      arrayLikeError,
      negativeArrayLikeError,
      negativeNodeListError
    };
  });
  expect(result).toEqual({
    isArray: true,
    isNaA: false,
    isArraySet: true,
    isNaAS: false,
    isObjectMap: true,
    isNaOM: false,
    isString: true,
    isObject: true,
    isNaO: false,
    isNaM: false,
    isFunction: true,
    isClass: true,
    isArgumentEmpty: false,
    isArgumentNull: true,
    isJSONArbitraryText: true,
    arrayLikeError: "ReferenceError",
    negativeArrayLikeError: "ReferenceError",
    negativeNodeListError: "ReferenceError"
  });
});


test("ActiveQuery.exit and Element chain helpers return their receiver", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    const parent = document.createElement("div");
    const first = document.createElement("span");
    const second = document.createElement("b");
    const childReturn = parent.setChild([first, second]);
    const input = document.createElement("input");
    input.setValue("initial");
    const setReturn = input.setValue("");
    const thenValue = parent.then(node => node.children.length);
    return {
      staticExitSame: window.AQ.exit() === window.AQ,
      instanceExitSame: instance.exit() === instance,
      childReturnSame: childReturn === parent,
      childCount: parent.children.length,
      setReturnSame: setReturn === input,
      clearedValue: input.value,
      thenValue
    };
  });
  expect(result).toEqual({
    staticExitSame: true,
    instanceExitSame: true,
    childReturnSame: true,
    childCount: 2,
    setReturnSame: true,
    clearedValue: "",
    thenValue: 2
  });
});
