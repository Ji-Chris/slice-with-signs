// import React, { useEffect, useState, useRef } from 'react';

// const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// const getRandomLetter = () => {
//   return letters[Math.floor(Math.random() * letters.length)];
// };

// const generateFruit = (id) => ({
//   id,
//   letter: getRandomLetter(),
//   y: 0,
//   x: Math.random() * 90 + 5, // percentage for horizontal position
// });

// export default function App() {
//   const [fruits, setFruits] = useState([]);
//   const [score, setScore] = useState(0);
//   const [misses, setMisses] = useState(0);
//   const fruitId = useRef(0);

//   // Spawn new fruit every 2 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFruits((prev) => [...prev, generateFruit(fruitId.current++)]);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   // Fruit falling animation
//   useEffect(() => {
//     const fallInterval = setInterval(() => {
//       setFruits((prev) =>
//         prev.map((fruit) => ({ ...fruit, y: fruit.y + 5 }))
//       );
//     }, 500);
//     return () => clearInterval(fallInterval);
//   }, []);

//   // Remove fruits that fall below screen
//   useEffect(() => {
//     setFruits((prev) =>
//       prev.filter((fruit) => {
//         if (fruit.y >= 100) {
//           setMisses((m) => m + 1);
//           return false;
//         }
//         return true;
//       })
//     );
//   }, [fruits]);

//   // Handle keyboard input
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const key = e.key.toUpperCase();
//       setFruits((prev) => {
//         const index = prev.findIndex((f) => f.letter === key);
//         if (index !== -1) {
//           setScore((s) => s + 1);
//           return prev.filter((_, i) => i !== index);
//         }
//         return prev;
//       });
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white relative overflow-hidden">
//       <div className="p-4 text-xl font-bold">Score: {score} | Misses: {misses}</div>
//       <div className="absolute inset-0">
//         {fruits.map((fruit) => (
//           <div
//             key={fruit.id}
//             className="absolute text-3xl font-bold"
//             style={{
//               top: `${fruit.y}%`,
//               left: `${fruit.x}%`,
//               transition: 'top 0.5s linear',
//             }}
//           >
//             🍉 {fruit.letter}
//           </div>
//         ))}
//       </div>
//       {misses >= 5 && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-4xl font-bold">
//           Game Over! Final Score: {score}
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState, useRef } from 'react';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getRandomLetter = () => {
  return letters[Math.floor(Math.random() * letters.length)];
};

const generateFruit = (id) => ({
  id,
  letter: getRandomLetter(),
  y: 0,
  x: Math.random() * 90 + 5, // percentage for horizontal position
});

export default function App() {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const fruitId = useRef(0);

  // Spawn new fruit every 2 seconds
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setFruits((prev) => [...prev, generateFruit(fruitId.current++)]);
    }, 2000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Fruit falling animation
  useEffect(() => {
    if (gameOver) return;
    const fallInterval = setInterval(() => {
      setFruits((prev) =>
        prev.map((fruit) => ({ ...fruit, y: fruit.y + 5 }))
      );
    }, 500);
    return () => clearInterval(fallInterval);
  }, [gameOver]);

  // Remove fruits that fall below screen
  useEffect(() => {
    setFruits((prev) =>
      prev.filter((fruit) => {
        if (fruit.y >= 100) {
          setMisses((m) => {
            const newMisses = m + 1;
            if (newMisses >= 6) {
              setGameOver(true);
              setScore(0);
            }
            return newMisses;
          });
          return false;
        }
        return true;
      })
    );
  }, [fruits]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      const key = e.key.toUpperCase();
      setFruits((prev) => {
        const index = prev.findIndex((f) => f.letter === key);
        if (index !== -1) {
          setScore((s) => s + 1);
          return prev.filter((_, i) => i !== index);
        }
        return prev;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  const handleRestart = () => {
    setScore(0);
    setMisses(0);
    setFruits([]);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="p-4 text-xl font-bold">Score: {score} | Misses: {misses}</div>
      <div className="absolute inset-0">
        {fruits.map((fruit) => (
          <div
            key={fruit.id}
            className="absolute text-3xl font-bold"
            style={{
              top: `${fruit.y}%`,
              left: `${fruit.x}%`,
              transition: 'top 0.5s linear',
            }}
          >
            🍉 {fruit.letter}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-center">
          <div className="text-4xl font-bold mb-4">Game Over!</div>
          <div className="text-xl mb-6">Final Score: {score}</div>
          <div className="space-x-4">
            <button onClick={handleRestart} className="bg-green-600 px-4 py-2 rounded-xl text-xl font-semibold">Restart</button>
            <button onClick={() => window.close()} className="bg-red-600 px-4 py-2 rounded-xl text-xl font-semibold">Quit</button>
          </div>
        </div>
      )}
    </div>
  );
}
