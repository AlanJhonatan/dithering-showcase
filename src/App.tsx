import { useRef } from "react";
import { DitherCanvas } from "./DitherCanvas";
import { FileInput } from "./FileInput";

export function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	return (
		<>
			<DitherCanvas canvasRef={canvasRef} />
			<FileInput canvasRef={canvasRef} />
		</>
	);
}