import { globSync } from 'glob';

const components: Map<string, Component> = new Map();

let componentFiles = globSync('dist/components/**/*.js');
componentFiles = componentFiles.filter(file => {
    return file.search('index') === -1;
});

for (const file of componentFiles) {
    const component: Component = require(`./${file.replace('dist\\components', '')}`).default;

    if (component) {
        components.set(component.name, component);
    }
}

export default components;
