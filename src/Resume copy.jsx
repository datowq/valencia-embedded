import React, { useState, useEffect, useRef } from "react"
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import resume from './data/resume.pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Player from "./Player"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const Resume = () => {
  const [numPages, setNumPages] = useState(null)
  const [scale, setScale] = useState(1)
  const [pdfText, setPdfText] = useState({ text: [], coordinates: []});
  const [resized, setResized] = useState(false)
  const [collisionBoxes, setCollisionBoxes] = useState([])
  const canvasRef = useRef(null);
  const viewerRef = useRef(null)

  const onDocumentLoadSuccess = async (pdf) => {
    const numPages = pdf.numPages;
    // const textPromises = [];
    console.log('Document loaded successfully');
    setNumPages(numPages)
    setScale(calculateScale())
    handleResize()

    // for (let i = 1; i <= numPages; i++) {
    //   textPromises.push(
    //     pdf.getPage(i)
    //       .then((page) => page.getTextContent())
    //       .then((textContent) => {
    //         const textItems = textContent.items;
    //         let extractedText = [];
    //         let itemCoordinates = [];
    //         for (let i = 0; i < textItems.length; i++) {
    //           const item = textItems[i];
    //           const [x, y] = item.transform.slice(4, 6);
    //           extractedText.push({item})
    //           itemCoordinates.push({ x, y, width: item.width, height: item.height });
    //         }
    //         return { text: extractedText, coordinates: itemCoordinates };
    //       })
    //   );
    // }

    // const extractedText = await Promise.all(textPromises);
    // setPdfText(extractedText)
  };

  // useEffect(() => {
  //   // const loadingTask = pdfjsLib.getDocument(resume);
  //   // loadingTask.promise.then(onDocumentLoadSuccess)
  //   // .then(setTextExtracted(true))
  // }, [pdfText]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   // if(textExtracted) {
  //   //     pdfText[0].coordinates.forEach((dim, index) => {
  //   //     const { x, y, width, height } = dim;
  //   //     context.strokeStyle = 'red';
  //   //     context.strokeRect(x, y, width, height);
  //   //     });
  //   // }
  // }, [pdfText]);

  // useEffect(() => {
  //   console.log(pdfText)
  // }, [pdfText])

  function calculateScale() {
    const viewer = document.getElementById('pdf-viewer')
    const viewerWidth = viewer ? viewer.clientWidth : 0
    return viewerWidth / (595.28 * 1.03) // 595.28 is the width of a standard A4 page at 72dpi
  }

  function handleResize() {
    setScale(calculateScale())
    const spans = document.querySelectorAll('span');
    let temp = []
    spans.forEach((span) => {
        span.style.border = '1px solid black';
        let rect = span.getBoundingClientRect();
        temp.push(rect);
    })
    setCollisionBoxes(temp)
    console.log(collisionBoxes)
  }

  useEffect(() => {
    let observer;
  
    function observeMutations() {
      observer = new MutationObserver(handleResize);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  
    window.addEventListener('resize', handleResize)
    handleResize()
    observeMutations()
    return () => {
      window.removeEventListener('resize', handleResize)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <>
        <div
        ref={viewerRef}
        id="pdf-viewer" 
        className="resume" 
        style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        overflow: 'scroll'}}>
            <Document 
            file={resume}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page 
                    onLoadSuccess={onDocumentLoadSuccess}
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                    scale={scale} 
                    textLayerMode={1}/>
                    ))} 
            </Document>
            <canvas 
                ref={canvasRef} 
                style={{
                    position: 'absolute', 
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                    }}>
            </canvas>  
        </div>
        <Player collisions={collisionBoxes}/>
    </>
  )
}

export default Resume
