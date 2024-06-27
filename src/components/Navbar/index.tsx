import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import DownloadButton from "@/pages/DownloadButton";
import {
  AiFillHome,
  AiOutlineHome,
  AiFillPlayCircle,
  AiOutlinePlayCircle,
} from "react-icons/ai";
import {
  IoHome,
  IoLibrary,
  IoLibraryOutline,
  IoSettings,
  IoSettingsOutline,
  IoSearchOutline,
  IoSearch,
  IoChatboxOutline,
  IoFootball,
} from "react-icons/io5";
import {
  PiTelevisionFill,
  PiTelevisionLight,
  PiMonitorLight,
  PiMonitorPlayFill,
} from "react-icons/pi";
import { usePathname, useSearchParams } from "next/navigation";
import {
  MdLocalMovies,
  MdOutlineLocalMovies,
  MdOutlineSettingsSuggest,
  MdSettings,
} from "react-icons/md";
import { IoIosFootball } from "react-icons/io";
import { TbPlayFootball } from "react-icons/tb";

const Navbar = ({ children }: any) => {
  const path = usePathname();
  const params = useSearchParams();
  // const query=
  const [pathname, setPathname] = useState(path);
  useEffect(() => {
    if (params.get("type") !== null) setPathname("/" + params.get("type"));
    else setPathname(path);
    console.log(params.get("type"));
  }, [path, params]);
  return (
    <div className={styles.navbar}>
      <Link
        href="/"
        aria-label="Home"
        data-tooltip-id="tooltip"
        data-tooltip-content="Inicio"
      >
        {pathname === "/" ? (
          <IoHome className={styles.active} />
        ) : (
          <AiOutlineHome className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/search"
        aria-label="Search"
        data-tooltip-id="tooltip"
        data-tooltip-html="<div>Pesquisar <span class='tooltip-btn'>CTRL + K</span></div>"
      >
        {pathname === "/search" ? (
          <IoSearch className={styles.active} />
        ) : (
          <IoSearchOutline className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/movie"
        aria-label="Movies"
        data-tooltip-id="tooltip"
        data-tooltip-content="Filmes"
      >
        {pathname === "/movie" ? (
          <MdLocalMovies className={styles.active} />
        ) : (
          <MdOutlineLocalMovies className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/tv"
        aria-label="Tv shows"
        data-tooltip-id="tooltip"
        data-tooltip-content="TV Series"
      >
        {pathname === "/tv" ? (
          <PiMonitorPlayFill className={styles.active} />
        ) : (
          <PiMonitorLight className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/futebol"
        arial-label="futebol"
        data-tooltip-id="tooltip"
        data-tooltip-content="Futebol"
      >
        {/* Usando o ícone de futebol */}
        {pathname === "/futebol" ? (
          <IoIosFootball className={styles.active} />
        ) : (
          <TbPlayFootball className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/televisao"
        arial-label="televisao"
        data-tooltip-id="tooltip"
        data-tooltip-content="Televisao"
      >
        {/* Usando o ícone de futebol */}
        {pathname === "/televisao" ? (
          <PiTelevisionFill className={styles.active} />
        ) : (
          <PiTelevisionLight className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/library"
        aria-label="Library"
        data-tooltip-id="tooltip"
        data-tooltip-content="WatchList"
      >
        {pathname === "/library" ? (
          <IoLibrary className={styles.active} />
        ) : (
          <IoLibraryOutline className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/settings"
        aria-label="Settings"
        data-tooltip-id="tooltip"
        data-tooltip-content="Settings"
      >
        {pathname === "/settings" ||
        pathname === "/signup" ||
        pathname === "/login" ? (
          <MdSettings className={styles.active} />
        ) : (
          <MdOutlineSettingsSuggest className={styles.inactive} />
        )}
      </Link>

      <Link
        href="/comentarios"
        arial-label="comentarios"
        data-tooltip-id="tooltip"
        data-tooltip-content="Comentarios"
      >
        {/* Adicionando classes active e inactive para o link "comentarios" */}
        {pathname === "/comentarios" ? (
          <IoChatboxOutline className={styles.active} />
        ) : (
          <IoChatboxOutline className={styles.inactive} />
        )}
      </Link>
    </div>
  );
};

export default Navbar;
