#!/usr/bin/env tsx

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const PROJECT_ROOT = resolve(__dirname, "..");
const ENTRY_POINTS = [
  "app/[locale]/(main)/page.tsx",
  "app/[locale]/(main)/layout.tsx",
  "app/layout.tsx",
  "app/[locale]/layout.tsx",
];

// Always keep these paths (system routes, shadcn, etc.)
const ALWAYS_KEEP_PATTERNS = [
  /^app\/api\//,
  /^app\/auth\//,
  /^app\/og\//,
  /^app\/r\//,
  /^app\/keystatic\//,
  /^app\/sitemap\.ts$/,
  /^app\/globals\.css$/,
  /^app\/layout\.tsx$/,
  /^app\/\[locale\]\/layout\.tsx$/,
  /^components\/ui\//,
  /^i18n\//,
  /^lib\/prisma\.ts$/,
  /^lib\/metadata\.ts$/,
  /^lib\/auth\.ts$/,
  /^lib\/consts\.ts$/,
  /^lib\/utils\.ts$/,
  /^next-env\.d\.ts$/,
  /^tsconfig\.json$/,
  /^next\.config\.ts$/,
  /^proxy\.ts$/,
];

// Routes that are allowed (and their nested paths)
const ALLOWED_ROUTES = [
  /^app\/\[locale\]\/\(main\)\/page\.tsx$/,
  /^app\/\[locale\]\/\(main\)\/guestbook\//,
  /^app\/\[locale\]\/\(main\)\/events\//,
  /^app\/\[locale\]\/\(main\)\/cursor\//,
];

type FilePath = string;
type ImportGraph = Map<FilePath, Set<FilePath>>;

function getAllTsFiles(
  dir: string,
  baseDir: string = PROJECT_ROOT,
): FilePath[] {
  const files: FilePath[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (
        entry === "node_modules" ||
        entry === ".next" ||
        entry.startsWith(".")
      ) {
        continue;
      }
      files.push(...getAllTsFiles(fullPath, baseDir));
    } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      const relPath = relative(baseDir, fullPath);
      files.push(relPath);
    }
  }

  return files;
}

function resolveImportPath(
  importPath: string,
  fromFile: FilePath,
): FilePath | null {
  // Skip external packages
  if (!(importPath.startsWith(".") || importPath.startsWith("@/"))) {
    return null;
  }

  const fromDir = dirname(fromFile);

  if (importPath.startsWith("@/")) {
    // Resolve @/ alias (which maps to project root)
    const aliasPath = importPath.slice(2);
    return aliasPath.startsWith("/") ? aliasPath.slice(1) : aliasPath;
  }

  // Resolve relative imports
  const resolved = resolve(fromDir, importPath);
  const relPath = relative(PROJECT_ROOT, resolved);

  // Try common extensions
  for (const ext of ["", ".ts", ".tsx", ".js", ".jsx"]) {
    const candidate = relPath + ext;
    if (candidate.endsWith(".ts") || candidate.endsWith(".tsx")) {
      return candidate;
    }
  }

  // Try index files
  for (const ext of [".ts", ".tsx"]) {
    const candidate = join(relPath, `index${ext}`);
    if (candidate.endsWith(".ts") || candidate.endsWith(".tsx")) {
      return candidate;
    }
  }

  return relPath;
}

