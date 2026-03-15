import fs from "fs";
import path from "path";

export function scanFiles(dir: string): string[] {
  const results: string[] = [];

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);

    if (item === "node_modules" || item.startsWith(".")) return;

    if (fs.statSync(fullPath).isDirectory()) {
      results.push(...scanFiles(fullPath));
    } else if (item.endsWith(".ts") || item.endsWith(".tsx") || item.endsWith(".js") || item.endsWith(".jsx")) {
      results.push(fullPath);
    }
  });

  return results;
}