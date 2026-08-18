import { expect, test } from "bun:test";
import { main } from "../src/cli.js";
import { capture, dependencies } from "./cli-fixtures.js";

test("does not emit a success envelope when structured history lookup fails", async () => {
  const output = capture();
  const error = capture();

  const status = await main(
    ["scans", "show", "51e818d", "--format", "json", "--full-output"],
    output.stream,
    error.stream,
    dependencies({
      onWorkbench: () => {
        throw new Error("Scan ID prefixes must be at least eight characters.");
      },
    }),
  );

  expect(status).toBe(2);
  expect(output.text()).toBe("");
  expect(error.text()).toContain(
    "Scan ID prefixes must be at least eight characters.",
  );
});
