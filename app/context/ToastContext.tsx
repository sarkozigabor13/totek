"use client";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Image from "next/image";


const ToasterContext = () => {
  const [position, setPosition] = useState<"top-center" | "bottom-right">("top-center");

  useEffect(() => {
    const handleResize = () => {
      setPosition(window.innerWidth >= 768 ? "bottom-right" : "top-center");
    };

    handleResize(); // inicializálás
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Toaster
      position={position}
      reverseOrder={true}
      toastOptions={{
        style: {
          padding: "16px",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
          position: "relative",
          zIndex: 999999999999
        },
        custom: {
          icon: (
            <Image
              src="/images/icon/info.png"
              alt="info"
              width={24}
              height={24}
            />
          ),
          style: { background: "#0f1012", border: "1px solid #0f1012" },
        },
        success: {
          icon: (
            <Image
              src="/images/icon/tick.png"
              alt="success"
              width={24}
              height={24}
            />
          ),
          style: { background: "#1d8e4e", border: "1px solid #1d8e4e" },
        },
        error: {
          icon: (
            <Image
              src="/images/icon/wrong.png"
              alt="error"
              width={24}
              height={24}
            />
          ),
          style: { background: "#652e31", border: "1px solid #652e31" },
        },
      }}
    />
  );
};

export default ToasterContext;
