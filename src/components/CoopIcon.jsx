export default function CoopIcon({ width: _width, height = 40, ...props }) {
  const width = (height * 250) / 195;
  return (
    <svg width={width} height={height} viewBox="0 0 250 195" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M94.218 0L248.997 77.3897L155.374 194.283L0 117.324L94.218 0Z" fill="url(#paint0_linear_92_72)" />
      <path d="M0 0.0693359H95V117.372H0V0.0693359Z" fill="#BECAF6" />
      <path d="M154.286 77.5557H249.286V194.858H154.286V77.5557Z" fill="#BECAF6" />
      <defs>
        <linearGradient id="paint0_linear_92_72" x1="-7.69473e-08" y1="88.4488" x2="324.666" y2="88.4488" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.5" />
          <stop offset="1" stopColor="#9DBBFF" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
