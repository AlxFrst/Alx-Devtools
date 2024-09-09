'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { HexColorPicker } from "react-colorful";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const preGeneratedPalettes = [
    ["#800000", "#982B1C", "#B85C38", "#E2BD91"],
    ["#2C3639", "#3F4E4F", "#A27B5C", "#DCD7C9"],
    ["#CDBE78", "#A9AD89", "#7E9181", "#54627B"],
    ["#4F709C", "#4942E4", "#8696FE", "#C4B0FF"],
    ["#461111", "#A13333", "#B3541E", "#D17A22"],
    ["#3D1766", "#6F1AB6", "#CD0404", "#FF0032"],
    ["#E7B10A", "#F7F1E5", "#898121", "#4C4B16"],
    ["#FF8787", "#F8C4B4", "#E5EBB2", "#BCE29E"],
];

const ColorPaletteGenerator = () => {
    const [baseColor, setBaseColor] = useState('#007bff');
    const [palettes, setPalettes] = useState(preGeneratedPalettes);

    const generatePalette = useCallback(() => {
        const hsl = hexToHSL(baseColor);
        const newPalette = [
            baseColor,
            hslToHex(hsl.h, Math.max(0, hsl.s - 20), Math.min(100, hsl.l + 20)),
            hslToHex(hsl.h, Math.max(0, hsl.s - 40), Math.min(100, hsl.l + 40)),
            hslToHex(hsl.h, Math.min(100, hsl.s + 20), Math.max(0, hsl.l - 20)),
        ];
        setPalettes(prevPalettes => [newPalette, ...prevPalettes.slice(0, prevPalettes.length - 1)]);
    }, [baseColor]);

    useEffect(() => {
        generatePalette();
    }, [generatePalette]);

    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color).then(() => {
            toast.success(`Couleur ${color} copiée dans le presse-papiers!`);
        }).catch(err => {
            console.error('Erreur lors de la copie :', err);
            toast.error('Erreur lors de la copie de la couleur');
        });
    };

    const hexToHSL = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s;
        const l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    };

    const hslToHex = (h, s, l) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="mb-8 bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-purple-400">Générateur de Palette de Couleurs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                        <div className="mb-4 md:mb-0 md:mr-8">
                            <HexColorPicker color={baseColor} onChange={setBaseColor} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold mb-2 text-gray-300">Couleur sélectionnée</p>
                            <div
                                className="w-20 h-20 rounded-full mx-auto mb-2 cursor-pointer"
                                style={{ backgroundColor: baseColor }}
                                onClick={() => copyToClipboard(baseColor)}
                            ></div>
                            <p className="font-mono text-gray-300">{baseColor.toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {palettes.map((palette, index) => (
                            <Card key={index} className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex h-24 mb-4">
                                        {palette.map((color, colorIndex) => (
                                            <div
                                                key={colorIndex}
                                                style={{ backgroundColor: color }}
                                                className="w-1/4 cursor-pointer"
                                                onClick={() => copyToClipboard(color)}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap justify-center">
                                        {palette.map((color, colorIndex) => (
                                            <Button
                                                key={colorIndex}
                                                variant="ghost"
                                                className="font-mono text-sm mr-2 mb-1 text-gray-300"
                                                onClick={() => copyToClipboard(color)}
                                            >
                                                {color.toUpperCase()}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ColorPaletteGenerator;