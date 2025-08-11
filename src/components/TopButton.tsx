import React, { useEffect, useRef, useState } from "react";
import { Link, Element } from "react-scroll";

interface TopButtonProps {
  target?: string;
  offset?: number;
  duration?: number; // in seconds
}

function TopButton({
  target = "",
  offset = 350,
  duration = 0.5,
}: TopButtonProps) {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > offset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  useEffect(() => {
    const btn = btnRef.current;
    if (btn) {
      btn.style.transition = `opacity ${duration}s`;
      btn.style.opacity = visible ? "1" : "0";
      btn.style.pointerEvents = visible ? "auto" : "none";
    }
  }, [visible, duration]);

  return (
    <div
      id="top-btn"
      className="scroll-btn"
      ref={btnRef}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: `opacity ${duration}s`,
        display: "block",
      }}
    >
      <Link
        to={target}
        smooth={true}
        duration={duration * 1000} // convert to milliseconds
        offset={-70}
        className="centered"
      >
        <span className="scroll-up"></span>
      </Link>
    </div>
  );
}

export default TopButton;
