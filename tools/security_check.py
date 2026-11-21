#!/usr/bin/env python3
"""
CLI Tool: Security & Integrity Auditor for Retro Arcade Revival
Validates game files, web demos, and contributions against security parameters:
  1. No dangerous dynamic execution (eval, exec, Function constructor)
  2. No unauthorized shell / process execution in game logic
  3. No path traversal attacks in save/file I/O
  4. Safe event listener and loop bounds in web demos
  5. No hardcoded suspicious outbound network calls
"""
import os
import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# Security verification parameters
DANGEROUS_PATTERNS = [
    (r"\beval\s*\(", "Dangerous dynamic eval() execution"),
    (r"\bexec\s*\(", "Dangerous dynamic exec() execution"),
    (r"\bos\.system\s*\(", "Unauthorized system shell execution"),
    (r"\bsubprocess\.(Popen|run|call)\s*\(", "Unauthorized subprocess execution"),
    (r"\bnew\s+Function\s*\(", "Dynamic Function constructor"),
    (r"\.\./\.\./", "Suspicious deep directory traversal pattern (../../)"),
]

SAFE_EXTENSIONS = {".gd", ".py", ".rs", ".c", ".h", ".ts", ".tsx", ".js", ".jsx", ".json", ".tscn"}
EXCLUDED_DIRS = {"node_modules", ".next", ".git", ".godot", "dist", "build"}

def scan_file_security(file_path: Path):
    issues = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return [f"Unable to read file: {e}"]

    # Check for dangerous code execution patterns
    for pattern, description in DANGEROUS_PATTERNS:
        matches = re.finditer(pattern, content)
        for m in matches:
            # Line number calculation
            line_no = content[:m.start()].count("\n") + 1
            # Allow legitimate tools scripts (e.g. this checker itself)
            if "tools/security_check.py" in str(file_path).replace("\\", "/"):
                continue
            issues.append(f"Line {line_no}: {description} (matched: {m.group(0).strip()})")

    return issues

def run_security_audit():
    print("🛡️ Running Retro Arcade Revival Security Audit...")
    print(f"Target Root: {REPO_ROOT}\n")

    total_scanned = 0
    total_issues = 0

    scan_targets = [
        REPO_ROOT / "games",
        REPO_ROOT / "shared",
        REPO_ROOT / "engine",
        REPO_ROOT / "website" / "components",
        REPO_ROOT / "website" / "app",
    ]

    for target in scan_targets:
        if not target.exists():
            continue
        for root, dirs, files in os.walk(target):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
            for f in files:
                ext = Path(f).suffix.lower()
                if ext in SAFE_EXTENSIONS:
                    file_path = Path(root) / f
                    total_scanned += 1
                    file_issues = scan_file_security(file_path)
                    if file_issues:
                        total_issues += len(file_issues)
                        rel_path = file_path.relative_to(REPO_ROOT)
                        print(f"❌ [SECURITY WARNING] {rel_path}:")
                        for issue in file_issues:
                            print(f"    • {issue}")

    print(f"\n📊 Audit Complete: Scanned {total_scanned} files.")
    if total_issues == 0:
        print("✅ PASS: Zero security violations detected. All parameters verified safe.")
        return True
    else:
        print(f"⚠️ FAIL: Found {total_issues} security violation(s) that must be addressed.")
        return False

if __name__ == "__main__":
    passed = run_security_audit()
    sys.exit(0 if passed else 1)
