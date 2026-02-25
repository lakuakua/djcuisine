export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent mb-4 shadow-xl shadow-red-500/50"></div>
        <p className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent text-xl font-bold">Loading...</p>
      </div>
    </div>
  );
}
