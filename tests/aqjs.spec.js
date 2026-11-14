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

test("defer passes a non-function array to setTimeout and throws", async ({ page }) => {
  const result = await page.evaluate(() => {
    const instance = new window.AQ("");
    try {
      instance.defer([() => true, 0]);
      return { threw: false, error: null };
    } catch (error) {
      return { threw: true, error: error.name };
    }
  });
  expect(result.threw).toBe(true);
  expect(result.error).toBe("TypeError");
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

test("AQJS overwrites native String.prototype.trim and freezes its descriptor", async ({ page }) => {
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
  expect(result.writable).toBe(false);
  expect(result.configurable).toBe(false);
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
    values.setItem(1, 3);
    return values;
  });
  expect(result).toEqual([1, 2]);
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

test("Object setValues and hasValues guards skip normal truthy arguments", async ({ page }) => {
  const result = await page.evaluate(() => {
    const value = { existing: 1 };
    const setResult = value.setValues("newKey", 2);
    const getResult = value.hasValues("existing");
    return { value, setSame: setResult === value, getSame: getResult === value };
  });
  expect(result).toEqual({ value: { existing: 1 }, setSame: true, getSame: true });
});
