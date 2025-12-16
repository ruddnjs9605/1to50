type Props = {
  children: React.ReactNode;
  onClick: () => void;
  style?: React.CSSProperties; // ✅ 추가
  variant?: "primary" | "ghost";
};

export default function Button({
  children,
  onClick,
  style,
  variant = "primary",
}: Props) {
  return (
    <button
      className={`square-button ${variant}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
