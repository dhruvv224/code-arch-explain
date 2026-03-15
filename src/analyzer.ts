import { Project } from "ts-morph";

export function buildDependencyGraph(files: string[]) {
  const project = new Project();

  files.forEach((file) => {
    project.addSourceFileAtPath(file);
  });

  const graph: Record<string, string[]> = {};

  project.getSourceFiles().forEach((file) => {
    const imports = file.getImportDeclarations();

    graph[file.getBaseName()] = imports.map((i) =>
      i.getModuleSpecifierValue()
    );
  });

  return graph;
}

export function graphToText(graph: Record<string, string[]>) {
  return Object.entries(graph)
    .map(([file, deps]) => `${file} imports ${deps.join(", ")}`)
    .join("\n");
}