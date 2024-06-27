import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetch";
import "react-loading-skeleton/dist/skeleton.css";
// import Image from "next/image";
import Carousel from "../Carousel";
import Link from "next/link";
import {
  BsBookmarkPlus,
  BsFillBookmarkCheckFill,
  BsShare,
} from "react-icons/bs";
import { FaInfo, FaPlay, FaStar } from "react-icons/fa";
import {
  setBookmarks,
  checkBookmarks,
  removeBookmarks,
  getBookmarks,
} from "@/Utils/bookmark";
import { navigatorShare } from "@/Utils/share";
import Skeleton from "react-loading-skeleton";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";

const externalImageLoader = ({ src }: { src: string }) =>
  `${process.env.NEXT_PUBLIC_TMBD_IMAGE_URL}${src}`;

const HomeHero = () => {
  const [data, setData] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [user, setUser] = useState<any>();
  const [bookmarkList, setBookmarkList] = useState<any[]>();
  console.log({ index });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axiosFetch({ requestID: "trending" });
        setData(response.results);
        let arr: string[] = [];
        response.results.map((ele: any) => {
          arr.push(process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele.backdrop_path);
        });
        if (arr.length === 0) arr.push("/images/logolmg.svg");
        setImages(arr);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userID = user.uid;
        setUser(userID);
        setLoading(false);
      } else {
        setLoading(true);
      }
    });
  }, []);

  useEffect(() => {
    const check = async () => {
      if (data[index] !== undefined && data[index] !== null) {
        setBookmarked(
          await checkBookmarks({
            userId: user,
            type: data[index].media_type,
            id: data[index].id,
          }),
        );
      }
    };
    if (data?.length > 0) check();
  }, [index, data, user]);

  const handleBookmarkAdd = () => {
    setBookmarks({
      userId: user,
      type: data[index]?.media_type,
      id: data[index].id,
    });
    setBookmarked(!bookmarked);
  };
  const handleBookmarkRemove = () => {
    removeBookmarks({
      userId: user,
      type: data[index]?.media_type,
      id: data[index].id,
    });
    setBookmarked(!bookmarked);
  };
  const handleShare = () => {
    const url = `/detail?type=${data[index].media_type}&id=${data[index].id}`;
    navigatorShare({ text: data[index].title, url: url });
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const releaseDate = new Date(
    data[index]?.release_date || data[index]?.first_air_date,
  );
  const formattedDate = `${releaseDate.getDate()} ${releaseDate.toLocaleString("default", { month: "long" })} ${releaseDate.getFullYear()}`;

  return (
    <div className={styles.HomeHero}>
      <div className={styles.HomeCarousel}>
        {images.length > 0 ? (
          <Carousel
            imageArr={images}
            setIndex={setIndex}
            mobileHeight="60vh"
            desktopHeight="80vh"
            objectFit={"cover"}
          />
        ) : (
          <Skeleton className={styles.CarouselLoading} />
        )}

        <div className={styles.HomeHeroMeta}>
          <h1
            data-tooltip-id="tooltip"
            data-tooltip-content={
              data[index]?.title || data[index]?.name || "name"
            }
          >
            {data[index]?.title || data[index]?.name || <Skeleton />}
          </h1>
          <p className={styles.description}>
            {data[index] ? (
              truncateText(data[index]?.overview, 130)
            ) : (
              <Skeleton count={3} />
            )}
          </p>
          <p className={styles.releaseDate}>
            {data[index] ? formattedDate : <Skeleton width={100} />}
          </p>
          <p className={styles.rating}>
            <FaStar />{" "}
            {data[index]?.vote_average?.toFixed(1) || <Skeleton width={30} />}
          </p>
          <div className={styles.HomeHeroMetaRow2}>
            <p className={styles.type}>
              {data[index] ? (
                data[index].media_type === "movie" ? (
                  "FILME"
                ) : (
                  "SERIE"
                )
              ) : (
                <Skeleton />
              )}
            </p>
            {data[index] ? (
              <>
                <Link
                  className={styles.links}
                  href={`${
                    data[index]?.media_type === "movie"
                      ? `/watch?type=${data[index]?.media_type}&id=${data[index]?.id}`
                      : `/watch?type=${data[index]?.media_type}&id=${data[index]?.id}&season=1&episode=1`
                  }`}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Assistir WZFilme"
                >
                  Assistir <FaPlay />
                </Link>
                <Link
                  className={styles.links}
                  href={`/detail?type=${data[index]?.media_type}&id=${data[index]?.id}`}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Ver mais"
                >
                  {" "}
                  Detalhes{" "}
                </Link>

                {bookmarked ? (
                  <BsFillBookmarkCheckFill
                    className={styles.HomeHeroIcons}
                    onClick={handleBookmarkRemove}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Remover da Watchlist"
                  />
                ) : (
                  <BsBookmarkPlus
                    className={styles.HomeHeroIcons}
                    onClick={handleBookmarkAdd}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Adicionar a Watchlist"
                  />
                )}
                <BsShare
                  className={styles.HomeHeroIcons}
                  onClick={handleShare}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Partilhar"
                />
              </>
            ) : (
              <div>
                <Skeleton width={200} count={1} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
