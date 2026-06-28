// Test del buscador
const fs = require('fs');
const vm = require('vm');

const sandbox = {
    document: { body: { classList: { contains: () => false, toggle: () => {} } } },
    console: console,
    Buscador: null,
};
vm.createContext(sandbox);

const datosCode = fs.readFileSync('js/datos.js', 'utf-8')
    .replace(/^const /gm, 'var ')
    .replace(/^var (ESPACIOS|EMPRESAS|SECTORES|SINERGIAS_PREDEFINIDAS|POLO_INFO) =/g, 'globalThis.$1 =');

vm.runInContext(datosCode, sandbox);

const buscadorCode = fs.readFileSync('js/buscador.js', 'utf-8')
    .replace(/^const /, 'var ')
    .replace(/^var Buscador = \(/, 'globalThis.Buscador = (');

vm.runInContext(buscadorCode, sandbox);

if (!sandbox.Buscador) {
    console.log('ERROR: Buscador no se exportó');
    process.exit(1);
}
