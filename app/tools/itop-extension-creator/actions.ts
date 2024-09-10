'use server';
import JSZip from 'jszip';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

async function addFilesToZip(zip: JSZip, dir: string, baseDir: string, companyName: string, extensionName: string, extensionLabel: string, version: string) {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(dir, file.name);
        const zipPath = path.relative(baseDir, filePath);

        if (file.isDirectory()) {
            await addFilesToZip(zip.folder(file.name)!, filePath, baseDir, companyName, extensionName, extensionLabel, version);
        } else {
            let content = await fs.readFile(filePath, 'utf-8');

            // Replace content
            content = content.replace(/companyname/g, companyName);
            content = content.replace(/extensionname/g, extensionName);
            content = content.replace(/extensionlabel/g, extensionLabel);
            content = content.replace(/1\.0\.0/g, version);

            // Replace filename
            let newFileName = zipPath.replace(/companyname/g, companyName);
            newFileName = newFileName.replace(/extensionname/g, extensionName);

            zip.file(newFileName, content);
        }
    }
}

export async function createExtension(companyName: string, extensionName: string, extensionLabel: string, version: string) {
    try {
        const exampleDir = path.join(process.cwd(), 'app', 'tools', 'itop-extension-creator', 'extension-exemple');
        const zip = new JSZip();

        await addFilesToZip(zip, exampleDir, exampleDir, companyName, extensionName, extensionLabel, version);

        // Generate ZIP file
        const content = await zip.generateAsync({ type: 'nodebuffer' });

        // Create a unique filename
        const fileName = `${extensionName}-${uuidv4()}.zip`;
        const filePath = path.join(process.cwd(), 'public', 'temp', fileName);

        // Ensure the directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        // Write the file
        await fs.writeFile(filePath, content);

        // Return the URL to the file
        return { success: true, fileUrl: `/temp/${fileName}` };
    } catch (error: unknown) {
        console.error('Error creating extension:', error);
        return { success: false, error: 'An error occurred while creating the extension: ' + (error instanceof Error ? error.message : String(error)) };
    }
}