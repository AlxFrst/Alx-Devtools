'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { analyzeExtension } from './actions';

interface ExtensionData {
    name: string;
    version: string;
    classes: Array<{ name: string; fields: Array<{ name: string; type: string }> }>;
    menus: Array<{ id: string; type: string }>;
    userRights: Array<{ profile: string; rights: Array<{ action: string; allowed: boolean }> }>;
    moduleParameters: Array<{ id: string; value: string }>;
    moduleDesigns: Array<{ id: string; description: string }>;
}

const ITopExtensionDescriptor = () => {
    const [file, setFile] = useState<File | null>(null);
    const [extensionData, setExtensionData] = useState<ExtensionData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await analyzeExtension(formData);
            setExtensionData(result);
        } catch (error) {
            console.error('Error analyzing extension:', error);
            setError('An error occurred while analyzing the extension.');
            setExtensionData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="mb-8 bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-purple-400">iTop Extension Descriptor</CardTitle>
                    <CardDescription className="text-gray-400">Analyze iTop extension ZIP files and generate a detailed description</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            type="file"
                            accept=".zip"
                            onChange={handleFileChange}
                            className="w-full bg-gray-800 border-gray-700 text-white"
                        />
                        <Button
                            onClick={handleAnalyze}
                            disabled={!file || isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                            {isLoading ? 'Analyzing...' : 'Analyze Extension'}
                        </Button>

                        {error && <div className="text-red-500">{error}</div>}

                        {extensionData && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-purple-400 mb-4">Extension Details</h2>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <span className="text-gray-400">Name:</span> <span className="text-white">{extensionData.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Version:</span> <span className="text-white">{extensionData.version}</span>
                                    </div>
                                </div>

                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="classes">
                                        <AccordionTrigger className="text-purple-400">Classes</AccordionTrigger>
                                        <AccordionContent>
                                            {extensionData.classes.map((cls, index) => (
                                                <div key={index} className="mb-4">
                                                    <h3 className="text-white font-bold">{cls.name}</h3>
                                                    <ul className="list-disc list-inside">
                                                        {cls.fields.map((field, fieldIndex) => (
                                                            <li key={fieldIndex} className="text-gray-300">
                                                                {field.name}: <Badge variant="outline">{field.type}</Badge>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="menus">
                                        <AccordionTrigger className="text-purple-400">Menus</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc list-inside">
                                                {extensionData.menus.map((menu, index) => (
                                                    <li key={index} className="text-gray-300">
                                                        {menu.id}: <Badge variant="outline">{menu.type}</Badge>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="userRights">
                                        <AccordionTrigger className="text-purple-400">User Rights</AccordionTrigger>
                                        <AccordionContent>
                                            {extensionData.userRights.map((profile, index) => (
                                                <div key={index} className="mb-4">
                                                    <h3 className="text-white font-bold">{profile.profile}</h3>
                                                    <ul className="list-disc list-inside">
                                                        {profile.rights.map((right, rightIndex) => (
                                                            <li key={rightIndex} className="text-gray-300">
                                                                {right.action}: <Badge variant={right.allowed ? "success" : "destructive"}>{right.allowed ? "Allowed" : "Denied"}</Badge>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="moduleParameters">
                                        <AccordionTrigger className="text-purple-400">Module Parameters</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc list-inside">
                                                {extensionData.moduleParameters.map((param, index) => (
                                                    <li key={index} className="text-gray-300">
                                                        {param.id}: <span className="text-white">{param.value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="moduleDesigns">
                                        <AccordionTrigger className="text-purple-400">Module Designs</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc list-inside">
                                                {extensionData.moduleDesigns.map((design, index) => (
                                                    <li key={index} className="text-gray-300">
                                                        {design.id}: <span className="text-white">{design.description}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ITopExtensionDescriptor;