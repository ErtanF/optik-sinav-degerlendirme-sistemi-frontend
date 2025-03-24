import React, { useState, useEffect, memo } from 'react';
import styles from './StudentSelector.module.css';

const StudentSelector = memo(function StudentSelector({ onStudentSelect }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Veritabanından öğrenci listesini çekme simulasyonu
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Backend bağlantısı yapıldığında burada gerçek API çağrısı olacak
        // Şimdilik dummy data kullanacağız
        setTimeout(() => {
          const dummyData = [
            { id: 1, name: 'Ahmet Yılmaz', class: '10-A', number: '1024' },
            { id: 2, name: 'Ayşe Kaya', class: '10-A', number: '1025' },
            { id: 3, name: 'Mehmet Demir', class: '10-B', number: '1056' },
            { id: 4, name: 'Zeynep Çelik', class: '10-B', number: '1057' },
            { id: 5, name: 'Ali Öztürk', class: '10-C', number: '1078' }
          ];
          setStudents(dummyData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Öğrenci verisi çekilemedi', error);
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
  
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>Öğrenciler yükleniyor...</div>
      ) : (
        <>
          <div className={styles.title}>Öğrenci Seçimi</div>
          <div className={styles.studentList}>
            {students.map(student => (
              <div 
                key={student.id}
                className={styles.studentItem}
                onClick={() => onStudentSelect(student)}
              >
                <div className={styles.studentName}>{student.name}</div>
                <div className={styles.studentInfo}>Sınıf: {student.class} | No: {student.number}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export default StudentSelector;