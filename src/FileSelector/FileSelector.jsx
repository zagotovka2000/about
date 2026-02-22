import React from 'react';
import './FileSelector.css';

const FileSelector = ({ files, activeFile, onFileSelect }) => {
  return (
    <div className="file-selector-grid">
      {files.map(file => (
        <button
          key={file}
          onClick={() => onFileSelect(file)}
          className={`toggle-button ${activeFile === file ? 'active' : ''}`}
        >
          <span className="button-text">
            {file.replace('.txt', '').replace(/^\w/, c => c.toUpperCase())}
          </span>
          <span className="button-arrow">
            {activeFile === file ? '▲' : '▼'}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FileSelector;
