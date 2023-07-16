import React from 'react';

const AlgorithmSelector = ({ algorithm, setAlgorithm }) => {
  return (
    <div>
      <label>Select an algorithm:</label>
      <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
        <option value="bfs">Breadth-First Search</option>
        <option value="astar">A*</option>
      </select>
    </div>
  );
}

export default AlgorithmSelector;
