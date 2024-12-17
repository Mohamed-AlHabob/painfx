import Image from "next/image";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

export const Logo = ({ height = 40, width = 40, className }: LogoProps) => {
  return (
    <Image
      height={height}
      width={width}
      alt="PainFx Logo"
      src="/assets/logo.svg"
      className={className}
      priority
    />
  );
};

export const LogoDark = ({ height = 40, width = 40, className }: LogoProps) => {
  return (
    <Image
      height={height}
      width={width}
      alt="PainFx Logo (Dark Mode)"
      src="/assets/LogoDark.svg"
      className={className}
      priority
    />
  );
};

