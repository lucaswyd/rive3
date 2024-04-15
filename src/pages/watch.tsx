import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetch";
import WatchDetails from "@/components/WatchDetails";


const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();
  // console.log(params.get("id"));
  const [type, setType] = useState<string | null>("");
  const [id, setId] = useState<any>();
  const [season, setSeason] = useState<any>();
  const [episode, setEpisode] = useState<any>();
  const [minEpisodes, setMinEpisodes] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(2);
  const [maxSeason, setMaxSeason] = useState(1);
  const [nextSeasonMinEpisodes, setNextSeasonMinEpisodes] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchDetails, setWatchDetails] = useState(false);
  const [data, setdata] = useState<any>();
  const [source, setSource] = useState("SUP");
  const nextBtn: any = useRef(null);
  const backBtn: any = useRef(null);
  if (type === null && params.get("id") !== null) setType(params.get("type"));
  if (id === null && params.get("id") !== null) setId(params.get("id"));
  if (season === null && params.get("season") !== null)
    setSeason(params.get("season"));
  if (episode === null && params.get("episode") !== null)
    setEpisode(params.get("episode"));

  useEffect(() => {
    setLoading(true);
    setType(params.get("type"));
    setId(params.get("id"));
    setSeason(params.get("season"));
    setEpisode(params.get("episode"));
    setContinueWatching({ type: params.get("type"), id: params.get("id") });
    const fetch = async () => {
      const res: any = await axiosFetch({ requestID: `${type}Data`, id: id });
      setdata(res);
      setMaxSeason(res?.number_of_seasons);
      const seasonData = await axiosFetch({
        requestID: `tvEpisodes`,
        id: id,
        season: season,
      });
      setMaxEpisodes(
        seasonData?.episodes[seasonData?.episodes?.length - 1]?.episode_number,
      );
      setMinEpisodes(seasonData?.episodes[0]?.episode_number);
      if (parseInt(episode) >= maxEpisodes - 1) {
        var nextseasonData = await axiosFetch({
          requestID: `tvEpisodes`,
          id: id,
          season: parseInt(season) + 1,
        });
        setNextSeasonMinEpisodes(nextseasonData?.episodes[0]?.episode_number);
      }
    };
    if (type === "tv") fetch();

    const handleKeyDown = (event: any) => {
      if (event.shiftKey && event.key === "N") {
        event.preventDefault();
        nextBtn?.current.click();
        // handleForward();
        // console.log("next");
      } else if (event.shiftKey && event.key === "P") {
        event.preventDefault();
        backBtn?.current.click();
        // handleBackward();
        // console.log("prev");
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [params, id, season, episode]);
  useEffect(() => {
   /* toast.info(
      <div>
         Baixe o nosso APP para o Telemovel, leve o Warez contigo a todo sitio
        { " " }
        <a target="_blank" href="#">
          Download{" "}
        </a>
      </div>,
    );

    toast.info(
      <div>
        Dica: Utilize o AD-Block para tentar bloquear a publicidade dos servidores
        { " " }
        <a target="_blank" href="#">
          AD-Block{" "}
        </a>
      </div>,
    );

    toast.info(
      <div>
        Bem-vindo a versao Beta V2, Consulte no topo superior ao lado direito todos os detalhes, temporadas e episodios do teu conteudo favorito {" "}
        <a target="_blank" href="#">
          {" "}
        </a>{" "}
         {" "}
        <a target="_blank" href="#">
          {" "}
        </a>{" "}
         {" "}
        <a
          target="_blank"
          href="https://play.google.com/store/apps/details?id=videoplayer.videodownloader.downloader"
        >
          {" "}
        </a>{" "}
         {" "}
        <a
          target="_blank"
          href="https://www.reddit.com/r/DataHoarder/comments/qgne3i/how_to_download_videos_from_vidsrcme/"
        >
          {" "}
        </a>
      </div>,
    ); */
    // window.addEventListener("keydown", (event) => {
    //   console.log("Key pressed:", event.key);
    // });
  }, []);
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log({ id });
  //     setLoading(false);
  //   }, 1000);
  // }, [id]);

  // useEffect(() => {
  //   // Override window.open to prevent opening new tabs
  //   window.open = function (url, target, features, replace) {
  //     console.log("window.open is blocked:", url);
  //     return null; // Return null to prevent opening new tabs
  //   };
  // }, [window]);

  function handleBackward() {
    // setEpisode(parseInt(episode)+1);
    if (episode > minEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) - 1}`,
      );
  }
  function handleForward() {
    // setEpisode(parseInt(episode)+1);
    if (episode < maxEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) + 1}`,
      );
    else if (parseInt(season) + 1 <= maxSeason)
      push(
        `/watch?type=tv&id=${id}&season=${parseInt(season) + 1}&episode=${nextSeasonMinEpisodes}`,
      );
  }

  const STREAM_URL_AGG = process.env.NEXT_PUBLIC_STREAM_URL_AGG;
  const STREAM_URL_VID = process.env.NEXT_PUBLIC_STREAM_URL_VID;
  const STREAM_URL_PRO = process.env.NEXT_PUBLIC_STREAM_URL_PRO;
  const STREAM_URL_EMB = process.env.NEXT_PUBLIC_STREAM_URL_EMB;
  const STREAM_URL_MULTI = process.env.NEXT_PUBLIC_STREAM_URL_MULTI;
  const STREAM_URL_SUP = process.env.NEXT_PUBLIC_STREAM_URL_SUP;

  return (
    <div className={styles.watch}>
      <div onClick={() => back()} className={styles.backBtn}>
        <IoReturnDownBack
          data-tooltip-id="tooltip"
          data-tooltip-content="go back"
        />
      </div>
      {
        <div className={styles.episodeControl}>
          {type === "tv" ? (
            <>
              <div
                ref={backBtn}
                onClick={() => {
                  if (episode > 1) handleBackward();
                }}
                data-tooltip-id="tooltip"
                data-tooltip-html={
                  episode > minEpisodes
                    ? "<div>Previous episode <span class='tooltip-btn'>SHIFT + P</span></div>"
                    : `Start of season ${season}`
                }
              >
                <FaBackwardStep
                  className={`${episode <= minEpisodes ? styles.inactive : null}`}
                />
              </div>
              <div
                ref={nextBtn}
                onClick={() => {
                  if (
                    episode < maxEpisodes ||
                    parseInt(season) + 1 <= maxSeason
                  )
                    handleForward();
                }}
                data-tooltip-id="tooltip"
                data-tooltip-html={
                  episode < maxEpisodes
                    ? "<div>Next episode <span class='tooltip-btn'>SHIFT + N</span></div>"
                    : parseInt(season) + 1 <= maxSeason
                      ? `<div>Start season ${parseInt(season) + 1} <span class='tooltip-btn'>SHIFT + N</span></div>`
                      : `End of season ${season}`
                }
              >
                <FaForwardStep
                  className={`${episode >= maxEpisodes && season >= maxSeason ? styles.inactive : null} ${episode >= maxEpisodes && season < maxSeason ? styles.nextSeason : null}`}
                />
              </div>
            </>
          ) : null}
          <div
            onClick={() => setWatchDetails(!watchDetails)}
            data-tooltip-id="tooltip"
            data-tooltip-content="More"
          >
            {watchDetails ? <BsHddStackFill /> : <BsHddStack />}
          </div>
        </div>
      }
      {watchDetails && (
        <WatchDetails
          id={id}
          type={type}
          data={data}
          season={season}
          episode={episode}
          setWatchDetails={setWatchDetails}
        />
      )}
      <select
        name="source"
        id="source"
        className={styles.source}
        value={source}
        onChange={(e) => setSource(e.target.value)}
      >
        <option value="AGG">SERVIDOR  : 6 (SERVIDOR - DUBLADO BR)</option>
        <option value="VID">SERVIDOR : 5 (SERVIDOR -  ANIMES)</option>
        <option value="PRO">SERVIDOR : 4 (Servidor 4 - Com Legenda)</option>
        <option value="EMB">SERVIDOR : 3 (Servidor 3 - com Legendas)</option>
        <option value="MULTI">SERVIDOR : 2 (Servidor 2- Com Legendas)</option>
        <option value="SUP" defaultChecked>
          SERVIDOR : 1 (Servidor 1 - com Legendas)</option>
      </select>
      <div className={`${styles.loader} skeleton`}></div>

      {source === "AGG" && id !== "" && id !== null ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_AGG}/e/${id}`
              : `${STREAM_URL_AGG}/e/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
        ></iframe>
      ) : null}

      {source === "VID" && id !== "" && id !== null ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_VID}/filme/${id}`
              : `${STREAM_URL_VID}/serie/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
        ></iframe>
      ) : null}

      {source === "PRO" && id !== "" && id !== null ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_PRO}/embed/${type}/${id}`
              : `${STREAM_URL_PRO}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
        ></iframe>
      ) : null}

      {source === "EMB" && id !== "" && id !== null ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_EMB}/embed/movie/${id}`
              : `${STREAM_URL_EMB}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
        ></iframe>
      ) : null}

      {source === "MULTI" && id !== "" && id !== null ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_MULTI}/embed/movie?tmdb=${id}`
              : `${STREAM_URL_MULTI}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
        ></iframe>
      ) : null}

      {source === "SUP" && id !== "" && id !== null ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_SUP}/embed/movie/${id}`
              : `${STREAM_URL_SUP}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
        ></iframe>
      ) : null}
    </div>
  );
};

export default Watch;
