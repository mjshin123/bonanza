const DPATH =
  "M185.879 0.471136C187.37 -0.157067 189.05 -0.157067 190.541 0.471136L372.751 77.28C377.702 79.367 377.625 86.4096 372.629 88.3875L190.419 160.529C189 161.091 187.42 161.091 186.001 160.529L3.79093 88.3875C-1.20465 86.4096 -1.28193 79.367 3.66904 77.28L185.879 0.471136Z";

export default function DiamondSvg({ index, selected }) {
  const gid = `bfdg-${index}-${selected ? "b" : "w"}`;
  const stops = selected
    ? [
        ["#4566E2", 0, 1],
        ["#0A2895", 1, 0.9],
      ]
    : [
        ["#F1F8FC", 0, 1],
        ["#A2B3F1", 1, 0.7],
      ];

  return (
    <svg width="100%" height="100%" viewBox="0 0 377 161" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="188.21" y1="168.703" x2="188.21" y2="1.724" gradientUnits="userSpaceOnUse">
          {stops.map(([color, offset, opacity]) => (
            <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
          ))}
        </linearGradient>
      </defs>
      <path d={DPATH} fill={`url(#${gid})`} />
    </svg>
  );
}
