import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const copies = [
  ["frontend/.next", ".next"],
  ["frontend/public", "public"],
];

for (const [source, target] of copies) {
  const sourcePath = join(root, source);
  const targetPath = join(root, target);

  if (!existsSync(sourcePath)) {
    throw new Error(`Expected build artifact does not exist: ${source}`);
  }

  rmSync(targetPath, { recursive: true, force: true });
  cpSync(sourcePath, targetPath, { recursive: true });
}
