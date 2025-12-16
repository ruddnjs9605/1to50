
type Props = {
  value: number | null;
  onClick: () => void;
};

export default function Card({ value, onClick }: Props) {
  return (
    <div className={`card ${value !== null ? "flipped" : ""}`} onClick={onClick}>
      <div className="card-inner">
        {typeof value === "number" ? (
  <div className="card-back">
    {String(value).padStart(2, " ")}
  </div>
) : (
  <div className="card-front">?</div>
)}
      </div>
    </div>
  );
}
