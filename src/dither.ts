const FACTOR = 4;

type RGBA = Array<number>;
type Pixels = Uint8ClampedArray<ArrayBuffer>;

function getRGBA(px: number, pixels: ImageDataArray): RGBA {
	const r = pixels[px];
	const g = pixels[px + 1];
	const b = pixels[px + 2];
	const a = pixels[px + 3];

	return [r, g, b, a];
}

function quantizateRGBA(rgba: RGBA): RGBA {
	const [r, g, b, a] = rgba;

	let newR = Math.round((r / 255) * FACTOR) * (255 / FACTOR);
	let newG = Math.round((g / 255) * FACTOR) * (255 / FACTOR);
	let newB = Math.round((b / 255) * FACTOR) * (255 / FACTOR);

	return [newR, newG, newB, a];
}

function setRGBA(pixelIdx: number, pixels: Pixels, rgba: RGBA) {
	const [r, g, b] = rgba;

	pixels[pixelIdx + 0] = r;
	pixels[pixelIdx + 1] = g;
	pixels[pixelIdx + 2] = b;
}

function addRGBA(pxIdx: number, pixels: Pixels, rgbaToAdd: RGBA) {
	const [r, g, b] = rgbaToAdd;

	pixels[pxIdx + 0] += r;
	pixels[pxIdx + 1] += g;
	pixels[pxIdx + 2] += b;
}

function errorQuantizationRGBA(initialRgba: RGBA, quantizatedRgba: RGBA) {
	const errorR = initialRgba[0] - quantizatedRgba[0];
	const errorG = initialRgba[1] - quantizatedRgba[1];
	const errorB = initialRgba[2] - quantizatedRgba[2];

	return [errorR, errorG, errorB];
}

function getIndex(x: number, y: number, width: number) {
	return (x + y * width) * 4;
}

export function dither(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const pixels = imageData.data;

	for (let y = 0; y < imageData.height; y++) {
		for (let x = 0; x < imageData.width; x++) {
			const currentIdx = getIndex(x, y, canvas.width);

			const rgba = getRGBA(currentIdx, pixels);

			const rgbaQuantizated = quantizateRGBA(rgba);

			setRGBA(currentIdx, pixels, rgbaQuantizated);

			const errorRGB = errorQuantizationRGBA(rgba, rgbaQuantizated);

			if (x + 1 < imageData.width) {
				const rightIndex = getIndex(x + 1, y, canvas.width);
				addRGBA(rightIndex, pixels, [
					errorRGB[0] * (7 / 16),
					errorRGB[1] * (7 / 16),
					errorRGB[2] * (7 / 16),
				]);
			}

			if (x - 1 >= 0 && y + 1 < imageData.height) {
				const downLeftIndex = getIndex(x - 1, y + 1, canvas.width);

				addRGBA(downLeftIndex, pixels, [
					errorRGB[0] * (3 / 16),
					errorRGB[1] * (3 / 16),
					errorRGB[2] * (3 / 16),
				]);
			}

			if (y + 1 < imageData.height) {
				const downIndex = getIndex(x, y + 1, canvas.width);
				addRGBA(downIndex, pixels, [
					errorRGB[0] * (5 / 16),
					errorRGB[1] * (5 / 16),
					errorRGB[2] * (5 / 16),
				]);
			}

			if (x + 1 < imageData.width && y + 1 < imageData.height) {
				const downRightIndex = getIndex(x + 1, y + 1, canvas.width);

				addRGBA(downRightIndex, pixels, [
					errorRGB[0] * (1 / 16),
					errorRGB[1] * (1 / 16),
					errorRGB[2] * (1 / 16),
				]);
			}
		}
	}

	context.putImageData(imageData, 0, 0);
}