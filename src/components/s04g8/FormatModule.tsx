import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DecodedImage } from "../../S04_Group8_lib/s04g8/types.ts";

interface FormatModuleProps {
    image?: DecodedImage | null;
}

interface LayoutSegment {
    label: string;
    detail: string;
    width: number; // percent, segments in a format should sum to 100
}

interface FormatInfo {
    id: string;
    label: string;
    mime: string;
    accent: string;
    compression: string;
    transparency: string;
    typicalSize: string;
    blurb: string;
    layout: LayoutSegment[];
    note?: string;
}

// Static reference data — one entry per format we teach, independent of
// what the uploader currently accepts.
const FORMATS: FormatInfo[] = [
    {
        id: "png",
        label: "PNG",
        mime: "image/png",
        accent: "#6FCF97",
        compression: "Lossless (DEFLATE)",
        transparency: "Full alpha channel (0–255 per pixel)",
        typicalSize: "Larger than JPEG for photos, smaller for flat-color art",
        blurb: "PNG never throws pixels away. Every value you decode is exactly the value that was encoded — the tradeoff is a bigger file for photographic detail.",
        layout: [
            { label: "Signature", detail: "8 fixed bytes identifying the file as PNG", width: 10 },
            { label: "IHDR chunk", detail: "Width, height, bit depth, color type", width: 18 },
            { label: "IDAT chunk(s)", detail: "Pixel data, filtered then DEFLATE-compressed", width: 55 },
            { label: "IEND chunk", detail: "Marks the end of the file", width: 17 },
        ],
    },
    {
        id: "jpeg",
        label: "JPEG",
        mime: "image/jpeg",
        accent: "#71C6FF",
        compression: "Lossy (DCT + quantization)",
        transparency: "None",
        typicalSize: "Small — the format's whole design goal",
        blurb: "JPEG splits the image into 8×8 blocks, transforms each into frequencies, and discards the frequencies your eye is least likely to notice.",
        layout: [
            { label: "Header (APP0/EXIF)", detail: "Metadata, thumbnails, encoder info", width: 14 },
            { label: "Quantization tables", detail: "How aggressively each frequency is compressed", width: 12 },
            { label: "DCT-coded blocks", detail: "8×8 pixel blocks as compressed frequency data", width: 58 },
            { label: "EOI marker", detail: "End of image", width: 16 },
        ],
    },
    {
        id: "bmp",
        label: "BMP",
        mime: "image/bmp",
        accent: "#B0B0B8",
        compression: "None (usually)",
        transparency: "Optional, format-dependent",
        typicalSize: "Largest of the four — essentially the raw pixel grid",
        blurb: "BMP mostly just writes out width × height × bytes-per-pixel, in order. Simple to decode, expensive to store — the closest thing to raw memory you'll find in a file.",
        layout: [
            { label: "File header", detail: "Magic bytes 'BM', file size, pixel data offset", width: 12 },
            { label: "DIB header", detail: "Width, height, bit depth, compression method", width: 18 },
            { label: "Pixel array", detail: "Raw BGR(A) bytes, row by row, bottom-up", width: 62 },
            { label: "Padding", detail: "Each row padded to a 4-byte boundary", width: 8 },
        ],
    },
    {
        id: "webp",
        label: "WEBP",
        mime: "image/webp",
        accent: "#F2A65A",
        compression: "Either lossy (VP8) or lossless (VP8L), encoder's choice",
        transparency: "Full alpha channel, in both lossy and lossless modes",
        typicalSize: "Smaller than PNG and JPEG at equivalent quality — WEBP's main selling point",
        blurb: "WEBP wraps a video codec's still-frame mode in a general-purpose container. That's also why it can do something PNG and JPEG can't on their own: animation, using the same bitstream format as a video keyframe.",
        layout: [
            { label: "RIFF header", detail: "'RIFF' magic bytes, file size, 'WEBP' fourCC", width: 12 },
            { label: "VP8X chunk", detail: "Optional: flags for alpha, animation, ICC profile", width: 14 },
            { label: "VP8 / VP8L bitstream", detail: "The actual encoded pixel data, lossy or lossless", width: 58 },
            { label: "Metadata chunks", detail: "Optional ICCP / EXIF / XMP data", width: 16 },
        ],
    },
    {
        id: "heic",
        label: "HEIC",
        mime: "image/heic",
        accent: "#C792EA",
        compression: "Lossy (HEVC / H.265 intra-frame)",
        transparency: "Supported via a separate alpha tile",
        typicalSize: "Roughly half a JPEG at equivalent quality",
        blurb: "HEIC treats a photo like a single frame of video, reusing the same block-based prediction and entropy coding as H.265 — which is why it compresses so much better than JPEG.",
        layout: [
            { label: "ftyp box", detail: "Identifies the file as HEIF/HEIC", width: 10 },
            { label: "meta box", detail: "Item locations, EXIF, thumbnail references", width: 20 },
            { label: "mdat box", detail: "HEVC-encoded image tile(s)", width: 60 },
            { label: "Alpha tile", detail: "Separate compressed plane for transparency", width: 10 },
        ],
        note: "This exhibit's uploader currently accepts PNG, JPEG, BMP, and WEBP — HEIC isn't decodable by most non-Safari browsers, so this card is reference-only for now.",
    },
];

