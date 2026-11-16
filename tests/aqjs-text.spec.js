import { test, expect } from "@playwright/test";

async function collectTextContract(page, path) {
  await page.goto(path);
  await page.waitForFunction(() => window.fixtureReady === true);
  return page.evaluate(() => {
    const node = document.createElement("div");
    node.textContent = "Original content";
    const truthyReturn = node.setText("Updated panel");
    const afterTruthy = node.textContent;
    const falsyResults = [0, false, null, ""].map(value => {
      const returned = node.setText(value);
      return {
        returnsSame: returned === node,
        text: node.textContent
      };
    });
    return {
      truthyReturnsSame: truthyReturn === node,
      afterTruthy,
      falsyResults,
      getTextWhole: node.getText(),
      getTextFound: node.getText("panel"),
      getTextMissing: node.getText("absent")
    };
  });
}

test("Element.setText writes truthy values and preserves content for falsy values", async ({ page }) => {
  const result = await collectTextContract(page, "/");
  expect(result).toEqual({
    truthyReturnsSame: true,
    afterTruthy: "Updated panel",
    falsyResults: [
      { returnsSame: true, text: "Updated panel" },
      { returnsSame: true, text: "Updated panel" },
      { returnsSame: true, text: "Updated panel" },
      { returnsSame: true, text: "Updated panel" }
    ],
    getTextWhole: "Updated panel",
    getTextFound: true,
    getTextMissing: false
  });
});

test("Element setText/getText contract matches source and minified builds", async ({ page }) => {
  const source = await collectTextContract(page, "/");
  const minified = await collectTextContract(page, "/tests/fixture-min.html");
  expect(minified).toEqual(source);
});
