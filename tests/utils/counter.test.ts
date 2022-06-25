import { Counter } from "../../src/utils/counter.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("Counter - incrementGet", () => {
  const counter = new Counter();
  assertEquals(counter.incrementGet(), 1);
  assertEquals(counter.incrementGet(), 2);
  assertEquals(counter.incrementGet(), 3);
});

Deno.test("Counter - decrementGet", () => {
  const counter = new Counter();
  assertEquals(counter.decrementGet(), -1);
  assertEquals(counter.decrementGet(), -2);
  assertEquals(counter.decrementGet(), -3);
});

Deno.test("Counter - incrementGet/decrementGet", () => {
  const counter = new Counter();
  assertEquals(counter.incrementGet(), 1);
  assertEquals(counter.incrementGet(), 2);
  assertEquals(counter.incrementGet(), 3);
  assertEquals(counter.decrementGet(), 2);
  assertEquals(counter.decrementGet(), 1);
});
