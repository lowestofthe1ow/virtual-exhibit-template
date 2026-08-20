import { useMemo } from "react";

function Matrix2x2({ rows }) {
    return (
        <span className="inline-flex items-center font-mono text-xs">
            <span className="text-base leading-none text-white">[</span>
            <span className="inline-flex flex-col mx-0.5 leading-snug text-white">
                {rows.map((row, i) => (
                    <span key={i} className="whitespace-nowrap text-white">
                        {row.join("  ")}
                    </span>
                ))}
            </span>
            <span className="text-base leading-none text-white">]</span>
        </span>
    );
}

function MatrixVec({ rows }) {
    return (
        <span className="inline-flex items-center font-mono text-xs">
            <span className="text-base leading-none text-white">[</span>
            <span className="inline-flex flex-col mx-0.5 leading-snug">
                {rows.map((row, i) => (
                    <span key={i} className="whitespace-nowrap text-white">
                        {row}
                    </span>
                ))}
            </span>
            <span className="text-base leading-none text-white">]</span>
        </span>
    );
}

function firstPixel(data) {
    if (!data || data.data.length < 4) return null;
    return {
        r: data.data[0],
        g: data.data[1],
        b: data.data[2],
        a: data.data[3],
    };
}

function clamp(v) {
    return Math.max(0, Math.min(255, Math.round(v)));
}

function GrayscaleBody({ pixel }) {
    const L = 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b;
    const Lr = Math.round(L);

    return (
        <div className="space-y-3">
            <p className="text-sm text-white">
                Each RGB pixel is reduced to a single luminance value:
            </p>
            <div className="flex items-center justify-center gap-0.5 text-xs font-mono bg-neutral-900 rounded p-3 overflow-x-auto">
                <span className="text-sky-300">L</span>
                <span className="text-white">=</span>
                <span className="text-red-400">0.299</span>
                <span className="text-white">·</span>
                <span className="text-red-400">{pixel.r}</span>
                <span className="text-white">+</span>
                <span className="text-green-400">0.587</span>
                <span className="text-white">·</span>
                <span className="text-green-400">{pixel.g}</span>
                <span className="text-white">+</span>
                <span className="text-blue-400">0.114</span>
                <span className="text-white">·</span>
                <span className="text-blue-400">{pixel.b}</span>
            </div>
            <div className="text-center text-xs font-mono bg-neutral-900 rounded p-2 overflow-x-auto">
                <span className="text-white">= </span>
                <span className="text-white">
                    {(0.299 * pixel.r).toFixed(1)}
                </span>
                <span className="text-white"> + </span>
                <span className="text-white">
                    {(0.587 * pixel.g).toFixed(1)}
                </span>
                <span className="text-white"> + </span>
                <span className="text-white">
                    {(0.114 * pixel.b).toFixed(1)}
                </span>
                <span className="text-white"> = </span>
                <span className="text-sky-300 font-bold">{Lr}</span>
            </div>
            <p className="text-xs text-white">
                Original: R={pixel.r}, G={pixel.g}, B={pixel.b} → All channels
                set to <span className="text-sky-300">{Lr}</span>
            </p>
        </div>
    );
}

function BrightnessBody({ pixel, delta }) {
    const R2 = clamp(pixel.r + delta);
    const G2 = clamp(pixel.g + delta);
    const B2 = clamp(pixel.b + delta);

    return (
        <div className="space-y-3">
            <p className="text-sm text-white">
                A constant <em className="text-yellow-300">β = {delta}</em> is
                added to each channel, clamped to 0–255:
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm font-mono bg-neutral-900 rounded p-4">
                <div className="text-center">
                    <div className="text-red-400 text-xs mb-1">Red</div>
                    <div className="text-white">
                        {pixel.r} + ({delta}) = {R2}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-green-400 text-xs mb-1">Green</div>
                    <div className="text-white">
                        {pixel.g} + ({delta}) = {G2}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-blue-400 text-xs mb-1">Blue</div>
                    <div className="text-white">
                        {pixel.b} + ({delta}) = {B2}
                    </div>
                </div>
            </div>
            <p className="text-xs text-white">
                Before: ({pixel.r}, {pixel.g}, {pixel.b}) → After: ({R2}, {G2},{" "}
                {B2})
            </p>
        </div>
    );
}

