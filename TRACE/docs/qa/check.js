const fs = require("fs");
const h = fs.readFileSync("e:/TRACE/index.html", "utf8");
const i = h.lastIndexOf("<script>");
const j = h.lastIndexOf("</script>");
const src = h.slice(i + 8, j);
console.log("script start snippet:\n", src.slice(0, 80));
console.log("script end snippet:\n", src.slice(-80));
try {
  new Function(src);
  console.log("OK", src.length);
} catch (e) {
  console.log("ERR", e.message);
  const m = /<anonymous>:(\d+)/.exec(e.stack || "");
  if (m) {
    const n = +m[1];
    const lines = src.split(/\n/);
    console.log("around", n);
    console.log(lines.slice(Math.max(0, n - 4), n + 3).map((l, k) => (n - 3 + k) + "|" + l).join("\n"));
  }
}
