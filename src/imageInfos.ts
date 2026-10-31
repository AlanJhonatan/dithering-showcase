export function showImageInfos(bitmap: ImageBitmap) {
	const div = document.createElement("div");

	const sizeInfos = `width: ${bitmap.width}, height: ${bitmap.height}`;
	const pixelInfos = `pixels: ${bitmap.width * bitmap.height}`;

	div.textContent = `${sizeInfos}, ${pixelInfos}`;

	document.body.append(div);
}