export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-gold-400 border-r-transparent mb-4"></div>
        <p className="text-gold-400 text-lg">Loading...</p>
      </div>
    </div>
  );
}
