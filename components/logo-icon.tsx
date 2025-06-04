import Image from "next/image"

interface LogoIconProps {
  size?: number
  className?: string
}

export function LogoIcon({ size = 32, className = "" }: LogoIconProps) {
  return (
    <Image
      src="/logo.png"
      alt="MovieStream"
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
      priority
      unoptimized
    />
  )
}
