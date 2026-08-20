export function grayscale(imageData) {
    const data = new Uint8ClampedArray(imageData.data);
    const out = new ImageData(data, imageData.width, imageData.height);

    for (let i = 0; i < out.data.length; i += 4) {
        const r = out.data[i];
        const g = out.data[i + 1];
        const b = out.data[i + 2];
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        out.data[i] = gray;
        out.data[i + 1] = gray;
        out.data[i + 2] = gray;
    }

    return out;
}

export function brightness(imageData, delta) {
    const data = new Uint8ClampedArray(imageData.data);
    const out = new ImageData(data, imageData.width, imageData.height);

    for (let i = 0; i < out.data.length; i += 4) {
        out.data[i] = Math.min(255, Math.max(0, out.data[i] + delta));
        out.data[i + 1] = Math.min(255, Math.max(0, out.data[i + 1] + delta));
        out.data[i + 2] = Math.min(255, Math.max(0, out.data[i + 2] + delta));
    }

    return out;
}

export function invert(imageData) {
    const data = new Uint8ClampedArray(imageData.data);
    const out = new ImageData(data, imageData.width, imageData.height);

    for (let i = 0; i < out.data.length; i += 4) {
        out.data[i] = 255 - out.data[i];
        out.data[i + 1] = 255 - out.data[i + 1];
        out.data[i + 2] = 255 - out.data[i + 2];
    }

    return out;
}

export function scale(imageData, sx, sy) {
    const srcW = imageData.width;
    const srcH = imageData.height;
    const dstW = Math.max(1, Math.round(srcW * sx));
    const dstH = Math.max(1, Math.round(srcH * sy));

    const canvas = document.createElement("canvas");
    canvas.width = dstW;
    canvas.height = dstH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return imageData;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = srcW;
    tempCanvas.height = srcH;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return imageData;
    tempCtx.putImageData(imageData, 0, 0);

    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(tempCanvas, 0, 0, dstW, dstH);

    return ctx.getImageData(0, 0, dstW, dstH);
}

export function rotate(imageData, deg) {
    const rad = (deg * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const srcW = imageData.width;
    const srcH = imageData.height;
    const dstW = Math.max(1, Math.round(srcW * cos + srcH * sin));
    const dstH = Math.max(1, Math.round(srcW * sin + srcH * cos));

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = srcW;
    tempCanvas.height = srcH;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return imageData;
    tempCtx.putImageData(imageData, 0, 0);

    const canvas = document.createElement("canvas");
    canvas.width = dstW;
    canvas.height = dstH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return imageData;

    ctx.translate(dstW / 2, dstH / 2);
    ctx.rotate(rad);
    ctx.drawImage(tempCanvas, -srcW / 2, -srcH / 2);

    return ctx.getImageData(0, 0, dstW, dstH);
}

function clamp(v) {
    return Math.max(0, Math.min(255, Math.round(v)));
}

export function channelIsolate(imageData, channel) {
    const data = new Uint8ClampedArray(imageData.data);
    const out = new ImageData(data, imageData.width, imageData.height);
    const idx = { r: 0, g: 1, b: 2 }[channel];

    for (let i = 0; i < out.data.length; i += 4) {
        const val = out.data[i + idx];
        out.data[i] = channel === "r" ? val : 0;
        out.data[i + 1] = channel === "g" ? val : 0;
        out.data[i + 2] = channel === "b" ? val : 0;
    }

    return out;
}

export function sepia(imageData) {
    const data = new Uint8ClampedArray(imageData.data);
    const out = new ImageData(data, imageData.width, imageData.height);

    for (let i = 0; i < out.data.length; i += 4) {
        const r = out.data[i];
        const g = out.data[i + 1];
        const b = out.data[i + 2];
        out.data[i] = clamp(0.393 * r + 0.769 * g + 0.189 * b);
        out.data[i + 1] = clamp(0.349 * r + 0.686 * g + 0.168 * b);
        out.data[i + 2] = clamp(0.272 * r + 0.534 * g + 0.131 * b);
    }

    return out;
}

export function colorTint(imageData, rMul, gMul, bMul) {
    const data = new Uint8ClampedArray(imageData.data);
    const out = new ImageData(data, imageData.width, imageData.height);

    for (let i = 0; i < out.data.length; i += 4) {
        out.data[i] = clamp(out.data[i] * rMul);
        out.data[i + 1] = clamp(out.data[i + 1] * gMul);
        out.data[i + 2] = clamp(out.data[i + 2] * bMul);
    }

    return out;
}
