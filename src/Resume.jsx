import React, { useState, useEffect } from "react";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import resume from './data/resume.pdf';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Resume = () => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setScale(calculateScale());
  }

  function calculateScale() {
    const viewer = document.getElementById('pdf-viewer');
    const viewerWidth = viewer ? viewer.clientWidth : 0;
    return viewerWidth / (595.28 * 1.03); // 595.28 is the width of a standard A4 page at 72dpi
  }

  useEffect(() => {
    function handleResize() {
      setScale(calculateScale());
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id="pdf-viewer" className="resume" 
    style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        overflow: 'scroll'}}>
      <Document file={resume} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} textLayerMode={1}/>
        ))}
      </Document>
    </div>
  );
}

export default Resume;
