const STAGES = [
    {
        icon: "💾",
        label: "Storage",
        desc: "Compressed file on disk (PNG, JPEG, BMP)",
    },
    {
        icon: "📄",
        label: "File",
        desc: "Binary file selected by the user",
    },
    {
        icon: "🔄",
        label: "Decode",
        desc: "Format decoded to raw pixel data",
    },
    {
        icon: "🧠",
        label: "Memory",
        desc: "Pixel buffer in RAM as RGBA values",
    },
    {
        icon: "🖥️",
        label: "Display",
        desc: "Rendered on screen via GPU",
    },
];

export default function PipelineVisualizer() {
    return (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-4 h-full">
            <h3 className="text-lg font-semibold text-sky-400 mb-3">
                Image Processing Pipeline
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-0">
                {STAGES.map((stage, i) => (
                    <div key={stage.label} className="flex items-center">
                        <div className="flex flex-col items-center p-3 bg-neutral-900 rounded-lg border border-neutral-600 w-28 sm:w-32">
                            <span className="text-2xl mb-1">{stage.icon}</span>
                            <span className="text-sm font-semibold text-white text-center">
                                {stage.label}
                            </span>
                            <span className="text-[10px] text-neutral-400 text-center mt-1 leading-tight">
                                {stage.desc}
                            </span>
                        </div>
                        {i < STAGES.length - 1 && (
                            <span className="text-2xl text-neutral-500 mx-1 select-none">
                                →
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
