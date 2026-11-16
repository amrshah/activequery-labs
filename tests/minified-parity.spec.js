import { test, expect } from "@playwright/test";
import postcss from "postcss";
import fs from "node:fs";

function normalizeSelector(selector) {
  return selector
    .replace(/\s*,\s*/g, ",")
    .replace(/\s*([>+~])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeValue(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s*([,()])\s*/g, "$1")
    .trim();
}

function canonicalRules(root) {
  const result = [];
  root.walkRules(rule => {
    const context = [];
    let parent = rule.parent;
    while (parent && parent.type !== "root") {
      if (parent.type === "atrule") {
        const params = parent.params.replace(/\s*:\s*/g, ":").replace(/\s*,\s*/g, ",").replace(/\s+/g, " ").trim();
        context.unshift(`@${parent.name} ${params}`);
      }
      parent = parent.parent;
    }
    const declarations = (rule.nodes || [])
      .filter(node => node.type === "decl")
      .map(node => [node.prop, normalizeValue(node.value), Boolean(node.important)]);
    result.push({ selector: normalizeSelector(rule.selector || ""), context, declarations });
  });
  return result;
}

test("AQCSS minified stylesheet matches source selector and declaration AST", async () => {
  const source = fs.readFileSync("./vendor/ActiveQuery.css", "utf8");
  const minified = fs.readFileSync("./vendor/ActiveQuery.min.css", "utf8");
  const sourceAst = postcss.parse(source);
  const minifiedAst = postcss.parse(minified);
  expect(canonicalRules(minifiedAst)).toEqual(canonicalRules(sourceAst));
});

test("AQJS source and minified builds expose equivalent core DOM behavior", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => window.fixtureReady === true);
  const sourceResult = await page.evaluate(() => {
    const target = document.querySelector("#single");
    target.setClasses(["parity-a", "parity-b"]);
    return {
      none: window.AQ.DOM(".not-found"),
      one: window.AQ.DOM("#single")?.id,
      many: window.AQ.DOM(".target")?.length,
      nested: window.AQ.nestedDOM.call(document.querySelector("#scope-b"), ".target")?.id,
      classes: target.getClasses(["parity-a", "parity-b"])
    };
  });

  await page.goto("/tests/fixture-min.html");
  await page.waitForFunction(() => window.fixtureReady === true);
  const minifiedResult = await page.evaluate(() => {
    const target = document.querySelector("#single");
    target.setClasses(["parity-a", "parity-b"]);
    return {
      none: window.AQ.DOM(".not-found"),
      one: window.AQ.DOM("#single")?.id,
      many: window.AQ.DOM(".target")?.length,
      nested: window.AQ.nestedDOM.call(document.querySelector("#scope-b"), ".target")?.id,
      classes: target.getClasses(["parity-a", "parity-b"])
    };
  });

  expect(minifiedResult).toEqual(sourceResult);
});

test("minified AQJS overwrites native String.trim and retains native descriptor flags", async ({ page }) => {
  await page.goto("/tests/fixture-min.html");
  await page.waitForFunction(() => window.fixtureReady === true);
  const result = await page.evaluate(() => {
    const descriptor = Object.getOwnPropertyDescriptor(String.prototype, "trim");
    return {
      sameAsNative: String.prototype.trim === window.nativeStringTrim,
      writable: descriptor.writable,
      configurable: descriptor.configurable
    };
  });
  expect(result).toEqual({ sameAsNative: false, writable: true, configurable: true });
});

test("minified AQJS default constructor triggers the same prototype mutation", async ({ page }) => {
  await page.goto("/tests/fixture-min.html");
  await page.waitForFunction(() => window.fixtureReady === true);
  const result = await page.evaluate(() => {
    new window.AQ();
    return {
      windowNull: Object.prototype.hasOwnProperty.call(window, "null"),
      objectZero: Object.prototype.hasOwnProperty.call(Object.prototype, "0"),
      objectZeroEnumerable: Object.prototype.propertyIsEnumerable("0")
    };
  });
  expect(result).toEqual({ windowNull: true, objectZero: true, objectZeroEnumerable: true });
});


test("AQJS source and minified builds match selected edge-case contracts", async ({ page }) => {
  const collect = async path => {
    await page.goto(path);
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const rows = [{ key: 1 }, { key: 2 }];
      const assignedIndex = rows.getIndex("key", "=", 99);
      const values = [1, 2];
      const setItemReturn = values.setItem(1, 3);
      const arrayContext = [document.querySelector("#scope-a")];
      const nodeList = document.querySelectorAll(".target");
      const target = document.querySelector("#single");
      target.textContent = "preserve";
      target.setText("");
      let arrayLikeError = null;
      try { new window.AQ("").isArrayLike([1]); } catch (error) { arrayLikeError = error.name; }
      return {
        assignedIndex,
        assignedValue: rows[0].key,
        setItemValues: [...values],
        setItemReturnSame: setItemReturn === values,
        arrayNestedSame: window.AQ.nestedDOM.call(arrayContext, ".target") === arrayContext,
        nodeListGetHtmlSame: nodeList.getHtml() === nodeList,
        nodeListGetClassesSame: nodeList.getClasses() === nodeList,
        nodeListGetStylesUndefined: nodeList.getStyles(["color"]) === undefined,
        emptySetTextPreserves: target.textContent === "preserve",
        arrayLikeError
      };
    });
  };

  const sourceResult = await collect("/");
  const minifiedResult = await collect("/tests/fixture-min.html");
  expect(minifiedResult).toEqual(sourceResult);
  expect(sourceResult).toEqual({
    assignedIndex: 0,
    assignedValue: 99,
    setItemValues: [1, 2],
    setItemReturnSame: true,
    arrayNestedSame: true,
    nodeListGetHtmlSame: true,
    nodeListGetClassesSame: true,
    nodeListGetStylesUndefined: true,
    emptySetTextPreserves: true,
    arrayLikeError: "ReferenceError"
  });
});


test("AQJS source and minified builds preserve Element value/child and NodeList event contracts", async ({ page }) => {
  const collect = async path => {
    await page.goto(path);
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const input = document.createElement("input");
      input.setValue("ready");
      const afterTruthy = input.value;
      input.setValue(0);
      const afterFalsy = input.value;

      const generic = document.createElement("div");
      generic.setValue("ignored");
      const child = document.createElement("em");
      const childRoot = document.createElement("div");
      const childReturn = childRoot.setChild([child]);

      const callbackValue = childRoot.then(node => node.children[0].tagName);
      const nodes = document.querySelectorAll(".target");
      let eventCalls = 0;
      nodes.on("aq-parity-event", () => eventCalls++);
      nodes.forEach(node => node.dispatchEvent(new Event("aq-parity-event")));
      const empty = document.querySelectorAll(".no-such-target");
      const emptyOnSame = empty.on("aq-parity-event", () => {}) === empty;

      const values = [{ key: "beta:more" }, { key: "beta" }, { key: "alpha" }];
      return {
        afterTruthy,
        afterFalsy,
        genericHasValue: "value" in generic,
        genericValue: generic.value,
        childTag: childRoot.firstElementChild?.tagName,
        childReturnSame: childReturn === childRoot,
        callbackValue,
        eventCalls,
        emptyOnSame,
        defaultCount: values.getCount("key", "x:", "beta:more")
      };
    });
  };

  const sourceResult = await collect("/");
  const minifiedResult = await collect("/tests/fixture-min.html");
  expect(minifiedResult).toEqual(sourceResult);
  expect(sourceResult).toEqual({
    afterTruthy: "ready",
    afterFalsy: "",
    genericHasValue: true,
    genericValue: "",
    childTag: "EM",
    childReturnSame: true,
    callbackValue: "EM",
    eventCalls: 3,
    emptyOnSame: true,
    defaultCount: 2
  });
});


