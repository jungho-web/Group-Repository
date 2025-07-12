import "./crowns.css";

export default function SpinningCrownsBackground() {
  const crowns = Array.from({ length: 100 });

  return (
    <div className="crown-background">
      {crowns.map((_, i) => (
        <div
          key={i}
          className="crown"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `0s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        >
          👑
        </div>
      ))}
    </div>
  );
}