/**
 * Comparison cards for the four image formats this exhibit teaches.
 * If `image` (a DecodedImage) is passed, the card matching its MIME type
 * is highlighted and shown its real file size instead of the generic blurb.
 */
export default function FormatModule({ image = null }: FormatModuleProps) {
    const [openId, setOpenId] = useState<string | null>(FORMATS[0].id);

    return (
        <section className="w-full py-10">
            <div className="flex flex-wrap justify-center gap-4">
                {FORMATS.map((fmt) => {
                    const isActive = image?.type === fmt.mime;
                    const isOpen = openId === fmt.id;
                    const isWide = fmt.id === "webp" || fmt.id === "heic";
                    return (
                        <motion.button
                            key={fmt.id}
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : fmt.id)}
                            className={`text-left rounded-xl border bg-[#232323] p-5 transition-shadow focus-visible:outline focus-visible:outline-2 w-full ${
                                isWide
                                    ? "sm:w-[calc(50%-0.5rem)] lg:w-[calc(42%-0.5rem)]"
                                    : "sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
                            }`}
                            style={{
                                borderColor: isActive ? fmt.accent : "#3E4246",
                                outlineColor: fmt.accent,
                                boxShadow: isActive ? `0 0 0 2px ${fmt.accent}33` : "none",
                            }}
                            layout
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: fmt.accent }} />
                                    <h3 className="font-mono text-lg font-semibold tracking-tight text-white">
                                        {fmt.label}
                                    </h3>
                                </div>
                                {isActive && (
                                    <span
                                        className="rounded-full px-2 py-0.5 text-xs font-medium text-[#1a1a1a]"
                                        style={{ background: fmt.accent }}
                                    >
                                        loaded image
                                    </span>
                                )}
                            </div>

                            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-neutral-300">
                                <dt className="text-neutral-500">Compression</dt>
                                <dd>{fmt.compression}</dd>
                                <dt className="text-neutral-500">Transparency</dt>
                                <dd>{fmt.transparency}</dd>
                                <dt className="text-neutral-500">File size</dt>
                                <dd>
                                    {isActive && image?.size != null
                                        ? `${(image.size / 1024).toFixed(1)} KB (this file)`
                                        : fmt.typicalSize}
                                </dd>
                            </dl>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="mt-3 text-sm text-neutral-400 text-justify">{fmt.blurb}</p>

                                        {/* storage layout diagram: proportional stacked bar */}
                                        <div className="mt-4">
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                                                File layout
                                            </p>
                                            <div className="flex h-6 w-full overflow-hidden rounded-md border border-neutral-700">
                                                {fmt.layout.map((seg, i) => (
                                                    <div
                                                        key={i}
                                                        title={seg.label}
                                                        style={{
                                                            width: `${seg.width}%`,
                                                            background: `${fmt.accent}${i % 2 === 0 ? "ff" : "80"}`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <ul className="mt-2 mb-0 pl-0 space-y-0.5 text-xs text-neutral-400 text-justify list-none">
                                                {fmt.layout.map((seg, i) => (
                                                    <li key={i}>
                                                        <span className="font-medium text-neutral-200">{seg.label}:</span>{" "}
                                                        {seg.detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {fmt.note && (
                                            <p className="mt-3 rounded-md bg-amber-400/10 p-2 text-xs text-amber-300">
                                                {fmt.note}
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
}