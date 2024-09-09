'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { metadata } from './metadata';

export default function Base64DecoderPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const decodeBase64 = () => {
        try {
            const decoded = atob(input);
            setOutput(decoded);
        } catch (error) {
            setOutput('Error: Invalid Base64 input');
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
                                Base64 Input
                            </label>
                            <Input
                                id="input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter Base64 encoded string here"
                                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <Button onClick={decodeBase64} className="w-full bg-purple-600 hover:bg-purple-700">
                            Decode
                        </Button>
                        <div>
                            <label htmlFor="output" className="block text-sm font-medium text-gray-300 mb-1">
                                Decoded Output
                            </label>
                            <Textarea
                                id="output"
                                value={output}
                                readOnly
                                placeholder="Decoded output will appear here"
                                className="w-full h-32 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-purple-400">About Base64 Decoding</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-gray-300">
                        Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format.
                        It's commonly used when there's a need to encode binary data that needs to be stored and transferred over media that are designed to deal with text.
                    </p>
                    <p className="text-gray-300">
                        This tool allows you to quickly decode Base64 encoded strings. Simply paste your Base64 encoded text into the input field and click "Decode" to see the original text.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}