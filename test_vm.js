const vm = require('vm');
const fs = require('fs');

const context = { console };
vm.createContext(context);

const code = `
    const miVar = 'hola';
    miVar;
`;
vm.runInContext(code, context);
console.log('context.miVar:', context.miVar);
console.log('typeof miVar:', typeof context.miVar);
