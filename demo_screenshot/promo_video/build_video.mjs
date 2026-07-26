import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const scriptDir = dirname(fileURLToPath(import.meta.url));
const demoDir = resolve(scriptDir, "..");
const repoRoot = resolve(demoDir, "..");
const requestedLocale = process.argv.includes("--locale=en") ? "en" : "zh-tw";
const isEnglish = requestedLocale === "en";
const localeSlug = isEnglish ? "en" : "zh-tw";
const editionArgument = process.argv.find((argument) => argument.startsWith("--edition="));
const requestedEdition = editionArgument ? editionArgument.split("=", 2)[1].trim() : "";
if (requestedEdition && !/^[a-z0-9-]+$/i.test(requestedEdition)) {
  throw new Error("Edition must contain only letters, numbers, and hyphens.");
}
const editionSuffix = requestedEdition ? `-${requestedEdition}` : "";
const voiceName = isEnglish ? "Samantha" : "Meijia";
const layoutPath = join(scriptDir, "layout.html");
const subtitlesPath = join(scriptDir, isEnglish ? "subtitles-en.ass" : "subtitles.ass");
const outputVideo = join(demoDir, `notipala-product-tour-${localeSlug}${editionSuffix}.mp4`);
const outputPoster = join(demoDir, `notipala-product-tour-${localeSlug}${editionSuffix}-poster.png`);
const outputVoiceover = join(demoDir, `notipala-product-tour-${localeSlug}${editionSuffix}-voiceover.m4a`);
const transitionDuration = 0.5;
const frameRate = 30;
const introDuration = 9.5;
const outroDuration = 4;

const sources = {
  intro: join(demoDir, "notipala-growing-section-map-intro.mp4"),
  question: join(demoDir, "question-answer-evidence-section-map.gif"),
  upload: join(demoDir, "upload-file-section-map.gif"),
  followUp: join(demoDir, "follow-up-section-map.gif"),
  memory: join(demoDir, "memory-mode-reason-path-highlights.gif"),
  details: join(demoDir, "section-map-node-edge-details.gif"),
};

const demoScenes = isEnglish
  ? [
      { id: 1, source: sources.question, duration: 14.5 },
      { id: 2, source: sources.upload, duration: 10.5 },
      { id: 3, source: sources.followUp, duration: 11.5 },
      { id: 4, source: sources.memory, duration: 17 },
      { id: 5, source: sources.details, duration: 15 },
    ]
  : [
      { id: 1, source: sources.question, duration: 11.5 },
      { id: 2, source: sources.upload, duration: 8.5 },
      { id: 3, source: sources.followUp, duration: 8.5 },
      { id: 4, source: sources.memory, duration: 16.5 },
    ];

const segmentDurations = [
  introDuration,
  ...demoScenes.map((scene) => scene.duration),
  outroDuration,
];
const totalDuration =
  segmentDurations.reduce((sum, duration) => sum + duration, 0) -
  transitionDuration * (segmentDurations.length - 1);

const narrationZhTw = [
  {
    startMs: 500,
    maxDuration: 8.0,
    rate: 150,
    text: "每一個問題，都能成為知識的起點。當你持續探索，Section Map 也會跟著成長。",
  },
  {
    startMs: 9150,
    maxDuration: 10.5,
    rate: 150,
    text: "輸入問題，Notipala 不只整理回答，也把每個論點連回它的來源。展開 Evidence，就能立即確認答案的依據。",
  },
  {
    startMs: 20150,
    maxDuration: 7.4,
    rate: 150,
    text: "有自己的資料？直接上傳檔案。系統會讀取內容，建立一張可以追蹤的章節地圖。",
  },
  {
    startMs: 28150,
    maxDuration: 7.4,
    rate: 145,
    text: "接著追問，也不必重新開始。新的答案會沿著原有脈絡，讓地圖繼續長大。",
  },
  {
    startMs: 36150,
    maxDuration: 15.2,
    rate: 125,
    text: "切換到 Memory Mode，選擇想聚焦的 Section，再提出問題。Notipala 會標出實際使用的節點和推理路徑，讓答案如何形成，一目了然。",
  },
  {
    startMs: 52200,
    maxDuration: 3.4,
    rate: 150,
    text: "Notipala，讓問題，長成知識。",
  },
];

