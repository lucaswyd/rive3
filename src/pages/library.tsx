import { useState, useEffect } from "react";
import axiosFetch from "@/Utils/fetch";
import styles from "@/styles/Library.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import ReactPaginate from "react-paginate"; // for pagination
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { getBookmarks, removeBookmarks } from "@/Utils/bookmark";
import {
  getContinueWatching,
  removeContinueWatching,
} from "@/Utils/continueWatching";
import { BsFillBookmarkXFill } from "react-icons/bs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import NProgress from "nprogress";
import { useQuery, useQueryClient } from "react-query";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const Library = () => {
  const [category, setCategory] = useState("watchlist"); // latest, trending, topRated
  const [subCategory, setSubCategory] = useState("movie");
  const [ids, setIds] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const queryClient = useQueryClient();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userID = user.uid;
        setUser(userID);
      } else {
        setUser(null);
      }
    });
  }, []);

  const fetchData = async (ids: any[], subCategory: string) => {
    let arr: any = [];
    try {
      const promises = ids.map((id) =>
        axiosFetch({
          requestID: `${subCategory}Data`,
          id,
        }),
      );
      const results = await Promise.all(promises);
      arr = results.filter((data) => data !== undefined);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return arr;
  };

  const { data, isLoading } = useQuery(
    ["movieData", ids, subCategory],
    () => fetchData(ids, subCategory),
    {
      enabled: ids.length > 0,
    },
  );

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (category === "watchlist") {
        if (user !== null) {
          const res = await getBookmarks(user);
          setIds(subCategory === "movie" ? res?.movie || [] : res?.tv || []);
        }
      } else if (category === "continueWatching") {
        setIds(
          subCategory === "movie"
            ? getContinueWatching()?.movie || []
            : getContinueWatching()?.tv || [],
        );
      }
    };
    fetchBookmarks();
  }, [category, subCategory, user]);

  const handleWatchlistRemove = async ({ type, id }: any) => {
    if (user !== null) {
      await removeBookmarks({ userId: user, type, id });
    } else {
      removeBookmarks({ userId: null, type, id });
    }
    queryClient.invalidateQueries("movieData");
  };

  return (
    <div className={styles.MoviePage}>
      <h1>Biblioteca</h1>
      <div className={styles.category}>
        <p
          className={`${category === "watchlist" ? styles.active : styles.inactive}`}
          onClick={() => setCategory("watchlist")}
        >
          Favoritos
        </p>
        <p
          className={`${category === "continueWatching" ? styles.active : styles.inactive}`}
          onClick={() => setCategory("continueWatching")}
        >
          Continuar Assistindo
        </p>
      </div>
      <div className={styles.category}>
        <p
          className={`${subCategory === "movie" ? styles.active : styles.inactive}`}
          onClick={() => setSubCategory("movie")}
        >
          Filme
        </p>
        <p
          className={`${subCategory === "tv" ? styles.active : styles.inactive}`}
          onClick={() => setSubCategory("tv")}
        >
          Series
        </p>
      </div>

      <div className={styles.movieList}>
        {!isLoading && data?.length > 0 && ids.length > 0 ? (
          data.map((ele: any) => {
            if (category === "watchlist") {
              return (
                <div className={styles.watchlistItems}>
                  <MovieCardSmall data={ele} media_type={subCategory} />
                  <BsFillBookmarkXFill
                    className={styles.bookmarkIcon}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Remove from Watchlist"
                    onClick={() =>
                      handleWatchlistRemove({ type: subCategory, id: ele?.id })
                    }
                  />
                </div>
              );
            } else {
              return <MovieCardSmall data={ele} media_type={subCategory} />;
            }
          })
        ) : ids.length === 0 ? (
          <p>A sua lista esta vazia, adicione o seu conteudo favorito!</p>
        ) : (
          dummyList.map((ele) => <Skeleton className={styles.loading} />)
        )}
      </div>
    </div>
  );
};

export default Library;
