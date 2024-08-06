import React from 'react';

const IframePdf = ({ pdfUrl }) => {
  return (
    <div style={styles.container}>
      <iframe 
        src={pdfUrl} 
        type="application/pdf" 
        style={styles.iframe}
        title="PDF Viewer"
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    margin: 0,
  },
  iframe: {
    width: '80%',
    height: '80%',
    border: 'none',
  }
};

export default IframePdf;

