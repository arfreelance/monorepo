// @arfreelance/generator-web

import { getPackages, getProject } from "./helpers/packages.js";
import { resolve } from "node:path";
import { rm, stat } from "node:fs/promises";
import * as questions from "./helpers/questions.js";
import chalk from "chalk";
import Generator from "yeoman-generator";
import resolver from "./helpers/resolver.js";

// Export generator
// -----------------------------------------------------------------------------

export default class extends Generator {
    // Constructor
    // -------------------------------------------------------------------------

    constructor(args, opts) {
        super(args, opts);

        this.appname = "Argentina Freelance";
        this.description = "Firebase apps generator";
    }

    // Initialization methods
    // (checking current project state, getting configs, etc)
    // -------------------------------------------------------------------------

    initializing() {
        this.log();
    }

    // Prompt users for options
    // (where call this.prompt()).
    // -------------------------------------------------------------------------

    async prompting() {
        try {
            this.answers = { project: await this.prompt(questions.project) };
            this.project = getProject(this.answers.project.id);
        } catch (error) {
            throw new Error(error);
        }

        try {
            await stat(this.project.root);
            this.overwrite = await this.prompt(questions.overwrite);
        } catch {
            this.overwrite = false;
        }
    }

    // Saving configurations and configure the project
    // (creating .editorconfig files and other metadata files).
    // -------------------------------------------------------------------------

    async configuring() {
        try {
            if (this.overwrite) {
                if (this.overwrite.confirm)
                    await rm(this.project.root, {
                        force: true,
                        maxRetries: 10,
                        recursive: true,
                    });
                else this.cancelCancellableTasks();
            }

            this.destinationRoot(this.project.root);
            this.packages = getPackages(this.project);

            const id = this.answers.project.id;
            const raw = this.project.git.url.toString();
            const git = raw.replace(/^git[+]/gi, "");
            const url = git.replace(/[.]git$/gi, "");

            this.config.set("project", { id, repository: { git, url } });
            await this.config.save();
        } catch (error) {
            throw new Error(error);
        }
    }

    // If the method name doesn’t match a priority,
    // it will be pushed to this group.
    // -------------------------------------------------------------------------

    async default() {
        const symbol = chalk.green(">");
        const prefix = chalk.dim("Creating the project in");
        const suffix = chalk.white(`${this.project.root}`);
        this.log(`${symbol} ${prefix} ${chalk.bold(suffix)}`);
    }

    // Where write the generator specific files
    // (routes, controllers, etc).
    // -------------------------------------------------------------------------

    async writing() {
        const packages = [this.project, ...this.packages];

        const packageTasks = packages.map(async (data) => {
            try {
                // Get dynamic package data

                const packageJson = { ...data.json };
                const folder = data.folder;
                const filesToCopy = data.filesToCopy;
                const filesToRender = data.filesToRender;

                // Add dependencies

                if (Array.isArray(packageJson.dependencies)) {
                    packageJson.dependencies = await resolver(
                        packageJson.dependencies
                    );
                }

                // Add devDependencies

                if (Array.isArray(packageJson.devDependencies)) {
                    packageJson.devDependencies = await resolver(
                        packageJson.devDependencies
                    );
                }

                // Create "package.json"

                const path = resolve(folder, "package.json");
                const pkgStorage = this.createStorage(path);
                await pkgStorage.merge(packageJson);

                // Copy package files

                for (const sourcePath in filesToCopy) {
                    const target =
                        filesToCopy[sourcePath] === true
                            ? sourcePath
                            : filesToCopy[sourcePath];

                    await this.copyTemplateAsync(
                        resolve(this.sourceRoot(), sourcePath),
                        resolve(folder, target)
                    );
                }

                // Render package files

                const templateData = {
                    projectData: this.config.get("project"),
                    packageJson: { ...packageJson },
                };

                for (const sourcePath in filesToRender) {
                    const target =
                        filesToRender[sourcePath] === true
                            ? sourcePath
                            : filesToRender[sourcePath];

                    await this.renderTemplateAsync(
                        resolve(this.sourceRoot(), sourcePath),
                        resolve(folder, target),
                        templateData
                    );
                }
            } catch (error) {
                throw new Error(error);
            }
        });

        await Promise.all(packageTasks);
        this.log();
    }

    // Where installations are run (npm, bower).
    // -------------------------------------------------------------------------

    async install() {
        const remote = this.config.getPath("project.repository.git");
        const message = '--message="chore: initial commit"';

        this.log();
        await this.spawnCommand("git", ["init"]);
        await this.spawnCommand("git", ["branch", "-M", "main"]);
        await this.spawnCommand("git", ["remote", "add", "origin", remote]);
        await this.spawnCommand("git", ["remote", "-v"]);
        this.log();

        await this.spawnCommand("npm", ["install", "--no-audit"]);
        await this.spawnCommand("npm", ["run", "bootstrap"]);
        await this.spawnCommand("npm", ["test"]);
        this.log();

        await this.spawnCommand("git", ["add", "."]);
        await this.spawnCommand("git", ["commit", "--all", message]);
        this.log();
    }

    // Called last, cleanup, say good bye, etc.
    // -------------------------------------------------------------------------

    end() {}
}
