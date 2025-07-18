import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  href?: string
  className?: string
}

export function Logo({ size = "md", showText = true, href = "/", className = "" }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32, textSize: "text-lg" },
    md: { width: 40, height: 40, textSize: "text-xl" },
    lg: { width: 56, height: 56, textSize: "text-2xl" },
  }

  const logoContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt="MovieStream Logo"
        width={sizes[size].width}
        height={sizes[size].height}
        className="rounded-xl"
        // Removed 'priority' and 'unoptimized' props
      />
      {showText && <span className={`font-bold ${sizes[size].textSize}`}>MovieStream</span>}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
