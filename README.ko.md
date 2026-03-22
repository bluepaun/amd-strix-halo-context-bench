# AMD Strix Halo 컨텍스트 벤치마크

언어: [English](README.md) | [한국어](README.ko.md)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Dashboard-245cff?logo=githubpages&logoColor=white)](https://bluepaun.github.io/amd-strix-halo-context-bench/)

이 프로젝트는 AMD Strix Halo 128GB 시스템에서 로컬 `llama.cpp` 서버 모델을 점점 더 긴 컨텍스트 길이로 벤치마크합니다.

이 프로젝트의 핵심 질문은 단순합니다. 프롬프트 컨텍스트가 길어질수록 decode/prefill 처리량이 어떻게 변하는지, 그리고 decode 속도가 `10 tok/sec` 아래로 떨어지는 첫 구간이 어디인지 측정하는 것입니다.

## 테스트 플랫폼

- 플랫폼: AMD Strix Halo
- CPU: AMD Ryzen AI Max+ 395
- GPU: AMD Radeon 8060S
- GPU 아키텍처: RDNA 3.5
- LLVM 타깃: `gfx1151`
- 시스템 메모리: 128GB
- 실행 환경: `distrobox` + `kyuz0/amd-strix-halo-toolboxes:rocm-7.2`
- 커널 (`uname -r`): `6.19.8-061908-generic`

## 이 프로젝트가 하는 일

- 로컬 `llama.cpp` 서버에서 사용 가능한 모델 목록을 가져옵니다.
- 터미널 UI에서 하나 이상의 모델을 선택할 수 있습니다.
- 모델을 한 번에 하나씩 로드하고, 컨텍스트 길이 벤치마크를 수행한 뒤, 언로드합니다.
- 결과를 `benchmark_results.csv`에 점진적으로 기록합니다.
- CSV를 `model_name`, `context_k` 순으로 정렬된 상태로 유지합니다.
- 현재 모델, 현재 버킷, 처리량, 임계점, 전체 실행 시간, 현재 버킷 경과 시간을 TUI에 실시간으로 표시합니다.

## 벤치마크 방식

- 측정에는 `POST /completion` 엔드포인트를 사용합니다.
- decode 처리량은 `timings.predicted_per_second`를 사용합니다.
- prefill 처리량은 `timings.prompt_per_second`를 사용합니다.
- 재현성을 위해 고정된 샘플링 설정을 사용합니다:
  - `cache_prompt: false`
  - `temperature: 0`
  - `top_k: 1`
  - `top_p: 1`
  - 고정 `seed`
  - 고정 `n_predict = 128`
- `1K`는 `1024` tokens로 취급합니다.
- coarse 버킷은 `0K`, `1K`, `10K`, `20K`, `30K`부터 시작하고, 이후 `10K` 간격으로 측정하며, 마지막 usable bucket도 포함합니다.
- decode 처리량이 `10 tok/sec` 아래로 떨어지면 중단합니다.
- `request_failed`가 반복되어 더 이상 신뢰할 수 없다고 판단되면 중단합니다.
- 모델이 usable max context까지 도달해도 임계값 아래로 내려가지 않으면, 마지막으로 성공한 bucket을 threshold로 기록합니다.

참고: CSV 스키마에는 `search_phase`가 포함되어 있지만, 현재 러너는 coarse 포인트만 기록합니다.

## 요구 사항

- Node.js 20+
- 다음 엔드포인트를 제공하는 `llama.cpp` 서버:
  - `GET /models`
  - `POST /models/load`
  - `POST /models/unload`
  - `POST /completion`
  - `POST /tokenize`

## Strix Halo 설정 참고 자료

이 저장소는 벤치마크 도구 자체에 집중하며, 호스트 전체 설정 가이드를 모두 포함하지는 않습니다. 이 프로젝트의 실행 환경은 아래 두 자료를 명시적으로 참고했습니다.

- 참고 자료 1: `kyuz0/amd-strix-halo-toolboxes`
  - Strix Halo용 컨테이너 기반 `llama.cpp` 실행 환경, ROCm/Vulkan 백엔드 정보, 커널/펌웨어 호환성, `-fa 1`, `--no-mmap` 같은 권장 실행 옵션을 제공합니다.
  - https://github.com/kyuz0/amd-strix-halo-toolboxes
- 참고 자료 2: TechnigmaAI Ubuntu 24.04 GTT 가이드
  - Ryzen AI Max+ 395에서 BIOS VRAM 크기, IOMMU 설정, 대용량 공유 GPU 메모리를 위한 GRUB 파라미터를 단계별로 설명합니다.
  - https://github.com/technigmaai/technigmaai-wiki/wiki/AMD-Ryzen-AI-Max--395:-GTT--Memory-Step%E2%80%90by%E2%80%90Step-Instructions-%28Ubuntu-24.04%29

이 저장소의 측정 기준 런타임은 `rocm-7.2` 기반 `distrobox` 환경입니다.

이 자료들에서 특히 유용한 내용은 다음과 같습니다.

- BIOS VRAM 크기, IOMMU 설정, 커널 버전, 펌웨어 버전, 백엔드 선택에 따라 최대 usable context와 성능이 크게 달라질 수 있습니다.
- Ubuntu 튜닝 예시로는 `512MB` VRAM과 `amd_iommu=off`, `amdgpu.gttsize=131072`, `ttm.pages_limit=33554432` 같은 GRUB 파라미터가 자주 사용됩니다.
- Strix Halo에서 `llama.cpp`를 안정적으로 돌리기 위해 `-fa 1`과 `--no-mmap`을 권장하는 사례가 많습니다.

벤치마크 결과를 공개할 때는 호스트 OS, 커널, 펌웨어, 백엔드, 부트 파라미터를 CSV와 함께 남겨두는 것이 좋습니다.

## 빠른 시작

```bash
npm install
npm start
```

기본 연결 주소:

```text
http://127.0.0.1:8080
```

모델 선택 UI가 열리면:

- `space`로 모델 선택
- `enter`로 벤치마크 시작

## 환경 변수

```bash
LLAMA_BASE_URL=http://127.0.0.1:8080
BENCHMARK_OUTPUT_PATH=benchmark_results.csv
BENCHMARK_PAGES_OUTPUT_PATH=docs/benchmark_results.csv
REQUEST_TIMEOUT_MS=3600000
```

- `LLAMA_BASE_URL`: `llama.cpp` 서버의 base URL
- `BENCHMARK_OUTPUT_PATH`: CSV 출력 경로
- `BENCHMARK_PAGES_OUTPUT_PATH`: GitHub Pages 대시보드용 CSV 미러 경로
- `REQUEST_TIMEOUT_MS`: 요청별 타임아웃 밀리초 값

## 출력

벤치마크는 하나의 CSV 파일만 사용하며, 각 benchmark point가 최종 확정될 때마다 파일을 갱신합니다.

현재 스키마:

```csv
model_name,context_k,search_phase,decode_tps,prefill_tps,below_10,status,elapsed,test_date
```

핵심 동작:

- `(model_name, context_k)` 기준으로 upsert 합니다.
- retry 중간 단계의 실패는 기록하지 않습니다.
- 최종적으로 exhausted 된 `request_failed`는 기록합니다.
- 행은 항상 `model_name`, `context_k` 순으로 정렬됩니다.
- `elapsed`는 `26s`, `4m48s`, `1h32m33s` 같은 사람이 읽기 쉬운 형식으로 저장됩니다.

주요 status 값:

- `ok`
- `timeout`
- `load_failed`
- `request_failed`
- `degenerate_response`
- `unload_failed`

## GitHub Pages 대시보드

- 정적 벤치마크 탐색기는 `docs/`에 있습니다.
- GitHub Pages용으로 만들었고, 영어와 한국어를 모두 지원합니다.
- 대시보드는 `docs/benchmark_results.csv`를 읽습니다.
- 벤치마크 CLI는 기본적으로 CSV를 `docs/benchmark_results.csv`에도 함께 미러링하므로, 결과를 커밋하면 배포 데이터도 같이 맞춰집니다.
- GitHub Pages에는 `main` 브랜치의 `docs/` 폴더를 서비스하도록 설정하면 됩니다.
- 로컬 미리보기:

```bash
python3 -m http.server 4173 --directory docs
```

## TUI

실행 중 터미널 UI에는 다음 정보가 표시됩니다.

- 전체 모델 진행 상황
- 현재 모델과 load 상태
- 현재 context bucket
- 전체 실행 경과 시간 실시간 표시
- 현재 bucket 경과 시간 실시간 표시
- 최신 decode / prefill 처리량
- 각 포인트 elapsed를 포함한 최근 확정 결과
- 모델별 threshold 요약

## 프로젝트 구조

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

## 대표 사용 목적

이 저장소는 AMD Strix Halo 128GB 시스템에서 컨텍스트 길이 증가에 따른 성능 변화를 반복 가능하게 측정하기 위한 용도입니다. 특히 대형 로컬 모델이 플랫폼의 실질적인 메모리 한계와 처리량 한계에 가까워질 때 어떻게 동작하는지 비교하는 데 초점을 둡니다.
