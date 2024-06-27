import React from "react";
import styles from "./style.module.scss";

const genres = [
  { id: "28", name: "Ação" },
  { id: "12", name: "Aventura" },
  { id: "16", name: "Animação" },
  { id: "35", name: "Comédia" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentário" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Família" },
  { id: "14", name: "Fantasia" },
  { id: "36", name: "História" },
  { id: "27", name: "Terror" },
  { id: "10402", name: "Música" },
  { id: "9648", name: "Mistério" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Ficção Científica" },
  { id: "10770", name: "Filme para TV" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "Guerra" },
  { id: "37", name: "Faroeste" },
];

interface GenreFilterProps {
  filterGenreList: string[];
  setFilterGenreList: (genreList: string[]) => void;
  fetchData: () => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  filterGenreList,
  setFilterGenreList,
  fetchData,
}) => {
  const handleGenreClick = (genreId: string) => {
    const updatedGenreList = filterGenreList.includes(genreId)
      ? filterGenreList.filter((id) => id !== genreId)
      : [...filterGenreList, genreId];
    setFilterGenreList(updatedGenreList);
    fetchData(); // Chamar fetchData para atualizar os dados
  };

  return (
    <div className={styles.genreButtons}>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={
            filterGenreList.includes(genre.id) ? styles.active : styles.inactive
          }
          onClick={() => handleGenreClick(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
