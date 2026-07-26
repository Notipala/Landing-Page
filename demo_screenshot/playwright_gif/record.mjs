async (page) => {
  const recordingUrl = await page.url();
  const scenarioMatch = recordingUrl.match(/[?&]recordScenario=([^&]+)/);
  const rawScenario = scenarioMatch ? decodeURIComponent(scenarioMatch[1]) : "question";
  const scenarios = new Set(["question", "upload", "follow", "memory", "details"]);
  if (!scenarios.has(rawScenario)) throw new Error(`Unsupported scenario: ${rawScenario}`);
  const scenario = rawScenario;
  const frameDir = `/private/tmp/notipala-gif-${scenario}-frames`;
  const pageUrl = recordingUrl.split("?")[0];
  const fixturePath = decodeURIComponent(
    pageUrl
      .replace(/^file:\/\//, "")
      .replace("/playwright_gif/index.html", "/notipala-upload-demo.md"),
  );
  const FPS = 8;
  const FRAME_MS = 1000 / FPS;
  const TIMING = Object.freeze({
    cursorMoveMs: 1125,
    clickPauseMs: 875,
    detailHoldMs: 2750,
    typingMs: 3000,
    panelDragMs: 1750,
  });

  await page.setViewportSize({ width: 960, height: 640 });
  await page.goto(`${pageUrl}?scenario=${scenario}`, { waitUntil: "load" });
  await page.emulateMedia({ reducedMotion: "reduce" });

  let frame = 0;

  async function snap(count = 1) {
    for (let index = 0; index < count; index += 1) {
      const filename = `${frameDir}/frame-${String(frame).padStart(4, "0")}.png`;
      await page.screenshot({ path: filename });
      frame += 1;
    }
  }

  async function hold(milliseconds) {
    await snap(Math.max(1, Math.round(milliseconds / FRAME_MS)));
  }

  async function cursorPosition() {
    return page.evaluate(() => {
      const cursor = document.getElementById("demo-cursor");
      return {
        x: Number.parseFloat(cursor.style.left || "915"),
        y: Number.parseFloat(cursor.style.top || "590"),
      };
    });
  }

  async function moveCursorTo(selector, milliseconds = TIMING.cursorMoveMs) {
    const target = page.locator(selector);
    await target.waitFor({ state: "visible" });
    const box = await target.boundingBox();
    if (!box) throw new Error(`Missing bounding box for ${selector}`);
    const start = await cursorPosition();
    const end = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const steps = Math.max(4, Math.round(milliseconds / FRAME_MS));
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const x = start.x + (end.x - start.x) * eased;
      const y = start.y + (end.y - start.y) * eased;
      await page.mouse.move(x, y);
      await page.evaluate(
        ({ x: nextX, y: nextY }) => window.demo.setCursor(nextX, nextY),
        { x, y },
      );
      await snap();
    }
  }

  async function click(selector, pauseMs = TIMING.clickPauseMs) {
    await moveCursorTo(selector);
    await page.evaluate(() => window.demo.cursorClick());
    await page.locator(selector).click();
    await hold(pauseMs);
  }

  async function typeSlowly(selector, text, milliseconds = TIMING.typingMs) {
    await moveCursorTo(selector, 750);
    await page.locator(selector).click();
    const steps = Math.max(8, Math.round(milliseconds / FRAME_MS));
    const chunkSize = Math.max(1, Math.ceil(text.length / steps));
    for (let offset = 0; offset < text.length; offset += chunkSize) {
      await page.keyboard.insertText(text.slice(offset, offset + chunkSize));
      await snap();
    }
  }

  async function dragPanel(targetWidth = 540) {
    const handle = page.locator("#resize-handle");
    await moveCursorTo("#resize-handle", 875);
    const box = await handle.boundingBox();
    if (!box) throw new Error("Resize handle is not visible");
    const startX = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const endX = 960 - targetWidth;
    const steps = Math.max(8, Math.round(TIMING.panelDragMs / FRAME_MS));
    await page.mouse.move(startX, y);
    await page.mouse.down();
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const x = startX + (endX - startX) * eased;
      await page.mouse.move(x, y);
      await page.evaluate(
        ({ x: nextX, y: nextY }) => window.demo.setCursor(nextX, nextY),
        { x, y },
      );
      await snap();
    }
    await page.mouse.up();
    await page.evaluate(() => window.demo.cursorClick());
    await hold(1000);
  }

  async function revealGraph(from, to, holdPerStep = 375) {
    for (let count = from; count <= to; count += 1) {
      await page.evaluate((nextCount) => window.demo.revealNodes(nextCount), count);
      await hold(holdPerStep);
    }
  }

  async function scrollReportTo(target, milliseconds = 1750) {
    const start = await page.evaluate(() => window.demo.getReportScroll());
    const steps = Math.max(6, Math.round(milliseconds / FRAME_MS));
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = start + (target - start) * eased;
      await page.evaluate((value) => window.demo.reportScrollTo(value), next);
      await snap();
    }
  }

  await hold(1500);

  if (scenario === "question") {
    await typeSlowly(
      "#composer-input",
      "How should production AI stay accurate when knowledge changes every week?",
      3500,
    );
    await click("#send-btn");
    await hold(1500);
    await page.evaluate(() => window.demo.setAnswerReady("question"));
    await page.evaluate(() => window.demo.showToast("Answer ready — every claim stays connected to evidence"));
    await hold(2250);
    await click("#evidence-toggle", 1750);
    await page.evaluate(() => window.demo.hideToast());
    await dragPanel();
    await page.evaluate(() => {
      window.demo.startBuilding("Answer complete — Section notes are now connecting.");
      window.demo.showToast("Expanded panel — building a richer 12-node Section Map");
    });
    await hold(1500);
    await revealGraph(1, 12, 250);
    await page.evaluate(() => {
      window.demo.finishBuilding();
      window.demo.showToast("Section Map ready — 12 evidence-backed sections");
    });
    await hold(3500);
  }

  if (scenario === "upload") {
    await moveCursorTo("#upload-btn", 1250);
    await page.locator("#file-input").setInputFiles(fixturePath);
    await page.evaluate(() => {
      window.demo.cursorClick();
      window.demo.showToast("File received — preserving source structure and citations");
    });
    await hold(2250);
    await dragPanel();
    await page.evaluate(() => {
      window.demo.startBuilding("Uploaded file validated — connecting document sections.");
      window.demo.showToast("Expanded panel — Section Map grows as the file is indexed");
    });
    await hold(1500);
    await revealGraph(1, 12, 275);
    await page.evaluate(() => {
      window.demo.finishBuilding();
      window.demo.showToast("Upload complete — 12 connected document sections");
    });
    await hold(3500);
  }

  if (scenario === "follow") {
    await dragPanel();
    await page.evaluate(() =>
      window.demo.showToast("Previous map stays visible while the follow-up adds new knowledge"),
    );
    await typeSlowly(
      "#composer-input",
      "Which approach is better when the facts change every week, and why?",
      3500,
    );
    await click("#send-btn");
    await page.evaluate(() =>
      window.demo.startBuilding("Follow-up received — preserving the existing map while it grows."),
    );
    await hold(1750);
    await page.evaluate(() => window.demo.completeFollowUp());
    await hold(1750);
    await revealGraph(8, 12, 500);
    await page.evaluate(() => {
      window.demo.finishBuilding();
      window.demo.showToast("Follow-up connected — the same map now has 12 sections");
    });
    await hold(3500);
  }

  if (scenario === "memory") {
    await dragPanel();
    await page.evaluate(() =>
      window.demo.showToast("Expanded panel — choose the knowledge Memory Mode should use"),
    );
    await click('[data-node-id="rag"].chip', 875);
    await click('[data-node-id="trust"].chip', 875);
    await click('[data-node-id="retrieve"].chip', 875);
    await typeSlowly(
      "#map-query",
      "How do freshness and source trust affect answer consistency?",
      3000,
    );
    await click("#ask-map-btn", 1250);
    await page.evaluate(() => {
      window.demo.showMemoryResult();
      window.demo.showToast("Memory answer ready — tracing the primary reasoning path");
    });
    await hold(2500);
    await page.evaluate(() => {
      window.demo.setHighlights([
        "question",
        "rag",
        "trust",
        "retrieve",
        "ground",
        "verify",
        "fresh",
        "decision",
      ]);
      window.demo.setMapYScale(0.78);
    });
    await scrollReportTo(360, 2250);
    await page.evaluate(() =>
      window.demo.showToast("Used sections and connecting edges are highlighted"),
    );
    await hold(4000);
  }

  if (scenario === "details") {
    await dragPanel();
    await page.evaluate(() =>
      window.demo.showToast("Expanded panel — nodes and bridges remain fully visible"),
    );
    await hold(1500);
    await click('[data-node-id="assemble"].map-node', 500);
    await page.evaluate(() =>
      window.demo.showToast("Node selected — opening its evidence-backed Section note"),
    );
    await hold(TIMING.detailHoldMs);
    await click("#back-btn", 875);
    await page.evaluate(() => window.demo.showToast("Back to the connected Section Map"));
    await hold(1000);
    await click('[data-edge-id="retrieve-ground"].edge-pill', 500);
    await page.evaluate(() =>
      window.demo.showToast("Bridge selected — opening its Cross-section note"),
    );
    await hold(TIMING.detailHoldMs + 750);
    await click("#back-btn", 750);
    await page.evaluate(() =>
      window.demo.showToast("Explore any node or edge without losing the map context"),
    );
    await hold(2500);
  }

  return {
    scenario,
    frames: frame,
    frameDir,
    fps: FPS,
    durationSeconds: Number((frame / FPS).toFixed(2)),
    timing: TIMING,
  };
}
