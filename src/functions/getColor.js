const Canvas = require("canvas");
const blockSize = 5;

function rgbToHex({ r, g, b }) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getColor(imgEl) {
	const canvas = Canvas.createCanvas(800, 800);
	const ctx = canvas.getContext("2d");

	const rgb = { r: 0, g: 0, b: 0 };
	let i = -4;
	let count = 0;

	const height = (canvas.height =
		imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height);

	const width = (canvas.width =
		imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width);

	ctx.drawImage(imgEl, 0, 0);

	const data = ctx.getImageData(0, 0, width, height);
	const length = data.data.length;

	while ((i += blockSize * 4) < length) {
		count++;
		rgb.r += data.data[i];
		rgb.g += data.data[i + 1];
		rgb.b += data.data[i + 2];
	}

	rgb.r = ~~(rgb.r / count);
	rgb.g = ~~(rgb.g / count);
	rgb.b = ~~(rgb.b / count);

	return { rgb, hex: rgbToHex(rgb) };
}

module.exports = getColor;
module.exports.rgbToHex = rgbToHex;