test("AQJS source and minified builds preserve Array then and Document/Window event contracts", async ({ page }) => {
  const collect = async path => {
    await page.goto(path);
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const values = [1, 2, 3];
      const callbackResult = values.then(list => list.length + 10);
      const missingCallback = values.then() === undefined;
      const invalidCallback = values.then("not-a-callback") === undefined;
      let documentCalls = 0;
      let windowCalls = 0;
      document.on("aq-parity-document", () => documentCalls++);
      window.on("aq-parity-window", () => windowCalls++);
      document.dispatchEvent(new Event("aq-parity-document"));
      window.dispatchEvent(new Event("aq-parity-window"));
      return {
        callbackResult,
        missingCallback,
        invalidCallback,
        documentCalls,
        windowCalls,
        invalidDocumentReturnsReceiver: document.on("", () => {}) === document,
        invalidWindowReturnsReceiver: window.on("aq-invalid", null) === window
      };
    });
  };
  const sourceResult = await collect("/");
  const minifiedResult = await collect("/tests/fixture-min.html");
  expect(minifiedResult).toEqual(sourceResult);
  expect(sourceResult).toEqual({
    callbackResult: 13,
    missingCallback: true,
    invalidCallback: true,
    documentCalls: 1,
    windowCalls: 1,
    invalidDocumentReturnsReceiver: true,
    invalidWindowReturnsReceiver: true
  });
});


test("AQJS source and minified builds preserve early lifecycle and initlog timing", async ({ page }) => {
  const collect = async modulePath => {
    await page.goto("/");
    return page.evaluate(async path => {
      const frame = document.createElement("iframe");
      const loaded = new Promise(resolve => frame.addEventListener("load", resolve, { once: true }));
      frame.srcdoc = `<!doctype html><html><head></head><body>
        <script type="module">
          import { ActiveQuery } from "${path}";
          const instance = new ActiveQuery("");
          window.lifecycle = { ready: 0, init: 0, run: 0, complete: 0 };
          instance.on("ready", () => window.lifecycle.ready++);
          instance.on("init", () => window.lifecycle.init++);
          instance.on("run", () => window.lifecycle.run++);
          instance.initlog.push(() => window.lifecycle.complete++);
        <\/script>
      </body></html>`;
      document.body.appendChild(frame);
      await loaded;
      await new Promise(resolve => setTimeout(resolve, 30));
      const result = frame.contentWindow.lifecycle;
      frame.remove();
      return result;
    }, modulePath);
  };
  const source = await collect("/vendor/ActiveQuery.js");
  const minified = await collect("/vendor/ActiveQuery.min.js");
  expect(minified).toEqual(source);
  expect(source).toEqual({ ready: 1, init: 1, run: 1, complete: 1 });
});


test("AQJS source and minified builds preserve Array query helper contracts", async ({ page }) => {
  const collect = async modulePath => {
    await page.goto(modulePath.includes(".min.") ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const values = [{ key: 1 }, { key: "1" }, { key: "abc" }, { key: "abcd" }];
      const strings = [{ key: "abc" }, { key: "abcd" }];
      const assignmentRows = [{ key: 1 }, { key: 2 }];
      const assignedIndex = assignmentRows.getIndex("key", "=", 99);
      return {
        looseCount: values.getCount("key", "==", 1),
        strictCount: values.getCount("key", "===", 1),
        substringCount: strings.getCount("key", "*", "bc"),
        defaultCount: strings.getCount("key", "contains", "bc"),
        hasExact: values.has("key", "abc"),
        foundIndex: values.getIndexs("key", "abcd"),
        missingIndex: values.getIndexs("key", "missing"),
        assignedIndex,
        assignedValue: assignmentRows[0].key
      };
    });
  };
  const source = await collect("/vendor/ActiveQuery.js");
  const minified = await collect("/vendor/ActiveQuery.min.js");
  expect(minified).toEqual(source);
  expect(source).toEqual({
    looseCount: 2,
    strictCount: 1,
    substringCount: 2,
    defaultCount: 2,
    hasExact: true,
    foundIndex: 3,
    missingIndex: false,
    assignedIndex: 0,
    assignedValue: 99
  });
});

