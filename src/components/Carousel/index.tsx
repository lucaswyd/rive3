import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import styles from "./style.module.scss";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

interface CarouselProps {
  imageArr: string[];
  setIndex: (index: number) => void;
  mobileHeight: string;
  desktopHeight: string;
  objectFit: string;
  trailerKey?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  imageArr,
  setIndex,
  mobileHeight,
  desktopHeight,
  objectFit,
  trailerKey,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imagePlaceholder, setImagePlaceholder] = useState<boolean>(false);

  const images = useMemo(
    () => (imageArr.length === 0 ? ["/images/logolmg.svg"] : imageArr),
    [imageArr],
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--carousel-desktop-height",
      desktopHeight,
    );
    document.documentElement.style.setProperty(
      "--carousel-mobile-height",
      mobileHeight,
    );
    document.documentElement.style.setProperty(
      "--carousel-object-fit",
      objectFit,
    );

    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [desktopHeight, mobileHeight, objectFit]);

  const slideVariants = {
    hiddenRight: { x: "100%", opacity: 0 },
    hiddenLeft: { x: "-100%", opacity: 0 },
    visible: { x: "0", opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 1.5 } },
  };

  const handleNext = useCallback(() => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
    setIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, setIndex]);

  const handlePrevious = useCallback(() => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1,
    );
    setIndex(currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, setIndex]);

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    trackMouse: true,
  });

  const handleImageError = () => setImagePlaceholder(true);

  const handleImageLoad = () => {
    setTimeout(() => setImageLoaded(true), 100);
  };

  return (
    <div {...handlers} className={styles.carousel}>
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
              onError={handleImageError}
              onLoad={handleImageLoad}
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
              src={
                imagePlaceholder ? "/images/logolmg.svg" : images[currentIndex]
              }
              initial={direction === "right" ? "hiddenRight" : "hiddenLeft"}
              animate="visible"
              exit="exit"
              variants={slideVariants}
              className={imageLoaded ? styles.skeleton : ""}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
        </AnimatePresence>
        <div className={styles.slide_direction}>
          <BsCaretLeftFill className={styles.left} onClick={handlePrevious} />
          <BsCaretRightFill className={styles.right} onClick={handleNext} />
        </div>
      </div>
      <div className={styles.dots}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(Carousel);
