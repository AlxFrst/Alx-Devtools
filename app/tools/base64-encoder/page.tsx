'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { metadata } from './metadata';

export default function Base64EncoderPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const encodeBase64 = () => {
        try {
            const encoded = btoa(input);
            setOutput(encoded);
        } catch (error) {
            setOutput('Error: Unable to encode input');
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
                                Input Text
                            </label>
                            <Input
                                id="input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter text to encode"
                                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <Button onClick={encodeBase64} className="w-full bg-purple-600 hover:bg-purple-700">
                            Encode
                        </Button>
                        <div>
                            <label htmlFor="output" className="block text-sm font-medium text-gray-300 mb-1">
                                Base64 Encoded Output
                            </label>
                            <Textarea
                                id="output"
                                value={output}
                                readOnly
                                placeholder="Encoded output will appear here"
                                className="w-full h-32 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-purple-400">About Base64 Encoding</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-gray-300">
                        Base64 encoding is a process of converting binary data into a text format. It uses a set of 64 characters
                        (hence the name) to represent the binary data. This encoding is commonly used when there&apos;s a need to store
                        or transfer binary data in environments that only support text, such as email systems.
                    </p>
                    <p className="text-gray-300">
                        This tool allows you to quickly encode text into Base64 format. Simply type or paste your text into the
                        input field and click &quote;Encode&quote; to see the Base64 encoded version. Note that while Base64 encoding can be
                        used to obfuscate data, it is not a form of encryption and does not provide security.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}