test("AQJS source and minified builds preserve Element and NodeList bulk mutations", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const node = document.createElement("div");
      const attributesReturn = node.setAttributes(["data-one", "1", "data-stop", "", "data-after", "3"]);
      node.setAttributeName(["hidden", "inert"]);
      node.removeAttributes(["inert"]);
      node.setStyles(["color: red", "marginTop: 2px"]);
      node.setClasses(["alpha", "beta"]);
      node.toggleClasses("beta");
      const list = document.querySelectorAll(".target");
      list.setAttributes(["data-bulk", "yes"]);
      list.setStyles(["color: blue"]);
      list.setClasses(["bulk"]);
      return {
        attributesReturnSame: attributesReturn === node,
        firstAttribute: node.getAttribute("data-one"),
        stoppedAttribute: node.hasAttribute("data-after"),
        hidden: node.hasAttribute("hidden"),
        inertRemoved: !node.hasAttribute("inert"),
        inlineStyles: node.getStyles(["color", "marginTop", true]),
        classes: node.getClasses(["alpha", "beta"]),
        nodeListAttributes: [...list].map(item => item.getAttribute("data-bulk")),
        nodeListStyles: [...list].map(item => item.style.color),
        nodeListClasses: [...list].map(item => item.classList.contains("bulk"))
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    attributesReturnSame: true,
    firstAttribute: "1",
    stoppedAttribute: false,
    hidden: true,
    inertRemoved: true,
    inlineStyles: ["red", "2px"],
    classes: false,
    nodeListAttributes: ["yes", "yes", "yes"],
    nodeListStyles: ["blue", "blue", "blue"],
    nodeListClasses: [true, true, true]
  });
});


test("AQJS source and minified builds preserve Element fragment and form-control mutation contracts", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const host = document.createElement("div");
      const fragment = document.createDocumentFragment();
      fragment.append(document.createElement("span"), document.createElement("b"));
      const fragmentReturn = host.setChild(fragment);

      const partialHost = document.createElement("div");
      const valid = document.createElement("i");
      let partialError = null;
      try { partialHost.setChild([valid, "invalid"]); } catch (error) { partialError = error.name; }

      const input = document.createElement("input");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      const select = document.createElement("select");
      select.innerHTML = '<option value="a">A</option><option value="b">B</option>';
      const textarea = document.createElement("textarea");
      input.setValue("text");
      checkbox.setValue("yes");
      select.setValue("b");
      textarea.setValue("notes");
      const assigned = [input.value, checkbox.value, select.value, textarea.value];
      input.setValue(0);
      checkbox.setValue(false);
      select.setValue("missing");
      textarea.setValue(null);

      return {
        fragmentReturnSame: fragmentReturn === host,
        fragmentChildren: [...host.children].map(node => node.tagName),
        fragmentEmptied: fragment.childNodes.length === 0,
        partialError,
        partialAppend: partialHost.firstElementChild === valid,
        assigned,
        cleared: [input.value, checkbox.value, select.value, textarea.value],
        receiverIdentity: [
          input.setValue("again") === input,
          checkbox.setValue("again") === checkbox,
          select.setValue("a") === select,
          textarea.setValue("again") === textarea
        ]
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    fragmentReturnSame: true,
    fragmentChildren: ["SPAN", "B"],
    fragmentEmptied: true,
    partialError: "TypeError",
    partialAppend: true,
    assigned: ["text", "yes", "b", "notes"],
    cleared: ["", "", "", ""],
    receiverIdentity: [true, true, true, true]
  });
});


