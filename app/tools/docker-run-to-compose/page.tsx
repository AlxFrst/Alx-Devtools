// page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { metadata } from './metadata';
import { convertToCompose } from './actions';

export default function DockerRunToComposePage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [composeVersion, setComposeVersion] = useState('latest');

    const handleConvert = async () => {
        const result = await convertToCompose(input, composeVersion as 'v2x' | 'v3x' | 'latest');
        if (result.success && result.output) {
            setOutput(result.output);
        } else {
            setOutput(`Error: ${result.error || 'Unknown error occurred'}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="mb-8 bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-purple-400">{metadata.title}</CardTitle>
                    <CardDescription className="text-gray-400">{metadata.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="input" className="block text-sm font-medium text-gray-300 mb-1">
                                Docker Run Command
                            </label>
                            <Textarea
                                id="input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter your docker run command here"
                                className="w-full h-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="version" className="block text-sm font-medium text-gray-300 mb-1">
                                Compose Version
                            </label>
                            <select
                                id="version"
                                value={composeVersion}
                                onChange={(e) => setComposeVersion(e.target.value)}
                                className="w-full bg-gray-800 border-gray-700 text-white p-2 rounded"
                            >
                                <option value="latest">Latest (Common Specification)</option>
                                <option value="v3x">3.x</option>
                                <option value="v2x">2.x</option>
                            </select>
                        </div>
                        <Button onClick={handleConvert} className="w-full bg-purple-600 hover:bg-purple-700">
                            Convert to Docker Compose
                        </Button>
                        <div>
                            <label htmlFor="output" className="block text-sm font-medium text-gray-300 mb-1">
                                Docker Compose Configuration
                            </label>
                            <Textarea
                                id="output"
                                value={output}
                                readOnly
                                placeholder="Docker Compose configuration will appear here"
                                className="w-full h-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-purple-400">About Docker Run to Compose</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-gray-300">
                        Docker Run to Compose is a tool that helps you convert Docker run commands to Docker Compose configuration files.
                        This conversion simplifies the process of managing multi-container Docker applications.
                    </p>
                    <p className="text-gray-300">
                        To use this tool, paste your Docker run command into the input field, select the desired Compose version,
                        and click &quot;Convert to Docker Compose&quot;. The equivalent Docker Compose configuration will be generated in the output field.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}