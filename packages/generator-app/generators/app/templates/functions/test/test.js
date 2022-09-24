import { strict as assert } from "assert";
import * as fn from "../lib/index.js";

// Test suite
// -----------------------------------------------------------------------------

describe("#helloFunctions()", function () {
    it("should return `Hello functions!`", function () {
        assert.strictEqual(fn.helloFunctions(), "Hello functions!");
    });
});
