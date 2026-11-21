extends Control

# Block Drop — Open-Source Falling Polyomino Game
# Inspired by vintage 1980s falling puzzle gameplay.
# Clean-room original implementation.

const COLS: int = 10
const ROWS: int = 20
const CELL_SIZE: int = 28

# Distinct modern color palette for the 7 standard polyominoes
const COLORS = [
	Color(0.1, 0.12, 0.16),  # 0: Empty
	Color(0.2, 0.7, 0.9),    # 1: I-shape (Cyan)
	Color(0.95, 0.8, 0.2),   # 2: O-shape (Yellow)
	Color(0.65, 0.3, 0.85),  # 3: T-shape (Purple)
	Color(0.3, 0.85, 0.4),   # 4: S-shape (Green)
	Color(0.9, 0.3, 0.3),    # 5: Z-shape (Red)
	Color(0.3, 0.45, 0.9),   # 6: J-shape (Blue)
	Color(0.95, 0.55, 0.2),  # 7: L-shape (Orange)
]

# Shape definitions: coordinates for 4 rotation states
const SHAPES = {
	1: [ # I
		[Vector2i(0, 1), Vector2i(1, 1), Vector2i(2, 1), Vector2i(3, 1)],
		[Vector2i(2, 0), Vector2i(2, 1), Vector2i(2, 2), Vector2i(2, 3)],
		[Vector2i(0, 2), Vector2i(1, 2), Vector2i(2, 2), Vector2i(3, 2)],
		[Vector2i(1, 0), Vector2i(1, 1), Vector2i(1, 2), Vector2i(1, 3)]
	],
	2: [ # O
		[Vector2i(1, 0), Vector2i(2, 0), Vector2i(1, 1), Vector2i(2, 1)],
		[Vector2i(1, 0), Vector2i(2, 0), Vector2i(1, 1), Vector2i(2, 1)],
		[Vector2i(1, 0), Vector2i(2, 0), Vector2i(1, 1), Vector2i(2, 1)],
		[Vector2i(1, 0), Vector2i(2, 0), Vector2i(1, 1), Vector2i(2, 1)]
	],
	3: [ # T
		[Vector2i(1, 0), Vector2i(0, 1), Vector2i(1, 1), Vector2i(2, 1)],
		[Vector2i(1, 0), Vector2i(1, 1), Vector2i(2, 1), Vector2i(1, 2)],
		[Vector2i(0, 1), Vector2i(1, 1), Vector2i(2, 1), Vector2i(1, 2)],
		[Vector2i(1, 0), Vector2i(0, 1), Vector2i(1, 1), Vector2i(1, 2)]
	],
	4: [ # S
		[Vector2i(1, 0), Vector2i(2, 0), Vector2i(0, 1), Vector2i(1, 1)],
		[Vector2i(1, 0), Vector2i(1, 1), Vector2i(2, 1), Vector2i(2, 2)],
		[Vector2i(1, 1), Vector2i(2, 1), Vector2i(0, 2), Vector2i(1, 2)],
		[Vector2i(0, 0), Vector2i(0, 1), Vector2i(1, 1), Vector2i(1, 2)]
	],
	5: [ # Z
		[Vector2i(0, 0), Vector2i(1, 0), Vector2i(1, 1), Vector2i(2, 1)],
		[Vector2i(2, 0), Vector2i(1, 1), Vector2i(2, 1), Vector2i(1, 2)],
		[Vector2i(0, 1), Vector2i(1, 1), Vector2i(1, 2), Vector2i(2, 2)],
		[Vector2i(1, 0), Vector2i(0, 1), Vector2i(1, 1), Vector2i(0, 2)]
	],
	6: [ # J
		[Vector2i(0, 0), Vector2i(0, 1), Vector2i(1, 1), Vector2i(2, 1)],
		[Vector2i(1, 0), Vector2i(2, 0), Vector2i(1, 1), Vector2i(1, 2)],
		[Vector2i(0, 1), Vector2i(1, 1), Vector2i(2, 1), Vector2i(2, 2)],
		[Vector2i(1, 0), Vector2i(1, 1), Vector2i(0, 2), Vector2i(1, 2)]
	],
	7: [ # L
		[Vector2i(2, 0), Vector2i(0, 1), Vector2i(1, 1), Vector2i(2, 1)],
		[Vector2i(1, 0), Vector2i(1, 1), Vector2i(1, 2), Vector2i(2, 2)],
		[Vector2i(0, 1), Vector2i(1, 1), Vector2i(2, 1), Vector2i(0, 2)],
		[Vector2i(0, 0), Vector2i(1, 0), Vector2i(1, 1), Vector2i(1, 2)]
	]
}

