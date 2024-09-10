'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { generateXml } from './actions';

const ITopClassGenerator = () => {
    const [className, setClassName] = useState('');
    const [parentClass, setParentClass] = useState('cmdbAbstractObject');
    const [properties, setProperties] = useState({
        category: 'bizmodel,searchable',
        abstract: false,
        keyType: 'autoincrement',
        dbTable: '',
        dbKeyField: 'id',
        dbFinalClassField: 'finalclass',
        isLink: false,
        namingFormat: '',
    });
    const [fields, setFields] = useState([]);
    const [lifecycle, setLifecycle] = useState({
        attribute: '',
        states: [],
        transitions: [],
        highlightScale: [],
    });
    const [methods, setMethods] = useState([]);
    const [indexes, setIndexes] = useState([]);
    const [relations, setRelations] = useState([]);
    const [menu, setMenu] = useState({
        type: 'OQLMenuNode',
        parent: '',
        rank: 0,
        oql: '',
    });
    const [userRights, setUserRights] = useState({
        profiles: [],
    });
    const [branding, setBranding] = useState({
        logo: '',
        mainColor: '',
        complementaryColor: '',
    });
    const [xmlOutput, setXmlOutput] = useState('');

    const addField = () => {
        setFields([...fields, {
            name: '',
            type: 'AttributeString',
            isNullAllowed: true,
            defaultValue: '',
            specificProperties: {}
        }]);
    };

    const updateField = (index, key, value) => {
        const updatedFields = [...fields];
        if (key.includes('.')) {
            const [mainKey, subKey] = key.split('.');
            updatedFields[index][mainKey][subKey] = value;
        } else {
            updatedFields[index][key] = value;
        }
        setFields(updatedFields);
    };

    const removeField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const addLifecycleState = () => {
        setLifecycle({
            ...lifecycle,
            states: [...lifecycle.states, { name: '', flags: {}, highlight: '' }]
        });
    };

    const removeLifecycleState = (index) => {
        const newStates = lifecycle.states.filter((_, i) => i !== index);
        setLifecycle({ ...lifecycle, states: newStates });
    };

    const addLifecycleTransition = () => {
        setLifecycle({
            ...lifecycle,
            transitions: [...lifecycle.transitions, { stimulus: '', target: '', actions: [] }]
        });
    };

    const removeLifecycleTransition = (index) => {
        const newTransitions = lifecycle.transitions.filter((_, i) => i !== index);
        setLifecycle({ ...lifecycle, transitions: newTransitions });
    };

    const addMethod = () => {
        setMethods([...methods, { name: '', type: 'Overload-DBObject', code: '' }]);
    };

    const removeMethod = (index) => {
        setMethods(methods.filter((_, i) => i !== index));
    };

    const addIndex = () => {
        setIndexes([...indexes, { name: '', fields: [] }]);
    };

    const removeIndex = (index) => {
        setIndexes(indexes.filter((_, i) => i !== index));
    };

    const addRelation = () => {
        setRelations([...relations, { type: 'impacts', neighbourClass: '', queryDown: '', queryUp: '' }]);
    };

    const removeRelation = (index) => {
        setRelations(relations.filter((_, i) => i !== index));
    };

    const addProfile = () => {
        setUserRights({
            ...userRights,
            profiles: [...userRights.profiles, { name: '', rights: {} }]
        });
    };

    const removeProfile = (index) => {
        const newProfiles = userRights.profiles.filter((_, i) => i !== index);
        setUserRights({ ...userRights, profiles: newProfiles });
    };

    const handleGenerateXml = async () => {
        try {
            const xml = await generateXml(
                className,
                parentClass,
                properties,
                fields,
                lifecycle,
                methods,
                indexes,
                relations,
                menu,
                userRights,
                branding
            );
            setXmlOutput(xml);
        } catch (error) {
            console.error('Error generating XML:', error);
            setXmlOutput('Error generating XML. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="mb-8 bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-purple-400">iTop Class Generator</CardTitle>
                    <CardDescription className="text-gray-400">Create XML definitions for iTop classes</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="basic">
                        <TabsList className="grid w-full grid-cols-7 bg-gray-800 p-1 rounded-md">
                            <TabsTrigger value="basic" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Basic</TabsTrigger>
                            <TabsTrigger value="properties" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Properties</TabsTrigger>
                            <TabsTrigger value="fields" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Fields</TabsTrigger>
                            <TabsTrigger value="lifecycle" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Lifecycle</TabsTrigger>
                            <TabsTrigger value="methods" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Methods</TabsTrigger>
                            <TabsTrigger value="advanced" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Advanced</TabsTrigger>
                            <TabsTrigger value="ui" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white">UI</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic">
                            <div className="space-y-4">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                placeholder="Class Name"
                                                value={className}
                                                onChange={(e) => setClassName(e.target.value)}
                                                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Enter the name of your iTop class</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Select value={parentClass} onValueChange={(value) => setParentClass(value)}>
                                    <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                                        <SelectValue placeholder="Parent Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cmdbAbstractObject">cmdbAbstractObject</SelectItem>
                                        <SelectItem value="FunctionalCI">FunctionalCI</SelectItem>
                                        <SelectItem value="Ticket">Ticket</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="properties">
                            <div className="space-y-4">
                                <Input
                                    placeholder="Category"
                                    value={properties.category}
                                    onChange={(e) => setProperties({ ...properties, category: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="abstract-switch"
                                        checked={properties.abstract}
                                        onCheckedChange={(checked) => setProperties({ ...properties, abstract: checked })}
                                    />
                                    <label htmlFor="abstract-switch" className="text-white">Abstract</label>
                                </div>
                                <Input
                                    placeholder="DB Table"
                                    value={properties.dbTable}
                                    onChange={(e) => setProperties({ ...properties, dbTable: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                                <Input
                                    placeholder="Naming Format"
                                    value={properties.namingFormat}
                                    onChange={(e) => setProperties({ ...properties, namingFormat: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="fields">
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={index} className="space-y-2 relative p-4 bg-gray-800 rounded-md">
                                        <Input
                                            placeholder="Field name"
                                            value={field.name}
                                            onChange={(e) => updateField(index, 'name', e.target.value)}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        />
                                        <Select value={field.type} onValueChange={(value) => updateField(index, 'type', value)}>
                                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                                                <SelectValue placeholder="Field type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AttributeString">String</SelectItem>
                                                <SelectItem value="AttributeInteger">Integer</SelectItem>
                                                <SelectItem value="AttributeEnum">Enum</SelectItem>
                                                <SelectItem value="AttributeExternalKey">ExternalKey</SelectItem>
                                                <SelectItem value="AttributeLinkedSet">LinkedSet</SelectItem>
                                                <SelectItem value="AttributeTagSet">TagSet</SelectItem>
                                                <SelectItem value="AttributeCustomFields">CustomFields</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={field.isNullAllowed.toString()}
                                            onValueChange={(value) => updateField(index, 'isNullAllowed', value === 'true')}
                                        >
                                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                                                <SelectValue placeholder="Nullable" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Nullable</SelectItem>
                                                <SelectItem value="false">Not Nullable</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="Default Value"
                                            value={field.defaultValue}
                                            onChange={(e) => updateField(index, 'defaultValue', e.target.value)}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        />
                                        {field.type === 'AttributeEnum' && (
                                            <Textarea
                                                placeholder="Enum values (comma-separated)"
                                                value={field.specificProperties.values || ''}
                                                onChange={(e) => updateField(index, 'specificProperties.values', e.target.value)}
                                                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            />
                                        )}
                                        {field.type === 'AttributeExternalKey' && (
                                            <Input
                                                placeholder="Target Class"
                                                value={field.specificProperties.targetClass || ''}
                                                onChange={(e) => updateField(index, 'specificProperties.targetClass', e.target.value)}
                                                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            />
                                        )}
                                        <Button
                                            onClick={() => removeField(index)}
                                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1"
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={addField} className="w-full bg-purple-600 hover:bg-purple-700">Add Field</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="lifecycle">
                            <div className="space-y-4">
                                <Input
                                    placeholder="Lifecycle Attribute"
                                    value={lifecycle.attribute}
                                    onChange={(e) => setLifecycle({ ...lifecycle, attribute: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                                <div className="space-y-4">
                                    <h3 className="text-white">States</h3>
                                    {lifecycle.states.map((state, index) => (
                                        <div key={index} className="relative p-4 bg-gray-800 rounded-md">
                                            <Input
                                                placeholder="State name"
                                                value={state.name}
                                                onChange={(e) => {
                                                    const newStates = [...lifecycle.states];
                                                    newStates[index].name = e.target.value;
                                                    setLifecycle({ ...lifecycle, states: newStates });
                                                }}
                                                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 mb-2"
                                            />
                                            <Input
                                                placeholder="Highlight"
                                                value={state.highlight}
                                                onChange={(e) => {
                                                    const newStates = [...lifecycle.states];
                                                    newStates[index].highlight = e.target.value;
                                                    setLifecycle({ ...lifecycle, states: newStates });
                                                }}
                                                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            />
                                            <Button
                                                onClick={() => removeLifecycleState(index)}
                                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1"
                                            >
                                                X
                                            </Button>
                                        </div>
                                    ))}
                                    <Button onClick={addLifecycleState} className="w-full bg-purple-600 hover:bg-purple-700">Add State</Button>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white">Transitions</h3>
                                    {lifecycle.transitions.map((transition, index) => (
                                        <div key={index} className="relative p-4 bg-gray-800 rounded-md">
                                            <Input
                                                placeholder="Stimulus"
                                                value={transition.stimulus}
                                                onChange={(e) => {
                                                    const newTransitions = [...lifecycle.transitions];
                                                    newTransitions[index].stimulus = e.target.value;
                                                    setLifecycle({ ...lifecycle, transitions: newTransitions });
                                                }}
                                                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 mb-2"
                                            />
                                            <Input
                                                placeholder="Target state"
                                                value={transition.target}
                                                onChange={(e) => {
                                                    const newTransitions = [...lifecycle.transitions];
                                                    newTransitions[index].target = e.target.value;
                                                    setLifecycle({ ...lifecycle, transitions: newTransitions });
                                                }}
                                                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            />
                                            <Button
                                                onClick={() => removeLifecycleTransition(index)}
                                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1"
                                            >
                                                X
                                            </Button>
                                        </div>
                                    ))}
                                    <Button onClick={addLifecycleTransition} className="w-full bg-purple-600 hover:bg-purple-700">Add Transition</Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="methods">
                            <div className="space-y-4">
                                {methods.map((method, index) => (
                                    <div key={index} className="space-y-2 relative p-4 bg-gray-800 rounded-md">
                                        <Input
                                            placeholder="Method Name"
                                            value={method.name}
                                            onChange={(e) => {
                                                const updatedMethods = [...methods];
                                                updatedMethods[index].name = e.target.value;
                                                setMethods(updatedMethods);
                                            }}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        />
                                        <Select
                                            value={method.type}
                                            onValueChange={(value) => {
                                                const updatedMethods = [...methods];
                                                updatedMethods[index].type = value;
                                                setMethods(updatedMethods);
                                            }}
                                        >
                                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                                                <SelectValue placeholder="Method Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Overload-DBObject">Overload-DBObject</SelectItem>
                                                <SelectItem value="LifecycleAction">LifecycleAction</SelectItem>
                                                <SelectItem value="Custom">Custom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Textarea
                                            placeholder="Method Code"
                                            value={method.code}
                                            onChange={(e) => {
                                                const updatedMethods = [...methods];
                                                updatedMethods[index].code = e.target.value;
                                                setMethods(updatedMethods);
                                            }}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            rows={5}
                                        />
                                        <Button
                                            onClick={() => removeMethod(index)}
                                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1"
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={addMethod} className="w-full bg-purple-600 hover:bg-purple-700">Add Method</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="advanced">
                            <div className="space-y-4">
                                <h3 className="text-white">Indexes</h3>
                                {indexes.map((index, idx) => (
                                    <div key={idx} className="relative p-4 bg-gray-800 rounded-md">
                                        <Input
                                            placeholder="Index name"
                                            value={index.name}
                                            onChange={(e) => {
                                                const newIndexes = [...indexes];
                                                newIndexes[idx].name = e.target.value;
                                                setIndexes(newIndexes);
                                            }}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 mb-2"
                                        />
                                        <Input
                                            placeholder="Fields (comma-separated)"
                                            value={index.fields.join(',')}
                                            onChange={(e) => {
                                                const newIndexes = [...indexes];
                                                newIndexes[idx].fields = e.target.value.split(',');
                                                setIndexes(newIndexes);
                                            }}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        />
                                        <Button
                                            onClick={() => removeIndex(idx)}
                                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1"
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={addIndex} className="w-full bg-purple-600 hover:bg-purple-700">Add Index</Button>

                                <h3 className="text-white mt-6">Relations</h3>
                                {relations.map((relation, idx) => (
                                    <div key={idx} className="relative p-4 bg-gray-800 rounded-md">
                                        <Select
                                            value={relation.type}
                                            onValueChange={(value) => {
                                                const newRelations = [...relations];
                                                newRelations[idx].type = value;
                                                setRelations(newRelations);
                                            }}
                                        >
                                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                                                <SelectValue placeholder="Relation Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="impacts">Impacts</SelectItem>
                                                <SelectItem value="depends on">Depends On</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            placeholder="Neighbour Class"
                                            value={relation.neighbourClass}
                                            onChange={(e) => {
                                                const newRelations = [...relations];
                                                newRelations[idx].neighbourClass = e.target.value;
                                                setRelations(newRelations);
                                            }}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-2"
                                        />
                                        <Textarea
                                            placeholder="Query Down"
                                            value={relation.queryDown}
                                            onChange={(e) => {
                                                const newRelations = [...relations];
                                                newRelations[idx].queryDown = e.target.value;
                                                setRelations(newRelations);
                                            }}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-2"
                                        />
                                        <Textarea
                                            placeholder="Query Up"
                                            value={relation.queryUp}
                                            onChange={(e) => {
                                                const newRelations = [...relations];
                                                newRelations[idx].queryUp = e.target.value;
                                                setRelations(newRelations);
                                            }}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-2"
                                        />
                                        <Button
                                            onClick={() => removeRelation(idx)}
                                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1"
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={addRelation} className="w-full bg-purple-600 hover:bg-purple-700">Add Relation</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="ui">
                            <div className="space-y-4">
                                <h3 className="text-white">Menu</h3>
                                <Select
                                    value={menu.type}
                                    onValueChange={(value) => setMenu({ ...menu, type: value })}
                                >
                                    <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                                        <SelectValue placeholder="Menu Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OQLMenuNode">OQL Menu</SelectItem>
                                        <SelectItem value="NewObjectMenuNode">New Object Menu</SelectItem>
                                        <SelectItem value="SearchMenuNode">Search Menu</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Parent Menu"
                                    value={menu.parent}
                                    onChange={(e) => setMenu({ ...menu, parent: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                                <Input
                                    placeholder="Rank"
                                    type="number"
                                    value={menu.rank}
                                    onChange={(e) => setMenu({ ...menu, rank: parseInt(e.target.value) })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                                {menu.type === 'OQLMenuNode' && (
                                    <Textarea
                                        placeholder="OQL Query"
                                        value={menu.oql}
                                        onChange={(e) => setMenu({ ...menu, oql: e.target.value })}
                                        className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                    />
                                )}

                                <h3 className="text-white mt-6">User Rights</h3>
                                {userRights.profiles.map((profile, idx) => (
                                    <div key={idx} className="relative p-4 bg-gray-800 rounded-md">
                                        <Input
                                            placeholder="Profile Name"
                                            value={profile.name}
                                            onChange={(e) => {
                                                const newProfiles = [...userRights.profiles];
                                                newProfiles[idx].name = e.target.value;
                                                setUserRights({ ...userRights, profiles: newProfiles });
                                            }}
                                            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 mb-2"
                                        />
                                        {['read', 'write', 'delete'].map(action => (
                                            <div key={action} className="flex items-center space-x-2 mt-2">
                                                <Switch
                                                    id={`${profile.name}-${action}`}
                                                    checked={profile.rights[action] === 'allow'}
                                                    onCheckedChange={(checked) => {
                                                        const newProfiles = [...userRights.profiles];
                                                        newProfiles[idx].rights[action] = checked ? 'allow' : 'deny';
                                                        setUserRights({ ...userRights, profiles: newProfiles });
                                                    }}
                                                />
                                                <label htmlFor={`${profile.name}-${action}`} className="text-white capitalize">{action}</label>
                                            </div>
                                        ))}
                                        <Button
                                            onClick={() => removeProfile(idx)}
                                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1"
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={addProfile} className="w-full bg-purple-600 hover:bg-purple-700">Add Profile</Button>

                                <h3 className="text-white mt-6">Branding</h3>
                                <Input
                                    placeholder="Logo URL"
                                    value={branding.logo}
                                    onChange={(e) => setBranding({ ...branding, logo: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                                <Input
                                    placeholder="Main Color"
                                    value={branding.mainColor}
                                    onChange={(e) => setBranding({ ...branding, mainColor: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                                <Input
                                    placeholder="Complementary Color"
                                    value={branding.complementaryColor}
                                    onChange={(e) => setBranding({ ...branding, complementaryColor: e.target.value })}
                                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button
                        onClick={handleGenerateXml}
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                    >
                        Generate XML
                    </Button>
                    <Textarea
                        value={xmlOutput}
                        readOnly
                        rows={10}
                        placeholder="Generated XML will appear here"
                        className="w-full mt-4 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    />
                </CardContent>
            </Card>
            <Card className="mt-8 bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-purple-400">About iTop Class Generator</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-gray-300">
                        The iTop Class Generator is a comprehensive tool designed to simplify the process of creating XML definitions for iTop classes.
                        It provides an intuitive interface for defining class properties, fields, lifecycle states, methods, and advanced features like indexes and relations.
                    </p>
                    <p className="mb-4 text-gray-300">
                        With this tool, you can:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-4">
                        <li>Define basic class properties such as name, parent class, and database settings</li>
                        <li>Add and configure fields with various types and attributes</li>
                        <li>Set up lifecycle states and transitions</li>
                        <li>Create custom methods for your class</li>
                        <li>Define indexes for optimized database queries</li>
                        <li>Establish relations with other classes</li>
                        <li>Configure menu items for the iTop interface</li>
                        <li>Set up user rights and profiles</li>
                        <li>Customize branding elements</li>
                        <li>Generate the corresponding XML definition ready for use in iTop</li>
                    </ul>
                    <p className="text-gray-300">
                        This tool is particularly useful for iTop administrators and developers who need to create or modify
                        classes frequently, as it eliminates the need to write XML definitions manually and provides a comprehensive
                        set of options to fully leverage iTop&apos;s extensibility features.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ITopClassGenerator;