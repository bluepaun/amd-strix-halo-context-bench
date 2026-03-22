import path from "node:path";
import process from "node:process";
import { checkbox } from "@inquirer/prompts";
import { LlamaApiClient } from "./api/llamaClient.js";
import { BenchmarkRunner } from "./benchmark/benchmarkRunner.js";
import { DEFAULT_BASE_URL, DEFAULT_OUTPUT_PATH, TOKENS_PER_CONTEXT_K } from "./config.js";
import { ResultsCsvStore } from "./csv/writeResults.js";
import { PromptSizer } from "./prompt/promptSizer.js";
import { ConsoleStatusReporter } from "./ui/statusReporter.js";

async function selectModels(client: LlamaApiClient): Promise<string[]> {
  const models = await client.listModels();

  if (models.length === 0) {
    throw new Error(`No models were returned from ${DEFAULT_BASE_URL}/models.`);
  }

  const selections = await checkbox({
    message: "Select models to benchmark",
    instructions: "Space to toggle, enter to start",
    pageSize: 12,
    choices: models.map((model) => ({
      name: `${model.id} (${model.statusValue}, ctx ${Math.floor(model.ctxSizeTokens / TOKENS_PER_CONTEXT_K)}K)`,
      value: model.id,
    })),
    validate: (values) => (values.length > 0 ? true : "Select at least one model."),
  });

  return selections;
}

async function main(): Promise<void> {
  const outputPath = path.resolve(process.cwd(), DEFAULT_OUTPUT_PATH);
  const client = new LlamaApiClient(DEFAULT_BASE_URL);
  const selectedModels = await selectModels(client);
  const reporter = new ConsoleStatusReporter();
  const promptSizer = new PromptSizer(client);
  const resultsStore = new ResultsCsvStore(outputPath);
  const runner = new BenchmarkRunner(client, promptSizer, reporter, resultsStore);

  await runner.runModels(selectedModels);
  reporter.finish(outputPath, await resultsStore.getRowCount());

  console.log(`Saved benchmark CSV to ${outputPath}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