var grid: Array = []
var current_shape_id: int = 1
var current_rotation: int = 0
var current_pos := Vector2i(3, 0)

var next_shape_id: int = 1
var hold_shape_id: int = 0
var can_hold: bool = true

var score: int = 0
var lines_cleared: int = 0
var level: int = 1
var game_over: bool = false
var paused: bool = false

var fall_timer: float = 0.0
var fall_delay: float = 0.8

var board_offset := Vector2(280, 80)

func _ready() -> void:
	init_grid()
	randomize()
	next_shape_id = randi_range(1, 7)
	spawn_piece()

func init_grid() -> void:
	grid.clear()
	for y in range(ROWS):
		var row := []
		for x in range(COLS):
			row.append(0)
		grid.append(row)

func spawn_piece() -> void:
	current_shape_id = next_shape_id
	next_shape_id = randi_range(1, 7)
	current_rotation = 0
	current_pos = Vector2i(3, 0)
	can_hold = true

	if not is_valid_position(current_pos, current_shape_id, current_rotation):
		game_over = true

func _process(delta: float) -> void:
	if game_over or paused:
		queue_redraw()
		return

	fall_timer += delta
	if fall_timer >= fall_delay:
		fall_timer = 0.0
		step_down()

	queue_redraw()

func step_down() -> bool:
	var next_pos = current_pos + Vector2i(0, 1)
	if is_valid_position(next_pos, current_shape_id, current_rotation):
		current_pos = next_pos
		return true
	else:
		lock_piece()
		return false

func lock_piece() -> void:
	var cells = get_cells(current_shape_id, current_rotation)
	for cell in cells:
		var gx = current_pos.x + cell.x
		var gy = current_pos.y + cell.y
		if gy >= 0 and gy < ROWS and gx >= 0 and gx < COLS:
			grid[gy][gx] = current_shape_id

	clear_lines()
	spawn_piece()

func clear_lines() -> void:
	var cleared := 0
	var y := ROWS - 1
	while y >= 0:
		var full := true
		for x in range(COLS):
			if grid[y][x] == 0:
				full = false
				break
		if full:
			cleared += 1
			grid.remove_at(y)
			var empty_row := []
			for x in range(COLS):
				empty_row.append(0)
			grid.insert(0, empty_row)
		else:
			y -= 1

	if cleared > 0:
		lines_cleared += cleared
		var points = [0, 100, 300, 500, 800][cleared] * level
		score += points
		level = 1 + int(lines_cleared / 10)
		fall_delay = max(0.1, 0.8 - (level - 1) * 0.07)

func hard_drop() -> void:
	while is_valid_position(current_pos + Vector2i(0, 1), current_shape_id, current_rotation):
		current_pos.y += 1
		score += 2
	lock_piece()

func rotate_piece() -> void:
	var next_rot = (current_rotation + 1) % 4
	# Wall kicks
	var kicks = [Vector2i(0, 0), Vector2i(-1, 0), Vector2i(1, 0), Vector2i(0, -1)]
	for kick in kicks:
		if is_valid_position(current_pos + kick, current_shape_id, next_rot):
			current_pos += kick
			current_rotation = next_rot
			return

