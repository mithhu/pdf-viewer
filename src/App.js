import React, { useState } from 'react';
import './App.css';
import ReactPdf from './ReactPdf';
import IframePdf from './IframePdf';

function App() {
  const [selected, setSelected] = useState(true);

  return (
    <div className="App">
      <div style={{padding: '20px'}}>
      <button onClick={() => setSelected(true)}>React Pdf</button>
      <button onClick={() => setSelected(false)}>Iframe Pdf</button>
      </div>
      {selected ? <ReactPdf /> : <IframePdf pdfUrl="/pdf.pdf" />}
    </div>
  );
}

export default App;