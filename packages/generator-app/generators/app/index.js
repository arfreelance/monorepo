// @arfreelance/generator-web

import Generator from "yeoman-generator";

// Export generator
// -----------------------------------------------------------------------------

export default class extends Generator {
    // Constructor
    // -------------------------------------------------------------------------

    constructor(args, opts) {
        super(args, opts);

        this.appname = "Argentina Freelance";
        this.description = "Webapps and websites generator";
    }

    // Initialization methods
    // (checking current project state, getting configs, etc)
    // -------------------------------------------------------------------------

    async initializing() {}

    // Prompt users for options
    // (where call this.prompt()).
    // -------------------------------------------------------------------------

    async prompting() {}

    // Saving configurations and configure the project
    // (creating .editorconfig files and other metadata files).
    // -------------------------------------------------------------------------

    configuring() {}

    // If the method name doesn’t match a priority,
    // it will be pushed to this group.
    // -------------------------------------------------------------------------

    default() {}

    // Where write the generator specific files
    // (routes, controllers, etc).
    // -------------------------------------------------------------------------

    writing() {
        // this.packageJson.merge({ test: "test" });
    }

    // Where installations are run (npm, bower).
    // -------------------------------------------------------------------------

    async install() {
        // await this.addDependencies(pkg.dependencies);
        // await this.addDevDependencies(pkg.devDependencies);
    }

    // Called last, cleanup, say good bye, etc.
    // -------------------------------------------------------------------------

    end() {}
}