function InvertBody({ pixel }) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-white">
                Each channel is subtracted from 255:
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm font-mono bg-neutral-900 rounded p-4">
                <div className="text-center">
                    <div className="text-red-400 text-xs mb-1">Red</div>
                    <div className="text-white">
                        255 − {pixel.r} = {255 - pixel.r}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-green-400 text-xs mb-1">Green</div>
                    <div className="text-white">
                        255 − {pixel.g} = {255 - pixel.g}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-blue-400 text-xs mb-1">Blue</div>
                    <div className="text-white">
                        255 − {pixel.b} = {255 - pixel.b}
                    </div>
                </div>
            </div>
            <p className="text-xs text-white">
                Before: ({pixel.r}, {pixel.g}, {pixel.b}) → After: (
                {255 - pixel.r}, {255 - pixel.g}, {255 - pixel.b})
            </p>
        </div>
    );
}

function ScaleBody({ scalePct, oW, oH }) {
    const s = scalePct / 100;
    const dW = Math.round(oW * s);
    const dH = Math.round(oH * s);

    return (
        <div className="space-y-3">
            <p className="text-sm text-white">
                Each pixel coordinate is multiplied by the scale factor{" "}
                <em className="text-yellow-300">{s}×</em>:
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-mono bg-neutral-900 rounded p-4 overflow-x-auto">
                <MatrixVec rows={["x'", "y'"]} />
                <span className="text-white">=</span>
                <Matrix2x2
                    rows={[
                        [`${s}`, "0"],
                        ["0", `${s}`],
                    ]}
                />
                <span className="text-white">·</span>
                <MatrixVec rows={["x", "y"]} />
            </div>
            <div className="text-center text-sm font-mono bg-neutral-900 rounded p-3">
                <span className="text-white">{oW}×{oH}</span>
                <span className="text-white"> → </span>
                <span className="text-sky-300 font-bold">
                    {dW}×{dH}
                </span>
            </div>
            <p className="text-xs text-white">
                Each source pixel maps to a {s >= 1 ? `${Math.round(s)}×${Math.round(s)}` : `${(1/s).toFixed(1)}×${(1/s).toFixed(1)}`}{" "}
                block in the output.
            </p>
        </div>
    );
}

function RotateBody({ angleDeg, oW, oH }) {
    const rad = (angleDeg * Math.PI) / 180;
    const cosVal = Math.cos(rad);
    const sinVal = Math.sin(rad);
    const cosS = cosVal.toFixed(4);
    const sinS = sinVal.toFixed(4);
    const cosAbs = Math.abs(cosVal);
    const sinAbs = Math.abs(sinVal);
    const dW = Math.max(1, Math.round(oW * cosAbs + oH * sinAbs));
    const dH = Math.max(1, Math.round(oW * sinAbs + oH * cosAbs));

    return (
        <div className="space-y-3">
            <p className="text-sm text-white">
                Each pixel is rotated by{" "}
                <em className="text-yellow-300">{angleDeg}°</em> about the
                origin:
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-mono bg-neutral-900 rounded p-4 overflow-x-auto">
                <MatrixVec rows={["x'", "y'"]} />
                <span className="text-white">=</span>
                <Matrix2x2
                    rows={[
                        [`cos ${angleDeg}°`, `-sin ${angleDeg}°`],
                        [`sin ${angleDeg}°`, `cos ${angleDeg}°`],
                    ]}
                />
                <span className="text-white">·</span>
                <MatrixVec rows={["x", "y"]} />
            </div>
            <div className="text-center text-xs font-mono bg-neutral-900 rounded p-3 overflow-x-auto">
                <span className="text-white whitespace-nowrap">
                    cos({angleDeg}°) = {cosS}
                </span>
                <span className="text-white"> | </span>
                <span className="text-white whitespace-nowrap">
                    sin({angleDeg}°) = {sinS}
                </span>
            </div>
            <div className="text-center text-sm font-mono bg-neutral-900 rounded p-3">
                <span className="text-white">{oW}×{oH}</span>
                <span className="text-white"> → </span>
                <span className="text-sky-300 font-bold">
                    {dW}×{dH}
                </span>
                <span className="text-white"> (rotated bounds)</span>
            </div>
            <p className="text-xs text-white">
                The rotation matrix is applied to every pixel coordinate.
            </p>
        </div>
    );
}

function NoPixelBody() {
    return (
        <p className="text-sm text-white italic">
            Hover over a region on the image to see real pixel math.
        </p>
    );
}

