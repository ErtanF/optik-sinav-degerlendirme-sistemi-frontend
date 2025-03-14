import React from 'react';

const TextEditor = ({ content, onChange, onKeyDown, inputRef }) => {
  // CSS stillerini içeri entegre ettim
  const styles = {
    input: {
      width: '100%',
      height: '100%',
      border: 'none',
      background: 'transparent',
      padding: '0.5rem',
      fontSize: '1rem',
      textAlign: 'center',
      color: 'var(--text-color-dark)',
      outline: 'none'
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      className="editable-text-input"
      style={styles.input}
      value={content}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder="Metin girin..."
    />
  );
};

export default TextEditor;