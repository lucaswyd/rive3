import React, { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import Link from "next/link";
import { FaGithub, FaGlobe } from "react-icons/fa";
import { getSettings, setSettings } from "@/Utils/settings";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { logoutUser } from "@/Utils/firebaseUser";

const SettingsPage = ({
  mode,
  theme,
  ascent_color,
  setMode,
  setTheme,
  setAscent_color,
}: any) => {
  const [user, setUser] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // console.log({ user });
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(false);
        setLoading(false);
      }
    });
  }, []);
  const handleSelect = ({ type, value }: any) => {
    const prevVal = { mode, theme, ascent_color };
    if (type === "mode") setSettings({ values: { ...prevVal, mode: value } });
    if (type === "theme") setSettings({ values: { ...prevVal, theme: value } });
    if (type === "ascent_color")
      setSettings({ values: { ...prevVal, ascent_color: value } });
  };
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img src="/images/logolmg.png" alt="logo" />
        <p>Warez é um projeto livre e sem fins lucrativos</p>
      </div>
      <div className={styles.settings}>
        <h1>Conta</h1>
        {user ? (
          <div className={styles.group}>
            <>
              <p className={styles.logout} onClick={() => logoutUser()}>
                Sair
              </p>
              {/* <Link href="/signup">Signup</Link> */}
            </>
            <h4 className={styles.profileCard}>
              Estamos corrigindo as falhas na Cloud da Watchlist
            </h4>
          </div>
        ) : (
          <div className={styles.group}>
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
            <h4 className={styles.profileCard}>
              Faça login para sincronizar com a nuvem
            </h4>
          </div>
        )}
        <h1>Aparencia</h1>
        <div className={styles.group}>
          <div>
            <label htmlFor="mode">Modo</label>
            <div>
              <button
                className={`${mode === "system" ? styles.selected : ""}`}
                onClick={() => {
                  setMode("system");
                  handleSelect({ type: "mode", value: "system" });
                }}
              >
                Sistema
              </button>
              <button
                className={`${mode === "light" ? styles.selected : ""}`}
                onClick={() => {
                  setMode("light");
                  handleSelect({ type: "mode", value: "light" });
                }}
              >
                Claro
              </button>
              <button
                className={`${mode === "dark" ? styles.selected : ""}`}
                onClick={() => {
                  setMode("dark");
                  handleSelect({ type: "mode", value: "dark" });
                }}
              >
                Escuro
              </button>
            </div>
            <label htmlFor="ascent">Cores secundarias </label>
            <select
              name="ascent"
              id="ascent"
              value={ascent_color}
              onChange={(e) => {
                setAscent_color(e.target.value);
                handleSelect({ type: "ascent_color", value: e.target.value });
              }}
            >
              <option value="gold" defaultChecked>
                Gold
              </option>
              <option value="#f44336">Red</option>
              <option value="#e91e63">Pink</option>
              <option value="#9c27b0">Purple</option>
              <option value="#673ab7">Deep Purple</option>
              <option value="#3f51b5">Indigo</option>
              <option value="#2196f3">Blue</option>
              <option value="#03a9f4">Light Blue</option>
              <option value="#00bcd4">Cyan</option>
              <option value="#009688">Teal</option>
              <option value="#4caf50">Green</option>
              <option value="#8bc34a">Light Green</option>
              <option value="#ffeb3b">Yellow</option>
              <option value="#ffc107">Amber</option>
              <option value="#ff9800">Orange</option>
              <option value="#ff5722">Deep Orange</option>
              <option value="#795548">Brown</option>
            </select>
          </div>
        </div>
        <h1>Centro da App</h1>
        <div className={styles.group}>
          <Link
            href="/downloads"
            data-tooltip-id="tooltip"
            data-tooltip-content="Downloads"
          >
            Download App
          </Link>
          <Link href="mailto:geral@webproject.pt">Reportar Erro</Link>
          {/* <Link href="/contact">Contact Us</Link> */}
        </div>
        <h1>Links</h1>
        <div className={styles.group}>
          <Link href={"https://wareztuga.pt"}>
            <FaGlobe /> Wareztuga
          </Link>
          <Link href={"https://wareztuga.pt"}>
            <FaGlobe /> Parceiro
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
