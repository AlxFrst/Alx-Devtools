// lib/get-tools.ts
import fs from 'fs';
import path from 'path';

export type Tool = {
    title: string;
    description: string;
    icon: string;
    category: string;
    slug: string;
};

export function getTools(): Tool[] {
    const toolsDirectory = path.join(process.cwd(), 'app/tools');
    const toolFolders = fs.readdirSync(toolsDirectory);

    return toolFolders.map(folder => {
        const fullPath = path.join(toolsDirectory, folder, 'metadata.ts');
        if (!fs.existsSync(fullPath)) {
            console.warn(`Metadata file not found for tool: ${folder}`);
            return null;
        }
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Extraction des métadonnées
        const metadataMatch = fileContents.match(/export const metadata = ({[\s\S]*?});/);
        if (!metadataMatch) {
            console.warn(`Metadata not found in file for tool: ${folder}`);
            return null;
        }
        const metadata = eval(`(${metadataMatch[1]})`);

        return {
            ...metadata,
            slug: folder,
        };
    }).filter(tool => tool !== null) as Tool[];
}