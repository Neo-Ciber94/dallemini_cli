import { merge } from "../../src/utils/merge.ts";
import { assertObjectMatch } from "../dev_deps.ts";

type Point = {
  x?: number;
  y?: number;
};

Deno.test("merge - empty fields", () => {
  const p1: Point = {
    x: 1,
  };

  const p2: Point = {
    y: 2,
  };

  const result = merge(p1, p2);
  assertObjectMatch(result, { x: 1, y: 2 });
});

Deno.test("merge - replace", () => {
  const p1: Point = {
    x: 1,
    y: 2,
  };

  const p2: Point = {
    x: 5,
    y: 6,
  };

  const result = merge(p1, p2);
  assertObjectMatch(result, { x: 5, y: 6 });
});
