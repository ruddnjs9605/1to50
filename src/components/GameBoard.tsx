import Card from "./Card";

type Props = {
  board: (number | null)[];
  onClick: (n: number | null, i: number) => void;
};

export default function GameBoard({ board, onClick }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 10,
      }}
    >
      {board.map((n, i) => (
        <Card key={i} value={n} onClick={() => onClick(n, i)} />
      ))}
    </div>
  );
}
