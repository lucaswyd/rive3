import React from "react";
import Link from "next/link";
import styles from "../components/Televisao/style.module.scss";


const ContentGrid: React.FC = () => {
  const contents = [
    { id: 1, link: "/hlswatch?type=tv&id=1&server=SIC", image: "/images/TV/sic.png" },
    { id: 2, link: "/hlswatch?type=tv&id=2&server=TVI", image: "/images/TV/tvi.png" },

  ];

  return (
    <div className={styles.GridContainer}>
      {contents.map((content) => (
        <Link key={content.id} href={content.link}>
          <div className={styles.contentItem}>
            <img
              src={content.image}
              alt={`Futebol ${content.id}`}
              width={300}
              height={200}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ContentGrid;
