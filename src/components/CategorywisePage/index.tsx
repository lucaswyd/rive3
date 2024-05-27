import React, { useState, useEffect, useCallback } from "react";
import axiosFetch from "@/Utils/fetch";
import styles from "./style.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import Filter from "../Filter";
import Skeleton from "react-loading-skeleton";
import NProgress from "nprogress";
import InfiniteScroll from "@/pages/InfiniteScroll";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CategorywisePage = ({ categoryType }: { categoryType: string }) => {
  const [trigger, setTrigger] = useState(false);
  const CapitalCategoryType = capitalizeFirstLetter(categoryType);
  const [category, setCategory] = useState("trending");
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [filterGenreList, setFilterGenreList] = useState<string>("");
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let newData;

      if (category === "filter") {
        newData = await axiosFetch({
          requestID: `${category}${CapitalCategoryType}`,
          page: currentPage,
          genreKeywords: filterGenreList,
          country: filterCountry,
          year: filterYear !== null ? filterYear : undefined,
          sortBy: "popularity.desc",
        });
      } else {
        newData = await axiosFetch({
          requestID: `${category}${CapitalCategoryType}`,
          page: currentPage,
        });
      }

      setData((prevData) => [...prevData, ...newData.results]);
      setTotalPages(newData.total_pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [category, currentPage, filterGenreList, filterCountry, filterYear, CapitalCategoryType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterClick = () => {
    setCurrentPage(1);
    setCategory("filter");
    setShowFilter(!showFilter);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className={styles.MoviePage}>
      <h1>{CapitalCategoryType}</h1>
      <div className={styles.category}>
        <p
          className={`${category === "trending" ? styles.active : styles.inactive}`}
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
          trigger={trigger}
          setTrigger={setTrigger}
        />
      )}
      <InfiniteScroll loadMore={() => setCurrentPage((prevPage) => prevPage + 1)} isLoading={loading} hasMore={currentPage < totalPages}>
        <div className={styles.movieList}>
          {data.map((ele, index) => (
            <MovieCardSmall key={index} data={ele} media_type={categoryType} />
          ))}
          {loading && dummyList.map((ele, index) => <Skeleton key={index} className={styles.loading} />)}
        </div>
      </InfiniteScroll>
      <button className={styles.scrollToTopButton} onClick={scrollToTop}>Carregando mais ....</button>
    </div>
  );
};

export default CategorywisePage;
