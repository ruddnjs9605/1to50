import { useMemo, useState } from "react";

type Props = {
  records: number[];
};

const AGE_BENCHMARKS: Record<
  string,
  { mean: number; sd: number; label: string }
> = {
  "teens": { mean: 32, sd: 6, label: "10대 (샘플)" },
  "20s": { mean: 28, sd: 5, label: "20대 (샘플)" },
  "30s": { mean: 26, sd: 5, label: "30대 (샘플)" },
  "40s": { mean: 27, sd: 6, label: "40대 (샘플)" },
  "50s": { mean: 30, sd: 7, label: "50대+ (샘플)" },
};

function normalCdf(x: number, mean: number, sd: number) {
  const z = (x - mean) / (sd * Math.SQRT2);
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const erf =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-z * z);
  const sign = z >= 0 ? 1 : -1;
  return 0.5 * (1 + sign * erf);
}

export default function RankingBoard({ records }: Props) {
  const [ageKey, setAgeKey] = useState<keyof typeof AGE_BENCHMARKS>("20s");
  const hasRecords = records.length > 0;
  const bestTime = hasRecords ? records[0] : null;

  const percentile = useMemo(() => {
    if (!bestTime) return null;
    const { mean, sd } = AGE_BENCHMARKS[ageKey];
    const slowerPortion = 1 - normalCdf(bestTime, mean, sd);
    const value = Math.max(0, Math.min(100, slowerPortion * 100));
    return value;
  }, [ageKey, bestTime]);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>🏆 랭킹</h3>

      {!hasRecords && <div style={{ color: "#888" }}>기록이 없어요. 한 번 클리어해보세요!</div>}

      {records.map((time, idx) => (
        <div key={`${time}-${idx}`}>
          {idx + 1}위 - {time.toFixed(2)}초
        </div>
      ))}

      <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "var(--card)" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>나이대별 예상 백분위 (샘플)</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <label htmlFor="age-group" style={{ color: "var(--muted)" }}>
            나이대
          </label>
          <select
            id="age-group"
            value={ageKey}
            onChange={(e) => setAgeKey(e.target.value as keyof typeof AGE_BENCHMARKS)}
            style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid var(--muted)", background: "var(--card)", color: "var(--text)" }}
          >
            {Object.entries(AGE_BENCHMARKS).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </div>

        {bestTime ? (
          <div>
            <div style={{ marginBottom: 4 }}>
              내 최고 기록: <b>{bestTime.toFixed(2)}초</b>
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)" }}>
              가정된 분포 기준 상위 {percentile ? percentile.toFixed(1) : "0.0"}% (추정)
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--muted)" }}>기록이 생기면 추정 백분위를 보여드릴게요.</div>
        )}
      </div>
    </div>
  );
}
