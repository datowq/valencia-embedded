import { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf";
import LoadingSpinner from "../utils/LoadingSpinner";
import Player from "./Player";
import Door from "./Door";

import { pdfjs } from "react-pdf";
import ResumePDF from "./data/resume.pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Resume = () => {
  const [collisionBoxes, setCollisionBoxes] = useState([]);
  const [collided, setCollided] = useState(false);
  const [box, setBox] = useState(-1);

  const viewerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [onStartScreen, setOnStartScreen] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

  const collisionm = (i) => {
    setCollided(true);
    setBox(i);
  };

  useEffect(() => {
    if (collided) {
      setCollided(false);
    }
  }, [collided]);

  useEffect(() => {
    function handleSpanManipulation() {
      const spans = document.querySelectorAll("span");

      const nonEmptySpans = Array.from(spans).filter((span) => {
        return (
          span.textContent.trim() !== "" && span.textContent.trim() !== "|"
        );
      });

      nonEmptySpans.forEach((span, _) => {
        span.style.border = "2px solid black";
      });

      const spanRectangles = Array.from(nonEmptySpans).map((span) =>
        span.getBoundingClientRect()
      );
      setCollisionBoxes(spanRectangles);
    }

    const observer = new MutationObserver(handleSpanManipulation);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  function calculateScale() {
    const viewer = viewerRef.current;
    const viewerWidth = viewer ? viewer.clientWidth : 0;
    return viewerWidth / (595.28 * 1.03); // 595.28 is the width of a standard A4 page at 72dpi
  }

  useEffect(() => {
    function handleResize() {
      setScale(calculateScale());
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onStartScreen]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsDocumentLoaded(true);
  };

  return (
    <>
      {onStartScreen ? (
        <div className="z-10 text-8xl text-black bg-white select-none flex flex-col w-full h-full font-chronotype justify-center items-center text-center">
          <div>resume world</div>
          <button className="text-4xl" onClick={() => setOnStartScreen(false)}>
            start
          </button>
        </div>
      ) : (
        <>
          <div
            ref={viewerRef}
            className="z-0 w-full h-full fixed top-0 left-0 overflow-hidden bg-white select-none"
          >
            <Document
              file={ResumePDF}
              onLoadSuccess={handleDocumentLoadSuccess}
              loading={<LoadingSpinner />}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                  textLayerMode={1}
                />
              ))}
            </Document>
          </div>
          {isDocumentLoaded && (
            <Player
              collisionBoxes={collisionBoxes}
              handleCollision={collisionm}
            />
          )}
        </>
      )}
    </>
  );
};

export default Resume;
