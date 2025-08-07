import React from 'react';

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div style={styles.container}>
      {/* Background Animation */}
      <div style={styles.backgroundAnimation}>
        <div style={{...styles.floatingCircle, ...styles.circle1}}></div>
        <div style={{...styles.floatingCircle, ...styles.circle2}}></div>
        <div style={{...styles.floatingCircle, ...styles.circle3}}></div>
        <div style={{...styles.floatingCircle, ...styles.circle4}}></div>
      </div>

      {/* Stars */}
      <div style={styles.stars}>
        <div style={{...styles.star, top: '10%', left: '10%', animationDelay: '0s'}}></div>
        <div style={{...styles.star, top: '20%', right: '15%', animationDelay: '1s'}}></div>
        <div style={{...styles.star, bottom: '30%', left: '20%', animationDelay: '2s'}}></div>
        <div style={{...styles.star, bottom: '10%', right: '10%', animationDelay: '3s'}}></div>
        <div style={{...styles.star, top: '50%', left: '5%', animationDelay: '4s'}}></div>
        <div style={{...styles.star, top: '30%', right: '5%', animationDelay: '5s'}}></div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* 404 Number */}
        <div style={styles.numberContainer}>
          <h1 style={styles.mainNumber}>404</h1>
          <div style={styles.glowEffect}>404</div>
        </div>

        {/* Error Message */}
        <div style={styles.messageContainer}>
          <h2 style={styles.title}>NOT FOUND</h2>
          <p style={styles.subtitle}>Oops!, chúng ta có một vấn đề!</p>
          <p style={styles.description}>
            Trang bạn đang tìm kiếm đã biến mất vào không gian mạng. 
            Hãy quay về trái đất an toàn nhé!
          </p>
        </div>

        {/* Modern Geometric Illustration */}
        <div style={styles.illustrationContainer}>
          <div style={styles.illustration}>
            {/* Central Planet/Circle */}
            <div style={styles.mainPlanet}>
              <div style={styles.planetRing1}></div>
              <div style={styles.planetRing2}></div>
              <div style={styles.planetCore}>
                <div style={styles.planetGlow}></div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div style={{...styles.floatingDot, ...styles.dot1}}>🌟</div>
            <div style={{...styles.floatingDot, ...styles.dot2}}>🐄</div>
            <div style={{...styles.floatingDot, ...styles.dot3}}>✨</div>
            <div style={{...styles.floatingDot, ...styles.dot4}}>💫</div>
            
            {/* Orbiting Satellites */}
            <div style={styles.satelliteOrbit}>
              <div style={styles.satellite1}>🛸</div>
            </div>
            <div style={styles.satelliteOrbit2}>
              <div style={styles.satellite2}>🚀</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            onClick={handleGoHome}
            style={styles.primaryButton}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = 'linear-gradient(45deg, yellow, orange)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'linear-gradient(45deg, #4ecdc4, #45b7d1)';
            }}
          >
            TRANG CHỦ
          </button>
          <button 
            onClick={handleGoBack}
            style={styles.secondaryButton}
            onMouseEnter={(e) => {
              e.target.style.background = '#45b7d1';
              e.target.style.color = 'white';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#fff';
              e.target.style.transform = 'scale(1)';
            }}
          >
            QUAY LẠI
          </button>
        </div>

      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
            100% { transform: translateY(0px) rotate(360deg); }
          }
          
          @keyframes glow {
            0% { text-shadow: 0 0 20px #ff6b6b, 0 0 30px #4ecdc4, 0 0 40px #45b7d1; }
            50% { text-shadow: 0 0 30px #ff6b6b, 0 0 40px #4ecdc4, 0 0 50px #45b7d1; }
            100% { text-shadow: 0 0 20px #ff6b6b, 0 0 30px #4ecdc4, 0 0 40px #45b7d1; }
          }
          
          @keyframes twinkle {
            0% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
          }
          
          @keyframes orbit2 {
            0% { transform: rotate(180deg) translateX(60px) rotate(-180deg); }
            100% { transform: rotate(540deg) translateX(60px) rotate(-540deg); }
          }
          
          @keyframes floatDot {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes planetGlow {
            0% { box-shadow: 0 0 30px #4ecdc4, inset 0 0 20px rgba(78, 205, 196, 0.3); }
            50% { box-shadow: 0 0 50px #45b7d1, inset 0 0 30px rgba(69, 183, 209, 0.5); }
            100% { box-shadow: 0 0 30px #4ecdc4, inset 0 0 20px rgba(78, 205, 196, 0.3); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0D0C1D, #1D1441)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px'
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float 6s ease-in-out infinite'
  },
  circle1: {
    width: '80px',
    height: '80px',
    top: '20%',
    left: '10%',
    animationDelay: '0s'
  },
  circle2: {
    width: '60px',
    height: '60px',
    top: '60%',
    right: '10%',
    animationDelay: '2s'
  },
  circle3: {
    width: '40px',
    height: '40px',
    bottom: '20%',
    left: '20%',
    animationDelay: '4s'
  },
  circle4: {
    width: '100px',
    height: '100px',
    top: '10%',
    right: '20%',
    animationDelay: '1s'
  },
  stars: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2
  },
  star: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: '#fff',
    borderRadius: '50%',
    animation: 'twinkle 3s ease-in-out infinite'
  },
  content: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    maxWidth: '800px',
    width: '100%'
  },
  numberContainer: {
    position: 'relative',
    marginBottom: '40px'
  },
  mainNumber: {
    fontSize: '120px',
    fontWeight: '900',
    color: '#fff',
    margin: '0',
    lineHeight: '1',
    animation: 'glow 2s ease-in-out infinite alternate',
    textShadow: '0 0 20px yellow, 0 0 30px #4ecdc4, 0 0 40px #45b7d1'
  },
  glowEffect: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '120px',
    fontWeight: '900',
    color: 'transparent',
    background: 'linear-gradient(45deg, yellow, #4ecdc4, #45b7d1)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    opacity: '0.3',
    filter: 'blur(2px)',
    zIndex: -1
  },
  messageContainer: {
    marginBottom: '60px'
  },
  title: {
    color: '#fff',
    fontSize: '50px',
    fontWeight: '100',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    margin: '0 0 20px 0',
    fontFamily: 'Anton, sans-serif',
    letterSpacing: '1px'
  },
  subtitle: {
    color: '#f0f8ff',
    fontSize: '22px',
    marginBottom: '15px',
    margin: '0 0 15px 0',
    fontFamily: 'Alata, sans-serif',
  },
  description: {
    color: '#e6f3ff',
    fontSize: '18px',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Alata, sans-serif',
  },
  illustrationContainer: {
    marginBottom: '50px',
    display: 'flex',
    justifyContent: 'center',
    height: '200px'
  },
  illustration: {
    position: 'relative',
    width: '200px',
    height: '200px'
  },
  mainPlanet: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    height: '80px'
  },
  planetCore: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
    borderRadius: '50%',
    position: 'relative',
    animation: 'planetGlow 3s ease-in-out infinite',
    boxShadow: '0 0 30px #4ecdc4, inset 0 0 20px rgba(78, 205, 196, 0.3)'
  },
  planetGlow: {
    position: 'absolute',
    top: '10px',
    left: '15px',
    width: '25px',
    height: '25px',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '50%',
    filter: 'blur(8px)'
  },
  planetRing1: {
    position: 'absolute',
    top: '-20px',
    left: '-20px',
    width: '120px',
    height: '120px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite'
  },
  planetRing2: {
    position: 'absolute',
    top: '-35px',
    left: '-35px',
    width: '150px',
    height: '150px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: 'pulse 6s ease-in-out infinite'
  },
  satelliteOrbit: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '160px',
    height: '160px',
    transform: 'translate(-50%, -50%)',
    animation: 'orbit 8s linear infinite'
  },
  satellite1: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    fontSize: '20px',
    transform: 'translate(-50%, -50%)'
  },
  satelliteOrbit2: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120px',
    height: '120px',
    transform: 'translate(-50%, -50%)',
    animation: 'orbit2 6s linear infinite'
  },
  satellite2: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    fontSize: '16px',
    transform: 'translate(-50%, -50%)'
  },
  floatingDot: {
    position: 'absolute',
    fontSize: '12px',
    animation: 'floatDot 3s ease-in-out infinite'
  },
  dot1: {
    top: '20%',
    left: '20%',
    animationDelay: '0s'
  },
  dot2: {
    top: '30%',
    right: '15%',
    animationDelay: '1s'
  },
  dot3: {
    bottom: '25%',
    left: '25%',
    animationDelay: '2s'
  },
  dot4: {
    bottom: '30%',
    right: '20%',
    animationDelay: '1.5s'
  },
  buttonContainer: {
    marginBottom: '40px',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  primaryButton: {
    height: '50px',
    fontSize: '16px',
    fontWeight: '100',
    background: 'linear-gradient(45deg, #4ecdc4, #45b7d1)',
    border: 'none',
    borderRadius: '25px',
    padding: '0 30px',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(69, 183, 209, 0.3)',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'Anton, sans-serif',
  },
  secondaryButton: {
    height: '50px',
    fontSize: '16px',
    fontWeight: '100',
    background: 'transparent',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '25px',
    padding: '0 30px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    fontFamily: 'Anton, sans-serif',
  }
};

export default NotFound;