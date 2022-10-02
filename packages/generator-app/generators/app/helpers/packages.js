import Package from "./package.js";

// Project class
// -----------------------------------------------------------------------------

export class Project extends Package {
    constructor(suffix) {
        super(suffix);

        this.json = {
            scripts: {
                bootstrap: "npx lerna bootstrap",
                prepare: "npx husky install",
                "test:lerna": "npx lerna run test",
                "test:lint": "npx arfreelance-lint",
                test: "npm run test:lint && npm run test:lerna",
            },
            devDependencies: [
                "@arfreelance/eslint-config",
                "@arfreelance/eslint-plugin",
                "@arfreelance/package-lint",
                "@arfreelance/stylelint-config",
                "@arfreelance/stylelint-plugin",
                "@babel/core",
                "@babel/eslint-parser",
                "@babel/preset-env",
                "@commitlint/cli",
                "@commitlint/config-conventional",
                "commitizen",
                "cz-conventional-changelog",
                "husky",
                "lerna",
                "lint-staged",
                "prettier",
                "stylelint",
            ],
            commitlint: {
                extends: ["@commitlint/config-conventional"],
            },
            "lint-staged": {
                "*.{css,js,json,md,scss}": "arfreelance-lint",
            },
            config: {
                commitizen: {
                    path: "./node_modules/cz-conventional-changelog",
                },
            },
        };

        this.filesToCopy = {
            ".babelrc.json": true,
            ".browserslistrc": true,
            ".editorconfig": true,
            ".eslintignore": true,
            ".eslintrc.json": true,
            ".gitattributes": true,
            ".gitignore": true,
            ".npmrc": true,
            ".prettierignore": true,
            ".prettierrc.json": true,
            ".stylelintignore": true,
            ".stylelintrc.json": true,
            "firebase.json": true,
            "lerna.json": true,
        };

        this.filesToRender = {
            ".firebaserc": true,
            "TODO.md": true,
        };
    }
}

// Firestore class
// -----------------------------------------------------------------------------

export class Firestore extends Package {
    constructor(parent) {
        super("firestore", parent);

        this.filesToCopy = {
            "firestore/firestore.rules": "firestore.rules",
            "firestore/indexes.json": "indexes.json",
        };
    }
}

// Functions class
// -----------------------------------------------------------------------------

export class Functions extends Package {
    constructor(parent) {
        super("functions", parent);

        this.json = {
            scripts: {
                coverage: "npx c8 npm run mocha",
                lint: "npx arfreelance-lint",
                mocha: "npx mocha --color --reporter spec",
                test: "npm run lint && npm run coverage",
            },
            dependencies: ["firebase-admin", "firebase-functions"],
            devDependencies: [
                "@arfreelance/package-lint",
                "c8",
                "firebase-functions-test",
                "mocha",
            ],
        };

        this.filesToCopy = {
            "functions/lib/index.js": "lib/index.js",
            "functions/test/test.js": "test/test.js",
            "functions/.nycrc.json": ".nycrc.json",
        };
    }
}

// Hosting class
// -----------------------------------------------------------------------------

export class Hosting extends Package {
    constructor(parent) {
        super("hosting", parent);

        this.json = {
            scripts: {
                build: "npx gulp --color default",
                coverage: "npx c8 npm run mocha",
                lint: "npx arfreelance-lint",
                mocha: "npx mocha --color --reporter spec",
                test: "npm run lint && npm run coverage",
            },
            dependencies: ["firebase"],
            devDependencies: [
                "@arfreelance/gulp",
                "@arfreelance/package-lint",
                "c8",
                "gulp",
                "mocha",
            ],
        };

        this.filesToCopy = {
            "hosting/sources/img/empty": "sources/img/empty",
            "hosting/sources/root/empty": "sources/root/empty",
            "hosting/sources/pug/pages/404.pug": "sources/pug/pages/404.pug",
            "hosting/sources/pug/pages/index.pug":
                "sources/pug/pages/index.pug",
            "hosting/sources/js/firebase/analytics.js":
                "sources/js/firebase/analytics.js",
            "hosting/sources/js/firebase/app.js": "sources/js/firebase/app.js",
            "hosting/sources/js/firebase/auth.js":
                "sources/js/firebase/auth.js",
            "hosting/sources/js/firebase/firestore.js":
                "sources/js/firebase/firestore.js",
            "hosting/sources/js/main.js": "sources/js/main.js",
            "hosting/sources/scss/main.scss": "sources/scss/main.scss",
            "hosting/sources/pug/template/main.pug":
                "sources/pug/template/main.pug",
            "hosting/test/test.js": "test/test.js",
            "hosting/.nycrc.json": ".nycrc.json",
            "hosting/gulpfile.js": "gulpfile.js",
        };
    }
}

// RemoteConfig class
// -----------------------------------------------------------------------------

export class RemoteConfig extends Package {
    constructor(parent) {
        super("remoteconfig", parent);

        this.filesToCopy = {
            "remoteconfig/template.json": "template.json",
        };
    }
}

// Storage class
// -----------------------------------------------------------------------------

export class Storage extends Package {
    constructor(parent) {
        super("storage", parent);

        this.filesToCopy = {
            "storage/storage.rules": "storage.rules",
        };
    }
}

// Get project function
// -----------------------------------------------------------------------------

export const getProject = (projectId) => {
    return new Project(projectId);
};

// Get packages function
// -----------------------------------------------------------------------------

export const getPackages = (project) => {
    return [
        new Firestore(project),
        new Functions(project),
        new Hosting(project),
        new RemoteConfig(project),
        new Storage(project),
    ];
};

// Default export
// -----------------------------------------------------------------------------

export default { getPackages, getProject };
