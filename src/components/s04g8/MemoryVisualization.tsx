import { useMemo, useState, useEffect } from "react";
import type { DecodedImage, Pixel } from "../../S04_Group8_lib/s04g8/types.ts";

interface MemoryVisualizationProps {
    image?: DecodedImage | null;
    /**
     * The pixel to center the byte table on. Wired from SplitScreen,
     * which lifts PixelGrid's onPixelChange callback into hoveredPixel
     * state and passes it straight through as this prop.
     */
    pixel?: Pixel | null;
    rowCount?: number;
}

interface MemoryRow {
    pixelIndex: number;
    offset: number;
    x: number;
    y: number;
    bytes: [number, number, number, number];
    isSelected: boolean;
}

const CHANNEL_LABELS = ["R", "G", "B", "A"] as const;
const CHANNEL_COLORS = ["#E27D7D", "#6FCF97", "#71C6FF", "#B0B0B8"];

function toHex(byte: number): string {
    return byte.toString(16).padStart(2, "0").toUpperCase();
}

function toBinary(byte: number): string {
    return byte.toString(2).padStart(8, "0");
}

/**
 * Renders a compact hex/binary table showing raw RGBA bytes as they sit
 * in the decoded ImageData buffer, centered on a selected/hovered pixel.
 */
export default function MemoryVisualization({
    image = null,
    pixel = null,
    rowCount = 8,
}: MemoryVisualizationProps) {
    const [internalPixel, setInternalPixel] = useState({ x: 0, y: 0 });

    // Follow an externally-provided pixel when one exists (e.g. once
    // wired to PixelGrid); otherwise keep the standalone default.
    useEffect(() => {
        if (pixel) setInternalPixel({ x: pixel.x, y: pixel.y });
    }, [pixel?.x, pixel?.y]);

    const width = image?.width ?? 0;
    const height = image?.height ?? 0;
    const data = image?.imageData?.data ?? null;

    const rows = useMemo<MemoryRow[]>(() => {
        if (!data || !width || !height) return [];

        const cx = Math.min(Math.max(internalPixel.x, 0), width - 1);
        const cy = Math.min(Math.max(internalPixel.y, 0), height - 1);
        const centerIndex = cy * width + cx;

        const half = Math.floor(rowCount / 2);
        const start = Math.max(0, centerIndex - half);

        const out: MemoryRow[] = [];
        for (let i = 0; i < rowCount; i++) {
            const pixelIndex = start + i;
            if (pixelIndex >= width * height) break;
            const offset = pixelIndex * 4;
            const px = pixelIndex % width;
            const py = Math.floor(pixelIndex / width);
            out.push({
                pixelIndex,
                offset,
                x: px,
                y: py,
                bytes: [
                    data[offset],
                    data[offset + 1],
                    data[offset + 2],
                    data[offset + 3],
                ],
                isSelected: pixelIndex === centerIndex,
            });
        }
        return out;
    }, [data, width, height, internalPixel.x, internalPixel.y, rowCount]);

    if (!image) {
        return (
            <section className="w-full py-10">
                <div className="rounded-xl border border-dashed border-neutral-700 p-8 text-center text-sm text-neutral-500">
                    Load an image above to see its raw bytes in memory.
                </div>
            </section>
        );
    }

    return (
        <section className="w-full py-10">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-neutral-400">
                    Every pixel is stored as 4 consecutive bytes —{" "}
                    <span className="font-mono">R, G, B, A</span> — one after
                    another, row by row. This is a window into that buffer.
                </p>
                <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <label className="flex items-center gap-1">
                        x:
                        <input
                            type="number"
                            min={0}
                            max={Math.max(width - 1, 0)}
                            value={internalPixel.x}
                            onChange={(e) =>
                                setInternalPixel((p) => ({
                                    ...p,
                                    x: Number(e.target.value),
                                }))
                            }
                            className="w-16 rounded border border-neutral-600 bg-[#1a1a1a] px-1 py-0.5"
                        />
                    </label>
                    <label className="flex items-center gap-1">
                        y:
                        <input
                            type="number"
                            min={0}
                            max={Math.max(height - 1, 0)}
                            value={internalPixel.y}
                            onChange={(e) =>
                                setInternalPixel((p) => ({
                                    ...p,
                                    y: Number(e.target.value),
                                }))
                            }
                            className="w-16 rounded border border-neutral-600 bg-[#1a1a1a] px-1 py-0.5"
                        />
                    </label>
                </div>
            </div>

            <div
                className="overflow-x-auto rounded-xl text-xs border border-neutral-700 bg-[#0a0a0a] p-4 font-mono text-xs text-neutral-300"
                style={{
                    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}
            >
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-neutral-500">
                            <th className="px-2 py-1 text-left font-normal">
                                pixel
                            </th>
                            <th className="px-2 py-1 text-left font-normal">
                                byte offset
                            </th>
                            <th className="px-2 py-1 text-left font-normal">
                                (x, y)
                            </th>
                            {CHANNEL_LABELS.map((c, i) => (
                                <th
                                    key={c}
                                    className="px-2 py-1 text-left font-normal"
                                    style={{ color: CHANNEL_COLORS[i] }}
                                >
                                    {c} (hex / bin)
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.pixelIndex}
                                className={
                                    row.isSelected
                                        ? "bg-[#71C6FF]/10"
                                        : "hover:bg-white/5"
                                }
                            >
                                <td className="px-2 py-1 text-neutral-500">
                                    #{row.pixelIndex}
                                </td>
                                <td className="px-2 py-1 text-neutral-500">
                                    0x{toHex(row.offset)}
                                </td>
                                <td className="px-2 py-1">
                                    ({row.x}, {row.y})
                                </td>
                                {row.bytes.map((b, i) => (
                                    <td
                                        key={i}
                                        className="px-2 py-1"
                                        style={{ color: CHANNEL_COLORS[i] }}
                                    >
                                        {toHex(b)}{" "}
                                        <span className="text-neutral-500">
                                            {toBinary(b)}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-2 text-xs text-neutral-500">
                Highlighted row is the selected pixel: byte offset ={" "}
                <span className="font-mono">(y × width + x) × 4</span>.
            </p>
        </section>
    );
}
