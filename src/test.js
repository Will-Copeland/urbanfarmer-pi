import fs from 'fs';
import path from 'path';

console.log(path.join(__dirname, '..'));

fs.readdirSync(path.join(__dirname, '..')).forEach((file) => {
  console.log('file: ', file);
});
