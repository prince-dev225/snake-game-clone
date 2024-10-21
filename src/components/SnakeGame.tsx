import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };
const GAME_SPEED = 150; // Slower speed

type Position = { x: number; y: number };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Check for collisions
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => prevScore + 1);
        setFood(getRandomFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getRandomFood = (snake: Position[]): Position => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-green-500">Snake Game</h1>
      <div className="mb-4 text-white">Score: {score}</div>
      <div
        className="grid bg-gray-800"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          gap: '1px',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`w-5 h-5 ${
                isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-700'
              }`}
            />
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-4 text-red-500 text-2xl font-bold">Game Over!</div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetGame}
      >
        {gameOver ? 'Play Again' : 'Reset Game'}
      </button>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button className="p-2 bg-gray-700 text-white rounded" onClick={() => setDirection({ x: 0, y: -1 })}>
          <ChevronUp size={24} />
        </button>
        <button className="p-2 bg-gray-700 text-white rounded" onClick={() => setDirection({ x: 0, y: 1 })}>
          <ChevronDown size={24} />
        </button>
        <button className="p-2 bg-gray-700 text-white rounded" onClick={() => setDirection({ x: -1, y: 0 })}>
          <ChevronLeft size={24} />
        </button>
        <button className="p-2 bg-gray-700 text-white rounded" onClick={() => setDirection({ x: 1, y: 0 })}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;