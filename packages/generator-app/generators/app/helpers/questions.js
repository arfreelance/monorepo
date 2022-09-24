import chalk from "chalk";

// Project question helpers
// -----------------------------------------------------------------------------

const projectIdMessage = () => {
    return "Enter the Firebase project ID:";
};

const projectIdFilter = (value) => {
    return value.trim();
};

const projectIdValidator = (value) => {
    switch (true) {
        case !/^[a-z](.*)/g.test(value):
            return "Debe comenzar con una letra en minúscula.";
        case !/(.*)[a-zA-Z0-9]$/g.test(value):
            return "Debe finalizar con una letra o un número.";
        case !/^[a-zA-Z0-9-]+$/g.test(value):
            return "Solo puede contener letras, números y guiones.";
        case value.length < 6:
            return "Debe tener 6 caracteres como mínimo.";
        case value.length > 30:
            return "Debe tener 30 caracteres como máximo.";
        default:
            return true;
    }
};

// Project question(s)
// -----------------------------------------------------------------------------

export const project = [
    {
        type: "input",
        name: "id",
        message: projectIdMessage,
        filter: projectIdFilter,
        validate: projectIdValidator,
    },
];

// Overwrite question helpers
// -----------------------------------------------------------------------------

const overwriteConfirmMessage = () => {
    const prefix = chalk.red("The project already exists!");
    const suffix = chalk.yellow("Are you sure to overwrite?");
    return `${chalk.bold(prefix)} ${suffix}`;
};

// Overwrite question(s)
// -----------------------------------------------------------------------------

export const overwrite = [
    {
        type: "confirm",
        name: "confirm",
        default: false,
        message: overwriteConfirmMessage,
    },
];
