import { BASELINE_PROMPT, BENCHMARK_CONTINUATION_SUFFIX, FILLER_UNIT, TOKENS_PER_CONTEXT_K } from "../config.js";
import type { PromptBuildResult } from "../types.js";
import { LlamaApiClient } from "../api/llamaClient.js";

const minimum = (value: number): number => Math.max(1, Math.ceil(value));

export class PromptSizer {
  private readonly promptCache = new Map<string, PromptBuildResult>();
  private readonly unitTokenCache = new Map<string, number>();
  private readonly suffixTokenCache = new Map<string, number>();

  constructor(private readonly client: LlamaApiClient) {}

  async buildPrompt(modelId: string, contextK: number): Promise<PromptBuildResult> {
    const cacheKey = `${modelId}:${contextK}`;
    const cached = this.promptCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = contextK === 0
      ? await this.buildBaselinePrompt(modelId)
      : await this.buildSizedPrompt(modelId, contextK * TOKENS_PER_CONTEXT_K);

    this.promptCache.set(cacheKey, result);
    return result;
  }

  private async buildBaselinePrompt(modelId: string): Promise<PromptBuildResult> {
    const actualTokens = await this.client.tokenize(modelId, BASELINE_PROMPT);
    return {
      prompt: BASELINE_PROMPT,
      actualTokens,
    };
  }

  private async buildSizedPrompt(modelId: string, targetTokens: number): Promise<PromptBuildResult> {
    const unitTokens = await this.getUnitTokens(modelId);
    const suffixTokens = await this.getSuffixTokens(modelId);
    const tolerance = Math.max(8, Math.round(targetTokens * 0.005));
    const fillerTargetTokens = Math.max(1, targetTokens - suffixTokens);

    let lowRepeats = 1;
    let lowTokens = unitTokens;
    let highRepeats = minimum(fillerTargetTokens / unitTokens);
    let highCandidate = await this.measurePrompt(modelId, highRepeats);

    if (Math.abs(highCandidate.actualTokens - targetTokens) <= tolerance) {
      return highCandidate;
    }

    if (highCandidate.actualTokens < targetTokens) {
      lowRepeats = highRepeats;
      lowTokens = highCandidate.actualTokens;

      while (highCandidate.actualTokens < targetTokens) {
        lowRepeats = highRepeats;
        lowTokens = highCandidate.actualTokens;
        highRepeats = Math.ceil(highRepeats * 1.5) + 1;
        highCandidate = await this.measurePrompt(modelId, highRepeats);
      }
    } else {
      lowRepeats = 0;
      lowTokens = 0;
    }

    let bestCandidate =
      Math.abs(highCandidate.actualTokens - targetTokens) < Math.abs(lowTokens - targetTokens)
        ? highCandidate
        : lowRepeats > 0
          ? await this.measurePrompt(modelId, lowRepeats)
          : highCandidate;

    while (highRepeats - lowRepeats > 1) {
      const midRepeats = Math.floor((lowRepeats + highRepeats) / 2);
      const candidate = await this.measurePrompt(modelId, midRepeats);

      if (Math.abs(candidate.actualTokens - targetTokens) < Math.abs(bestCandidate.actualTokens - targetTokens)) {
        bestCandidate = candidate;
      }

      if (Math.abs(candidate.actualTokens - targetTokens) <= tolerance) {
        return candidate;
      }

      if (candidate.actualTokens < targetTokens) {
        lowRepeats = midRepeats;
        lowTokens = candidate.actualTokens;
      } else {
        highRepeats = midRepeats;
        highCandidate = candidate;
      }
    }

    return Math.abs(highCandidate.actualTokens - targetTokens) < Math.abs(bestCandidate.actualTokens - targetTokens)
      ? highCandidate
      : bestCandidate;
  }

  private async getUnitTokens(modelId: string): Promise<number> {
    const cached = this.unitTokenCache.get(modelId);
    if (cached) {
      return cached;
    }

    const unitTokens = await this.client.tokenize(modelId, FILLER_UNIT);
    this.unitTokenCache.set(modelId, unitTokens);
    return unitTokens;
  }

  private async getSuffixTokens(modelId: string): Promise<number> {
    const cached = this.suffixTokenCache.get(modelId);
    if (cached) {
      return cached;
    }

    const suffixTokens = await this.client.tokenize(modelId, BENCHMARK_CONTINUATION_SUFFIX);
    this.suffixTokenCache.set(modelId, suffixTokens);
    return suffixTokens;
  }

  private async measurePrompt(modelId: string, repeats: number): Promise<PromptBuildResult> {
    const prompt = `${FILLER_UNIT.repeat(repeats).trim()}${BENCHMARK_CONTINUATION_SUFFIX}`;
    const actualTokens = await this.client.tokenize(modelId, prompt);
    return { prompt, actualTokens };
  }
}
