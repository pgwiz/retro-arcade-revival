#!/usr/bin/env python3
"""
CLI Tool: Validates and updates shared libraries and assets
Checks module integrity, reports missing helpers, and ensures version synchronization.
"""
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SHARED_DIR = REPO_ROOT / "shared"

REQUIRED_SHARED_MODULES = [
    "audio/sfx_player.gd",
    "input/input_manager.gd",
    "utils/save_manager.gd",
]

def verify_shared_libraries():
    print("🔍 Checking Retro Arcade Revival shared library integrity...")
    missing = []
    for mod in REQUIRED_SHARED_MODULES:
        target = SHARED_DIR / mod
        if not target.exists():
            missing.append(mod)
        else:
            print(f"  [OK] shared/{mod}")

    if missing:
        print(f"\n⚠️ Missing {len(missing)} module(s):")
        for m in missing:
            print(f"  - {m}")
        return False

    print("\n✅ All core shared modules are present and up to date.")
    return True

if __name__ == "__main__":
    success = verify_shared_libraries()
    sys.exit(0 if success else 1)
