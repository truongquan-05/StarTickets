import React, { useState } from 'react';

const LichChieuUser = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Mock data - sau này sẽ thay bằng API
  const mockMovieSchedule = {
    '2025-08-15': [
      {
        id: 1,
        movieTitle: 'Avengers: Endgame',
        poster: 'https://via.placeholder.com/80x120/1f2937/ffffff?text=Movie1',
        showtimes: ['14:00', '17:30', '20:15'],
        cinema: 'CGV Vincom',
        duration: '181 phút',
        genre: 'Hành động, Phiêu lưu'
      },
      {
        id: 2,
        movieTitle: 'Spider-Man: No Way Home',
        poster: 'https://via.placeholder.com/80x120/dc2626/ffffff?text=Movie2',
        showtimes: ['13:30', '16:45', '19:30'],
        cinema: 'Lotte Cinema',
        duration: '148 phút',
        genre: 'Hành động, Khoa học viễn tưởng'
      }
    ],
    '2025-08-16': [
      {
        id: 3,
        movieTitle: 'The Batman',
        poster: 'https://via.placeholder.com/80x120/374151/ffffff?text=Movie3',
        showtimes: ['15:00', '18:15', '21:00'],
        cinema: 'BHD Star',
        duration: '176 phút',
        genre: 'Hành động, Tội phạm'
      }
    ],
    '2025-08-18': [
      {
        id: 4,
        movieTitle: 'Top Gun: Maverick',
        poster: 'https://via.placeholder.com/80x120/059669/ffffff?text=Movie4',
        showtimes: ['14:30', '17:00', '19:45'],
        cinema: 'Galaxy Cinema',
        duration: '130 phút',
        genre: 'Hành động, Drama'
      },
      {
        id: 5,
        movieTitle: 'Doctor Strange 2',
        poster: 'https://via.placeholder.com/80x120/7c3aed/ffffff?text=Movie5',
        showtimes: ['16:00', '20:30'],
        cinema: 'CGV Vincom',
        duration: '126 phút',
        genre: 'Hành động, Fantasy'
      }
    ]
  };

  // Lấy ngày đầu và cuối tháng
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  
  // Tạo array các ngày trong tháng để hiển thị
  const days = [];
  const date = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const hasMovies = (date) => {
    return mockMovieSchedule[formatDateKey(date)]?.length > 0;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const selectDate = (date) => {
    if (hasMovies(date)) {
      setSelectedDate(formatDateKey(date));
    }
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    monthYear: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333'
    },
    navButton: {
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s'
    },
    calendar: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    dayHeaders: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      backgroundColor: '#1890ff'
    },
    dayHeader: {
      padding: '15px',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'white',
      fontSize: '14px'
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '1px',
      backgroundColor: '#e0e0e0'
    },
    dayCell: {
      minHeight: '80px',
      backgroundColor: '#fff',
      padding: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative'
    },
    dayNumber: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    movieDot: {
      position: 'absolute',
      bottom: '5px',
      right: '5px',
      width: '8px',
      height: '8px',
      backgroundColor: '#52c41a',
      borderRadius: '50%'
    },
    movieDetails: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    movieItem: {
      display: 'flex',
      gap: '15px',
      padding: '15px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '15px',
      backgroundColor: '#fafafa'
    },
    poster: {
      width: '80px',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '6px'
    },
    movieInfo: {
      flex: 1
    },
    movieTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#333'
    },
    movieMeta: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '4px'
    },
    showtimes: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '8px'
    },
    showtime: {
      backgroundColor: '#1890ff',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button 
          style={styles.navButton}
          onClick={() => navigateMonth(-1)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#40a9ff'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1890ff'}
        >
          ← Tháng trước
        </button>
        <div style={styles.monthYear}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button 
          style={styles.navButton}
          onClick={() => navigateMonth(1)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#40a9ff'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1890ff'}
        >
          Tháng sau →
        </button>
      </div>

      {/* Calendar */}
      <div style={styles.calendar}>
        {/* Day headers */}
        <div style={styles.dayHeaders}>
          {dayNames.map(day => (
            <div key={day} style={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div style={styles.daysGrid}>
          {days.map((day, index) => {
            const isCurrentMonthDay = isCurrentMonth(day);
            const isTodayDay = isToday(day);
            const hasMoviesDay = hasMovies(day);
            
            return (
              <div
                key={index}
                style={{
                  ...styles.dayCell,
                  opacity: isCurrentMonthDay ? 1 : 0.3,
                  backgroundColor: isTodayDay ? '#e6f7ff' : '#fff',
                  border: isTodayDay ? '2px solid #1890ff' : 'none',
                  cursor: hasMoviesDay ? 'pointer' : 'default'
                }}
                onClick={() => selectDate(day)}
                onMouseOver={(e) => {
                  if (hasMoviesDay) {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = isTodayDay ? '#e6f7ff' : '#fff';
                }}
              >
                <div style={{
                  ...styles.dayNumber,
                  color: isTodayDay ? '#1890ff' : '#333'
                }}>
                  {day.getDate()}
                </div>
                {hasMoviesDay && <div style={styles.movieDot}></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Movie details */}
      {selectedDate && mockMovieSchedule[selectedDate] && (
        <div style={styles.movieDetails}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            Lịch chiếu ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
          </h3>
          {mockMovieSchedule[selectedDate].map(movie => (
            <div key={movie.id} style={styles.movieItem}>
              <img 
                src={movie.poster} 
                alt={movie.movieTitle}
                style={styles.poster}
              />
              <div style={styles.movieInfo}>
                <div style={styles.movieTitle}>{movie.movieTitle}</div>
                <div style={styles.movieMeta}>📍 {movie.cinema}</div>
                <div style={styles.movieMeta}>⏱️ {movie.duration}</div>
                <div style={styles.movieMeta}>🎬 {movie.genre}</div>
                <div style={styles.showtimes}>
                  {movie.showtimes.map(time => (
                    <span 
                      key={time} 
                      style={styles.showtime}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#40a9ff'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#1890ff'}
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LichChieuUser;