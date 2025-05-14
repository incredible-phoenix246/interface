import React, { forwardRef } from 'react';

export interface SVGProps extends React.SVGAttributes<SVGSVGElement> {
  children?: React.ReactNode;
}
const LogoIcon = forwardRef<SVGSVGElement, SVGProps>(({ className, ...props }, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      viewBox="0 0 4717 4717"
      fill="none"
      className={className}
      ref={ref}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2732.98 4686.35C4018.52 4479.49 4892.96 3269.66 4686.1 1984.13C4479.24 698.592 3269.41 -175.847 1983.88 31.0134C698.342 237.873 -176.097 1447.7 30.7634 2733.23C191.96 3734.99 962.19 4487.11 1902.69 4672.47C1750.14 3566.63 2250.22 2839.89 2482.59 2562.33C1975.25 2877.08 1688.47 3577.54 1669.71 3890.09C829.148 3012.84 1466.74 2194.92 2275.33 2031.75C2657.49 1925.28 2581.76 1523.6 2547.58 1342.29C2541.86 1311.96 2537.3 1287.8 2536.25 1272.22C2964.41 1537.14 3285.49 2156.32 3296.48 2661.29C3308.23 3201.34 3061.89 3687.15 2460.39 3888.12C2250.91 3958.11 2087.15 4145.27 2103.97 4365.48L2129.96 4705.77C2326.58 4724.78 2528.83 4719.2 2732.98 4686.35Z"
        fill="#9A74EB"
      />
    </svg>
  );
});

LogoIcon.displayName = 'LogoIcon';
export default LogoIcon;
