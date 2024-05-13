import React, { useState, useEffect } from "react";
import axiosFetch from "@/Utils/fetch";
import styles from "./style.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import Filter from "../Filter";
import Skeleton from "react-loading-skeleton";
import NProgress from "nprogress";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const CategorywisePage = ({ categoryType }) => {
  const [trigger, setTrigger] = useState(false);
  const CapitalCategoryType = capitalizeFirstLetter(categoryType);
  const [category, setCategory] = useState("trending");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [filterGenreList, setFilterGenreList] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let newData;
        if (category === "filter") {
          newData = await axiosFetch({
            requestID: `${category}${CapitalCategoryType}`,
            page: currentPage,
            genreKeywords: filterGenreList,
            country: filterCountry,
            year: filterYear,
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
    };

    fetchData();
  }, [category, currentPage, filterGenreList, filterCountry, filterYear, CapitalCategoryType]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
        currentPage < totalPages &&
        !loading
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, totalPages, loading]);

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
          filterYear={filterYear}
          setCategory={setCategory}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      )}
      <div className={styles.movieList}>
        {data.map((ele, index) => (
          <MovieCardSmall key={index} data={ele} media_type={categoryType} />
        ))}
        {loading && dummyList.map((ele, index) => <Skeleton key={index} className={styles.loading} />)}
      </div>
      <button className={styles.scrollToTopButton} onClick={scrollToTop}>Voltar ao Topo</button>
    </div>
  );
};

export default CategorywisePage;