test("AQJS source and minified builds preserve NodeList setValue control and empty-list contracts", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const root = document.createElement("div");
      root.innerHTML = '<input><input type="checkbox"><select><option value="a">A</option><option value="batch">Batch</option></select><textarea></textarea><div></div>';
      const list = root.querySelectorAll("input, select, textarea, div");
      const setReturn = list.setValue("batch");
      const assigned = [...list].map(node => "value" in node ? node.value : null);
      list.setValue(false);
      const cleared = [...list].map(node => "value" in node ? node.value : null);
      const empty = root.querySelectorAll(".missing");
      return {
        setReturnsList: setReturn === list,
        assigned,
        cleared,
        genericStillHasNoValue: !("value" in list[4]),
        emptyReturnsSame: empty.setValue("ignored") === empty
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    setReturnsList: true,
    assigned: ["batch", "batch", "batch", "batch", null],
    cleared: ["", "", "", "", null],
    genericStillHasNoValue: true,
    emptyReturnsSame: true
  });
});


test("AQJS source and minified builds preserve Element setContent replacement and failure contracts", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const singleHost = document.createElement("div");
      singleHost.innerHTML = "<em>old</em>";
      const single = document.createElement("span");
      const singleReturn = singleHost.setContent(single);

      const arrayHost = document.createElement("div");
      arrayHost.innerHTML = "<em>old</em>";
      const arrayReturn = arrayHost.setContent([document.createElement("i"), document.createElement("b")]);

      const emptyHost = document.createElement("div");
      emptyHost.innerHTML = "<em>old</em>";
      const emptyReturn = emptyHost.setContent([]);

      const fragmentHost = document.createElement("div");
      fragmentHost.innerHTML = "<em>old</em>";
      const fragment = document.createDocumentFragment();
      fragment.append(document.createElement("u"), document.createElement("strong"));
      const fragmentReturn = fragmentHost.setContent(fragment);

      const partialHost = document.createElement("div");
      partialHost.innerHTML = "<em>old</em>";
      const valid = document.createElement("small");
      let partialError = null;
      try { partialHost.setContent([valid, "invalid"]); } catch (error) { partialError = error.name; }

      const stringHost = document.createElement("div");
      stringHost.innerHTML = "<em>old</em>";
      let stringError = null;
      try { stringHost.setContent("plain text"); } catch (error) { stringError = error.name; }

      return {
        single: { returnsHost: singleReturn === singleHost, tags: [...singleHost.children].map(node => node.tagName) },
        array: { returnsHost: arrayReturn === arrayHost, tags: [...arrayHost.children].map(node => node.tagName) },
        emptyArray: { returnsHost: emptyReturn === emptyHost, childCount: emptyHost.childElementCount },
        fragment: { returnsHost: fragmentReturn === fragmentHost, emptied: fragment.childNodes.length === 0, tags: [...fragmentHost.children].map(node => node.tagName) },
        partial: { error: partialError, tags: [...partialHost.children].map(node => node.tagName) },
        string: { error: stringError, html: stringHost.innerHTML }
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    single: { returnsHost: true, tags: ["SPAN"] },
    array: { returnsHost: true, tags: ["I", "B"] },
    emptyArray: { returnsHost: true, childCount: 0 },
    fragment: { returnsHost: true, emptied: true, tags: ["U", "STRONG"] },
    partial: { error: "TypeError", tags: ["SMALL"] },
    string: { error: "TypeError", html: "" }
  });
});


