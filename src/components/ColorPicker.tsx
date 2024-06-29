import React, { ChangeEvent } from "react";
import styles from "@/styles/Settings.module.scss";

interface ColorPickerProps {
  label: string;
  color: string;
  colorName: string;
  handleColorChange: (
    e: ChangeEvent<HTMLInputElement>,
    colorName: string,
  ) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  color,
  colorName,
  handleColorChange,
}) => {
  return (
    <div className={styles.colorPicker}>
      <label htmlFor={colorName}>{label}</label>
      <input
        type="color"
        id={colorName}
        value={color}
        onChange={(e) => handleColorChange(e, colorName)}
      />
    </div>
  );
};

export default ColorPicker;
