import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../components/Futebol/style.module.scss";

const ContentGrid: React.FC = () => {
  useEffect(() => {
    toast.info(
      "Estamos a enfrentar ataques para derrubar os canais de futebol do Warez. Estamos a trabalhar arduamente para contornar os bloqueios impostos pelas emissoras de TV.",
      {
        position: "top-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      },
    );
  }, []);

  // Array de conteúdos fictícios
  const contents = [
    {
      id: 1,
      link: "/ftwatch?type=tv&server=STV1",
      image: "/images/futebol/artboard-1.png",
    },
    {
      id: 2,
      link: "/ftwatch?type=tv&server=STV2",
      image: "/images/futebol/artboard-2.png",
    },
    {
      id: 3,
      link: "/ftwatch?type=tv&server=STV3",
      image: "/images/futebol/artboard-3.png",
    },
    {
      id: 4,
      link: "/ftwatch?type=tv&server=STV4",
      image: "/images/futebol/artboard-4.png",
    },
    {
      id: 5,
      link: "/ftwatch?type=tv&server=STV5",
      image: "/images/futebol/artboard-5.png",
    },
    {
      id: 6,
      link: "/ftwatch?type=tv&server=ELS1",
      image: "/images/futebol/artboard-6.png",
    },
    {
      id: 7,
      link: "/ftwatch?type=tv&server=ELS2",
      image: "/images/futebol/artboard-7.png",
    },
    {
      id: 8,
      link: "/ftwatch?type=tv&server=ELS3",
      image: "/images/futebol/artboard-8.png",
    },
    {
      id: 9,
      link: "/ftwatch?type=tv&server=BFTV",
      image: "/images/futebol/artboard-10.png",
    },
  ];

  return (
    <div className={styles.GridContainer}>
      <ToastContainer />
      {contents.map((content) => (
        <a key={content.id} href={content.link} className={styles.contentItem}>
          <img
            src={content.image}
            alt={`Futebol ${content.id}`}
            width={300}
            height={200}
          />
        </a>
      ))}
    </div>
  );
};

export default ContentGrid;
