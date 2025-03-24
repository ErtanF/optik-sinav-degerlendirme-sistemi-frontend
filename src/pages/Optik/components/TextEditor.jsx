import React, { memo } from 'react';
import styles from './TextEditor.module.css';

const TextEditor = memo(function TextEditor({ content, onChange, onKeyDown, inputRef }) {
  return (
    <input
      ref={inputRef}
      type="text"
      className={styles.input}
      value={content}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder="Metin girin..."
      autoFocus
    />
  );
});

export default TextEditor;