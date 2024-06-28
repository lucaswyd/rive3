import React, { useState, useEffect, useCallback, useMemo } from "react";
import axiosFetch from "@/Utils/fetch";
import styles from "./style.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import Filter from "../Filter";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const dummyList = Array.from({ length: 10 }, (_, i) => i + 1);

interface CategorywisePageProps {
  categoryType: string;
}

const CategorywisePage: React.FC<CategorywisePageProps> = ({
  categoryType,
}) => {
  const CapitalCategoryType = useMemo(
    () => capitalizeFirstLetter(categoryType),
    [categoryType],
  );

  const [category, setCategory] = useState<string>("trending");
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterGenreList, setFilterGenreList] = useState<string>("");
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [trigger, setTrigger] = useState<boolean>(false);

  const fetchData = useCallback(
    debounce(async (page: number, reset = false) => {
      setLoading(true);
      try {
        const params = {
          requestID: `${category}${CapitalCategoryType}`,
          page,
          sortBy: "popularity.desc",
          genreKeywords: category === "filter" ? filterGenreList : undefined,
          country: category === "filter" ? filterCountry : undefined,
          year:
            category === "filter" && filterYear !== null
              ? filterYear
              : undefined,
        };

        const newData = await axiosFetch(params);

        if (reset) {
          setData(newData.results);
        } else {
          setData((prevData) => [...prevData, ...newData.results]);
        }

        setTotalPages(newData.total_pages);
        setHasMore(page < newData.total_pages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [category, filterGenreList, filterCountry, filterYear, CapitalCategoryType],
  );

  useEffect(() => {
    fetchData(1, true);
  }, [category, filterGenreList, filterCountry, filterYear]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className={styles.MoviePage}>
      <h1>{CapitalCategoryType}</h1>
      <Filter
        categoryType={categoryType}
        setShowFilter={() => {}}
        setFilterYear={setFilterYear}
        setFilterCountry={setFilterCountry}
        setFilterGenreList={setFilterGenreList}
        filterGenreList={filterGenreList}
        filterCountry={filterCountry}
        filterYear={filterYear !== null ? filterYear.toString() : ""}
        setCategory={setCategory}
        trigger={trigger}
        setTrigger={setTrigger}
      />
      <InfiniteScroll
        dataLength={data.length}
        next={() => setCurrentPage((prevPage) => prevPage + 1)}
        hasMore={hasMore}
        loader={<Skeleton className={styles.loading} />}
        endMessage={<p style={{ textAlign: "center" }}>Você chegou ao fim!</p>}
      >
        <div className={styles.movieList}>
          {data.map((ele, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <MovieCardSmall data={ele} media_type={categoryType} />
            </motion.div>
          ))}
          {loading &&
            dummyList.map((ele, index) => (
              <Skeleton key={index} className={styles.loading} />
            ))}
        </div>
      </InfiniteScroll>
      <button className={styles.scrollToTopButton} onClick={scrollToTop}>
        Voltar ao topo
      </button>
    </div>
  );
};

export default React.memo(CategorywisePage);
