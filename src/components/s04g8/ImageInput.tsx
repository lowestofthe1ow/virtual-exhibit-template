import type { DecodedImage, ImageLoadError } from "../../S04_Group8_lib/s04g8/types.ts";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    loadImage,
    loadSample,
    SAMPLE_IMAGES,
} from "../../S04_Group8_lib/s04g8/imageLoader.ts";
import "../../styles/s04g8/tailwind.css";

interface InputImageProps {
    onImageLoad: (image: DecodedImage) => void;
    onError?: (error: ImageLoadError) => void;
    maxFileSizeMB?: number;
    acceptedTypes?: string[];
    hasImage?: boolean;
}

export default function InputImage({
    onImageLoad,
    onError,
    maxFileSizeMB = 10,
    acceptedTypes = ["image/png", "image/jpeg", "image/bmp", "image/webp, image/heic"],
    hasImage = false,
}: InputImageProps) {
    const [isDecoding, setIsDecoding] = useState(false);
    const [localError, setLocalError] = useState<ImageLoadError | null>(null);
    const [showSamples, setShowSamples] = useState(false);

    const handleError = useCallback(
        (err: ImageLoadError) => {
            setLocalError(err);
            onError?.(err);
        },
        [onError]
    );

    const onDrop = useCallback(
        async (acceptedFiles: File[], rejectedFiles: any[]) => {
            setLocalError(null);

            if (rejectedFiles?.length) {
                handleError({
                    code: "unsupported_type",
                    mssg: `"${rejectedFiles[0].file.name}" isn't a supported image type.`,
                });
                return;
            }

            const file = acceptedFiles[0];
            if (!file) return;

            setIsDecoding(true);
            try {
                const image = await loadImage(file, {
                    maxSizeMB: maxFileSizeMB,
                    acceptedTypes,
                });
                onImageLoad(image);
            } catch (err) {
                handleError(err as ImageLoadError);
            } finally {
                setIsDecoding(false);
            }
        },
        [maxFileSizeMB, acceptedTypes, onImageLoad, handleError]
    );

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        multiple: false,
        accept: Object.fromEntries(
            (
                acceptedTypes ?? [
                    "image/png",
                    "image/jpeg",
                    "image/bmp",
                    "image/webp",
                ]
            ).map((t) => [t, []])
        ),
        noClick: true,
    });

    async function handleSampleClick(sample: (typeof SAMPLE_IMAGES)[number]) {
        setLocalError(null);
        setIsDecoding(true);
        try {
            const image = await loadSample(sample);
            onImageLoad(image);
        } catch (err) {
            handleError(err as ImageLoadError);
        } finally {
            setIsDecoding(false);
        }
    }

    const uploadLabel = isDecoding
        ? "Decoding…"
        : hasImage
        ? "Change Image"
        : "Upload Image";

    return (
        <div>
            <div
                {...getRootProps()}
                className="flex flex-col items-center gap-4"
            >
                <input {...getInputProps()} />

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={open}
                        disabled={isDecoding}
                        title="PNG, JPG/JPEG, BMP, HEIC"
                        className="px-8 py-3 rounded-lg border-none bg-[#71C6FF] text-[#292929] text-base font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {uploadLabel}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowSamples(!showSamples)}
                        disabled={isDecoding}
                        className="px-8 py-3 rounded-lg border border-white bg-[#292929] text-white text-base font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Pick Sample Photo
                    </button>
                </div>

                {showSamples && (
                    <div className="flex gap-2 flex-wrap justify-center">
                        {SAMPLE_IMAGES.map((sample) => (
                            <button
                                key={sample.id}
                                type="button"
                                onClick={() => handleSampleClick(sample)}
                                disabled={isDecoding}
                                title={sample.desc}
                                className="px-4 py-2 rounded-md border border-[#555] bg-[#333] text-white text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {sample.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {localError && (
                <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 mt-3">
                    <span>{localError.mssg}</span>
                </div>
            )}
        </div>
    );
}
