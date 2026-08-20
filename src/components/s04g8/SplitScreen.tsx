import type { DecodedImage } from "../../S04_Group8_lib/s04g8/types.ts";
import RegionSelector from "./RegionSelector.tsx";
import { useState, useMemo, useCallback, useEffect } from "react";
import PixelGrid from "./PixelGrid.tsx";
import { type Pixel } from "../../S04_Group8_lib/s04g8/types.ts";
import MemoryVisualization from "./MemoryVisualization.tsx";
import MathVisualizer from "./MathVisualizer.jsx";
import PipelineVisualizer from "./PipelineVisualizer.jsx";

interface SplitScreenProps {
    currentImage: DecodedImage | null;
    processedImageData: ImageData | null;
    activeTab: string;
    operationParams: { brightness: number; scale: number; rotate: number };
    parentHoveredPixel: (data: Pixel | null) => void;
    parentOriginalPixels: (data: ImageData | null) => void;
    parentProcessedPixels: (data: ImageData | null) => void;
}

function imageDataToUrl(data: ImageData): string {
    const c = document.createElement("canvas");
    c.width = data.width;
    c.height = data.height;
    const ctx = c.getContext("2d");
    if (!ctx) return "";
    ctx.putImageData(data, 0, 0);
    return c.toDataURL();
}

export default function SplitScreen({
    currentImage,
    processedImageData,
    parentHoveredPixel,
    parentOriginalPixels,
    parentProcessedPixels,
}: SplitScreenProps) {
    const [pixels, setPixels] = useState<ImageData | null>(null);
    const [hoveredPixel, setHoveredPixel] = useState<Pixel | null>(null);
    const [originalPixels, setOriginalPixels] = useState<ImageData | null>(
        null,
    );
    const [processedPixels, setProcessedPixels] = useState<ImageData | null>(
        null,
    );

    const processedImageUrl = useMemo(() => {
        if (!processedImageData) return null;
        return imageDataToUrl(processedImageData);
    }, [processedImageData]);

    useEffect(() => {
        parentHoveredPixel(hoveredPixel);
    }, [hoveredPixel]);

    useEffect(() => {
        setOriginalPixels(null);
        setProcessedPixels(null);
        parentOriginalPixels(null);
        parentProcessedPixels(null);
    }, [currentImage?.id]);

    const handlePixelsChange = useCallback(
        (data: ImageData | null) => {
            setPixels(data);
            if (processedImageData) {
                setProcessedPixels(data);
                parentProcessedPixels(data);
            } else {
                setOriginalPixels(data);
                parentProcessedPixels(data);
            }
        },
        [processedImageData],
    );

    const imageUrl = processedImageUrl || currentImage?.url || "";

    return (
        <div className="p-6 text-white max-h-screen max-w-full overflow-x-hidden items-center flex flex-col gap-6">
            <div
                id="top-panels"
                className="w-full max-w-5xl flex flex-col md:flex-row items-start justify-center gap-6"
            >
                <div
                    id="image-panel"
                    className="relative aspect-square w-full md:w-[400px] shrink-0 overflow-hidden rounded-lg bg-neutral-950"
                >
                    {currentImage ? (
                        <RegionSelector
                            imageUrl={imageUrl}
                            onPixelsChange={handlePixelsChange}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-400">
                            No image loaded
                        </div>
                    )}
                </div>

                <div id="pixel-grid-panel">
                    <PixelGrid
                        pixelData={pixels}
                        onPixelChange={setHoveredPixel}
                    ></PixelGrid>
                </div>
            </div>
        </div>
    );
}
