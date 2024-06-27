import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import axiosFetch from "@/Utils/fetch";
import styles from "./style.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import Filter from "../Filter";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "@/pages/InfiniteScroll";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const dummyList = Array.from({ length: 10 }, (_, i) => i + 1);

const CategorywisePage = ({ categoryType }: { categoryType: string }) => {
  const CapitalCategoryType = useMemo(
    () => capitalizeFirstLetter(categoryType),
    [categoryType],
  );
  const [category, setCategory] = useState("trending");
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [filterGenreList, setFilterGenreList] = useState<string>("");
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const fetching = useRef(false);

  const fetchData = useCallback(
    debounce(async () => {
      if (fetching.current) return;
      fetching.current = true;

      const cacheKey = `${category}_${CapitalCategoryType}_${currentPage}_${filterGenreList}_${filterCountry}_${filterYear}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setData((prevData) => [...prevData, ...parsedData.results]);
        setTotalPages(parsedData.total_pages);
        setLoading(false);
        fetching.current = false;
        return;
      }

      try {
        setLoading(true);
        const params = {
          requestID: `${category}${CapitalCategoryType}`,
          page: currentPage,
          sortBy: "popularity.desc",
          genreKeywords: category === "filter" ? filterGenreList : undefined,
          country: category === "filter" ? filterCountry : undefined,
          year:
            category === "filter" && filterYear !== null
              ? filterYear
              : undefined,
        };

        const newData = await axiosFetch(params);
        setData((prevData) => [...prevData, ...newData.results]);
        setTotalPages(newData.total_pages);
        setLoading(false);
        localStorage.setItem(cacheKey, JSON.stringify(newData));
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      } finally {
        fetching.current = false;
      }
    }, 300),
    [
      category,
      currentPage,
      filterGenreList,
      filterCountry,
      filterYear,
      CapitalCategoryType,
    ],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterClick = () => {
    setCurrentPage(1);
    setCategory("filter");
    setShowFilter((prevShowFilter) => !prevShowFilter);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
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
      <div className={styles.category}>
        <p
          className={category === "trending" ? styles.active : styles.inactive}
          onClick={() => setCategory("trending")}
        >
          Tendencias
        </p>
        <p
          className={`${category === "filter" ? styles.active : styles.inactive} ${styles.filter}`}
          onClick={handleFilterClick}
        >
          Filtro{" "}
          {category === "filter" ? (
            <MdFilterAlt className={styles.active} />
          ) : (
            <MdFilterAltOff />
          )}
        </p>
      </div>
      {showFilter && (
        <Filter
          categoryType={categoryType}
          setShowFilter={setShowFilter}
          setFilterYear={setFilterYear}
          setFilterCountry={setFilterCountry}
          setFilterGenreList={setFilterGenreList}
          filterGenreList={filterGenreList}
          filterCountry={filterCountry}
          filterYear={filterYear !== null ? filterYear.toString() : ""}
          setCategory={setCategory}
        />
      )}
      <InfiniteScroll
        loadMore={() => setCurrentPage((prevPage) => prevPage + 1)}
        hasMore={currentPage < totalPages}
        loading={loading}
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
        Carregando mais ....
      </button>
    </div>
  );
};

export default React.memo(CategorywisePage);
