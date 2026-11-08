#!/usr/bin/env bash
# Encode a licensed stock or school-shot clip into the home page background video.
#   scripts/encode-hero-video.sh <input-video> [start-seconds] [duration-seconds]
# Writes src/assets/video/hero.mp4 (H.264), hero.webm (VP9) and hero-poster.jpg.
# The home page switches to the video hero automatically when hero.mp4 exists; rebuild after running.
# Requirements: ffmpeg. Keep clips 10-20 s, no audio, no identifiable children without a model release.
set -euo pipefail
IN="${1:?usage: $0 <input-video> [start] [duration]}"; START="${2:-0}"; DUR="${3:-16}"
OUT="src/assets/video"; mkdir -p "$OUT"
VF="scale=1920:-2:flags=lanczos,fps=25"
ffmpeg -hide_banner -loglevel error -y -ss "$START" -t "$DUR" -i "$IN" -an -vf "$VF" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 27 -movflags +faststart "$OUT/hero.mp4"
ffmpeg -hide_banner -loglevel error -y -ss "$START" -t "$DUR" -i "$IN" -an -vf "$VF" \
  -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 4 "$OUT/hero.webm"
ffmpeg -hide_banner -loglevel error -y -ss 1 -i "$OUT/hero.mp4" -frames:v 1 -q:v 4 "$OUT/hero-poster.jpg"
ls -lh "$OUT"
echo "Done. Run: node build.mjs"
