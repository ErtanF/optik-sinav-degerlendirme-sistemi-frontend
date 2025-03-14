import React, { useState, useEffect } from 'react';

const StudentSelector = ({ onStudentSelect }) => {
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
  
  const styles = {
    container: {
      backgroundColor: 'white',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      marginBottom: '15px',
      padding: '8px'
    },
    title: {
      fontSize: '14px',
      color: 'var(--primary-color)',
      marginBottom: '8px',
      fontWeight: '500'
    },
    studentList: {
      maxHeight: '150px',
      overflowY: 'auto',
      paddingRight: '5px',
      marginBottom: '5px'
    },
    studentItem: {
      padding: '8px',
      borderBottom: '1px solid var(--border-color)',
      cursor: 'pointer',
      borderRadius: '4px'
    },
    studentName: {
      fontWeight: 'bold',
      fontSize: '14px'
    },
    studentInfo: {
      color: 'var(--text-color-light)',
      fontSize: '12px'
    }
  };
  
  return (
    <div style={styles.container}>
      {loading ? (
        <div>Öğrenciler yükleniyor...</div>
      ) : (
        <>
          <div style={styles.title}>Öğrenci Seçimi</div>
          <div style={styles.studentList}>
            {students.map(student => (
              <div 
                key={student.id}
                style={styles.studentItem}
                onClick={() => onStudentSelect(student)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={styles.studentName}>{student.name}</div>
                <div style={styles.studentInfo}>Sınıf: {student.class} | No: {student.number}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentSelector;