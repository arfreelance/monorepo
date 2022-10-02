import pacote from "pacote";

// Default resolver
// -----------------------------------------------------------------------------

export default async (dependencies) => {
    dependencies = dependencies.map(async (dependency) => {
        const manifest = await pacote.manifest(dependency);
        if (!manifest) return undefined;
        return [manifest.name, `^${manifest.version}`];
    });

    dependencies = await Promise.all(dependencies);
    return Object.fromEntries(dependencies);
};