const narrationEnglish = [
  {
    startMs: 500,
    maxDuration: 8.1,
    rate: 145,
    text: "Every question can become the start of lasting knowledge. Keep exploring, and your Section Map grows alongside the way you think.",
  },
  {
    startMs: 9500,
    maxDuration: 13.3,
    rate: 145,
    text: "Ask once, and Notipala does more than organize an answer. Open Evidence to verify each claim, while the Section Map connects the sources, concepts, and decisions behind it.",
  },
  {
    startMs: 23500,
    maxDuration: 9.5,
    rate: 145,
    text: "Bring your own material by uploading a file. Notipala preserves its structure, indexes the content, and builds a connected map in the background.",
  },
  {
    startMs: 33500,
    maxDuration: 10.5,
    rate: 145,
    text: "Ask a follow-up without starting over. The previous context stays visible as new answers add sections and relationships to the same map.",
  },
  {
    startMs: 44500,
    maxDuration: 16,
    rate: 145,
    text: "In Memory Mode, choose the sections you want to focus on, then ask with that context. The selected nodes light up immediately, followed by the exact reasoning path Notipala used.",
  },
  {
    startMs: 61000,
    maxDuration: 14,
    rate: 145,
    text: "Select any node to inspect its Section note, or choose an edge to understand the relationship between sections. Every connection stays explainable, traceable, and easy to revisit.",
  },
  {
    startMs: 75500,
    maxDuration: 3.3,
    rate: 145,
    text: "Notipala. Turn every question into knowledge that compounds.",
  },
];

const narration = isEnglish ? narrationEnglish : narrationZhTw;

function ensureInputs() {
  const required = [layoutPath, subtitlesPath, ...Object.values(sources)];
  const missing = required.filter((path) => !existsSync(path));
  if (missing.length > 0) {
    throw new Error(`Missing required input(s):\n${missing.join("\n")}`);
  }
}

function run(command, args, label, options = {}) {
  process.stdout.write(`${label}\n`);
  return execFileSync(command, args, {
    encoding: options.encoding,
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
}

function runFfmpeg(args, label) {
  run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], label);
}

