import React from "react";
import styles from "@/styles/Settings.module.scss";

interface ThemeButtonsProps {
  mode: string;
  handleSelect: ({ type, value }: { type: string; value: string }) => void;
}

const ThemeButtons: React.FC<ThemeButtonsProps> = ({ mode, handleSelect }) => {
  return (
    <>
      <button
        className={`${mode === "light" ? styles.selected : ""}`}
        onClick={() => handleSelect({ type: "mode", value: "light" })}
      >
        Claro
      </button>
      <button
        className={`${mode === "dark" ? styles.selected : ""}`}
        onClick={() => handleSelect({ type: "mode", value: "dark" })}
      >
        Escuro
      </button>
    </>
  );
};

export default ThemeButtons;
