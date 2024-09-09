'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { metadata } from './metadata';
import { css_beautify } from 'js-beautify/js/lib/beautify-css';

export default function CssFormatterPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const formatCss = () => {
        const formattedCss = css_beautify(input, {
            indent_size: 2,
            indent_char: ' ',
            max_preserve_newlines: 1,
            preserve_newlines: true,
            keep_array_indentation: false,
            break_chained_methods: false,
            indent_scripts: 'normal',
            brace_style: 'collapse',
            space_before_conditional: true,
            unescape_strings: false,
            jslint_happy: false,
            end_with_newline: false,
            wrap_line_length: 0,
            indent_inner_html: false,
            comma_first: false,
            e4x: false,
            indent_empty_lines: false
        });
        setOutput(formattedCss);
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
                                CSS Input
                            </label>
                            <Textarea
                                id="input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter your CSS code here"
                                className="w-full h-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <Button onClick={formatCss} className="w-full bg-purple-600 hover:bg-purple-700">
                            Format CSS
                        </Button>
                        <div>
                            <label htmlFor="output" className="block text-sm font-medium text-gray-300 mb-1">
                                Formatted CSS
                            </label>
                            <Textarea
                                id="output"
                                value={output}
                                readOnly
                                placeholder="Formatted CSS will appear here"
                                className="w-full h-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-purple-400">About CSS Formatting</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-gray-300">
                        CSS formatting is the process of restructuring and beautifying CSS code to improve its readability and maintainability.
                        It involves organizing properties, aligning values, and ensuring consistent indentation and spacing.
                    </p>
                    <p className="text-gray-300">
                        This tool allows you to quickly format your CSS code. Simply paste your CSS into the input field and click "Format CSS" to see the beautified version.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}