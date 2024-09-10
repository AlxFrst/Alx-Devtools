'use server';

interface Field {
    name: string;
    type: string;
    isNullAllowed: boolean;
    defaultValue: string;
    specificProperties: any;
}

interface LifecycleState {
    name: string;
    flags: Record<string, boolean>;
    highlight: string;
}

interface LifecycleTransition {
    stimulus: string;
    target: string;
    actions: string[];
}

interface Lifecycle {
    attribute: string;
    states: LifecycleState[];
    transitions: LifecycleTransition[];
    highlightScale: string[];
}

interface Method {
    name: string;
    type: string;
    code: string;
}

interface Index {
    name: string;
    fields: string[];
}

interface Relation {
    type: string;
    neighbourClass: string;
    queryDown: string;
    queryUp: string;
}

interface Menu {
    type: string;
    parent: string;
    rank: number;
    oql: string;
}

interface UserRights {
    profiles: { name: string; rights: Record<string, string> }[];
}

interface Branding {
    logo: string;
    mainColor: string;
    complementaryColor: string;
}

interface ClassProperties {
    category: string;
    abstract: boolean;
    keyType: string;
    dbTable: string;
    dbKeyField: string;
    dbFinalClassField: string;
    isLink: boolean;
    namingFormat: string;
}

export const generateXml = (
    className: string,
    parentClass: string,
    properties: ClassProperties,
    fields: Field[],
    lifecycle: Lifecycle,
    methods: Method[],
    indexes: Index[],
    relations: Relation[],
    menu: Menu,
    userRights: UserRights,
    branding: Branding
): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<itop_design xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="3.0">
  <classes>
    <class id="${className}">
      <parent>${parentClass}</parent>
      <properties>\n`;

    // Properties
    for (const [key, value] of Object.entries(properties)) {
        if (value !== '') {
            xml += `        <${key}>${value}</${key}>\n`;
        }
    }

    xml += `      </properties>
      <fields>\n`;

    // Fields
    fields.forEach(field => {
        xml += `        <field id="${field.name}" xsi:type="${field.type}">
          <sql>${field.name}</sql>
          <default_value>${field.defaultValue}</default_value>
          <is_null_allowed>${field.isNullAllowed}</is_null_allowed>\n`;

        if (field.type === 'AttributeEnum' && field.specificProperties.values) {
            xml += `          <values>\n`;
            field.specificProperties.values.split(',').forEach((value, index) => {
                xml += `            <value id="${index}">${value.trim()}</value>\n`;
            });
            xml += `          </values>\n`;
        } else if (field.type === 'AttributeExternalKey' && field.specificProperties.targetClass) {
            xml += `          <target_class>${field.specificProperties.targetClass}</target_class>\n`;
        }

        xml += `        </field>\n`;
    });

    xml += `      </fields>\n`;

    // Lifecycle
    if (lifecycle.attribute) {
        xml += `      <lifecycle>
        <attribute>${lifecycle.attribute}</attribute>
        <states>\n`;

        lifecycle.states.forEach(state => {
            xml += `          <state id="${state.name}">
            <flags>\n`;
            for (const [flag, value] of Object.entries(state.flags)) {
                xml += `              <${flag}>${value}</${flag}>\n`;
            }
            xml += `            </flags>
            <highlight>${state.highlight}</highlight>
          </state>\n`;
        });

        xml += `        </states>
        <transitions>\n`;

        lifecycle.transitions.forEach(transition => {
            xml += `          <transition id="${transition.stimulus}">
            <target>${transition.target}</target>
            <actions>\n`;
            transition.actions.forEach(action => {
                xml += `              <action>
                <verb>${action}</verb>
              </action>\n`;
            });
            xml += `            </actions>
          </transition>\n`;
        });

        xml += `        </transitions>
      </lifecycle>\n`;
    }

    // Methods
    if (methods.length > 0) {
        xml += `      <methods>\n`;
        methods.forEach(method => {
            xml += `        <method id="${method.name}">
          <static>false</static>
          <access>public</access>
          <type>${method.type}</type>
          <code><![CDATA[${method.code}]]></code>
        </method>\n`;
        });
        xml += `      </methods>\n`;
    }

    // Indexes
    if (indexes.length > 0) {
        xml += `      <indexes>\n`;
        indexes.forEach(index => {
            xml += `        <index id="${index.name}">
          <attributes>\n`;
            index.fields.forEach(field => {
                xml += `            <attribute id="${field}"/>\n`;
            });
            xml += `          </attributes>
        </index>\n`;
        });
        xml += `      </indexes>\n`;
    }

    // Relations
    if (relations.length > 0) {
        xml += `      <relations>\n`;
        relations.forEach(relation => {
            xml += `        <relation id="${relation.type}">
          <neighbours>
            <neighbour id="${relation.neighbourClass}">
              <query_down>${relation.queryDown}</query_down>
              <query_up>${relation.queryUp}</query_up>
            </neighbour>
          </neighbours>
        </relation>\n`;
        });
        xml += `      </relations>\n`;
    }

    xml += `    </class>
  </classes>\n`;

    // Menu
    if (menu.type) {
        xml += `  <menus>
    <menu id="${className}_menu" xsi:type="${menu.type}">
      <rank>${menu.rank}</rank>
      <parent>${menu.parent}</parent>\n`;
        if (menu.type === 'OQLMenuNode') {
            xml += `      <oql>${menu.oql}</oql>\n`;
        }
        xml += `    </menu>
  </menus>\n`;
    }

    // User Rights
    if (userRights.profiles.length > 0) {
        xml += `  <user_rights>
    <profiles>\n`;
        userRights.profiles.forEach(profile => {
            xml += `      <profile id="${profile.name}">
        <groups>
          <group id="${className}">
            <actions>\n`;
            for (const [action, right] of Object.entries(profile.rights)) {
                xml += `              <action id="action:${action}">${right}</action>\n`;
            }
            xml += `            </actions>
          </group>
        </groups>
      </profile>\n`;
        });
        xml += `    </profiles>
  </user_rights>\n`;
    }

    // Branding
    if (branding.logo || branding.mainColor || branding.complementaryColor) {
        xml += `  <branding>
    <main_logo>${branding.logo}</main_logo>
    <main_color>${branding.mainColor}</main_color>
    <complementary_color>${branding.complementaryColor}</complementary_color>
  </branding>\n`;
    }

    xml += `</itop_design>`;

    return xml;
};