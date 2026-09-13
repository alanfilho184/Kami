import { globSync } from 'glob';
import path from 'node:path';

const components: Map<string, Component> = new Map();

const componentsDir = path.resolve(__dirname).replace(/\\/g, '/');
const componentFiles = globSync(`${componentsDir}/**/*.{js,ts}`);

for (const file of componentFiles) {
    const normalizedFile = file.replace(/\\/g, '/');
    if (normalizedFile.endsWith('.d.ts') || /\/index\.(js|ts)$/.test(normalizedFile)) {
        continue;
    }

    const relativePath = path.posix.relative(componentsDir, normalizedFile);
    const component: Component = require(`./${relativePath}`).default;

    if (component) {
        components.set(component.name, component);
    }
}

export default components;
