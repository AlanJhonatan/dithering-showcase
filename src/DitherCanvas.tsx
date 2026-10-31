import { useEffect } from "react";

interface DitherCanvasProps {
	canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function DitherCanvas(props: DitherCanvasProps) {
	const { canvasRef } = props;

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		console.log("handling canvas", ctx);
	}, [canvasRef]);

	return (
		<div>
			<canvas ref={canvasRef} width={800} height={600} style={{ border: "1px solid black" }} />
		</div>
	);
}