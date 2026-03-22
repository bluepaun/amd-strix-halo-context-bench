# Llama.cpp Context Threshold Benchmark TUI

## Goal

Build a TypeScript TUI program that benchmarks llama.cpp server models and finds the first context size where decode speed drops below `10 tok/sec`.

## User Flow

1. Fetch models from `GET /models`.
2. Show the model list in a TUI multi-select.
3. Let the user select one or more models using `space` and start with `enter`.
4. Benchmark selected models sequentially, one model at a time.

## Benchmark Flow Per Model

1. Record currently loaded models.
2. Load the selected model with `POST /models/load`.
3. Poll `GET /models` until the selected model reports `status.value = loaded`.
4. Optionally confirm readiness with a tiny `/completion` request.
5. Run context benchmarks.
6. Unload the model with `POST /models/unload`.
7. Move to the next selected model.

## Request Strategy

Use `POST /completion` for benchmarking instead of chat endpoints for consistency across models.

Recommended fixed request settings:

- `cache_prompt: false`
- `temperature: 0`
- `top_k: 1`
- `top_p: 1`
- fixed `seed`
- fixed `n_predict` such as `128`

Metrics:

- decode speed = `timings.predicted_per_second`
- prefill speed = `timings.prompt_per_second`

## Context Search Strategy

### Coarse Search

Start with these target context buckets:

- `0K`
- `1K`
- `10K`
- `20K`
- `30K`
- continue in `10K` steps as needed

Stop coarse search at the first tested point where:

- `decode_tps < 10`

### Refine Search

After the first sub-10 coarse result:

1. Identify the last good coarse point where `decode_tps >= 10`.
2. Identify the first bad coarse point where `decode_tps < 10`.
3. Test every `1K` bucket between them.
4. The exact threshold is the first `context_k` where `decode_tps < 10`.

If no tested point drops below `10 tok/sec` before the model's usable limit, finish the model and define the threshold as the last successfully tested `context_k`.

## Prompt Construction

- `0K` means a minimal or empty prompt baseline.
- For non-zero targets, build repeated filler text.
- Use `POST /tokenize` to estimate prompt length and adjust the filler until the prompt is close to the target token count.
- Treat `context_k` as the benchmark bucket label where `1K = 1024` tokens.

Note: the actual evaluated token count may vary slightly because of BOS or model-specific tokenizer behavior. The benchmark should still report the requested target bucket.

## Output Format

Write one CSV file only.

Filename recommendation:

- `benchmark_results.csv`

The file should be updated after each finalized benchmark point instead of only once at the end.
If a point hits `request_failed`, do not write it until the last retry also fails.
When writing a finalized point, update the existing row with the same `model_name` and `context_k` if present; otherwise add a new row and keep the file sorted.

Schema:

```csv
model_name,context_k,search_phase,decode_tps,prefill_tps,below_10,status,elapsed,test_date
```

Field meanings:

- `model_name`: model ID from `/models`
- `context_k`: tested bucket in K-units where `1K = 1024` tokens
- `search_phase`: `coarse` or `refine`
- `decode_tps`: `timings.predicted_per_second`
- `prefill_tps`: `timings.prompt_per_second`
- `below_10`: `true` if `decode_tps < 10`, otherwise `false`
- `status`: `ok`, `timeout`, `load_failed`, `request_failed`, `degenerate_response`, `unload_failed`, or similar
- `elapsed`: human-readable elapsed time for that finalized test point, such as `1h32m33s`
- `test_date`: ISO 8601 timestamp for the latest row update

## CSV Sorting Rules

Rows must be sorted by:

1. `model_name` ascending
2. `context_k` ascending

This keeps each model grouped together while still showing throughput as context grows.

## Runtime UX

The TUI should show progress during execution, including:

- current model
- current context bucket
- live run elapsed time
- live current bucket elapsed time updated every second while benchmarking
- load state
- decode tok/sec
- prefill tok/sec
- whether threshold was found
- elapsed time for finalized benchmark rows shown in the TUI history
- incremental CSV updates as finalized points complete

Do not abort the full benchmark because of one failed point. Record the error in CSV and continue when possible.

## Suggested Internal Modules

- `api client`: calls llama.cpp endpoints
- `model selector`: TUI multi-select
- `prompt sizer`: token-target prompt builder using `/tokenize`
- `benchmark runner`: load, wait, test, refine, unload
- `csv writer`: upsert rows, keep sort order, and persist incremental updates

## Success Criteria

- Models are fetched from the local llama.cpp server.
- The user can select models with `space` and confirm with `enter`.
- Models are benchmarked sequentially.
- Coarse scan starts at `0K`.
- Exact threshold search is refined in `1K` steps after the first sub-10 coarse result.
- One CSV file is produced with all tested points.
- The CSV is updated in place after each finalized point and refreshes `test_date` on overwrite.
- CSV rows are sorted by `model_name`, then increasing `context_k`.
