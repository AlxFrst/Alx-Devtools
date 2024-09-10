// actions.ts
'use server';

import composerize from 'composerize';

export async function convertToCompose(input: string, composeVersion: 'v2x' | 'v3x' | 'latest') {
    try {
        const composeConfig = composerize(input, null, composeVersion, 2);
        return { success: true, output: composeConfig };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}