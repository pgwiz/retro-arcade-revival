class_name SaveManager
extends RefCounted

# Shared High Score & Progress Persistence
const SAVE_PATH := "user://arcade_scores.json"

static func save_high_score(game_id: String, score: int) -> void:
	var data := load_all_scores()
	var current_best: int = int(data.get(game_id, 0))
	if score > current_best:
		data[game_id] = score
		var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
		if file:
			file.store_string(JSON.stringify(data))

static func get_high_score(game_id: String) -> int:
	var data := load_all_scores()
	return int(data.get(game_id, 0))

static func load_all_scores() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if not file:
		return {}
	var text := file.get_as_text()
	var parsed = JSON.parse_string(text)
	return parsed if typeof(parsed) == TYPE_DICTIONARY else {}
