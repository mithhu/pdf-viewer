// src/Toolbar.js
import React from 'react';
import './Toolbar.css';

const Toolbar = ({ currentPage, numPages, zoom, onZoomIn, onZoomOut, onPageChange, onRotateLeft, onRotateRight }) => {
    const handlePageInputChange = (e) => {
        const pageNumber = parseInt(e.target.value, 10);
        if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= numPages) {
          onPageChange(pageNumber);
        }
      };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="menu-button">☰</button>
        <span className="toolbar-title">Sample PDF</span>
      </div>
      <div className="toolbar-center">
        <input
          type="number"
          value={currentPage}
          onChange={handlePageInputChange}
          min="1"
          max={numPages}
          className="page-input"
        />
        <span> / {numPages}</span>
        <span>{zoom}%</span>
        <button onClick={onZoomOut}>-</button>
        <button onClick={onZoomIn}>+</button>
        <button onClick={onRotateLeft}>⟲</button>
        <button onClick={onRotateRight}>⟳</button>
      </div>
      <div className="toolbar-right">
        <button>Download</button>
        <button>Print</button>
        <button>...</button>
      </div>
    </div>
  );
};

export default Toolbar;