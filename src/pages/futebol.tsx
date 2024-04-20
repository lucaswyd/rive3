import React from "react";
import { GridContainer, contentItem } from "../components/Futebol/style.module.scss";

const ContentGrid: React.FC = () => {
  // Array de conteúdos fictícios
  const contents = [
    { id: 1, link: "/ftwatch?type=tv&id=1&server=STV1", image: "/images/futebol/artboard-1.png" },
    { id: 2, link: "/ftwatch?type=tv&id=2&server=STV2", image: "/images/futebol/artboard-2.png" },
    { id: 3, link: "/ftwatch?type=tv&id=3&server=STV3", image: "/images/futebol/artboard-3.png" },
    { id: 4, link: "/ftwatch?type=tv&id=4&server=STV4", image: "/images/futebol/artboard-4.png" },
    { id: 5, link: "/ftwatch?type=tv&id=5&server=STV5", image: "/images/futebol/artboard-5.png" },
    { id: 6, link: "/ftwatch?type=tv&id=6&server=ELS1", image: "/images/futebol/artboard-6.png" },
    { id: 7, link: "/ftwatch?type=tv&id=7&server=ELS2", image: "/images/futebol/artboard-7.png" },
    { id: 8, link: "/ftwatch?type=tv&id=8&server=ELS3", image: "/images/futebol/artboard-8.png" },
    { id: 9, link: "/ftwatch?type=tv&id=9&server=STV4", image: "/images/futebol/artboard-10.png" },
  ];

  return (
    <div className={GridContainer}>
      {contents.map((content) => (
        <a key={content.id} href={content.link} className={contentItem}>
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