function probeDuration(path) {
  const output = run(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=nw=1:nk=1",
      path,
    ],
    `Probing ${path}`,
    { capture: true, encoding: "utf8" },
  );
  const duration = Number.parseFloat(output.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Could not determine duration for ${path}`);
  }
  return duration;
}

function loadPlaywright() {
  const candidates = [
    process.env.NOTIPALA_PLAYWRIGHT_PATH,
    "playwright",
    "/Users/liuzitang/.npm/_npx/fd3bca3c548369c0/node_modules/playwright",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      // Try the next local Playwright installation.
    }
  }

  throw new Error(
    "Playwright was not found. Set NOTIPALA_PLAYWRIGHT_PATH to a local Playwright package directory.",
  );
}

async function renderBackdrops(workDir) {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const outputs = [];

  try {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    await page.goto(pathToFileURL(layoutPath).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate((locale) => window.__setLocale(locale), requestedLocale);

    for (const scene of demoScenes) {
      const output = join(workDir, `backdrop-${scene.id}.png`);
      await page.evaluate((sceneId) => window.__setScene(sceneId), scene.id);
      await page.screenshot({ path: output, type: "png" });
      outputs.push(output);
      process.stdout.write(`Rendered backdrop ${scene.id}/${demoScenes.length}\n`);
    }

    const outro = join(workDir, "outro.png");
    await page.evaluate(() => window.__setScene("outro"));
    await page.screenshot({ path: outro, type: "png" });
    process.stdout.write("Rendered outro backdrop\n");

    return { scenes: outputs, outro };
  } finally {
    await browser.close();
  }
}

function encodeIntro(workDir) {
  const output = join(workDir, "segment-0.mp4");
  runFfmpeg(
    [
      "-i",
      sources.intro,
      "-vf",
      `fps=30,scale=1920:1080:flags=lanczos,setsar=1,tpad=stop_mode=clone:stop_duration=0.5,trim=duration=${introDuration},setpts=PTS-STARTPTS,format=yuv420p`,
      "-t",
      String(introDuration),
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "16",
      "-pix_fmt",
      "yuv420p",
      "-color_range",
      "tv",
      "-r",
      String(frameRate),
      output,
    ],
    "Encoding intro segment",
  );
  return output;
}

function encodeDemoScene(scene, backdrop, workDir) {
  const output = join(workDir, `segment-${scene.id}.mp4`);
  const sourceDuration = probeDuration(scene.source);
  const speedFactor = scene.duration / sourceDuration;
  const filter = [
    "[0:v]fps=30,scale=1920:1080:flags=lanczos,setsar=1[bg]",
    `[1:v]scale=1152:768:flags=lanczos,setpts=${speedFactor.toFixed(9)}*(PTS-STARTPTS),fps=30,setsar=1,tpad=stop_mode=clone:stop_duration=0.15,trim=duration=${scene.duration},setpts=PTS-STARTPTS[demo]`,
    `[bg][demo]overlay=104:176:shortest=1,scale=iw:ih:in_range=pc:out_range=tv,format=yuv420p[v]`,
  ].join(";");

  runFfmpeg(
    [
      "-loop",
      "1",
      "-framerate",
      String(frameRate),
      "-i",
      backdrop,
      "-ignore_loop",
      "1",
      "-i",
      scene.source,
      "-filter_complex",
      filter,
      "-map",
      "[v]",
      "-t",
      String(scene.duration),
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "16",
      "-pix_fmt",
      "yuv420p",
      "-color_range",
      "tv",
      "-r",
      String(frameRate),
      output,
    ],
    `Encoding demo scene ${scene.id}/${demoScenes.length}`,
  );
  return output;
}

function encodeOutro(outroBackdrop, workDir) {
  const output = join(workDir, `segment-${demoScenes.length + 1}.mp4`);
  runFfmpeg(
    [
      "-loop",
      "1",
      "-framerate",
      String(frameRate),
      "-i",
      outroBackdrop,
      "-vf",
      "fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p",
      "-t",
      String(outroDuration),
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "16",
      "-pix_fmt",
      "yuv420p",
      "-color_range",
      "tv",
      "-r",
      String(frameRate),
      output,
    ],
    "Encoding outro segment",
  );
  return output;
}

function atempoChain(speed) {
  const filters = [];
  let remaining = speed;
  while (remaining > 2) {
    filters.push("atempo=2");
    remaining /= 2;
  }
  while (remaining < 0.5) {
    filters.push("atempo=0.5");
    remaining /= 0.5;
  }
  filters.push(`atempo=${remaining.toFixed(6)}`);
  return filters.join(",");
}

function synthesizeNarration(workDir) {
  const voiceFiles = [];

  narration.forEach((line, index) => {
    const raw = join(workDir, `voice-${index}.aiff`);
    const processed = join(workDir, `voice-${index}.wav`);
    run(
      "say",
      ["-v", voiceName, "-r", String(line.rate), "-o", raw, line.text],
      `Synthesizing narration ${index + 1}/${narration.length}`,
    );

    const rawDuration = probeDuration(raw);
    const speed = Math.max(1, rawDuration / line.maxDuration);
    const expectedDuration = rawDuration / speed;
    const fadeOutStart = Math.max(0.1, expectedDuration - 0.18);
    const audioFilter = [
      atempoChain(speed),
      "aresample=48000",
      "pan=stereo|c0=c0|c1=c0",
      "highpass=f=75",
      "lowpass=f=12500",
      "loudnorm=I=-16:TP=-1.5:LRA=7",
      "afade=t=in:st=0:d=0.08",
      `afade=t=out:st=${fadeOutStart.toFixed(3)}:d=0.18`,
    ].join(",");

    runFfmpeg(
      [
        "-i",
        raw,
        "-af",
        audioFilter,
        "-ar",
        "48000",
        "-ac",
        "2",
        "-c:a",
        "pcm_s16le",
        processed,
      ],
      `Normalizing narration ${index + 1}/${narration.length}`,
    );
    voiceFiles.push(processed);
  });

  const mixed = join(workDir, "narration.m4a");
  const inputs = [
    "-f",
    "lavfi",
    "-t",
    String(totalDuration),
    "-i",
    "anullsrc=channel_layout=stereo:sample_rate=48000",
  ];
  voiceFiles.forEach((path) => inputs.push("-i", path));

  const delays = narration.map(
    (line, index) => `[${index + 1}:a]adelay=${line.startMs}:all=1[v${index}]`,
  );
  const mixInputs = ["[base]", ...narration.map((_, index) => `[v${index}]`)].join("");
  const filter = [
    `[0:a]atrim=duration=${totalDuration},asetpts=PTS-STARTPTS[base]`,
    ...delays,
    `${mixInputs}amix=inputs=${narration.length + 1}:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.95[a]`,
  ].join(";");

  runFfmpeg(
    [
      ...inputs,
      "-filter_complex",
      filter,
      "-map",
      "[a]",
      "-t",
      String(totalDuration),
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-ar",
      "48000",
      mixed,
    ],
    "Mixing narration track",
  );
  return mixed;
}

function assembleVideo(segments, narrationTrack, workDir) {
  const localSubtitles = join(workDir, "subtitles.ass");
  copyFileSync(subtitlesPath, localSubtitles);
  const inputArgs = [];
  segments.forEach((path) => inputArgs.push("-i", path));
  inputArgs.push("-i", narrationTrack);

  const transitions = [];
  let previousLabel = "[0:v]";
  let accumulatedDuration = segmentDurations[0];
  for (let index = 1; index < segments.length; index += 1) {
    const outputLabel = `[x${index}]`;
    const offset = accumulatedDuration - transitionDuration;
    transitions.push(
      `${previousLabel}[${index}:v]xfade=transition=fade:duration=${transitionDuration}:offset=${offset.toFixed(3)}${outputLabel}`,
    );
    previousLabel = outputLabel;
    accumulatedDuration += segmentDurations[index] - transitionDuration;
  }
  transitions.push(
    `${previousLabel}subtitles=filename='${localSubtitles}':fontsdir='/System/Library/Fonts',format=yuv420p[v]`,
  );

  runFfmpeg(
    [
      ...inputArgs,
      "-filter_complex",
      transitions.join(";"),
      "-map",
      "[v]",
      "-map",
      `${segments.length}:a`,
      "-t",
      String(totalDuration),
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      "-color_range",
      "tv",
      "-r",
      String(frameRate),
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-ar",
      "48000",
      "-movflags",
      "+faststart",
      outputVideo,
    ],
    "Assembling final subtitled video",
  );
}

async function main() {
  ensureInputs();
  mkdirSync(demoDir, { recursive: true });
  const workDir = await mkdtemp(join(tmpdir(), "notipala-product-tour-"));
  let completed = false;

  try {
    process.stdout.write(
      `Locale: ${requestedLocale} · Voice: ${voiceName} · Edition: ${requestedEdition || "default"}\n`,
    );
    process.stdout.write(`Working directory: ${workDir}\n`);
    const backdrops = await renderBackdrops(workDir);
    const segments = [encodeIntro(workDir)];
    demoScenes.forEach((scene, index) => {
      segments.push(encodeDemoScene(scene, backdrops.scenes[index], workDir));
    });
    segments.push(encodeOutro(backdrops.outro, workDir));

    const narrationTrack = synthesizeNarration(workDir);
    assembleVideo(segments, narrationTrack, workDir);
    copyFileSync(backdrops.outro, outputPoster);
    copyFileSync(narrationTrack, outputVoiceover);
    completed = true;

    process.stdout.write(`Video: ${outputVideo}\n`);
    process.stdout.write(`Poster: ${outputPoster}\n`);
    process.stdout.write(`Voiceover: ${outputVoiceover}\n`);
  } finally {
    if (completed) {
      rmSync(workDir, { recursive: true, force: true });
    } else {
      process.stderr.write(`Build failed; intermediates retained at ${workDir}\n`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
