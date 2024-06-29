import React, { ChangeEvent } from "react";
import styles from "@/styles/Settings.module.scss";

interface Colors {
  ascent_color: string;
  bg_color: string;
  bg_gradient: string;
  primary_1: string;
  primary_2: string;
  primary_3: string;
  primary_4: string;
  watchPageBtn: string;
}

interface ColorPickerProps {
  label: string;
  color: string;
  colorName: keyof Colors;
  handleColorChange: (
    e: ChangeEvent<HTMLInputElement>,
    colorName: keyof Colors,
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
