import React, { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import axios from 'axios';
import ControlPanel from './ControlPanel'; 
import '../styles/Board.css';

const START = [0, 0];
const END = [9, 9];
const OBSTACLE_PERCENT = 0.2; 

function createBoard() {
  const board = Array.from({length: 10}, () => Array(10).fill('empty'));
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (Math.random() < OBSTACLE_PERCENT && !(i === START[0] && j === START[1]) && !(i === END[0] && j === END[1])) {
        board[i][j] = 'obstacle';
      }
    }
  }
  board[START[0]][START[1]] = 'start';
  board[END[0]][END[1]] = 'end';
  return board;
}

export default function Board() {
  const [board, setBoard] = useState(createBoard());
  const [exploredCells, setExploredCells] = useState([]);
  const [path, setPath] = useState([]);
  const [isExplorationDone, setIsExplorationDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); 
  const [algorithm, setAlgorithm] = useState('bfs'); 

  const startPathfinding = async () => {
    setIsLoading(true);
    setHasStarted(true);
    const res = await axios.post('http://localhost:5000/api/pathfinding', {
      board,
      start: START,
      end: END,
      algorithm
    });
    setPath(res.data.path);
    setExploredCells(res.data.explored);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading || !hasStarted) return; 
    const timerId = setInterval(() => {
      if (exploredCells.length) {
        const nextCell = exploredCells[0];
        setExploredCells(exploredCells.slice(1));
        setBoard(board => {
          const newBoard = [...board];
          newBoard[nextCell[0]][nextCell[1]] = 'explored';
          return newBoard;
        });
      } else {
        setIsExplorationDone(true);
        clearInterval(timerId);
      }
    }, 200);
    return () => clearInterval(timerId);
  }, [exploredCells, isLoading, hasStarted]); 

  useEffect(() => {
    if (isLoading || !hasStarted) return; 
    if (isExplorationDone) {
      const timerId = setInterval(() => {
        if (path.length) {
          const nextCell = path[0];
          setPath(path.slice(1));
          setBoard(board => {
            const newBoard = [...board];
            newBoard[nextCell[0]][nextCell[1]] = 'path';
            return newBoard;
          });
        } else {
          clearInterval(timerId);
        }
      }, 200);
      return () => clearInterval(timerId);
    }
  }, [isExplorationDone, path, isLoading, hasStarted]); 

  return (
    <div>
      <div className="board">
        {board.map((row, i) => row.map((cell, j) => (
          <Paper
            key={`${i}-${j}`} 
            elevation={cell === 'obstacle' ? 6 : ((i + j) % 2 === 0) ? 1 : 3}
            className={`cell ${cell}`}
          />
        )))}
      </div>
      <ControlPanel algorithm={algorithm} setAlgorithm={setAlgorithm} startPathfinding={startPathfinding} />
    </div>
  );
}
