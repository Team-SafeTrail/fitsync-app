export default function RootLoading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #226c5d, #ffd29c, #226c5d)",
        backgroundSize: "200% 100%",
        animation: "route-progress-bar 1.2s infinite ease-in-out",
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  );
}
