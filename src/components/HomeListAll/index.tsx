import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetch";
import Skeleton from "react-loading-skeleton";
import MovieCardSmall from "../MovieCardSmall";
import { useInView } from "react-intersection-observer";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getContinueWatching,
  setContinueWatching,
  removeContinueWatching,
  checkContinueWatching,
} from "@/Utils/continueWatching"; // Import the continue watching functions

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const HomeListAll = () => {
  const [latestMovie, setLatestMovie] = useState<any[]>([]);
  const [latestTv, setLatestTv] = useState<any[]>([]);
  const [popularMovie, setPopularMovie] = useState<any[]>([]);
  const [popularTv, setPopularTv] = useState<any[]>([]);
  const [continueWatching, setContinueWatchingList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [latestMovieRef, latestMovieInView] = useInView({
    triggerOnce: true,
  });
  const [latestTvRef, latestTvInView] = useInView({
    triggerOnce: true,
  });
  const [popularMovieRef, popularMovieInView] = useInView({
    triggerOnce: true,
  });
  const [popularTvRef, popularTvInView] = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lM = await axiosFetch({ requestID: "trendingMovie" });
        setLatestMovie(lM.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    if (latestMovieInView) fetchData();
  }, [latestMovieInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lT = await axiosFetch({ requestID: "trendingTvDay" });
        setLatestTv(lT.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (latestTvInView) fetchData();
  }, [latestTvInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pM = await axiosFetch({
          requestID: "popularMovie",
          sortBy: "vote_average.asc",
        });
        setPopularMovie(pM.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (popularMovieInView) fetchData();
  }, [popularMovieInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pT = await axiosFetch({
          requestID: "trendingTv",
          sortBy: "vote_average.asc",
        });
        setPopularTv(pT.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (popularTvInView) fetchData();
  }, [popularTvInView]);

  useEffect(() => {
    const fetchContinueWatchingData = async () => {
      const continueWatchingData = getContinueWatching();
      const continueWatchingMovies = await Promise.all(
        continueWatchingData.movie.map(async (id: number) => {
          const response = await axiosFetch({
            requestID: "movieData",
            id: id.toString(),
          });
          return response;
        }),
      );
      const continueWatchingTv = await Promise.all(
        continueWatchingData.tv.map(async (id: number) => {
          const response = await axiosFetch({
            requestID: "tvData",
            id: id.toString(),
          });
          return response;
        }),
      );
      setContinueWatchingList([
        ...continueWatchingMovies,
        ...continueWatchingTv,
      ]);
    };
    fetchContinueWatchingData();
  }, []);

  const scroll = (index: number, direction: "left" | "right") => {
    const scrollAmount = direction === "left" ? -700 : 700;
    const element = document.querySelectorAll(`.${styles.HomeListSection}`)[
      index
    ];
    if (element) {
      element.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.HomeListAll}>
      <ToastContainer />

      <h1 className={styles.sectionTitle}>
        Continue Assistindo
        <div className={styles.navigation}>
          <MdChevronLeft
            onClick={() => scroll(0, "left")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          <MdChevronRight
            onClick={() => scroll(0, "right")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {continueWatching?.map((ele, index) => (
          <MovieCardSmall key={index} data={ele} media_type={ele.media_type} />
        ))}
        {continueWatching?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>

      <h1 ref={latestMovieRef} className={styles.sectionTitle}>
        Últimos Filmes
        <div className={styles.navigation}>
          <MdChevronLeft
            onClick={() => scroll(1, "left")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          <MdChevronRight
            onClick={() => scroll(1, "right")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {latestMovie?.map((ele) => (
          <MovieCardSmall key={ele.id} data={ele} media_type="movie" />
        ))}
        {latestMovie?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>

      <h1 ref={latestTvRef} className={styles.sectionTitle}>
        Últimas Séries
        <div className={styles.navigation}>
          <MdChevronLeft
            onClick={() => scroll(2, "left")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          <MdChevronRight
            onClick={() => scroll(2, "right")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {latestTv?.map((ele) => (
          <MovieCardSmall key={ele.id} data={ele} media_type="tv" />
        ))}
        {latestTv?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>

      <h1 ref={popularMovieRef} className={styles.sectionTitle}>
        Filmes Populares
        <div className={styles.navigation}>
          <MdChevronLeft
            onClick={() => scroll(3, "left")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          <MdChevronRight
            onClick={() => scroll(3, "right")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {popularMovie?.map((ele) => (
          <MovieCardSmall key={ele.id} data={ele} media_type="movie" />
        ))}
        {popularMovie?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>

      <h1 ref={popularTvRef} className={styles.sectionTitle}>
        Séries Populares
        <div className={styles.navigation}>
          <MdChevronLeft
            onClick={() => scroll(4, "left")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          <MdChevronRight
            onClick={() => scroll(4, "right")}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {popularTv?.map((ele) => (
          <MovieCardSmall key={ele.id} data={ele} media_type="tv" />
        ))}
        {popularTv?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>
    </div>
  );
};

export default HomeListAll;
