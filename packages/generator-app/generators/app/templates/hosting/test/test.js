import { strict as assert } from "assert";
import * as app from "../sources/scripts/app.js";

describe("firebase", function () {
    describe("#getAnalyticsInitializer()", function () {
        it("should not throw error", function () {
            assert.doesNotThrow(app.getAnalyticsInitializer());
        });
    });

    describe("#getAnalyticsInitializer(true)", function () {
        it("should throw error", function () {
            assert.throws(app.getAnalyticsInitializer(true));
        });
    });

    describe("#getSupportedAnalytics()", function () {
        it("should return undefined", async function () {
            assert.equal(await app.getSupportedAnalytics(), undefined);
        });
    });
});
