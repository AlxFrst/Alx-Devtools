// app/page.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <>
      <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Welcome to DevTools
      </h1>
      <p className="text-xl mb-12 text-gray-300 max-w-2xl">
        Empower your development workflow with our curated collection of essential tools.
        Select a tool from the sidebar to supercharge your productivity.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-purple-500/20 transition duration-300">
          <Zap className="h-12 w-12 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-semibold mb-4">Featured: Base64 Decoder</h3>
          <p className="mb-6 text-gray-300">Decode Base64 strings instantly with our lightning-fast tool.</p>
          <Button className="bg-purple-600 hover:bg-purple-700">Try Now</Button>
        </div>
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-pink-500/20 transition duration-300">
          <h3 className="text-2xl font-semibold mb-4">Latest Updates</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center"><div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>New JWT Debugger added</li>
            <li className="flex items-center"><div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>JSON Formatter performance boost</li>
            <li className="flex items-center"><div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>Dark mode theme refined</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default HomePage;