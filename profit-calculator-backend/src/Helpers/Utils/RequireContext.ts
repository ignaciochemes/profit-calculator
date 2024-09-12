export function importAllFromRequireContext(
    requireContext: __WebpackModuleApi.RequireContext,
) {
    if (!requireContext) {
        throw new Error('Require context is not defined');
    }

    const importedModules: any = requireContext.keys().map((filename) => {
        const required = requireContext(filename);

        if (!required) {
            throw new Error(`Required module ${filename} is not defined`);
        }

        return Object.keys(required).reduce((result, exportedKey) => {
            if (!required[exportedKey]) {
                throw new Error(`Required module ${filename} does not export ${exportedKey}`);
            }

            return result.concat(required[exportedKey]);
        }, [] as any);
    });

    return importedModules.flat();
}
