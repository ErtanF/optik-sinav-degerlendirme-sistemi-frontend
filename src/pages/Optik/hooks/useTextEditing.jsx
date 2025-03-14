import { useState, useRef, useCallback, useEffect } from 'react';

export const useTextEditing = (pageElements, setPageElements) => {
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const textInputRef = useRef(null);
  
  // Element güncelleme yardımcı fonksiyonu
  const updateElement = useCallback((uniqueId, updates) => {
    setPageElements(prev => prev.map(el => 
      el.uniqueId === uniqueId ? {...el, ...updates} : el
    ));
  }, [setPageElements]);
  
  // Metin düzenleme başlatma
  const startEditing = useCallback((element) => {
    if (element.type === 'text') {
      setEditingTextId(element.uniqueId);
      setEditingContent(element.content || '');
    }
  }, []);
  
  // Metin içeriğini değiştirme
  const handleContentChange = useCallback((e) => {
    setEditingContent(e.target.value);
  }, []);
  
  // Metin içeriğini kaydetme
  const saveTextContent = useCallback(() => {
    if (!editingTextId) return;
    
    updateElement(editingTextId, { content: editingContent });
    setEditingTextId(null);
    setEditingContent('');
  }, [editingTextId, editingContent, updateElement]);
  
  // Metin düzenlemeyi iptal etme
  const cancelTextEditing = useCallback(() => {
    setEditingTextId(null);
    setEditingContent('');
  }, []);
  
  // Enter ve Escape tuşlarını dinleme
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      saveTextContent();
    } else if (e.key === 'Escape') {
      cancelTextEditing();
    }
  }, [saveTextContent, cancelTextEditing]);
  
  // Metin düzenleme aktif olduğunda input'a focus
  useEffect(() => {
    if (editingTextId && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [editingTextId]);
  
  // Dışarı tıklandığında metin düzenlemeyi kaydetme
  useEffect(() => {
    if (editingTextId) {
      const handleClickOutside = (e) => {
        if (textInputRef.current && !textInputRef.current.contains(e.target)) {
          saveTextContent();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [editingTextId, saveTextContent]);
  
  return {
    editingTextId,
    editingContent,
    textInputRef,
    startEditing,
    handleContentChange,
    handleKeyDown,
    saveTextContent,
    cancelTextEditing
  };
};