export default function InfoPanel({ event }) {
  if (!event) {
    return (
      <div className="h-[500px] rounded-xl shadow-2xl p-8 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
        <p className="text-gray-300">Select a year to begin.</p>
      </div>
    );
  }
  return (
    <div
      className="h-[500px] rounded-xl shadow-2xl p-8 overflow-y-auto border border-slate-700"
      style={{
        background:
          "linear-gradient(160deg, #1e293b 0%, #1e293b 60%, #1a2f4f 100%)",
      }}
    >
      <span
        className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
        style={{ backgroundColor: "#FCD116", color: "#0038A8" }}
      >
        {event.year}
      </span>
      <h2 className="text-3xl font-bold mt-4 text-white">{event.title}</h2>
      <div className="mt-6 space-y-4">
        <p className="text-gray-300 leading-relaxed">{event.description}</p>
        <div>
          <h3 className="font-semibold text-gray-200">📍 Location</h3>
          <p className="text-gray-400">{event.location}</p>
        </div>
      </div>
    </div>
  );
}