func hold_current_piece() -> void:
	if not can_hold:
		return
	can_hold = false
	if hold_shape_id == 0:
		hold_shape_id = current_shape_id
		spawn_piece()
	else:
		var temp = hold_shape_id
		hold_shape_id = current_shape_id
		current_shape_id = temp
		current_rotation = 0
		current_pos = Vector2i(3, 0)

func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed:
		if event.keycode == KEY_ESCAPE:
			get_tree().change_scene_to_file("res://engine/launcher.tscn")
			return

		if game_over:
			if event.keycode == KEY_R or event.keycode == KEY_SPACE:
				restart()
			return

		if event.keycode == KEY_LEFT or event.keycode == KEY_A:
			var test_pos = current_pos + Vector2i(-1, 0)
			if is_valid_position(test_pos, current_shape_id, current_rotation):
				current_pos = test_pos
		elif event.keycode == KEY_RIGHT or event.keycode == KEY_D:
			var test_pos = current_pos + Vector2i(1, 0)
			if is_valid_position(test_pos, current_shape_id, current_rotation):
				current_pos = test_pos
		elif event.keycode == KEY_DOWN or event.keycode == KEY_S:
			if step_down():
				score += 1
		elif event.keycode == KEY_UP or event.keycode == KEY_W:
			rotate_piece()
		elif event.keycode == KEY_SPACE:
			hard_drop()
		elif event.keycode == KEY_C or event.keycode == KEY_SHIFT:
			hold_current_piece()

func restart() -> void:
	init_grid()
	score = 0
	lines_cleared = 0
	level = 1
	fall_delay = 0.8
	hold_shape_id = 0
	game_over = false
	spawn_piece()

func is_valid_position(pos: Vector2i, shape_id: int, rot: int) -> bool:
	var cells = get_cells(shape_id, rot)
	for cell in cells:
		var x = pos.x + cell.x
		var y = pos.y + cell.y
		if x < 0 or x >= COLS or y >= ROWS:
			return false
		if y >= 0 and grid[y][x] != 0:
			return false
	return true

func get_cells(shape_id: int, rot: int) -> Array:
	return SHAPES[shape_id][rot % 4]

func get_ghost_y() -> int:
	var gy = current_pos.y
	while is_valid_position(Vector2i(current_pos.x, gy + 1), current_shape_id, current_rotation):
		gy += 1
	return gy

