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
      filterGenreList === "" ? id + "," : filterGenreList + id + ",",
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
      <div className={styles.filterRow}>
        <select onChange={(e) => handleGenreSelect(e.target.value)}>
          <option value="">Gênero</option>
          {genreData.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">Ano</option>
          {Array.from(new Array(50), (v, i) => (
            <option key={i} value={2024 - i}>
              {2024 - i}
            </option>
          ))}
        </select>
        <select onChange={(e) => handleCountrySelect(e.target.value)}>
          <option value="">Recomendado</option>
          {countryData.map((country) => (
            <option key={country.abbr} value={country.abbr}>
              {country.name}
            </option>
          ))}
        </select>
        <button onClick={handleFilterSubmit}>Procurar</button>
      </div>
    </div>
  );
};

export default Filter;
