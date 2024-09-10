'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { createExtension } from './actions';

const ExtensionCreator = () => {
    const [companyName, setCompanyName] = useState('');
    const [extensionName, setExtensionName] = useState('');
    const [extensionLabel, setExtensionLabel] = useState('');
    const [version, setVersion] = useState('');
    const [error, setError] = useState('');

    const validateInputs = () => {
        if (!/^[A-Za-z]+$/.test(companyName)) {
            setError('Company Name must contain only alphabetical characters.');
            return false;
        }
        if (!/^[a-z-]+$/.test(extensionName) || extensionName.startsWith('itop-') || extensionName.startsWith('combodo-')) {
            setError('Extension Name must contain only lowercase letters and dashes, and cannot start with "itop-" or "combodo-".');
            return false;
        }
        if (!/^\d+\.\d+\.\d+$/.test(version)) {
            setError('Version must be in the format x.y.z');
            return false;
        }
        setError('');
        return true;
    };

    const handleCreateExtension = async () => {
        if (!validateInputs()) return;

        const result = await createExtension(companyName, extensionName, extensionLabel, version);
        if (result.success && result.fileUrl) {
            // Create a link to download the file
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = result.fileUrl;
            a.download = `${extensionName}.zip`;

            // Add to the page, click, and remove
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            setError(result.error || 'An unknown error occurred');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="mb-8 bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-purple-400">iTop Extension Creator</CardTitle>
                    <CardDescription className="text-gray-400">Create a new iTop extension easily</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">
                                Company Name
                            </label>
                            <Input
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Enter company name"
                                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="extensionName" className="block text-sm font-medium text-gray-300 mb-1">
                                Extension Name
                            </label>
                            <Input
                                id="extensionName"
                                value={extensionName}
                                onChange={(e) => setExtensionName(e.target.value)}
                                placeholder="Enter extension name"
                                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="extensionLabel" className="block text-sm font-medium text-gray-300 mb-1">
                                Extension Label
                            </label>
                            <Input
                                id="extensionLabel"
                                value={extensionLabel}
                                onChange={(e) => setExtensionLabel(e.target.value)}
                                placeholder="Enter extension label"
                                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="version" className="block text-sm font-medium text-gray-300 mb-1">
                                Version
                            </label>
                            <Input
                                id="version"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                placeholder="Enter version (e.g. 1.0.0)"
                                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <Button onClick={handleCreateExtension} className="w-full bg-purple-600 hover:bg-purple-700">
                            Create Extension
                        </Button>
                        {error && (
                            <p className="text-red-500 mt-2">
                                {error}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-purple-400">About iTop Extension Creator</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-gray-300">
                        This tool allows you to create a new iTop extension with ease. Simply fill in the required information and click &quot;Create Extension&quot;.
                    </p>
                    <p className="text-gray-300">
                        The extension creator will generate the necessary files and structure for your iTop extension, saving you time and ensuring consistency in your development process.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExtensionCreator;