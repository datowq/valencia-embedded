import React, { useState, useEffect, useRef } from "react"
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import resume from './data/resume.pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import Player from "./Player"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const Resume = () => {
  const [numPages, setNumPages] = useState(null)
  const [scale, setScale] = useState(1)
  const [collisionBoxes, setCollisionBoxes] = useState([])
  const [collided, setCollided] = useState(false)
  const [spanss, setSpanss] = useState([])
  const [box, setBox] = useState(-1)
  const canvasRef = useRef(null)
  const viewerRef = useRef(null)

  const collisionm = (i) => {
    setCollided(true)
    setBox(i)
  }

  useEffect(() => {
    if(collided) {
      // spanss[box].style.color = 'red'
      // spanss[box].style.border = '2px solid black';
      setCollided(false)
    }
  }, [collided])

  function calculateScale() {
    const viewer = document.getElementById('pdf-viewer')
    const viewerWidth = viewer ? viewer.clientWidth : 0
    return viewerWidth / (595.28 * 1.03) // 595.28 is the width of a standard A4 page at 72dpi
  }

  useEffect(() => {
    const handleSpanManipulation = () => {
      const spans = document.querySelectorAll("span")
      const nonEmptySpans = Array.from(spans).filter(span => {
        return span.textContent.trim() !== "" && span.textContent.trim() !== "|";
      });
      setSpanss(Array.from(nonEmptySpans))
      nonEmptySpans.forEach((span, i) => {
        span.style.border = '2px solid black'
      })
      const spanRectangles = Array.from(nonEmptySpans).map(span => span.getBoundingClientRect())
      setCollisionBoxes(spanRectangles)
    }

    const observer = new MutationObserver(handleSpanManipulation)
    observer.observe(document.body, { childList: true, subtree: true})

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {

    function handleResize() {
      setScale(calculateScale())
    }
  
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
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
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                    scale={scale} 
                    textLayerMode={1}/>
                    ))} 
            </Document>
        </div>
        <Player collisions={collisionBoxes} handleCollision={collisionm}/>
    </>
  )
}

export default Resume
