import { resolve } from "node:path";

// Default package.json
// -----------------------------------------------------------------------------

export const defaultJson = {
    name: null,
    version: "0.0.0",
    private: true,
    description: "Package in experimental stage. Do not use for production.",
    homepage: null,
    bugs: null,
    repository: null,
    license: "CC-BY-NC-ND-4.0",
    author: {
        name: "Argentina Freelance",
        email: "soporte@argentinafreelance.com",
    },
    type: "module",
    scripts: {},
    dependencies: {},
    devDependencies: {},
    publishConfig: {
        access: "restricted",
    },
};

// Package class
// -----------------------------------------------------------------------------

export class Package {
    #customJson = {};
    #defaultJson = defaultJson;
    #prefix = "firebase";
    #user = "arfreelance";

    #filesToCopy = { "LICENSE.md": true };
    #filesToRender = { "README.md": true };

    constructor(suffix, parent) {
        this.suffix = suffix;
        this.parent = parent;
        this.scoped = true;
        this.packages = "packages";
    }

    get bugs() {
        const url = new URL(`${this.repo}/issues`);
        return this.parent ? this.parent.bugs : { url };
    }

    get filesToCopy() {
        return this.#filesToCopy;
    }

    set filesToCopy(files) {
        this.#filesToCopy = { ...this.#filesToCopy, ...files };
    }

    get filesToRender() {
        return this.#filesToRender;
    }

    set filesToRender(files) {
        this.#filesToRender = { ...this.#filesToRender, ...files };
    }

    get folder() {
        const dir = `./${this.packages}/${this.suffix}`;
        return this.parent ? resolve(this.root, dir) : this.root;
    }

    get git() {
        const url = new URL(`git+${this.repo}.git`);
        return this.parent ? this.parent.git : { type: "git", url };
    }

    get home() {
        const url = this.parent ? this.parent.home : this.repo;

        if (this.parent) {
            url.pathname = `${url.pathname}/tree/main/${this.packages}/${this.suffix}`;
        } else url.hash = "readme";

        return url;
    }

    get name() {
        return this.scoped ? this.scopedName : this.prefixedName;
    }

    get path() {
        return `${this.#user}/${this.prefixedName}`;
    }

    get prefix() {
        return this.parent ? this.parent.prefixedName : this.#prefix;
    }

    get prefixedName() {
        return `${this.prefix}-${this.suffix}`;
    }

    get repo() {
        const base = "https://github.com/";
        return new URL(`/${this.path}`, base);
    }

    get root() {
        const cwd = process.cwd();
        const dir = `./${this.prefixedName}`;
        return this.parent ? this.parent.root : resolve(cwd, dir);
    }

    get scopedName() {
        return `@${this.path}`;
    }

    set json(data) {
        this.#customJson = data;
    }

    get json() {
        const dynamicJson = {
            name: this.name,
            homepage: this.home,
            bugs: this.bugs,
            repository: this.git,
        };

        if (dynamicJson.private !== true) delete dynamicJson.private;
        if (dynamicJson.type !== "module") delete dynamicJson.type;

        return {
            ...this.#defaultJson,
            ...dynamicJson,
            ...this.#customJson,
        };
    }
}

// Default export
// -----------------------------------------------------------------------------

export default Package;
