import React, { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import Link from "next/link";
import { FaGithub, FaGlobe } from "react-icons/fa";
import { getSettings, setSettings } from "@/Utils/settings";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { logoutUser } from "@/Utils/firebaseUser";
import { ChromePicker } from "react-color"; // Importa o componente de seleção de cores

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
        <p>
Alo Comunidade,

Foram adicionadas atualizações significativas. Estamos a trabalhar para resolver a incompatibilidade com o botão de download em alguns dispositivos iOS. É importante notar que o site utiliza APIs e lista todo o conteúdo disponível no TMDb. Alguns conteúdos podem não ter links disponíveis nos servidores. Além disso, estamos a trabalhar para filtrar corretamente a API
        </p>
      </div>
      <div className={styles.settings}>
        <h1>Conta</h1>
        {user ? (
          <div className={styles.group}>
            <>
              <p className={styles.logout} onClick={() => logoutUser()}>
                Sair
              </p>
            </>
            <h4 className={styles.profileCard}>Ola, essa e a V2 Beta Wztuga!</h4>
          </div>
        ) : (
          <div className={styles.group}>
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
            <h4 className={styles.profileCard}>Faça login para sincronizar com a nuvem</h4>
          </div>
        )}
        <h1>Aparencia</h1>
        <div className={styles.group}>
          <div>
            <label htmlFor="mode">Modo</label>
            <select
              name="mode"
              id="mode"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                handleSelect({ type: "mode", value: e.target.value });
              }}
            >
              <option value="system" defaultChecked>
                Escolha um modo
              </option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label htmlFor="ascent">Cores secundarias </label>
            <ChromePicker
              color={ascent_color}
              onChange={(color) => {
                setAscent_color(color.hex);
                handleSelect({ type: "ascent_color", value: color.hex });
              }}
            />
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
          <Link href="mailto:geral@webproject.pt">
            Envie-nos a sua opniao
          </Link>
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
