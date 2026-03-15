#!/usr/bin/env ts-node
import "dotenv/config";
import { scanFiles } from "./scanner";
import { buildDependencyGraph, graphToText } from "./analyzer";
import { explainArchitecture } from "./ai";

async function run() {
  const target = process.argv[2] || ".";

  console.log("Scanning project...\n");

  const files = scanFiles(target);

  const graph = buildDependencyGraph(files);

  const graphText = graphToText(graph);

  console.log("Detected dependencies:\n");
  console.log(graphText);

  console.log("\nGenerating AI explanation...\n");

  const explanation = await explainArchitecture(graphText);

  console.log("AI Architecture Explanation:\n");
  console.log(explanation);
}

run().catch((error) => {
  console.error("Failed to run architecture explainer.");
  console.error(error);
  process.exitCode = 1;
});