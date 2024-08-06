import { useState, useCallback, useRef } from 'react';
import { Document, Page, Thumbnail } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

function ReactPdf() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageRefs = useRef({});

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

  console.log('Rendering MyApp, numPages:', numPages, 'pageNumbers:', pageNumbers);

  return (
    <div style={{ display: 'flex' }}>
      {/* Thumbnails on the left */}
      <div style={{ width: '150px', overflowY: 'auto', height: '100vh' }}>
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
      <div style={{ flex: 1, overflowY: 'auto', height: '100vh' }}>
        <Document file="/pdf.pdf">
          {pageNumbers.map((pageNumber) => (
            <div ref={el => pageRefs.current[pageNumber] = el} key={`page_${pageNumber}`}>
              <Page pageNumber={pageNumber} />
            </div>
          ))}
        </Document>
        {numPages && <p>Total Pages: {numPages}</p>}
      </div>
    </div>
  );
}

export default ReactPdf;