const formatElapsedFromSeconds = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3_600);
  const minutes = Math.floor((safeSeconds % 3_600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h${minutes}m${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m${seconds}s`;
  }

  return `${seconds}s`;
};

export const formatElapsed = (value: number | undefined): string => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "";
  }

  const roundedMilliseconds = Math.max(0, Math.round(value));
  if (roundedMilliseconds < 1_000) {
    return `${roundedMilliseconds}ms`;
  }

  return formatElapsedFromSeconds(Math.round(roundedMilliseconds / 1_000));
};

export const formatLiveElapsed = (startedAt: number | undefined, now: number = Date.now()): string => {
  if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) {
    return "-";
  }

  const elapsedMs = Math.max(0, now - startedAt);
  return formatElapsedFromSeconds(Math.floor(elapsedMs / 1_000));
};
