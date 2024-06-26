import { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf";
import LoadingSpinner from "../utils/LoadingSpinner";

import { pdfjs } from "react-pdf";
import ResumePDF from "./data/resume.pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Resume = ({
  startGame,
  currentCollisionBoxes,
  renderScale,
  setRenderScale,
  isDocumentLoaded,
  setIsDocumentLoaded,
}) => {
  const viewerRef = useRef(null);
  const documentRef = useRef(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    function handleSpanManipulation() {
      const spans = document.querySelectorAll("span");

      const nonEmptySpans = Array.from(spans).filter((span) => {
        return (
          span.textContent.trim() !== "" && span.textContent.trim() !== "|"
        );
      });

      // nonEmptySpans.forEach((span, _) => {
      //   span.style.border = "2px solid black";
      // });

      const spanRectangles = Array.from(nonEmptySpans).map((span) =>
        span.getBoundingClientRect()
      );
      // setPdfCollisionBoxes(spanRectangles);
      // pdfCollisionBoxes.current = spanRectangles;
      // console.log("from resume", pdfCollisionBoxes.current);
      currentCollisionBoxes.current = spanRectangles;
    }

    const observer = new MutationObserver(handleSpanManipulation);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [currentCollisionBoxes]);

  function calculateScale() {
    const viewer = viewerRef.current;
    const viewerWidth = viewer ? viewer.clientWidth : 0;
    return viewerWidth / (595.28 * 1.03); // 595.28 is the width of a standard A4 page at 72dpi
  }

  useEffect(() => {
    if (!isDocumentLoaded) return;

    function handleResize() {
      setRenderScale(calculateScale());
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isDocumentLoaded, setRenderScale]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsDocumentLoaded(true);
  };

  return (
    startGame && (
      <>
        <div
          ref={viewerRef}
          className="z-0 w-full h-full fixed top-0 left-0 overflow-hidden bg-white select-none"
        >
          <Document
            ref={documentRef}
            file={ResumePDF}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<LoadingSpinner />}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={renderScale}
                textLayerMode={1}
              />
            ))}
          </Document>
        </div>
      </>
    )
  );
};

export default Resume;
