// src/pages/Optik/components/PreviewModal.jsx
import React from 'react';
import Button from '../../../components/ui/Button/Button';
import FormRenderer from './FormRenderer';
import './PreviewModal.css';

const PreviewModal = ({ isOpen, onClose, pageElements, formTitle, onSave }) => {
  if (!isOpen) return null;

  // Kaydetme butonuna tıklandığında
  const handleSaveClick = () => {
    if (onSave && typeof onSave === 'function') {
      onSave();
    }
  };

  // Yazdırma fonksiyonu - İYİLEŞTİRİLMİŞ
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Popup engelleyiciyi devre dışı bırakın.');
    
    // Form renderer içeriğini kullanarak yazdırma sayfası oluştur - DAHA İYİ CSS EKLENDİ
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${formTitle || 'Optik Form'}</title>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
          .container { 
            position: relative; 
            width: 210mm; 
            height: 297mm; 
            background: white; 
            margin: 0 auto; 
          }
          
          /* FORM ELEMANLARI İÇİN YAZDIRMA STİLLERİ */
          /* Dairelerin düzgün yazdırılması için */
          .bubble {
            width: 16px !important;
            height: 16px !important;
            border: 1px solid black !important;
            border-radius: 50% !important;
            background-color: white !important;
            position: relative !important;
            display: inline-block !important;
            margin: 2px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .bubbleLabel {
            font-size: 9px !important;
            font-weight: bold !important;
            color: black !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Header stillerini koru */
          [style*="backgroundColor: #f8f8f8"] {
            background-color: #f8f8f8 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            border-bottom: 1px solid #ddd !important;
            font-weight: bold !important;
          }
          
          /* Form elemanlarının kenarlarını güçlendir */
          [style*="border: 1px solid rgba(0, 0, 0, 0.1)"] {
            border: 1px solid rgba(0, 0, 0, 0.4) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* İçeriğin düzgün hizalanması */
          .questionRow {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 4px !important;
          }
          
          .questionNumber {
            width: 20px !important;
            font-weight: bold !important;
            text-align: center !important;
          }
          
          .choices {
            display: flex !important;
            gap: 10px !important;
          }
          
          /* Diğer elemanlar için stil garantileri */
          * {
            box-sizing: border-box !important;
            font-family: Arial, sans-serif !important;
          }
        </style>
      </head>
      <body>
        <div id="print-container" class="container">
          ${document.querySelector('.preview-paper').innerHTML}
        </div>
        <script>
          // Dairelerin eksik olma sorununu çöz
          document.addEventListener('DOMContentLoaded', function() {
            // Tüm dairelerin üzerine CSS uygula
            const styleFixing = setTimeout(() => {
              document.querySelectorAll('.bubble').forEach(bubble => {
                bubble.style.border = '1px solid black';
                bubble.style.borderRadius = '50%';
                bubble.style.backgroundColor = 'white';
                bubble.style.webkitPrintColorAdjust = 'exact';
                bubble.style.printColorAdjust = 'exact';
              });
              window.print();
              setTimeout(() => window.close(), 500);
            }, 200);
          });
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal">
        <div className="preview-modal-header">
          <h2>Önizleme: {formTitle || 'Optik Form'}</h2>
          <button className="preview-close-button" onClick={onClose}>×</button>
        </div>
        <div className="preview-modal-body">
          <div className="preview-paper">
            <FormRenderer 
              pageElements={pageElements}
              formTitle={formTitle}
              visible={true}
              showGrid={false}
            />
          </div>
        </div>
        <div className="preview-modal-footer">
          <Button variant="outline" onClick={onClose}>Kapat</Button>
          <Button variant="secondary" onClick={handlePrint}>Yazdır</Button>
          <Button variant="primary" onClick={handleSaveClick}>Bu Görünümü Kaydet</Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;