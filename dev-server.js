// Servidor local para probar la tienda: sirve los archivos estáticos y /api/*, leyendo .env.
// Uso: npm run dev  ->  http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    process.env[m[1]] ??= m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const blocked = [".env", "dev-server.js", "package.json"];

http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;

  if (pathname.startsWith("/api/")) {
    const file = path.join(root, "api", path.basename(pathname) + ".js");
    if (fs.existsSync(file)) return require(file)(req, res);
  }

  const file = path.join(root, pathname === "/" ? "index.html" : pathname);
  if (!file.startsWith(root) || blocked.includes(path.basename(file)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.statusCode = 404;
    return res.end("No encontrado");
  }
  res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
}).listen(3000, () => console.log("Tienda en http://localhost:3000"));
