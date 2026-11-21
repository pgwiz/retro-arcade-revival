extends Control

# Engine Launcher & Hub
var registry: Array = []
var selected_index: int = 0

@onready var game_list_container: VBoxContainer = $VBox/MainLayout/GamesScroll/GamesList
@onready var title_label: Label = $VBox/MainLayout/DetailsPanel/Margin/DetailsVBox/TitleLabel
@onready var meta_label: Label = $VBox/MainLayout/DetailsPanel/Margin/DetailsVBox/MetaLabel
@onready var desc_label: Label = $VBox/MainLayout/DetailsPanel/Margin/DetailsVBox/DescLabel
@onready var controls_label: Label = $VBox/MainLayout/DetailsPanel/Margin/DetailsVBox/ControlsLabel
@onready var play_btn: Button = $VBox/MainLayout/DetailsPanel/Margin/DetailsVBox/PlayButton

func _ready() -> void:
	load_game_registry()
	build_game_list()
	if registry.size() > 0:
		select_game(0)
	play_btn.pressed.connect(_on_play_pressed)

func load_game_registry() -> void:
	var path := "res://engine/game_registry.json"
	if FileAccess.file_exists(path):
		var file := FileAccess.open(path, FileAccess.READ)
		var text := file.get_as_text()
		var json = JSON.parse_string(text)
		if json and json.has("games"):
			registry = json["games"]

func build_game_list() -> void:
	for child in game_list_container.get_children():
		child.queue_free()

	for i in range(registry.size()):
		var game = registry[i]
		var btn := Button.new()
		var status_icon := "🔨" if game.get("status") == "in_progress" else "📋"
		btn.text = "%s %s [%s]" % [status_icon, game.get("title", "Untitled"), game.get("genre", "")]
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		btn.custom_minimum_size = Vector2(280, 44)
		var idx := i
		btn.pressed.connect(func(): select_game(idx))
		game_list_container.add_child(btn)

func select_game(index: int) -> void:
	if index < 0 or index >= registry.size():
		return
	selected_index = index
	var game = registry[index]
	title_label.text = game.get("title", "")
	meta_label.text = "Genre: %s | Dimension: %s | Lead: %s | Status: %s" % [
		game.get("genre", "Unknown"),
		game.get("dimension", "2D"),
		game.get("lead_engine", "Godot"),
		game.get("status", "planned").to_upper()
	]
	desc_label.text = game.get("summary", "")
	controls_label.text = "Controls:\n" + game.get("controls", "Standard arcade inputs.")

	var is_available = ResourceLoader.exists(game.get("path", ""))
	play_btn.disabled = not is_available
	if is_available:
		play_btn.text = "▶ PLAY NOW"
	else:
		play_btn.text = "🔨 IN ACTIVE DEVELOPMENT"

func _on_play_pressed() -> void:
	if selected_index >= 0 and selected_index < registry.size():
		var game = registry[selected_index]
		var target_path: String = game.get("path", "")
		if ResourceLoader.exists(target_path):
			get_tree().change_scene_to_file(target_path)
