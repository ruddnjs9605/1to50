import { useEffect, useState } from "react";
import type { ClickResult } from "./game/useGame";
import { useGame } from "./game/useGame";
import { useTimer } from "./game/useTimer";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import Button from "./components/Button";
import Overlay from "./components/Overlay";
import { useRanking } from "./ranking/useRanking";
import "./styles/game.css";

export default function Game() {
  const game = useGame();
  const elapsed = useTimer(game.started && !game.cleared);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { bestTime, addRecord } = useRanking();
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [feedback, setFeedback] = useState<("correct" | "wrong" | null)[]>(
    () => Array(25).fill(null)
  );

  const resetFeedback = () => setFeedback(Array(25).fill(null));

  const handleStart = () => {
    resetFeedback();
    setIsNewRecord(false);
    game.startGame();
  };

  const handleRestart = () => {
    resetFeedback();
    setIsNewRecord(false);
    game.restart();
  };

  const handleClick = (n: number | null, idx: number) => {
    const result: ClickResult = game.onClick(n, idx);
    if (result === "ignored") return;

    setFeedback((prev) => {
      const next = [...prev];
      next[idx] = result;
      return next;
    });

    window.setTimeout(() => {
      setFeedback((prev) => {
        if (prev[idx] === null) return prev;
        const next = [...prev];
        next[idx] = null;
        return next;
      });
    }, 180);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (!game.cleared) return;
    if (elapsed <= 0) return;
    const { newRecord } = addRecord(elapsed);
    setIsNewRecord(newRecord);
  }, [game.cleared, elapsed, addRecord]);

  useEffect(() => {
    if (!game.started) setIsNewRecord(false);
  }, [game.started]);

  return (
    <div className="game-container">
      <Header elapsed={elapsed} theme={theme} onToggleTheme={toggleTheme} />

      <div className="best-record">
        <span>
          최고 기록:{" "}
          {bestTime !== null ? `${bestTime.toFixed(2)}초` : "아직 기록 없음"}
        </span>
        {isNewRecord && game.cleared && <span className="record-badge">신기록</span>}
      </div>

      <div className="next-number">
        다음 숫자: <b>{game.cleared ? "완료" : game.current}</b>
      </div>

      <div className="board-wrapper">
        <GameBoard board={game.board} onClick={handleClick} feedback={feedback} />

        {!game.started && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none", // 보드 클릭 방지
            }}
          >
            <Button
              onClick={handleStart}
              variant="ghost"
              style={{ pointerEvents: "auto" }}
            >
              START
            </Button>
          </div>
        )}

        {/* 클리어 오버레이 */}
        {game.cleared && (
          <Overlay
            time={elapsed}
            bestTime={bestTime}
            isNewRecord={isNewRecord}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
