import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./style.module.scss";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

const Carousel = ({
  imageArr,
  setIndex,
  mobileHeight,
  desktopHeight,
  objectFit,
  trailerKey, // Chave do vídeo do trailer
}: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [images, setImages] = useState(imageArr);
  const [imagePlaceholder, setImagePlaceholder] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--carousel-desktop-height",
      desktopHeight
    );
    document.documentElement.style.setProperty(
      "--carousel-mobile-height",
      mobileHeight
    );
    document.documentElement.style.setProperty(
      "--carousel-object-fit",
      objectFit
    );
    const interval = setInterval(() => {
      handleNext();
    }, 15000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (imageArr.length === 0) {
      setImages(["/images/logo.svg"]);
    } else {
      setImages(imageArr);
    }
  }, [imageArr]);

  const slideVariants = {
    hiddenRight: {
      x: "10%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-10%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: imageLoaded ? 1 : 0,
      transition: {
        duration: 1,
      },
    },
    exit: {
      opacity: 0,
      x: "-10%",
      transition: {
        duration: 0.7,
      },
    },
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setIndex((prevIndex: number) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
    setIndex((prevIndex: number) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.carousel}>
      <div
        className={`${styles.carousel_images} ${
          !imageLoaded ? styles.skeleton : ""
        }`}
      >
        <AnimatePresence initial={false} custom={direction}>
          {trailerKey ? (
            <motion.video
              autoPlay
              loop
              muted
              key={currentIndex}
              initial={direction === "right" ? "hiddenRight" : "hiddenLeft"}
              animate="visible"
              exit="exit"
              variants={slideVariants}
              className={imageLoaded ? styles.skeleton : ""}
              onError={() => {
                setImagePlaceholder(true);
              }}
              onLoad={() => {
                setTimeout(() => {
                  setImageLoaded(true);
                }, 100);
              }}
              loading="lazy"
            >
              <source
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </motion.video>
          ) : (
            <motion.img
              key={currentIndex}
              alt={"carousel"}
              src={`${imagePlaceholder ? "/images/logo.svg" : images[currentIndex]}`}
              initial={direction === "right" ? "hiddenRight" : "hiddenLeft"}
              animate="visible"
              exit="exit"
              variants={slideVariants}
              className={imageLoaded ? styles.skeleton : ""}
              onError={() => {
                setImagePlaceholder(true);
              }}
              onLoad={() => {
                setTimeout(() => {
                  setImageLoaded(true);
                }, 100);
              }}
              loading="lazy"
            />
          )}
        </AnimatePresence>

        <div className={styles.slide_direction}>
          <BsCaretLeftFill className={styles.left} onClick={handlePrevious} />
          <BsCaretRightFill className={styles.right} onClick={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
