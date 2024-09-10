declare module 'composerize' {
    function composerize(
        input: string,
        options: null,
        composeVersion: 'v2x' | 'v3x' | 'latest',
        indent: number
    ): string;

    export default composerize;
}