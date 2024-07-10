'use client'

const FuturisticLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black/30 absolute top-0 left-0 z-50">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-4 border-t-primary border-opacity-20 rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-t-secondary border-opacity-40 rounded-full animate-spin-slow"></div>
      <div className="absolute inset-4 border-4 border-t-accent border-opacity-60 rounded-full animate-spin-slower"></div>
    </div>
    <p className="mt-4 text-lg font-semibold text-pri">Loading...</p>
  </div>
  )
}

export default FuturisticLoader