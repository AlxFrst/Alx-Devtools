'use client';

import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Tool } from '@/lib/get-tools';

type SidebarProps = {
    tools: Tool[];
};

const Sidebar: React.FC<SidebarProps> = ({ tools }) => {
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSortedTools = useMemo(() => {
        return tools
            .filter(tool => 
                tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.category.localeCompare(b.category));
    }, [tools, searchTerm]);

    const groupedTools = useMemo(() => {
        return filteredAndSortedTools.reduce((acc, tool) => {
            if (!acc[tool.category]) {
                acc[tool.category] = [];
            }
            acc[tool.category].push(tool);
            return acc;
        }, {} as Record<string, Tool[]>);
    }, [filteredAndSortedTools]);

    return (
        <div className="w-80 bg-gray-900 p-6 h-screen">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">DevTools</h2>
                <div className="relative">
                    <Input
                        placeholder="Search tools..."
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>
            <ScrollArea className="h-[calc(100vh-12rem)]">
                {Object.entries(groupedTools).map(([category, categoryTools]) => (
                    <div key={category} className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">{category}</h3>
                        <div className="space-y-1">
                            {categoryTools.map((tool) => (
                                <Button
                                    key={tool.slug}
                                    variant="ghost"
                                    className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 ${pathname === `/tools/${tool.slug}` ? 'bg-gray-800 text-white' : ''}`}
                                    asChild
                                >
                                    <Link href={`/tools/${tool.slug}`}>
                                        <span className="mr-2">{tool.icon}</span>
                                        {tool.title}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};

export default Sidebar;