function extractImports(content: string, filePath: FilePath): FilePath[] {
  const imports: FilePath[] = [];

  // Static imports: import ... from "..."
  const staticImportRegex =
    /import\s+(?:type\s+)?(?:[\w\s{},*]+from\s+)?["']([^"']+)["']/g;
  let match: RegExpExecArray | null = staticImportRegex.exec(content);
  while (match !== null) {
    const resolved = resolveImportPath(match[1], filePath);
    if (resolved) {
      imports.push(resolved);
    }
    match = staticImportRegex.exec(content);
  }

  // Dynamic imports: import("...")
  const dynamicImportRegex = /import\s*\(\s*["']([^"']+)["']\s*\)/g;
  match = dynamicImportRegex.exec(content);
  while (match !== null) {
    const resolved = resolveImportPath(match[1], filePath);
    if (resolved) {
      imports.push(resolved);
    }
    match = dynamicImportRegex.exec(content);
  }

  // next/dynamic: dynamic(() => import("..."))
  const dynamicNextRegex =
    /dynamic\s*\(\s*(?:\(\)\s*=>\s*)?import\s*\(\s*["']([^"']+)["']\s*\)/g;
  match = dynamicNextRegex.exec(content);
  while (match !== null) {
    const resolved = resolveImportPath(match[1], filePath);
    if (resolved) {
      imports.push(resolved);
    }
    match = dynamicNextRegex.exec(content);
  }

  // require(): require("...")
  const requireRegex = /require\s*\(\s*["']([^"']+)["']\s*\)/g;
  match = requireRegex.exec(content);
  while (match !== null) {
    const resolved = resolveImportPath(match[1], filePath);
    if (resolved) {
      imports.push(resolved);
    }
    match = requireRegex.exec(content);
  }

  return imports;
}

function findMatchingFile(imp: FilePath, files: FilePath[]): FilePath | null {
  const candidatePaths = [
    join(PROJECT_ROOT, imp),
    join(PROJECT_ROOT, `${imp}.ts`),
    join(PROJECT_ROOT, `${imp}.tsx`),
    join(PROJECT_ROOT, imp, "index.ts"),
    join(PROJECT_ROOT, imp, "index.tsx"),
  ];

  for (const candidate of candidatePaths) {
    try {
      const stat = statSync(candidate);
      if (stat.isFile()) {
        const relCandidate = relative(PROJECT_ROOT, candidate);
        if (files.includes(relCandidate)) {
          return relCandidate;
        }
      }
    } catch {
      // File doesn't exist, continue
    }
  }

  // Try to find the file in the files list
  const matchingFile = files.find((f) => f === imp || f.startsWith(`${imp}.`));
  return matchingFile || null;
}

function processFileImports(
  file: FilePath,
  imports: FilePath[],
  graph: ImportGraph,
  files: FilePath[],
): void {
  if (!graph.has(file)) {
    graph.set(file, new Set());
  }

  for (const imp of imports) {
    const matchingFile = findMatchingFile(imp, files);
    if (matchingFile) {
      graph.get(file)?.add(matchingFile);
    }
  }
}

function buildImportGraph(files: FilePath[]): ImportGraph {
  const graph = new Map<FilePath, Set<FilePath>>();

  for (const file of files) {
    const fullPath = join(PROJECT_ROOT, file);
    try {
      const content = readFileSync(fullPath, "utf-8");
      const imports = extractImports(content, file);
      processFileImports(file, imports, graph, files);
    } catch (error) {
      console.warn(`Warning: Could not read ${file}: ${error}`);
    }
  }

  return graph;
}

function findReachableFiles(
  graph: ImportGraph,
  entryPoints: FilePath[],
): Set<FilePath> {
  const visited = new Set<FilePath>();
  const queue: FilePath[] = [...entryPoints];

  for (const entry of entryPoints) {
    visited.add(entry);
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }
    const imports = graph.get(current) || new Set();

    for (const imp of imports) {
      if (!visited.has(imp)) {
        visited.add(imp);
        queue.push(imp);
      }
    }
  }

  return visited;
}

function shouldKeepFile(file: FilePath): boolean {
  // Check always-keep patterns
  for (const pattern of ALWAYS_KEEP_PATTERNS) {
    if (pattern.test(file)) {
      return true;
    }
  }

  // Check if it's an entry point
  if (ENTRY_POINTS.includes(file)) {
    return true;
  }

  // Check if it's in an allowed route subtree
  for (const pattern of ALLOWED_ROUTES) {
    if (pattern.test(file)) {
      return true;
    }
  }

  return false;
}

function main() {
  console.log("🔍 Scanning for TypeScript files...");
  const allFiles = getAllTsFiles(PROJECT_ROOT);

  console.log(`📁 Found ${allFiles.length} TypeScript files`);

  // Filter out files that should always be kept
  const filesToAnalyze = allFiles.filter((f) => !shouldKeepFile(f));

  console.log("🔗 Building import graph...");
  const graph = buildImportGraph(allFiles);

  console.log("🚀 Finding entry points...");
  const entryPoints: FilePath[] = [];
  for (const entry of ENTRY_POINTS) {
    const fullPath = join(PROJECT_ROOT, entry);
    try {
      statSync(fullPath);
      entryPoints.push(entry);
      console.log(`  ✓ ${entry}`);
    } catch {
      console.warn(`  ⚠ Entry point not found: ${entry}`);
    }
  }

  // Also include all page.tsx files in allowed routes
  for (const file of allFiles) {
    if (
      file.includes("/page.tsx") &&
      ALLOWED_ROUTES.some((pattern) => pattern.test(file)) &&
      !entryPoints.includes(file)
    ) {
      entryPoints.push(file);
    }
  }

  console.log(
    `\n🌐 Traversing import graph from ${entryPoints.length} entry points...`,
  );
  const reachable = findReachableFiles(graph, entryPoints);

  console.log(`✅ Found ${reachable.size} reachable files`);

  const unreachable = filesToAnalyze.filter((f) => !reachable.has(f));

  // Also include always-keep files in reachable count
  const alwaysKeepFiles = allFiles.filter((f) => shouldKeepFile(f));
  const totalReachable = reachable.size + alwaysKeepFiles.length;

  console.log("\n📊 Summary:");
  console.log(`  Total files: ${allFiles.length}`);
  console.log(`  Reachable files: ${totalReachable}`);
  console.log(`  Unreachable files: ${unreachable.length}`);

  if (unreachable.length > 0) {
    console.log("\n❌ Unreachable files:");
    for (const file of unreachable.sort()) {
      console.log(`  ${file}`);
    }
  } else {
    console.log("\n✅ No unreachable files found!");
  }

  return unreachable;
}

if (require.main === module) {
  main();
}

export { main };
