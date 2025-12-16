import Button from "./Button";

type Props = {
  time: number;
  bestTime: number | null;
  isNewRecord: boolean;
  onRestart: () => void;
};

export default function Overlay({ time, bestTime, isNewRecord, onRestart }: Props) {
  return (
    <div className="overlay">
      <div className="overlay-box">
        <div className="overlay-title">🎉 클리어!</div>
        <div className="overlay-time">{time.toFixed(2)}초</div>
        {isNewRecord && <div className="overlay-record">신기록 달성!</div>}
        {bestTime !== null && (
          <div className="overlay-best">내 최고 기록: {bestTime.toFixed(2)}초</div>
        )}
        <Button onClick={onRestart}>다시하기</Button>
      </div>
    </div>
  );
}
