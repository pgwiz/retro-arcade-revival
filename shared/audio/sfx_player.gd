class_name SFXPlayer
extends Node

# Shared Retro Procedural Audio Player
# Generates classic 8-bit sound effects without external copyrighted audio samples.

static func play_beep(tree: SceneTree, freq: float = 440.0, duration: float = 0.08) -> void:
	var player := AudioStreamPlayer.new()
	var generator := AudioStreamGenerator.new()
	generator.mix_rate = 22050
	generator.buffer_length = 0.2
	player.stream = generator
	tree.root.add_child(player)
	player.play()

	var playback = player.get_stream_playback()
	if playback:
		var sample_count := int(generator.mix_rate * duration)
		var phase := 0.0
		var phase_increment := freq / generator.mix_rate
		for i in range(sample_count):
			var sample := 0.2 if fmod(phase, 1.0) < 0.5 else -0.2
			playback.push_frame(Vector2(sample, sample))
			phase += phase_increment

	var timer := tree.create_timer(duration + 0.05)
	timer.timeout.connect(func():
		player.stop()
		player.queue_free()
	)

static func play_line_clear(tree: SceneTree) -> void:
	play_beep(tree, 587.33, 0.06) # D5
	var timer := tree.create_timer(0.07)
	timer.timeout.connect(func():
		play_beep(tree, 880.0, 0.12) # A5
	)

static func play_drop(tree: SceneTree) -> void:
	play_beep(tree, 220.0, 0.04)
