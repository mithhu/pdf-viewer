// src/ReactPdf.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, Thumbnail, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import './ReactPdf.css';
import Toolbar from './Toolbar';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function ReactPdf() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const pageRefs = useRef({});
  const containerRef = useRef(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    console.log('Document loaded successfully, numPages:', numPages);
    setNumPages(numPages);
    setPageNumbers(Array.from(new Array(numPages), (_, index) => index + 1));
  }, []);

  const onThumbnailClick = useCallback(({ pageNumber }) => {
    console.log(`Thumbnail for page ${pageNumber} clicked`);
    setCurrentPage(pageNumber);
    pageRefs.current[pageNumber]?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 10, 200));
  const handleZoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 10, 50));
  const handlePageChange = (pageNumber) => {
    console.log('handlePageChange', pageNumber);
    if (pageNumber > 0 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleRotateLeft = () => setRotation((prevRotation) => (prevRotation - 90) % 360);
  const handleRotateRight = () => setRotation((prevRotation) => (prevRotation + 90) % 360);

  useEffect(() => {
    console.log('currentPage updated:', currentPage);
    pageRefs.current[currentPage]?.scrollIntoView({ behavior: 'smooth' });
  }, [currentPage]);

  const handleScroll = () => {
    if (containerRef.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      let closestPage = currentPage;
      let closestDistance = Infinity;

      pageNumbers.forEach((pageNumber) => {
        const pageElement = pageRefs.current[pageNumber];
        if (pageElement) {
          const pageTop = pageElement.getBoundingClientRect().top;
          const distance = Math.abs(pageTop - containerTop);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPage = pageNumber;
          }
        }
      });

      if (closestPage !== currentPage) {
        setCurrentPage(closestPage);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [pageNumbers, currentPage]);

  console.log('Rendering MyApp, numPages:', numPages, 'pageNumbers:', pageNumbers);

  return (
    <div>
      <Toolbar
        currentPage={currentPage}
        numPages={numPages}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onPageChange={handlePageChange}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
      />
      <div style={{ display: 'flex', paddingTop: '60px' /* Adjust based on toolbar height */ }}>
        {/* Thumbnails on the left */}
        <div style={{ width: '150px', overflowY: 'auto', height: 'calc(100vh - 60px)' /* Adjust based on toolbar height */ }}>
          <Document file="/pdf.pdf" onLoadSuccess={onDocumentLoadSuccess}>
            {pageNumbers.map((pageNumber) => (
              <Thumbnail
                key={`thumbnail_${pageNumber}`}
                pageNumber={pageNumber}
                width={130}
                onItemClick={onThumbnailClick}
                className={currentPage === pageNumber ? 'active-thumbnail' : ''}
              />
            ))}
          </Document>
        </div>

        {/* Full pages on the right */}
        <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 60px)' /* Adjust based on toolbar height */ }}>
          <Document file="/pdf.pdf">
            {pageNumbers.map((pageNumber) => (
              <div ref={el => pageRefs.current[pageNumber] = el} key={`page_${pageNumber}`}>
                <Page pageNumber={pageNumber} scale={zoom / 100} rotate={rotation} />
              </div>
            ))}
          </Document>
          {numPages && <p>Total Pages: {numPages}</p>}
        </div>
      </div>
    </div>
  );
}

export default ReactPdf;