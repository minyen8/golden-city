import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nm = path.join(__dirname, 'node_modules');
const exists = fs.existsSync(nm);
const result = { node_modules_exists: exists };
if (exists) {
  result.contents = fs.readdirSync(nm).slice(0, 20);
}
fs.writeFileSync(path.join(__dirname, 'check-result.txt'), JSON.stringify(result, null, 2));
console.log('Done:', JSON.stringify(result));
