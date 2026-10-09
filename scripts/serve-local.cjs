const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

// Only serves exported files. Accounts and tasks stay in browser storage.
const root = path.resolve(__dirname, "../out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};
if (!fs.existsSync(path.join(root, "todo/index.html"))) {
  console.error("Run npm run build before starting the local app.");
  process.exit(1);
}
http
  .createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-cache");
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" });
      return res.end();
    }
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      let file = path.resolve(root, "." + pathname);
      const relative = path.relative(root, file);
      if (
        relative.startsWith("..") ||
        path.isAbsolute(relative) ||
        pathname.includes("\0")
      ) {
        res.writeHead(400);
        return res.end("Invalid path");
      }
      let stat = await fs.promises.stat(file).catch(() => null);
      if (stat?.isDirectory()) {
        file = path.join(file, "index.html");
        stat = await fs.promises.stat(file).catch(() => null);
      }
      if (!stat?.isFile()) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(
          req.method === "HEAD"
            ? undefined
            : await fs.promises.readFile(path.join(root, "404.html")),
        );
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Content-Length": stat.size,
      });
      if (req.method === "HEAD") return res.end();
      fs.createReadStream(file)
        .on("error", () => res.destroy())
        .pipe(res);
    } catch {
      if (!res.headersSent) res.writeHead(400);
      res.end("Invalid request");
    }
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Local frontend: http://localhost:${port}/todo/`);
  })
  .on("error", (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? `Port ${port} is in use. Close the previous local server or set PORT.`
        : error.message,
    );
    process.exitCode = 1;
  });
