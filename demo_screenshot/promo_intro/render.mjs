import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const scriptDir = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(scriptDir, "index.html");
const outputDir = resolve(scriptDir, "..");
const outputBase = join(outputDir, "notipala-growing-section-map-intro");
const frameRate = 30;
const durationMs = 9000;
const frameCount = Math.round((durationMs / 1000) * frameRate);

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

function runFfmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

async function main() {
  if (!existsSync(htmlPath)) {
    throw new Error(`Missing animation source: ${htmlPath}`);
  }

  mkdirSync(outputDir, { recursive: true });
  const frameDir = await mkdtemp(join(tmpdir(), "notipala-promo-frames-"));
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    for (let index = 0; index < frameCount; index += 1) {
      const timeMs = (index / frameRate) * 1000;
      await page.evaluate((time) => window.__setPromoTime(time), timeMs);
      await page.screenshot({
        path: join(frameDir, `frame-${String(index).padStart(4, "0")}.jpg`),
        type: "jpeg",
        quality: 94,
      });

      if ((index + 1) % 45 === 0 || index + 1 === frameCount) {
        process.stdout.write(`Captured ${index + 1}/${frameCount} frames\n`);
      }
    }

    await page.evaluate(() => window.__setPromoTime(8050));
    await page.screenshot({
      path: `${outputBase}-poster.png`,
      type: "png",
    });
  } finally {
    await browser.close();
  }

  const inputPattern = join(frameDir, "frame-%04d.jpg");
  const masterPath = `${outputBase}.mp4`;
  const gifPath = `${outputBase}.gif`;

  runFfmpeg([
    "-framerate",
    String(frameRate),
    "-i",
    inputPattern,
    "-vf",
    "scale=iw:ih:in_range=pc:out_range=tv,format=yuv420p",
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
    "-movflags",
    "+faststart",
    "-r",
    String(frameRate),
    masterPath,
  ]);

  runFfmpeg([
    "-i",
    masterPath,
    "-filter_complex",
    "[0:v]fps=15,scale=960:540:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=112:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle",
    "-loop",
    "0",
    gifPath,
  ]);

  rmSync(frameDir, { recursive: true, force: true });
  process.stdout.write(`MP4: ${masterPath}\nGIF: ${gifPath}\nPoster: ${outputBase}-poster.png\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