func _draw() -> void:
	# Background
	draw_rect(Rect2(Vector2.ZERO, size), Color(0.08, 0.09, 0.12), true)

	# Board Frame
	var board_rect = Rect2(board_offset, Vector2(COLS * CELL_SIZE, ROWS * CELL_SIZE))
	draw_rect(board_rect, Color(0.04, 0.05, 0.07), true)
	draw_rect(board_rect, Color(0.25, 0.3, 0.4), false, 2.0)

	# Grid lines
	for x in range(1, COLS):
		var p1 = board_offset + Vector2(x * CELL_SIZE, 0)
		var p2 = board_offset + Vector2(x * CELL_SIZE, ROWS * CELL_SIZE)
		draw_line(p1, p2, Color(0.12, 0.15, 0.2), 1.0)
	for y in range(1, ROWS):
		var p1 = board_offset + Vector2(0, y * CELL_SIZE)
		var p2 = board_offset + Vector2(COLS * CELL_SIZE, y * CELL_SIZE)
		draw_line(p1, p2, Color(0.12, 0.15, 0.2), 1.0)

	# Draw placed blocks
	for y in range(ROWS):
		for x in range(COLS):
			var val = grid[y][x]
			if val != 0:
				var cell_rect = Rect2(board_offset + Vector2(x * CELL_SIZE + 1, y * CELL_SIZE + 1), Vector2(CELL_SIZE - 2, CELL_SIZE - 2))
				draw_rect(cell_rect, COLORS[val], true)

	if not game_over:
		# Draw Ghost Piece
		var ghost_y = get_ghost_y()
		var cells = get_cells(current_shape_id, current_rotation)
		for cell in cells:
			var gx = current_pos.x + cell.x
			var gy = ghost_y + cell.y
			if gy >= 0:
				var ghost_rect = Rect2(board_offset + Vector2(gx * CELL_SIZE + 1, gy * CELL_SIZE + 1), Vector2(CELL_SIZE - 2, CELL_SIZE - 2))
				draw_rect(ghost_rect, Color(1, 1, 1, 0.15), false, 1.5)

		# Draw Active Piece
		for cell in cells:
			var gx = current_pos.x + cell.x
			var gy = current_pos.y + cell.y
			if gy >= 0:
				var active_rect = Rect2(board_offset + Vector2(gx * CELL_SIZE + 1, gy * CELL_SIZE + 1), Vector2(CELL_SIZE - 2, CELL_SIZE - 2))
				draw_rect(active_rect, COLORS[current_shape_id], true)

	# Side Panels: Score & Info
	var font = ThemeDB.fallback_font
	draw_string(font, Vector2(600, 100), "BLOCK DROP", HORIZONTAL_ALIGNMENT_LEFT, -1, 24, Color.WHITE)
	draw_string(font, Vector2(600, 140), "SCORE: %d" % score, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color(0.9, 0.9, 0.9))
	draw_string(font, Vector2(600, 170), "LINES: %d" % lines_cleared, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color(0.9, 0.9, 0.9))
	draw_string(font, Vector2(600, 200), "LEVEL: %d" % level, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color(0.4, 0.7, 1.0))

	# Next Box
	draw_string(font, Vector2(600, 250), "NEXT:", HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color.WHITE)
	var next_box = Rect2(Vector2(600, 260), Vector2(100, 80))
	draw_rect(next_box, Color(0.05, 0.06, 0.08), true)
	draw_rect(next_box, Color(0.2, 0.25, 0.35), false, 1.0)
	var next_cells = get_cells(next_shape_id, 0)
	for cell in next_cells:
		var nr = Rect2(Vector2(615 + cell.x * 18, 275 + cell.y * 18), Vector2(16, 16))
		draw_rect(nr, COLORS[next_shape_id], true)

	# Hold Box
	draw_string(font, Vector2(120, 100), "HOLD (C):", HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color.WHITE)
	var hold_box = Rect2(Vector2(120, 110), Vector2(100, 80))
	draw_rect(hold_box, Color(0.05, 0.06, 0.08), true)
	draw_rect(hold_box, Color(0.2, 0.25, 0.35), false, 1.0)
	if hold_shape_id != 0:
		var hold_cells = get_cells(hold_shape_id, 0)
		for cell in hold_cells:
			var hr = Rect2(Vector2(135 + cell.x * 18, 125 + cell.y * 18), Vector2(16, 16))
			draw_rect(hr, COLORS[hold_shape_id], true)

	# Controls Help
	draw_string(font, Vector2(120, 300), "CONTROLS:", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(0.7, 0.7, 0.7))
	draw_string(font, Vector2(120, 325), "◄/► : Move", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(0.6, 0.6, 0.6))
	draw_string(font, Vector2(120, 345), "▲   : Rotate", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(0.6, 0.6, 0.6))
	draw_string(font, Vector2(120, 365), "▼   : Soft Drop", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(0.6, 0.6, 0.6))
	draw_string(font, Vector2(120, 385), "SPACE : Hard Drop", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(0.6, 0.6, 0.6))
	draw_string(font, Vector2(120, 405), "C : Hold Piece", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(0.6, 0.6, 0.6))
	draw_string(font, Vector2(120, 435), "ESC : Hub Launcher", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(0.8, 0.5, 0.5))

	if game_over:
		var overlay = Rect2(board_offset, Vector2(COLS * CELL_SIZE, ROWS * CELL_SIZE))
		draw_rect(overlay, Color(0, 0, 0, 0.8), true)
		draw_string(font, board_offset + Vector2(40, 240), "GAME OVER", HORIZONTAL_ALIGNMENT_LEFT, -1, 26, Color(1, 0.3, 0.3))
		draw_string(font, board_offset + Vector2(20, 280), "Press R to Restart", HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color.WHITE)
