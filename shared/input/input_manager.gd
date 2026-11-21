class_name InputManager
extends RefCounted

# Shared Input Abstraction
# Unifies keyboard arrow keys, WASD, and gamepad buttons for retro games.

static func is_left_pressed() -> bool:
	return Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_A) or Input.is_joy_button_pressed(0, JOY_BUTTON_DPAD_LEFT)

static func is_right_pressed() -> bool:
	return Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_D) or Input.is_joy_button_pressed(0, JOY_BUTTON_DPAD_RIGHT)

static func is_down_pressed() -> bool:
	return Input.is_key_pressed(KEY_DOWN) or Input.is_key_pressed(KEY_S) or Input.is_joy_button_pressed(0, JOY_BUTTON_DPAD_DOWN)

static func is_up_pressed() -> bool:
	return Input.is_key_pressed(KEY_UP) or Input.is_key_pressed(KEY_W) or Input.is_joy_button_pressed(0, JOY_BUTTON_DPAD_UP)

static func is_action_pressed() -> bool:
	return Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_ENTER) or Input.is_joy_button_pressed(0, JOY_BUTTON_A)

static func is_back_pressed() -> bool:
	return Input.is_key_pressed(KEY_ESCAPE) or Input.is_joy_button_pressed(0, JOY_BUTTON_B)
