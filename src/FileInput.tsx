import { useState } from "react";
import { dither } from "./dither";
import { showImageInfos } from "./imageInfos";

interface FileInputProps {
	canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function FileInput(props: FileInputProps) {
	const { canvasRef } = props;

	const [isDragging, setIsDragging] = useState<boolean>(false);

	function handleDragOver(event) {
		// prevents opening dragged file on new tab.
		event.preventDefault();

		setIsDragging(true);
	}

	function handleDragLeave(event) {
		// event.preventDefault()
		setIsDragging(false);
	}

	async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();

		setIsDragging(false);

		const file = event.dataTransfer?.files[0];

		if (!file) {
			console.log("An problem occurred with the dropped file.");
		}

		await drawBlob(file);
	}

	async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		event.preventDefault();

		const file = event.target.files[0];

		await drawBlob(file);
	}

	async function drawBlob(file: File | null) {
		if (!file) {
			console.log("no available image uploaded.");
			return;
		}

		const isImage = file.type.startsWith("image/");

		if (!isImage) {
			console.log("incorret file format.");
			return;
		}

		const imgBitmap = await createImageBitmap(file);

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		canvas.width = imgBitmap.width;
		canvas.height = imgBitmap.height;

		ctx.drawImage(imgBitmap, 0, 0);

		showImageInfos(imgBitmap);
		dither(canvas, ctx);
	}

	return (
		<div
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			style={{
				width: "100%",
				maxWidth: "600px",
				height: "150px",
				border: isDragging ? "3px dashed #0070f3" : "2px dashed #ccc",
				borderRadius: "12px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: isDragging ? "#f0f7ff" : "#fafafa",
				transition: "all 0.2s ease",
				cursor: "pointer",
			}}
			onClick={() => document.getElementById("fileInput").click()}
		>
			<p style={{ margin: 0, fontWeight: "bold" }}>
				{isDragging ? "Solte a imagem aqui!" : "Arraste e solte uma imagem aqui"}
			</p>
			<span style={{ fontSize: "14px", color: "#666" }}>ou clique para selecionar</span>

			<input
				id="fileInput"
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				style={{ display: "none" }}
			/>
		</div>
	);
}