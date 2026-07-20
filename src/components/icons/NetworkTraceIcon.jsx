export default function NetworkTraceIcon({ width: _width, height = 40, ...props }) {
  const width = (height * 294) / 134;
  return (
    <svg width={width} height={height} viewBox="0 0 294 134" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M122.142 119.692C129.705 127.254 141.966 127.254 149.529 119.691C157.092 112.128 157.091 99.8675 149.529 92.3046L149.53 92.3039L57.2258 0.000225903L29.8379 27.3882L122.142 119.692Z" fill="url(#paint0_linear_92_64)" />
      <path d="M252.35 119.692C259.913 127.254 272.174 127.254 279.737 119.691C287.3 112.128 287.299 99.8675 279.737 92.3046L279.738 92.3039L187.434 0.000225903L160.046 27.3882L252.35 119.692Z" fill="url(#paint1_linear_92_64)" />
      <path d="M137.328 0.000488281C148.023 0.000915044 156.693 8.6714 156.693 19.3667C156.693 30.062 148.023 38.7315 137.328 38.7319V38.7329L0 38.7329L0 0.000488281L137.328 0.000488281Z" fill="url(#paint2_linear_92_64)" />
      <circle cx="19.3662" cy="19.3662" r="19.3662" transform="matrix(-1 0 0 1 67.5244 0.000488281)" fill="#A2B3F1" fillOpacity="0.7" />
      <circle cx="19.3662" cy="19.3662" r="19.3662" transform="matrix(-1 0 0 1 200.455 0.000488281)" fill="#A2B3F1" fillOpacity="0.7" />
      <circle cx="19.3662" cy="19.3662" r="19.3662" transform="matrix(-1 0 0 1 200.455 86.7993)" fill="#A2B3F1" fillOpacity="0.7" />
      <circle cx="19.3662" cy="19.3662" r="19.3662" transform="matrix(-1 0 0 1 285.192 86.7993)" fill="#A2B3F1" fillOpacity="0.7" />
      <defs>
        <linearGradient id="paint0_linear_92_64" x1="72.7828" y1="42.9452" x2="149.529" y2="119.691" gradientUnits="userSpaceOnUse">
          <stop offset="0.0769231" stopColor="white" />
          <stop offset="1" stopColor="#A2B3F1" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="paint1_linear_92_64" x1="202.991" y1="42.9452" x2="279.737" y2="119.691" gradientUnits="userSpaceOnUse">
          <stop offset="0.0769231" stopColor="white" />
          <stop offset="1" stopColor="#A2B3F1" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="paint2_linear_92_64" x1="48.1582" y1="19.3667" x2="156.693" y2="19.3667" gradientUnits="userSpaceOnUse">
          <stop offset="0.120192" stopColor="white" />
          <stop offset="1" stopColor="#A2B3F1" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
