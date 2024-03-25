import React, { FC, useEffect, useRef, useState } from "react";
import "./Tapbar.css";
import iconCom from "../Images/iconCom.svg";
import iconFavorite from "../Images/iconFavorite.svg";
import iconPageUp from "../Images/iconPageUp.svg";
import iconShare from "../Images/iconShare.svg";

const Tapbar: FC = () => {
  const [commentsCount, setCommentsCount] = useState<number>(7);
  const [favoriteCount, setFavoriteCount] = useState<number>(7);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const prevScrollY = useRef<number>(window.scrollY);

  useEffect(() => {
    let isScrollingTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= lastScrollY && !isVisible) {
        setIsVisible(true);
      } else if (Math.abs(currentScrollY - lastScrollY) > 200 && isVisible) {
        setIsVisible(false);
      } else if (isVisible === false && currentScrollY < prevScrollY.current) {
        setIsVisible(true);
      }

      if (isScrollingTimer) clearTimeout(isScrollingTimer);

      isScrollingTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      prevScrollY.current = currentScrollY;
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (isScrollingTimer) clearTimeout(isScrollingTimer);
    };
  }, [isVisible]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: "Check out this page!",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => console.log("URL copied to clipboard"))
        .catch((error) => console.error("Error copying to clipboard:", error));
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleComments = () => {
    setCommentsCount((prevCount) => prevCount + 1);
  };

  const handleFavorite = () => {
    setFavoriteCount((prevCount) => prevCount + 1);
  };

  return (
    <div className={`tapbar-container ${isVisible ? "visible" : "hidden"}`}>
      <button className="tapbar-button" onClick={handleShare}>
        <img src={iconShare} alt="Share" />
      </button>
      <button className="tapbar-button" onClick={handleScrollToTop}>
        <img src={iconPageUp} alt="Scroll to top" />
      </button>
      <button className="tapbar-button" onClick={handleComments}>
        <img src={iconCom} alt="Comments" />{" "}
        <span className="button-count">{commentsCount}</span>
      </button>
      <button className="tapbar-button" onClick={handleFavorite}>
        <img src={iconFavorite} alt="Favorite" />{" "}
        <span className="button-count">{favoriteCount}</span>
      </button>
    </div>
  );
};

export default Tapbar;