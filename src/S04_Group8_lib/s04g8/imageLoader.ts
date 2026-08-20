import type { DecodedImage, SampleImage, ImageLoadError } from "./types.ts";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/bmp", "image/webp"];
const MAX_SIZE_MB = 10;

/**
 * Existing images that can be loaded into the exhibit without uploading.
 * @type {SampleImage[]}
 */
export const SAMPLE_IMAGES: SampleImage[] = [
    //TODO: replace with sample images
    {
        id: "1",
        name: "Sample 1",
        desc: "Photo of a cat",
        url: "https://images.unsplash.com/photo-1553181001-f9cf6c45afca?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "2",
        name: "Sample 2",
        desc: "Photo of a mountain",
        url: "https://images.unsplash.com/photo-1599385549907-a8a47fb6e402?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

/**
 * Converts a File object into a DecodedImage, which contains the raw pixel data and other metadata.
 *
 * @param {File} file
 * @param {Partial<{ maxSizeMB: number, acceptedTypes: string[] }>} [options]
 * @returns {Promise<DecodedImage>}
 * @throws {ImageLoadError}
 */
export async function loadImage(
    file: File,
    options: Partial<{ maxSizeMB: number; acceptedTypes: string[] }> = {}
): Promise<DecodedImage> {
    const maxSizeMB = options.maxSizeMB ?? MAX_SIZE_MB;
    const acceptedTypes = options.acceptedTypes ?? ACCEPTED_TYPES;

    //error handling for unsupported file types and file size limit
    if (!acceptedTypes.includes(file.type)) {
        throw /** @type {ImageLoadError} */ {
            code: "unsupported_type",
            mssg: `Please upload one of: ${acceptedTypes.join(", ")}.`,
        };
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
        throw /** @type {ImageLoadError} */ {
            code: "file_too_large",
            mssg: `"${file.name}" exceeds the ${maxSizeMB}MB limit.`,
        };
    }

    const url = await toURL(file);

    try {
        const { canvas, imageData, width, height } = await toCanvas(url);
        return {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type,
            size: file.size,
            width,
            height,
            url,
            src: "upload",
            imageData,
            canvas,
        };
    } catch (err) {
        throw /** @type {ImageLoadError} */ {
            code: "decode_failed",
            mssg: `Could not decode "${file.name}". The file may be corrupted.`,
        };
    }
}

/**
 * Converts a sample image metadata object into a DecodedImage, which contains the raw pixel data and other metadata.
 *
 * @param {SampleImage} sample
 * @returns {Promise<DecodedImage>}
 * @throws {ImageLoadError}
 */
export async function loadSample(sample: SampleImage): Promise<DecodedImage> {
    try {
        const { canvas, imageData, width, height } = await toCanvas(sample.url);
        return {
            id: crypto.randomUUID(),
            name: sample.name,
            type: inferType(sample.url),
            size: null,
            width,
            height,
            url: sample.url,
            src: "sample",
            imageData,
            canvas,
        };
    } catch (err) {
        throw /** @type {ImageLoadError} */ {
            code: "network_error",
            mssg: `Could not load sample image "${sample.name}".`,
        };
    }
}

//Helpers below this line

/** @param {File} file @returns {Promise<string>} */
function toURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

/**
 * image to canvas conversion helper
 *
 * @param {string} src
 * @returns {Promise<{ canvas: HTMLCanvasElement, imageData: ImageData, width: number, height: number}>}
 */
function toCanvas(src: string): Promise<{
    canvas: HTMLCanvasElement;
    imageData: ImageData;
    width: number;
    height: number;
}> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Context Unavailable"));
            ctx.drawImage(img, 0, 0);
            try {
                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                resolve({
                    canvas,
                    imageData,
                    width: canvas.width,
                    height: canvas.height,
                });
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = reject;
        img.src = src;
    });
}

/** @param {string} url @returns {string} */
function inferType(url: string): string {
    const ext = url.split(".").pop()?.toLowerCase();
    if (!ext) {
        return "application/octet-stream"; // Default MIME type
    }
    return (
        {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            bmp: "image/bmp",
            webp: "image/webp",
        }[ext] ?? "application/octet-stream"
    );
}