function ColorFilterBody({ params, pixel }) {
    const ch = params.colorFilterChannel;
    const chLabel =
        ch === "r"
            ? "Red"
            : ch === "g"
              ? "Green"
              : ch === "b"
                ? "Blue"
                : null;

    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm text-white font-medium mb-2">
                    Channel Isolation
                </p>
                {chLabel ? (
                    <div className="text-sm font-mono bg-neutral-900 rounded p-3 space-y-2">
                        <div className="text-center">
                            <span className="text-white">
                                Only the{" "}
                            </span>
                            <span
                                className={`font-bold ${
                                    ch === "r"
                                        ? "text-red-400"
                                        : ch === "g"
                                          ? "text-green-400"
                                          : "text-blue-400"
                                }`}
                            >
                                {chLabel}
                            </span>
                            <span className="text-white">
                                {" "}
                                channel is retained. Others set to 0.
                            </span>
                        </div>
                        {pixel && (
                            <div className="text-center text-xs text-white mt-1">
                                Pixel: R={ch === "r" ? pixel.r : 0}, G=
                                {ch === "g" ? pixel.g : 0}, B=
                                {ch === "b" ? pixel.b : 0}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-sm font-mono bg-neutral-900 rounded p-3">
                        <p className="text-center text-white">
                            No channel isolation applied yet.
                        </p>
                    </div>
                )}
            </div>

            <div className="border-t border-neutral-700 pt-3">
                <p className="text-sm text-white font-medium mb-2">
                    Custom RGB Tint
                </p>
                <div className="flex items-center justify-center gap-1 text-xs font-mono bg-neutral-900 rounded p-3 overflow-x-auto whitespace-nowrap">
                    <span className="text-sky-300">P'</span>
                    <span className="text-white">=</span>
                    <span className="text-white">clamp(</span>
                    <span className="text-sky-300">P</span>
                    <span className="text-white"> × </span>
                    <span className="text-yellow-300">m</span>
                    <span className="text-white">, 0, 255)</span>
                </div>
                <div className="text-center text-xs font-mono bg-neutral-900 rounded mt-2 p-2">
                    <span className="text-red-400">R×{params.tintR}%</span>
                    <span className="text-white"> | </span>
                    <span className="text-green-400">G×{params.tintG}%</span>
                    <span className="text-white"> | </span>
                    <span className="text-blue-400">B×{params.tintB}%</span>
                </div>
            </div>
        </div>
    );
}

export default function MathVisualizer({
    activeTab,
    originalPixels,
    processedPixels,
    params,
    originalWidth,
    originalHeight,
}) {
    const pixel = useMemo(() => {
        if (activeTab === "scale" || activeTab === "rotate")
            return { r: 0, g: 0, b: 0, a: 255 };
        return firstPixel(originalPixels) || firstPixel(processedPixels);
    }, [activeTab, originalPixels, processedPixels]);

    const title = useMemo(() => {
        switch (activeTab) {
            case "grayscale":
                return "Grayscale — Luminance Weighting";
            case "brightness":
                return "Brightness Adjustment";
            case "invert":
                return "Color Inversion";
            case "scale":
                return "Scaling — Affine Transform";
            case "rotate":
                return "Rotation — 2D Rotation Matrix";
            case "colorFilter":
                return "Color Filter";
            default:
                return "Operation Math";
        }
    }, [activeTab]);

    const body = useMemo(() => {
        if (!activeTab) {
            return (
                <p className="text-sm text-white italic">
                    Select an operation in the Image Processor to see its
                    math applied to real pixel data.
                </p>
            );
        }

        if (!pixel && activeTab !== "scale" && activeTab !== "rotate" && activeTab !== "colorFilter") {
            return <NoPixelBody />;
        }

        switch (activeTab) {
            case "grayscale":
                return <GrayscaleBody pixel={pixel} />;
            case "brightness":
                return (
                    <BrightnessBody
                        pixel={pixel}
                        delta={Math.round(params.brightness * 2.55)}
                    />
                );
            case "invert":
                return <InvertBody pixel={pixel} />;
            case "scale":
                return (
                    <ScaleBody
                        scalePct={params.scale}
                        oW={originalWidth}
                        oH={originalHeight}
                    />
                );
            case "rotate":
                return (
                    <RotateBody
                        angleDeg={params.rotate}
                        oW={originalWidth}
                        oH={originalHeight}
                    />
                );
            case "colorFilter":
                return <ColorFilterBody params={params} pixel={pixel} />;
            default:
                return null;
        }
    }, [activeTab, pixel, params, originalWidth, originalHeight]);

    return (
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6 h-auto mt-4 min-h-[320px] overflow-hidden">
            <h3 className="text-xl font-semibold text-sky-400 mb-4">
                {title}
            </h3>
            {body}
        </div>
    );
}
