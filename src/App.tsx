import React, { useState } from "react";
import ColorDropper from "./components/ColorDropper";
import colorPickerIcon from "./assets/IconColorPicker.svg";
import "./App.css";

const App: React.FC = () => {
	const [color, setColor] = useState<string>("");
	const [isDropperActive, setIsDropperActive] = useState<boolean>(false);

	const handleButtonClick = () => {
		setIsDropperActive(true);
	};

	return (
		<div className="App">
			<header className="header">
				<button
					id="colorDropperButton"
					className="activate-button"
					onClick={handleButtonClick}
				>
					<img src={colorPickerIcon} alt="Activate Color Dropper" />
				</button>
				{!isDropperActive && (
					<p className="current-color">
						Color: <span>{color}</span>
						<div
							style={{
								backgroundColor: color,
								width: "50px",
								height: "20px",
							}}
						></div>
					</p>
				)}
			</header>
			<div className="container">
				<main className="main-content">
					<ColorDropper
						setColor={setColor}
						setIsDropperActive={setIsDropperActive}
						isDropperActive={isDropperActive}
					/>
				</main>
			</div>
		</div>
	);
};

export default App;
