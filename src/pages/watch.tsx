import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetchBackend";
import WatchDetails from "@/components/WatchDetails";
import Player from "@/components/Artplayer";

const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();
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
  const [seasondata, setseasonData] = useState<any>();
  const [source, setSource] = useState("WZ");
  const [embedMode, setEmbedMode] = useState<any>();
  const [nonEmbedSourcesIndex, setNonEmbedSourcesIndex] = useState<any>("");
  const [nonEmbedSources, setNonEmbedSources] = useState<any>("");
  const [nonEmbedCaptions, setnonEmbedCaptions] = useState<any>();
  const [nonEmbedVideoProviders, setNonEmbedVideoProviders] = useState([]);
  const [nonEmbedSourcesNotFound, setNonEmbedSourcesNotFound] =
    useState<any>(false);
  const nextBtn: any = useRef(null);
  const backBtn: any = useRef(null);
  const moreBtn: any = useRef(null);

  if (type === null && params.get("id") !== null) setType(params.get("type"));
  if (id === null && params.get("id") !== null) setId(params.get("id"));
  if (season === null && params.get("season") !== null)
    setSeason(params.get("season"));
  if (episode === null && params.get("episode") !== null)
    setEpisode(params.get("episode"));

  useEffect(() => {
    if (
      localStorage.getItem("RiveStreamEmbedMode") !== undefined &&
      localStorage.getItem("RiveStreamEmbedMode") !== null
    )
      setEmbedMode(
        JSON.parse(localStorage.getItem("RiveStreamEmbedMode") || "false"),
      );
    else setEmbedMode(false);
    const latestAgg: any = localStorage.getItem("RiveStreamLatestAgg");
    if (latestAgg !== null && latestAgg !== undefined) setSource(latestAgg);
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
      setseasonData(seasonData);
      seasonData?.episodes?.length > 0 &&
        setMaxEpisodes(
          seasonData?.episodes[seasonData?.episodes?.length - 1]
            ?.episode_number,
        );
      setMinEpisodes(seasonData?.episodes[0]?.episode_number);
      if (parseInt(episode) >= maxEpisodes - 1) {
        var nextseasonData = await axiosFetch({
          requestID: `tvEpisodes`,
          id: id,
          season: parseInt(season) + 1,
        });
        nextseasonData?.episodes?.length > 0 &&
          setNextSeasonMinEpisodes(nextseasonData?.episodes[0]?.episode_number);
      }
    };
    if (type === "tv") fetch();

    const handleKeyDown = (event: any) => {
      if (event.shiftKey && event.key === "N") {
        event.preventDefault();
        if (nextBtn?.current) nextBtn.current.click();
      } else if (event.shiftKey && event.key === "P") {
        event.preventDefault();
        if (backBtn?.current) backBtn.current.click();
      } else if (event.shiftKey && event.key === "M") {
        event.preventDefault();
        if (moreBtn?.current) moreBtn.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [params, id, season, episode]);

  useEffect(() => {
    let autoEmbedMode: NodeJS.Timeout;
    if (embedMode === false && id !== undefined && id !== null) {
      const fetch = async () => {
        const providers: any = await axiosFetch({
          requestID: `VideoProviderServices`,
        });
        setNonEmbedVideoProviders(
          providers?.data?.map((ele: any) => {
            return {
              name: ele,
              status: "available",
            };
          }),
        );
        const res: any = { sources: [], captions: [] };
        for (const ele of providers?.data || []) {
          setNonEmbedVideoProviders((prevProviders: any) =>
            prevProviders.map((provider: any) => {
              if (provider.name === ele) {
                return {
                  ...provider,
                  status: "fetching",
                };
              }
              return provider;
            }),
          );
          try {
            const tempRes: any = await axiosFetch({
              requestID: `${type}VideoProvider`,
              id: id,
              season: season,
              episode: episode,
              service: ele,
            });
            console.log({ tempRes });

            tempRes?.data?.sources?.forEach((source: any) => {
              res.sources.push(source);
            });
            tempRes?.data?.captions?.forEach((caption: any) => {
              res.captions.push(caption);
            });

            setNonEmbedVideoProviders((prevProviders: any) =>
              prevProviders.map((provider: any) => {
                if (provider.name === ele) {
                  return {
                    ...provider,
                    status:
                      tempRes?.data?.sources?.length > 0 ? "success" : "error",
                  };
                }
                return provider;
              }),
            );
          } catch (error) {
            console.error(`Error fetching data for provider ${ele}:`, error);
            setNonEmbedVideoProviders((prevProviders: any) =>
              prevProviders.map((provider: any) => {
                if (provider.name === ele) {
                  return {
                    ...provider,
                    status: "error",
                  };
                }
                return provider;
              }),
            );
          }
        }
        console.log({ res });
        if (res?.sources?.length > 0) {
          setNonEmbedSources(res?.sources);
          res?.sources?.length > 0 ? setNonEmbedSourcesIndex(0) : null;
          setnonEmbedCaptions(res?.captions);
          clearTimeout(autoEmbedMode);
          setNonEmbedSourcesNotFound(false);
        } else {
          setNonEmbedSourcesNotFound(true);
          autoEmbedMode = setTimeout(() => {
            setEmbedMode(true);
          }, 10000);
        }
      };

      fetch();
    }
  }, [params, id, season, episode, embedMode]);

  function handleBackward() {
    if (episode > minEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) - 1}`,
      );
  }
  function handleForward() {
    if (episode < maxEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) + 1}`,
      );
    else if (parseInt(season) + 1 <= maxSeason)
      push(
        `/watch?type=tv&id=${id}&season=${parseInt(season) + 1}&episode=${nextSeasonMinEpisodes}`,
      );
  }

  const handleButtonClick = (value: string) => {
    setSource(value);
  };

  const STREAM_URL_AGG = process.env.NEXT_PUBLIC_STREAM_URL_AGG;
  const STREAM_URL_VID = process.env.NEXT_PUBLIC_STREAM_URL_VID;
  const STREAM_URL_PRO = process.env.NEXT_PUBLIC_STREAM_URL_PRO;
  const STREAM_URL_EMB = process.env.NEXT_PUBLIC_STREAM_URL_EMB;
  const STREAM_URL_MULTI = process.env.NEXT_PUBLIC_STREAM_URL_MULTI;
  const STREAM_URL_SUP = process.env.NEXT_PUBLIC_STREAM_URL_SUP;
  const STREAM_URL_WZ = process.env.NEXT_PUBLIC_STREAM_URL_WZ;

  return (
    <div className={styles.watch}>
      <div onClick={() => back()} className={styles.backBtn}>
        <IoReturnDownBack
          data-tooltip-id="tooltip"
          data-tooltip-content="go back"
        />
      </div>
      <div className={styles.episodeControl}>
        {type === "tv" && (
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
                if (episode < maxEpisodes || parseInt(season) + 1 <= maxSeason)
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
        )}
        <div
          onClick={() => setWatchDetails(!watchDetails)}
          data-tooltip-id="tooltip"
          data-tooltip-content="More"
        >
          {watchDetails ? <BsHddStackFill /> : <BsHddStack />}
        </div>
      </div>
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
      <div className={styles.source}>
        <button
          className={`${styles.sourceButton} ${source === "WZ" ? styles.active : ""}`}
          onClick={() => handleButtonClick("WZ")}
        >
          ADS FREE
        </button>

        <button
          className={`${styles.sourceButton} ${source === "MULTI" ? styles.active : ""}`}
          onClick={() => handleButtonClick("MULTI")}
        >
          SERVIDOR : 1
        </button>
        <button
          className={`${styles.sourceButton} ${source === "SUP" ? styles.active : ""}`}
          onClick={() => handleButtonClick("SUP")}
        >
          SERVIDOR : 2
        </button>
        <button
          className={`${styles.sourceButton} ${source === "EMB" ? styles.active : ""}`}
          onClick={() => handleButtonClick("EMB")}
        >
          SERVIDOR : 3
        </button>
        <button
          className={`${styles.sourceButton} ${source === "PRO" ? styles.active : ""}`}
          onClick={() => handleButtonClick("PRO")}
        >
          SERVIDOR : 4
        </button>
        <button
          className={`${styles.sourceButton} ${source === "VID" ? styles.active : ""}`}
          onClick={() => handleButtonClick("VID")}
        >
          SERVIDOR : 5
        </button>
        <button
          className={`${styles.sourceButton} ${source === "AGG" ? styles.active : ""}`}
          onClick={() => handleButtonClick("AGG")}
        >
          SERVIDOR : 6
        </button>
      </div>

      <div className={`${styles.loader} skeleton`}></div>

      {source === "AGG" && id !== "" && id !== null && (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_AGG}/e/${id}`
              : `${STREAM_URL_AGG}/e/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      )}
      {source === "VID" && id !== "" && id !== null && (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_VID}/filme/tt${id}`
              : `${STREAM_URL_VID}/serie/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      )}
      {source === "PRO" && id !== "" && id !== null && (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_PRO}/embed/${type}/${id}`
              : `${STREAM_URL_PRO}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      )}
      {source === "EMB" && id !== "" && id !== null && (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_EMB}/embed/movie/${id}`
              : `${STREAM_URL_EMB}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      )}
      {source === "MULTI" && id !== "" && id !== null && (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_MULTI}/embed/movie?tmdb=${id}`
              : `${STREAM_URL_MULTI}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      )}
      {source === "SUP" && id !== "" && id !== null && (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_SUP}/embed/movie/${id}`
              : `${STREAM_URL_SUP}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      )}

      {source === "WZ" && id !== "" && id !== null && (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_WZ}/media/tmdb-movie-${id}`
              : seasondata?.episodes?.length > 0
                ? `${STREAM_URL_WZ}/media/tmdb-tv-${id}/${seasondata.id}/${seasondata.episodes[Math.abs(episode - seasondata.episodes[0].episode_number)].id}`
                : `${STREAM_URL_WZ}/media/tmdb-tv-${id}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      )}
    </div>
  );
};

export default Watch;
