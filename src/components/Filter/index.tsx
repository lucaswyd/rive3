import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetch";

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface Genre {
  id: string;
  name: string;
}
const countryData: { abbr: string; name: string }[] = [
  { name: "Argentina", abbr: "AR" },
  { name: "Australia", abbr: "AU" },
  { name: "Austria", abbr: "AT" },
  { name: "Belgium", abbr: "BE" },
  { name: "Brazil", abbr: "BR" },
  { name: "Canada", abbr: "CA" },
  { name: "China", abbr: "CN" },
  { name: "France", abbr: "FR" },
  { name: "Germany", abbr: "DE" },
  { name: "India", abbr: "IN" },
  { name: "Italy", abbr: "IT" },
  { name: "Japan", abbr: "JP" },
  { name: "Mexico", abbr: "MX" },
  { name: "Netherlands", abbr: "NL" },
  { name: "Russia", abbr: "RU" },
  { name: "South Korea", abbr: "KR" },
  { name: "Spain", abbr: "ES" },
  { name: "Sweden", abbr: "SE" },
  { name: "Switzerland", abbr: "CH" },
  { name: "Taiwan", abbr: "TW" },
  { name: "United Kingdom", abbr: "UK" },
  { name: "United States", abbr: "US" },
  { name: "Denmark", abbr: "DK" },
  { name: "Norway", abbr: "NO" },
  { name: "Finland", abbr: "FI" },
  { name: "Portugal", abbr: "PT" },
  { name: "Greece", abbr: "GR" },
  { name: "Turkey", abbr: "TR" },
  { name: "Poland", abbr: "PL" },
  { name: "Czech Republic", abbr: "CZ" },
  { name: "Hungary", abbr: "HU" },
  { name: "Ireland", abbr: "IE" },
  { name: "New Zealand", abbr: "NZ" },
  { name: "South Africa", abbr: "ZA" },
  { name: "Egypt", abbr: "EG" },
  { name: "Thailand", abbr: "TH" },
  { name: "Singapore", abbr: "SG" },
  { name: "Malaysia", abbr: "MY" },
  { name: "Philippines", abbr: "PH" },
];

const Filter = ({
  categoryType,
  setShowFilter,
  setFilterYear,
  setFilterCountry,
  setFilterGenreList,
  filterGenreList,
  filterCountry,
  filterYear,
  setCategory,
  trigger,
  setTrigger,
}: {
  categoryType: string;
  setShowFilter: Function;
  setFilterYear: Function;
  setFilterCountry: Function;
  setFilterGenreList: Function;
  filterGenreList: string;
  filterCountry: string;
  filterYear: string | null;
  setCategory: Function;
  trigger: boolean;
  setTrigger: Function;
}) => {
  const CapitalCategoryType = capitalizeFirstLetter(categoryType);
  const [genreData, setGenreData] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosFetch({
          requestID: `genres${CapitalCategoryType}`,
        });
        setGenreData(data.genres);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [CapitalCategoryType]);

  const handleGenreSelect = (id: string) => {
    setFilterGenreList(
      filterGenreList === "" ? id + "," : filterGenreList + id + ","
    );
  };

  const handleCountrySelect = (abbr: string) => {
    setFilterCountry(abbr);
  };

  const handleFilterSubmit = () => {
    setCategory("filter");
    setTrigger(!trigger);
    setShowFilter(false);
  };

  const handleFilterReset = () => {
    setFilterGenreList("");
    setFilterYear(null);
    setFilterCountry("");
  };

  return (
    <div className={styles.Filter}>
      <h1>Filter</h1>
      <h1
        className={styles.close}
        onClick={() => {
          setShowFilter(false);
        }}
      >
        x
      </h1>

      <h2>Genres</h2>
      {genreData.map((ele) => {
        const selectedGenres =
          typeof filterGenreList === "string" ? filterGenreList.split(",") : [];
        const isChecked = selectedGenres.includes(ele.id.toString());
        return (
          <div
            key={ele.id}
            className={`${styles.checkboxDiv} ${
              isChecked ? styles.active : styles.inactive
            }`}
          >
            <label className={"container"} htmlFor={ele.id}>
              {ele.name}
              <input
                type="checkbox"
                id={ele.id}
                name={ele.name}
                value={ele.id}
                onChange={() => handleGenreSelect(ele.id)}
                checked={isChecked}
              />
              <span className={"checkmark"}></span>
            </label>
          </div>
        );
      })}

      <h2>Country</h2>
      {countryData.map((ele) => {
        return (
          <div
            key={ele.abbr}
            className={`${styles.checkboxDiv} ${
              filterCountry === ele.abbr ? styles.active : styles.inactive
            }`}
          >
            <label className={"container"} htmlFor={ele.name}>
              {ele.name}
              <input
                type="checkbox"
                id={ele.name}
                name={ele.name}
                value={ele.name}
                onChange={() => handleCountrySelect(ele.abbr)}
                checked={filterCountry === ele.abbr}
              />
              <span className={"checkmark"}></span>
            </label>
          </div>
        );
      })}

      <h2>Year</h2>
      <input
     type="text"
     id="input"
     name="input"
     value={filterYear || ''}
     onChange={(e) => {
    setFilterYear(e.target.value);
  }}
  placeholder="Enter Year"
/>

      <div className={styles.filterButtons}>
        <div className={styles.filterSubmit} onClick={handleFilterSubmit}>
          Submit
        </div>
        <div className={styles.filterSubmit} onClick={handleFilterReset}>
          Reset
        </div>
      </div>
    </div>
  );
};

export default Filter;