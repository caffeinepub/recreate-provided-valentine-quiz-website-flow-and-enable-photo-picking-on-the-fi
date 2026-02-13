export default function FloatingPetals() {
  const petals = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${10 + Math.random() * 5}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-fall-petals opacity-40"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            top: '-50px',
          }}
        >
          <img
            src="/assets/generated/flower-petals-transparent.dim_200x200.png"
            alt=""
            className="w-8 h-8"
          />
        </div>
      ))}
    </div>
  );
}
