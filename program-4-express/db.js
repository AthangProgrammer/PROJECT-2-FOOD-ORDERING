// Tiny helpers to read/write the JSON files in /data
const fs = require('fs');
const path = require('path');

const file = (name) => path.join(__dirname, 'data', `${name}.json`);
exports.read = (name) => JSON.parse(fs.readFileSync(file(name), 'utf8'));
exports.write = (name, data) => fs.writeFileSync(file(name), JSON.stringify(data, null, 2));
// Next id = highest existing id + 1
exports.nextId = (list) => list.reduce((max, x) => Math.max(max, x.id), 0) + 1;
