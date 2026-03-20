const fs = require('fs');
const path = require('path');
const nm = path.join(__dirname, 'node_modules');
const exists = fs.existsSync(nm);
const result = { node_modules_exists: exists };
if (exists) {
  result.contents = fs.readdirSync(nm).slice(0, 20);
}
fs.writeFileSync(path.join(__dirname, 'check-result.txt'), JSON.stringify(result, null, 2));
