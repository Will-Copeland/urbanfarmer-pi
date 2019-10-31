import fs from "fs";
import path from "path";

const p = path.join(__dirname, "../data");

console.log(path.join(__dirname, ".."));

fs.readdirSync(path.join(__dirname, "..")).forEach((file) => {
  console.log("file: ", file);
});

const exists = fs.existsSync(p);
console.log(exists);

const ss = fs.readdir(p, (err, files) => {
  if (err && err.errno === -2) {
    fs.mkdirSync(p);
  }
  return files;
});

console.log(ss);

