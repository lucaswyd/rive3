import React from "react";
import styles from "./Navbar.module.scss";
import DownloadButton from "../pages/DownloadButton";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.menu}>
        {/* Outros itens do menu, se houver */}
        <DownloadButton />
      </div>
    </nav>
  );
};

export default Navbar;
