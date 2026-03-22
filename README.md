# AMD Strix Halo Context Benchmark

Language: [English](README.md) | [한국어](README.ko.md)

This project benchmarks local `llama.cpp` server models across increasing context lengths on an AMD Strix Halo 128GB machine.

It is built to answer a simple question: how does decode and prefill throughput change as prompt context grows, and at what bucket does decode speed fall below `10 tok/sec`?

## Test Platform

- Platform: AMD Strix Halo
- CPU: AMD Ryzen AI Max+ 395
- GPU: AMD Radeon 8060S
- GPU architecture: RDNA 3.5
- LLVM target: `gfx1151`
- System memory: 128GB
- Runtime environment: `distrobox` with `kyuz0/amd-strix-halo-toolboxes:rocm-7.2`
- Kernel (`uname -r`): `6.19.8-061908-generic`

## What It Does

- Fetches available models from a local `llama.cpp` server.
- Lets you pick one or more models from a terminal UI.
- Loads models one at a time, runs context-length benchmarks, then unloads them.
- Writes results incrementally to `benchmark_results.csv`.
- Keeps the CSV sorted by `model_name`, then `context_k`.
- Shows a live TUI with current model, current bucket, throughput, threshold, run elapsed time, and current bucket elapsed time.

## Benchmark Method

- Uses the `POST /completion` endpoint for measurement.
- Uses `timings.predicted_per_second` as decode throughput.
- Uses `timings.prompt_per_second` as prefill throughput.
- Uses fixed sampling settings for consistency:
  - `cache_prompt: false`
  - `temperature: 0`
  - `top_k: 1`
  - `top_p: 1`
  - fixed `seed`
  - fixed `n_predict = 128`
- Treats `1K` as `1024` tokens.
- Tests coarse buckets at `0K`, `1K`, `10K`, `20K`, `30K`, then every `10K`, plus the model's final usable bucket.
- Stops when decode throughput drops below `10 tok/sec`, or when repeated `request_failed` errors make further progress unreliable.
- If the model reaches its usable max context without dropping below threshold, the threshold is recorded as the last successful bucket.

Note: the CSV schema includes `search_phase`, but the current runner records coarse points only.

## Requirements

- Node.js 20+
- A running `llama.cpp` server exposing:
  - `GET /models`
  - `POST /models/load`
  - `POST /models/unload`
  - `POST /completion`
  - `POST /tokenize`

## Strix Halo Setup References

This repository focuses on benchmarking, not full host provisioning. The environment used for this project explicitly references the two resources below for Strix Halo setup and tuning guidance:

- Reference 1: `kyuz0/amd-strix-halo-toolboxes`
  - containerized `llama.cpp` environments for Strix Halo, plus notes on ROCm/Vulkan backends, kernel and firmware compatibility, and recommended runtime flags such as `-fa 1` and `--no-mmap`
  - https://github.com/kyuz0/amd-strix-halo-toolboxes
- Reference 2: TechnigmaAI Ubuntu 24.04 GTT guide
  - step-by-step Ryzen AI Max+ 395 memory tuning reference covering BIOS VRAM size, IOMMU settings, and GRUB parameters for large shared GPU memory
  - https://github.com/technigmaai/technigmaai-wiki/wiki/AMD-Ryzen-AI-Max--395:-GTT--Memory-Step%E2%80%90by%E2%80%90Step-Instructions-%28Ubuntu-24.04%29

For the measurements in this repository, the `rocm-7.2` `distrobox` setup is the runtime baseline.

Useful details from those references:

- Strix Halo memory behavior and max usable context can change a lot depending on BIOS VRAM size, IOMMU settings, kernel version, firmware version, and backend choice.
- Ubuntu tuning examples commonly use `512MB` VRAM plus GRUB parameters like `amd_iommu=off`, `amdgpu.gttsize=131072`, and `ttm.pages_limit=33554432`.
- Toolbox-based `llama.cpp` setups often recommend `-fa 1` and `--no-mmap` on Strix Halo for better stability and performance.

If you publish benchmark results, it is worth recording your exact host OS, kernel, firmware, backend, and boot parameters alongside the CSV.

## Quick Start

```bash
npm install
npm start
```

By default the tool connects to:

```text
http://127.0.0.1:8080
```

After the model picker opens:

- press `space` to select models
- press `enter` to start benchmarking

## Environment Variables

```bash
LLAMA_BASE_URL=http://127.0.0.1:8080
BENCHMARK_OUTPUT_PATH=benchmark_results.csv
BENCHMARK_PAGES_OUTPUT_PATH=docs/benchmark_results.csv
REQUEST_TIMEOUT_MS=3600000
```

- `LLAMA_BASE_URL`: base URL for the `llama.cpp` server
- `BENCHMARK_OUTPUT_PATH`: CSV output path
- `BENCHMARK_PAGES_OUTPUT_PATH`: mirrored CSV path for the GitHub Pages dashboard
- `REQUEST_TIMEOUT_MS`: per-request timeout in milliseconds

## Output

The benchmark writes one CSV file and updates it after each finalized benchmark point.

Current schema:

```csv
model_name,context_k,search_phase,decode_tps,prefill_tps,below_10,status,elapsed,test_date
```

Key behaviors:

- Rows are upserted by `(model_name, context_k)`.
- Intermediate retry failures are not written.
- Final exhausted `request_failed` results are written.
- Rows stay sorted by `model_name`, then `context_k`.
- `elapsed` is stored in a human-readable format such as `26s`, `4m48s`, or `1h32m33s`.

Common status values:

- `ok`
- `timeout`
- `load_failed`
- `request_failed`
- `degenerate_response`
- `unload_failed`

## GitHub Pages Dashboard

- A static benchmark explorer lives in `docs/`.
- It is designed for GitHub Pages and supports both English and Korean.
- The dashboard reads `docs/benchmark_results.csv`.
- The benchmark CLI now mirrors CSV writes to `docs/benchmark_results.csv` by default, so published data stays in sync when you commit updated results.
- To publish it on GitHub Pages, serve the `main` branch `docs/` folder.
- For a quick local preview, run:

```bash
python3 -m http.server 4173 --directory docs
```

## TUI

During a run, the terminal UI shows:

- overall model progress
- current model and load state
- current context bucket
- live total run elapsed time
- live current bucket elapsed time
- latest decode and prefill throughput
- recent finalized benchmark points with per-point elapsed time
- model threshold summary

## Project Structure

```text
docs/              GitHub Pages benchmark dashboard
src/
  api/            llama.cpp HTTP client
  benchmark/      benchmark orchestration
  csv/            incremental CSV persistence
  prompt/         prompt sizing via /tokenize
  time/           elapsed time formatting
  ui/             terminal status reporter
```

## Typical Use Case

This repository is aimed at repeatable context-scaling measurements on an AMD Strix Halo 128GB system, especially for comparing how large local models behave as context grows toward the platform's practical memory and throughput limits.