test("AQJS source and minified builds preserve known Array, Object and predicate failure contracts", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const values = [{ score: 2 }, { score: 1 }];
      let sortError = null;
      try { values.setSort("score"); } catch (error) { sortError = error.name; }

      let indexError = null;
      try { [10, 20].i(0); } catch (error) { indexError = error.name; }

      const object = { existing: 1 };
      let setValuesError = null;
      let hasValuesError = null;
      try { object.setValues("newKey", 2); } catch (error) { setValuesError = error.name; }
      try { object.hasValues("existing"); } catch (error) { hasValuesError = error.name; }

      const instance = new window.AQ("");
      return {
        sortError,
        indexError,
        objectUnchanged: object.newKey === undefined,
        setValuesError,
        hasValuesError,
        isNaS: instance.isNaS("value"),
        isNaFNamedFunction: instance.isNaF(function named() {}),
        isNaFArrow: instance.isNaF(() => true),
        isNaFString: instance.isNaF("not a function")
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    sortError: "ReferenceError",
    indexError: "TypeError",
    objectUnchanged: true,
    setValuesError: "TypeError",
    hasValuesError: "TypeError",
    isNaS: true,
    isNaFNamedFunction: false,
    isNaFArrow: false,
    isNaFString: false
  });
});


test("AQJS source and minified builds preserve Array.setItem and Element content/getter edge contracts", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const values = [1, 2];
      const truthyReturn = values.setItem(1, 3);
      const afterTruthy = [...values];
      const falsyReturn = values.setItem(0, 0);
      const afterFalsy = [...values];

      const textNode = document.createElement("div");
      textNode.textContent = "original";
      const setTextReturn = textNode.setText("");
      const textAfterEmpty = textNode.textContent;

      const htmlNode = document.createElement("div");
      htmlNode.innerHTML = "<b>original</b>";
      const setHtmlReturn = htmlNode.setHtml("<em>replacement</em>");

      const input = document.createElement("input");
      input.value = "abc";

      const siblings = document.createElement("div");
      siblings.innerHTML = '<span id="first"></span><b id="second"></b>';
      const first = siblings.firstElementChild;
      let allSiblingsError = null;
      try { first.siblings(); } catch (error) { allSiblingsError = error.name; }

      return {
        array: {
          truthyReturnSame: truthyReturn === values,
          afterTruthy,
          falsyReturnSame: falsyReturn === values,
          afterFalsy
        },
        text: {
          returnSame: setTextReturn === textNode,
          afterEmpty: textAfterEmpty
        },
        html: {
          returnSame: setHtmlReturn === htmlNode,
          afterTruthy: htmlNode.innerHTML
        },
        getValue: {
          found: input.getValue("abc"),
          missing: input.getValue("z"),
          foundMode: input.getValue("abc", true),
          missingMode: input.getValue("z", true),
          noArgReturnsInput: input.getValue() === input
        },
        siblings: {
          next: first.siblings("next")?.id,
          prev: first.siblings("prev"),
          allError: allSiblingsError
        }
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    array: {
      truthyReturnSame: true,
      afterTruthy: [1, 2],
      falsyReturnSame: true,
      afterFalsy: [0, 1, 2]
    },
    text: { returnSame: true, afterEmpty: "original" },
    html: { returnSame: true, afterTruthy: "<b>original</b>" },
    getValue: {
      found: true,
      missing: false,
      foundMode: false,
      missingMode: true,
      noArgReturnsInput: true
    },
    siblings: { next: "second", prev: null, allError: "ReferenceError" }
  });
});


test("AQJS source and minified builds preserve getPlugin import, fallback and rejection behavior", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(async () => {
      const instance = new window.AQ("");
      const module = await instance.getPlugin("/tests/fixture-plugin.js");
      const fallback = await instance.getPlugin(42);
      let rejectedError = null;
      try {
        await instance.getPlugin("/tests/missing-plugin-for-parity.js");
      } catch (error) {
        rejectedError = error.name;
      }
      return {
        fixtureValue: module.fixtureValue,
        defaultValue: module.default,
        fallbackReturnsInstance: fallback === instance,
        rejectedError
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    fixtureValue: "aq-plugin-loaded",
    defaultValue: "plugin-default",
    fallbackReturnsInstance: true,
    rejectedError: "TypeError"
  });
});


