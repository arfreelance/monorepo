#!/usr/bin/env node

const { Command } = require("commander");
const { pkglint } = require("@arfreelance/gulp");
const pkg = require("../package.json");

// Initialize program
// -----------------------------------------------------------------------------

const program = new Command();

// Program data
// -----------------------------------------------------------------------------

program
    .name("package-lint")
    .description("Lint and fix package.json files")
    .version(pkg.version);

// Program process
// -----------------------------------------------------------------------------

async function run() {
    program.argument("<globs...>", "files to lint").action(async (globs) => {
        globs = globs.concat(["!**/node_modules/**/*"]);
        await pkglint(globs);
    });

    await program.parseAsync(process.argv);
}

// Program run
// -----------------------------------------------------------------------------

run();
