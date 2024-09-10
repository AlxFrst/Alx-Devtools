'use server';

import { parseString } from 'xml2js';
import AdmZip from 'adm-zip';
import { promisify } from 'util';

const parseXml = promisify(parseString);

interface ExtensionData {
    name: string;
    version: string;
    classes: Array<{ name: string; fields: Array<{ name: string; type: string }> }>;
    menus: Array<{ id: string; type: string }>;
    userRights: Array<{ profile: string; rights: Array<{ action: string; allowed: boolean }> }>;
    moduleParameters: Array<{ id: string; value: string }>;
    moduleDesigns: Array<{ id: string; description: string }>;
}

export async function analyzeExtension(formData: FormData): Promise<ExtensionData> {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            throw new Error('No file provided');
        }

        const buffer = await file.arrayBuffer();
        const zip = new AdmZip(Buffer.from(buffer));

        let datamodelXml = '';
        let extensionName = '';
        let extensionVersion = '';

        zip.getEntries().forEach((entry) => {
            if (entry.entryName.endsWith('.xml') && entry.entryName.includes('datamodel')) {
                datamodelXml = zip.readAsText(entry);
            } else if (entry.entryName.endsWith('module.itop-your-extension-name.php')) {
                const moduleContent = zip.readAsText(entry);
                extensionName = extractExtensionName(moduleContent);
                extensionVersion = extractExtensionVersion(moduleContent);
            }
        });

        if (!datamodelXml) {
            throw new Error('No datamodel XML file found in the ZIP');
        }

        const parsedXml = await parseXml(datamodelXml);
        return analyzeXml(parsedXml, extensionName, extensionVersion);
    } catch (error) {
        console.error('Error in analyzeExtension:', error);
        throw new Error(`Error analyzing extension: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

function extractExtensionName(moduleContent: string): string {
    const match = moduleContent.match(/SetupWebPage::AddModule\([\s\S]*?'label'\s*=>\s*Dict::S\('(.*?)'/);
    return match ? match[1] : 'Unknown Extension';
}

function extractExtensionVersion(moduleContent: string): string {
    const match = moduleContent.match(/SetupWebPage::AddModule\([\s\S]*?'version'\s*=>\s*'(.*?)'/);
    return match ? match[1] : 'Unknown Version';
}

function analyzeXml(parsedXml: any, extensionName: string, extensionVersion: string): ExtensionData {
    const extensionData: ExtensionData = {
        name: extensionName,
        version: extensionVersion,
        classes: [],
        menus: [],
        userRights: [],
        moduleParameters: [],
        moduleDesigns: []
    };

    if (parsedXml.itop_design) {
        const design = parsedXml.itop_design;

        // Classes
        if (design.classes && design.classes[0] && design.classes[0].class) {
            extensionData.classes = design.classes[0].class.map((cls: any) => ({
                name: cls.$.id,
                fields: cls.fields && cls.fields[0] && cls.fields[0].field
                    ? cls.fields[0].field.map((field: any) => ({
                        name: field.$.id,
                        type: field.$.xsi_type
                    }))
                    : []
            }));
        }

        // Menus
        if (design.menus && design.menus[0] && design.menus[0].menu) {
            extensionData.menus = design.menus[0].menu.map((menu: any) => ({
                id: menu.$.id,
                type: menu.$.xsi_type
            }));
        }

        // User Rights
        if (design.user_rights && design.user_rights[0] && design.user_rights[0].profiles) {
            extensionData.userRights = design.user_rights[0].profiles.flatMap((profileGroup: any) => {
                if (profileGroup.profile && Array.isArray(profileGroup.profile)) {
                    return profileGroup.profile.map((profile: any) => ({
                        profile: profile.$.id,
                        rights: profile.groups && profile.groups[0] && profile.groups[0].group
                            ? profile.groups[0].group.flatMap((group: any) =>
                                group.actions && group.actions[0] && group.actions[0].action
                                    ? group.actions[0].action.map((action: any) => ({
                                        action: action.$.id,
                                        allowed: action._ === 'allow'
                                    }))
                                    : []
                            )
                            : []
                    }));
                }
                return [];
            });
        }

        // Module Parameters
        if (design.module_parameters && design.module_parameters[0] && design.module_parameters[0].parameters) {
            extensionData.moduleParameters = design.module_parameters[0].parameters.flatMap((param: any) =>
                Object.entries(param).map(([key, value]) => ({
                    id: key,
                    value: JSON.stringify(value)
                }))
            );
        }

        // Module Designs
        if (design.module_designs && design.module_designs[0] && design.module_designs[0].module_design) {
            extensionData.moduleDesigns = design.module_designs[0].module_design.map((design: any) => ({
                id: design.$.id,
                description: 'Module design details' // You might want to add more specific details here
            }));
        }
    }

    return extensionData;
}