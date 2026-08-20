// Defined types for image loading and handling
//Decoded Image represents an image that has been loaded and decoded into pixel data,
// along with its metadata.
export interface DecodedImage {
    id: string;
    name: string;
    type: string;
    size: number | null;
    width: number;
    height: number;
    url: string;
    src: "upload" | "sample";
    imageData: ImageData;
    canvas: HTMLCanvasElement;
}

// SampleImage represents a sample image that can be loaded, including its metadata.
export interface SampleImage {
    id: string;
    name: string;
    url: string;
    desc: string;
}

// ImageLoadError represents an error that can occur during image loading,
// with a specific error code and message.
export interface ImageLoadError {
    code:
        | "unsupported_type"
        | "file_too_large"
        | "decode_failed"
        | "network_error";
    mssg: string;
}

// ImageInputProps defines the properties for an image input component,
// including callbacks for successful image load and error handling,
// as well as optional constraints on file size and accepted types.
export interface ImageInputProps {
    onImageLoad: (image: DecodedImage) => void;
    onError?: (error: ImageLoadError) => void;
    maxFileSizeMB?: number;
    acceptedTypes?: string[];
}

// Pixel represents the positional and color values of a pixel
export interface Pixel {
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    a: number;
}
