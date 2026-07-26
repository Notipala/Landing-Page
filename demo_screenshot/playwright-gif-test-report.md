# Notipala Playwright GIF 測試報告

重錄日期：2026-07-26

輸出：960×640、8 FPS、無限循環 GIF

錄製來源：依照正式 `GraphReportView` 的版面與互動規則建立的離線 Playwright fixture

目前執行環境無法取得啟動 localhost dev server 所需的 sandbox 核准，因此本次以 deterministic fixture 重錄；node／edge 詳情、panel resize、file input、表單輸入與 click 都由 Playwright 實際操作。錄製頁與操作腳本保存在 [`playwright_gif/`](playwright_gif/)。

所有案例在 Section Map 更新或互動前，都先把右側 panel 從 390px 拖寬到 540px。操作節奏統一為：

- Cursor move：1.125 秒
- Panel drag：1.75 秒
- 一般 click 後停留：0.875 秒
- Details 停留：2.75 秒以上
- 輸入動畫：約 3 秒

## 已完成案例

| 案例 | 結果 | 驗證內容 | GIF |
| --- | --- | --- | --- |
| 提問 → 回答 → 展開 Evidence → Section Map | PASS | 回答、Evidence、building 狀態；Section Map 從 0 成長到 12 nodes | [question-answer-evidence-section-map.gif](question-answer-evidence-section-map.gif) |
| Upload file → Section Map | PASS | Playwright 實際設定 file input；upload confirmation、building；Section Map 從 0 成長到 12 nodes | [upload-file-section-map.gif](upload-file-section-map.gif) |
| Follow-up → 保留舊 Map → Map 成長 | PASS | 原有 7 nodes 保持可見；回答更新後逐步增加為 12 nodes | [follow-up-section-map.gif](follow-up-section-map.gif) |
| Memory Mode → Reasoning Path → Highlights | PASS | 每次選取 focus section 時，對應 Map node 立即同步高光；顯示 Memory answer 與 Primary reasoning path；高光 8 個使用到的 nodes 及相關 edges | [memory-mode-reason-path-highlights.gif](memory-mode-reason-path-highlights.gif) |
| 點擊 Node／Edge → Details → Back | PASS | Node 開啟 `Section note`；Edge 開啟 `Cross-section note`；兩次均能返回完整 Map | [section-map-node-edge-details.gif](section-map-node-edge-details.gif) |

完整 Map 包含 12 個 section nodes、15 條連線及 14 個可點擊 bridge pills。上傳 fixture 為 [`notipala-upload-demo.md`](notipala-upload-demo.md)。

## 成品規格

| GIF | 時長 | Frames | Nodes |
| --- | ---: | ---: | ---: |
| question-answer-evidence-section-map.gif | 25.63 秒 | 205 | 12 |
| upload-file-section-map.gif | 16.63 秒 | 133 | 12 |
| follow-up-section-map.gif | 20.26 秒 | 162 | 7 → 12 |
| memory-mode-reason-path-highlights.gif | 25.51 秒 | 204 | 12；3 個即時 focus 高光；8 個 reasoning-path 高光 |
| section-map-node-edge-details.gif | 23.51 秒 | 188 | 12 |

## 後續建議

- Dev server 可啟動時，再用同一組 timing 與 selector 對真實 API pipeline 重跑一次。
- 補上 API error、graph failed／empty、reload while building 與 mobile swipe 案例。
- 在正式 node 與 edge buttons 加入穩定的 `data-testid`，降低文案調整造成的 selector 風險。
