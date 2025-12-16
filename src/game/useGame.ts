import { useState } from "react";
import { shuffle } from "./shuffle";

export function useGame() {
  const [board, setBoard] = useState<(number | null)[]>(Array(25).fill(null));
  const [queue, setQueue] = useState<number[]>([]);
  const [current, setCurrent] = useState(1);
  const [started, setStarted] = useState(false);
  const [cleared, setCleared] = useState(false);

  const startGame = () => {
    setBoard(shuffle(Array.from({ length: 25 }, (_, i) => i + 1)));
    setQueue(shuffle(Array.from({ length: 25 }, (_, i) => i + 26)));
    setCurrent(1);
    setStarted(true);
    setCleared(false);
  };

  const restart = () => {
    setBoard(Array(25).fill(null));
    setQueue([]);
    setCurrent(1);
    setStarted(false);
    setCleared(false);
  };

  const onClick = (n: number | null, idx: number) => {
    if (!started || n !== current) return;

    if (n === 50) {
      setCleared(true);
      return;
    }

    setQueue((prevQueue) => {
      const [nextNumber, ...rest] = prevQueue;

      setBoard((prevBoard) => {
        const updated = [...prevBoard];
        updated[idx] =
          typeof nextNumber === "number" ? nextNumber : null; // 26 이후는 빈칸으로 복귀
        return updated;
      });

      return rest;
    });

    setCurrent((c) => c + 1);
  };

  return {
    board,
    current,
    started,
    cleared,
    startGame,
    restart,
    onClick,
  };
}
