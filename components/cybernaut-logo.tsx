import Image from "next/image"

export function CybernautLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cybernaut%20Logo%20White%20Background%20%282%29-vNwiSlwi4VmIHTqDP8JIawBB4ogUBh.png"
        alt="Cybernaut Logo"
        width={200}
        height={60}
        className="h-auto"
      />
    </div>
  )
}

