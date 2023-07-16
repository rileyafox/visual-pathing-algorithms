import heapq

DIRECTIONS = [
    (-1, 0),  # Up
    (1, 0),   # Down
    (0, -1),  # Left
    (0, 1),   # Right
]

def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def astar_pathfinding(board, start, end):
    queue = []
    heapq.heappush(queue, (0, start))
    came_from = {start: None}
    cost_so_far = {start: 0}
    explored_cells = []

    while queue:
        (priority, current) = heapq.heappop(queue)

        # add current cell to explored cells
        if current not in [start, end]:  # we exclude start and end points
            explored_cells.append(list(current))

        if current == end:
            break

        for direction in DIRECTIONS:
            next_cell = (current[0] + direction[0], current[1] + direction[1])
            new_cost = cost_so_far[current] + 1
            if (0 <= next_cell[0] < len(board) and 
                0 <= next_cell[1] < len(board[0]) and 
                board[next_cell[0]][next_cell[1]] != 'obstacle' and 
                (next_cell not in cost_so_far or new_cost < cost_so_far[next_cell])):
                cost_so_far[next_cell] = new_cost
                priority = new_cost + heuristic(end, next_cell)
                heapq.heappush(queue, (priority, next_cell))
                came_from[next_cell] = current

    if end not in came_from:
        return {'path': None, 'explored_cells': explored_cells}

    path = []
    node = end
    while node is not None:
        path.append(node)
        node = came_from[node]
    path.reverse()

    return {'path': path, 'explored_cells': explored_cells}