test("AQJS source and minified builds preserve Array.getIndex and setItem edge behavior", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const values = [{ id: 1 }, { id: 2 }];
      const index = values.getIndex("id", "=", 99);
      const list = [1, 2];
      const returned = list.setItem(1, 3);
      return {
        getIndex: { index, ids: values.map(item => item.id) },
        setItem: { values: [...list], returnedSame: returned === list }
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    getIndex: { index: 0, ids: [99, 2] },
    setItem: { values: [1, 2], returnedSame: true }
  });
});


test("AQJS source and minified builds preserve Function, Element and NodeList then helpers and defer behavior", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(async () => {
      const fn = function marker() {};
      const functionThen = fn.then(value => value === fn ? "function-ok" : "wrong-receiver");

      const element = document.createElement("div");
      const elementThen = element.then(value => value === element ? "element-ok" : "wrong-receiver");

      const list = document.querySelectorAll(".target");
      const listThen = list.then(value => value === list ? "list-ok" : "wrong-receiver");

      window.deferParityCalls = 0;
      const instance = new window.AQ("");
      const timer = instance.defer([() => window.deferParityCalls++, 0.01]);
      await new Promise(resolve => setTimeout(resolve, 60));

      return {
        functionThen,
        elementThen,
        listThen,
        timerType: typeof timer,
        deferCalls: window.deferParityCalls
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    functionThen: "function-ok",
    elementThen: "element-ok",
    listThen: "list-ok",
    timerType: "number",
    deferCalls: 0
  });
});


test("AQJS source and minified builds preserve Element setText and setHtml falsy branches", async ({ page }) => {
  const collect = async minified => {
    await page.goto(minified ? "/tests/fixture-min.html" : "/");
    await page.waitForFunction(() => window.fixtureReady === true);
    return page.evaluate(() => {
      const textNode = document.createElement("div");
      textNode.textContent = "keep";
      const textReturns = [textNode.setText(""), textNode.setText(0), textNode.setText(false), textNode.setText(null)].every(value => value === textNode);

      const emptyHtml = document.createElement("div");
      emptyHtml.innerHTML = "<em>old</em>";
      const emptyReturn = emptyHtml.setHtml("");

      const zeroHtml = document.createElement("div");
      const zeroReturn = zeroHtml.setHtml(0);

      const falseHtml = document.createElement("div");
      const falseReturn = falseHtml.setHtml(false);

      const nullHtml = document.createElement("div");
      const nullReturn = nullHtml.setHtml(null);

      const outerHost = document.createElement("div");
      outerHost.innerHTML = "<span>remove host</span>";
      document.body.append(outerHost);
      const outerReturn = outerHost.setHtml("", true);

      return {
        text: { content: textNode.textContent, returnsHost: textReturns },
        emptyHtml: { html: emptyHtml.innerHTML, returnsHost: emptyReturn === emptyHtml },
        zeroHtml: { html: zeroHtml.innerHTML, returnsHost: zeroReturn === zeroHtml },
        falseHtml: { html: falseHtml.innerHTML, returnsHost: falseReturn === falseHtml },
        nullHtml: { html: nullHtml.innerHTML, returnsHost: nullReturn === nullHtml },
        outerHtml: { hostRemoved: !outerHost.isConnected, returnValue: outerReturn }
      };
    });
  };
  const source = await collect(false);
  const minified = await collect(true);
  expect(minified).toEqual(source);
  expect(source).toEqual({
    text: { content: "keep", returnsHost: true },
    emptyHtml: { html: "", returnsHost: true },
    zeroHtml: { html: "0", returnsHost: true },
    falseHtml: { html: "false", returnsHost: true },
    nullHtml: { html: "null", returnsHost: true },
    outerHtml: { hostRemoved: true, returnValue: "" }
  });
});
