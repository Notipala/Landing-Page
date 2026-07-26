# Product GIF recorder

This folder contains the deterministic Playwright surface used to record the
five product GIFs in `demo_screenshot/`.

## Scenarios

- `question`
- `upload`
- `follow`
- `memory`
- `details`

Open `index.html?recordScenario=<scenario>` in a 960×640 Playwright page, then
run `record.mjs` as the Playwright page function. Frames are written to:

```text
/private/tmp/notipala-gif-<scenario>-frames/frame-0000.png
```

Encode a frame sequence with:

```bash
ffmpeg -framerate 8 \
  -i /private/tmp/notipala-gif-question-frames/frame-%04d.png \
  -filter_complex "[0:v]split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle" \
  -loop 0 question-answer-evidence-section-map.gif
```

The timings are defined near the top of `record.mjs`. Every scenario expands
the report panel before updating or interacting with the Section Map.
