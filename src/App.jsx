import { useState, useEffect, useRef } from 'react'
import './App.css'
import discordIcon from './assets/discord.svg'
import steamIcon from './assets/steam.svg'
import logo from './assets/logo.png'

const StaticEffect = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timeoutId;
    let intervalId;

    const triggerStatic = () => {
      setIsActive(true);
      timeoutId = setTimeout(() => {
        setIsActive(false);
      }, 750); // Static burst lasts 0.75 seconds
    };

    // Initial delay before starting
    setTimeout(() => {
      triggerStatic();
      // Set up recurring interval between 8-15 seconds
      intervalId = setInterval(() => {
        triggerStatic();
      }, 8000 + Math.random() * 7000);
    }, 2000);

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return <div className={`static-overlay ${isActive ? 'active' : ''}`} />;
};

const EntropyLines = () => {
  const [paths, setPaths] = useState([]);
  const pathsRef = useRef([]);
  const requestRef = useRef();

  const createNewLine = () => {
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    return {
      id: Date.now() + Math.random(),
      points: [`M ${startX} ${startY}`],
      currentX: startX,
      currentY: startY,
      direction: Math.random() * Math.PI * 2,
      speed: 0.05 + Math.random() * 0.05
    };
  };

  const updatePaths = () => {
    pathsRef.current = pathsRef.current.map(path => {
      if (Math.random() < 0.005) {
        path.direction += (Math.random() - 0.05) * Math.PI / 2;
      }

      const dx = Math.cos(path.direction) * path.speed;
      const dy = Math.sin(path.direction) * path.speed;
      
      path.currentX += dx;
      path.currentY += dy;

      if (path.currentX < 0) path.currentX = window.innerWidth;
      if (path.currentX > window.innerWidth) path.currentX = 0;
      if (path.currentY < 0) path.currentY = window.innerHeight;
      if (path.currentY > window.innerHeight) path.currentY = 0;

      path.points.push(`L ${path.currentX} ${path.currentY}`);

      return path;
    });

    setPaths(pathsRef.current.map(path => ({
      id: path.id,
      d: path.points.join(' ')
    })));

    requestRef.current = requestAnimationFrame(updatePaths);
  };

  useEffect(() => {
    pathsRef.current = Array.from({ length: 5 }, createNewLine);
    requestRef.current = requestAnimationFrame(updatePaths);

    const interval = setInterval(() => {
      pathsRef.current = [...pathsRef.current, createNewLine()];
    }, 10000);

    return () => {
      cancelAnimationFrame(requestRef.current);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="entropy-background">
      <svg width="100%" height="100%" className="entropy-svg">
        {paths.map(path => (
          <path
            key={path.id}
            d={path.d}
            className="entropy-path"
          />
        ))}
      </svg>
    </div>
  );
};

function App() {
  const showLines = true;

  return (
    <div className="app-container">
      {showLines && <EntropyLines />}
      <StaticEffect />
      <div className="social-links">
        <a 
          href="https://discord.gg/SYscNRHT" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Join our Discord"
        >
          <img 
            src={discordIcon} 
            alt="Join our Discord" 
            className="social-icon"
          />
        </a>
        <a 
          href="https://steamcommunity.com/groups/entropysoftworks" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Join our Steam Community"
        >
          <img 
            src={steamIcon} 
            alt="Join our Steam Community" 
            className="social-icon"
          />
        </a>
      </div>
      <div className="content-wrapper">
        <div className="logo-container">
          <div className="logo-glow"></div>
          <img 
            src={logo} 
            alt="Entropy Softworks Logo" 
            className="logo"
          />
        </div>
      </div>
    </div>
  )
}

export default App