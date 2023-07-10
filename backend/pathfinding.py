from collections import deque

# Directions to move in the grid
DIRECTIONS = [
    (-1, 0),  # Up
    (1, 0),   # Down
    (0, -1),  # Left
    (0, 1),   # Right
]

def bfs_pathfinding(board, start, end):
    queue = deque([(start, [])])  # Queue stores the current cell and the path to it
    visited = set([start])  # Set stores visited cells

    while queue:
        (current, path) = queue.popleft()
        if current == end:
            return path + [end]  # Return the path to the end

        for direction in DIRECTIONS:
            # Compute the next cell
            next_cell = (current[0] + direction[0], current[1] + direction[1])
            # Check if the next cell is within the board and not an obstacle
            if (0 <= next_cell[0] < len(board) and 
                0 <= next_cell[1] < len(board[0]) and 
                board[next_cell[0]][next_cell[1]] != 'obstacle' and
                next_cell not in visited):
                queue.append((next_cell, path + [current]))  # Append the next cell and path to it
                visited.add(next_cell)  # Mark the next cell as visited

    return None  # Return None if there's no path
