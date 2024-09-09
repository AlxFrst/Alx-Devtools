'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { metadata } from './metadata';
import { getIpInfo } from './actions';

interface IpInfo {
    ip: string;
    country: string;
    city: string;
    isp: string;
}

export default function IpInfoPage() {
    const [input, setInput] = useState('');
    const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchIpInfo = async () => {
        setLoading(true);
        try {
            const info = await getIpInfo(input);
            setIpInfo(info);
        } catch (error) {
            console.error('Error fetching IP info:', error);
            setIpInfo(null);
        } finally {
            setLoading(false);
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
                                IP Address
                            </label>
                            <Input
                                id="input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter IP address"
                                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                        </div>
                        <Button onClick={fetchIpInfo} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                            {loading ? 'Loading...' : 'Get IP Info'}
                        </Button>
                        {ipInfo && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-purple-400 mb-2">IP Information:</h3>
                                <p className="text-gray-300">IP: {ipInfo.ip}</p>
                                <p className="text-gray-300">Country: {ipInfo.country}</p>
                                <p className="text-gray-300">City: {ipInfo.city}</p>
                                <p className="text-gray-300">ISP: {ipInfo.isp}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-purple-400">About IP Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-gray-300">
                        This tool allows you to retrieve information about an IP address, including its geographical location and
                        the Internet Service Provider (ISP) associated with it.
                    </p>
                    <p className="text-gray-300">
                        Simply enter an IP address in the input field and click &quot;Get IP Info&quot; to see details about that IP.
                        This can be useful for network troubleshooting, security analysis, or simply satisfying your curiosity
                        about where an IP address is located.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}