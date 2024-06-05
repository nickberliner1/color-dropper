import React, { useRef, useEffect, useState } from "react";
import exampleImage from "../assets/1920x1080-4598441-beach-water-pier-tropical-sky-sea-clouds-island-palm-trees.jpg";
import colorPickerIcon from "../assets/IconColorPicker.svg";
import magnifyingGlassIcon from "../assets/Selected Color.svg";

interface ColorDropperProps {
	setColor: (color: string) => void;
	setIsDropperActive: (isActive: boolean) => void;
	isDropperActive: boolean;
}

const ColorDropper: React.FC<ColorDropperProps> = ({
	setColor,
	setIsDropperActive,
	isDropperActive,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const magnifierCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const magnifierRef = useRef<HTMLDivElement | null>(null);
	const [currentColor, setCurrentColor] = useState<string>("#ffffff");
	const scaleFactor = 1; // Adjust scale factor

	const handleImageLoad = () => {
		const canvas = canvasRef.current;
		const image = new Image();
		image.src = exampleImage;
		image.onload = () => {
			if (canvas) {
				const context = canvas.getContext("2d");
				if (context) {
					canvas.width = window.innerWidth; // Set canvas width
					canvas.height = window.innerHeight; // Set canvas height
					context.drawImage(image, 0, 0, canvas.width, canvas.height);
				}
			}
		};
	};

	useEffect(() => {
		handleImageLoad();
	}, []);

	const handleMouseMove = (event: React.MouseEvent) => {
		if (!isDropperActive) return;

		const canvas = canvasRef.current;
		const magnifierCanvas = magnifierCanvasRef.current;

		if (canvas && magnifierCanvas) {
			const context = canvas.getContext("2d");
			const magnifierContext = magnifierCanvas.getContext("2d");

			if (context && magnifierContext) {
				const rect = canvas.getBoundingClientRect();
				const x = (event.clientX - rect.left) / scaleFactor;
				const y = (event.clientY - rect.top) / scaleFactor;
				const imageData = context.getImageData(x, y, 1, 1).data;
				const [r, g, b] = Array.from(imageData);
				const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b)
					.toString(16)
					.slice(1)}`;
				setCurrentColor(hexColor);

				// Draw magnified section
				const zoom = 3; // Magnification level
				const size = 100; // Size of the magnifier
				const adjustedZoom = zoom * scaleFactor; // Adjust zoom level based on scale factor

				magnifierContext.clearRect(0, 0, size, size);
				magnifierContext.drawImage(
					canvas,
					x - size / (2 * adjustedZoom),
					y - size / (2 * adjustedZoom),
					size / adjustedZoom,
					size / adjustedZoom,
					0,
					0,
					size,
					size
				);

				// Move magnifier
				const magnifier = magnifierRef.current;
				if (magnifier) {
					const magnifierSize = size;
					const canvasRect = canvas.getBoundingClientRect();
					const cursorX = event.clientX - canvasRect.left;
					const cursorY = event.clientY - canvasRect.top;

					magnifier.style.left = `${cursorX - magnifierSize / 2}px`;
					magnifier.style.top = `${cursorY - magnifierSize / 2}px`;

					magnifier.style.borderColor = hexColor;
					magnifier.style.display = "block";
				}
			}
		}
	};

	const handleClick = (event: React.MouseEvent) => {
		if (!isDropperActive) return;

		setColor(currentColor);
		setIsDropperActive(false);
		if (magnifierRef.current) {
			magnifierRef.current.style.display = "none";
		}
	};

	return (
		<div className="color-dropper-container">
			<canvas
				ref={canvasRef}
				onMouseMove={handleMouseMove}
				onClick={handleClick}
				style={{
					width: "100%",
					height: "100%",
					cursor: isDropperActive
						? `url(${colorPickerIcon}), auto`
						: "default",
				}}
			/>
			<div
				ref={magnifierRef}
				className="magnifier-container"
				style={{
					width: "100px",
					height: "100px",
					display: "none",
					borderRadius: "50%",
					border: "7px solid black",
					overflow: "hidden",
					position: "absolute",
					background: `url(${magnifyingGlassIcon}) no-repeat center center`,
					backgroundSize: "cover",
				}}
			>
				<canvas
					ref={magnifierCanvasRef}
					width={100}
					height={100}
					style={{ display: "block" }}
				/>
			</div>
		</div>
	);
};

export default ColorDropper;
