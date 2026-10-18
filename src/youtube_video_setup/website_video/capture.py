"""High-DPI website snapshot and DOM element locator using Playwright."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from playwright.sync_api import sync_playwright, ViewportSize


@dataclass
class BoundingBox:
    x: float
    y: float
    width: float
    height: float

    def to_dict(self) -> dict[str, float]:
        return {"x": self.x, "y": self.y, "width": self.width, "height": self.height}


@dataclass
class CaptureResult:
    image_path: Path
    url: str
    title: str
    viewport_width: int
    viewport_height: int
    scale_factor: float
    highlight_box: Optional[BoundingBox] = None


class WebCapture:
    """Captures high-resolution, dark-mode webpage snapshots and locates text bounding boxes."""

    def __init__(
        self,
        viewport_width: int = 1920,
        viewport_height: int = 1080,
        device_scale_factor: float = 2.0,
        dark_mode: bool = True,
    ) -> None:
        self.viewport_width = viewport_width
        self.viewport_height = viewport_height
        self.device_scale_factor = device_scale_factor
        self.dark_mode = dark_mode

    def capture(
        self,
        url: str,
        output_image_path: str | Path,
        highlight_text: Optional[str] = None,
        scroll_selector: Optional[str] = None,
        wait_ms: int = 1500,
    ) -> CaptureResult:
        """Navigates to URL, scrolls to target element/text, extracts coordinates, and snapshots."""
        out_path = Path(output_image_path).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)

        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"https://{url}"

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport=ViewportSize(width=self.viewport_width, height=self.viewport_height),
                device_scale_factor=self.device_scale_factor,
                color_scheme="dark" if self.dark_mode else "light",
                user_agent=(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                ),
            )
            page = context.new_page()

            # Navigate
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=30000)
            except Exception as e:
                # Fallback if timeout
                pass

            page.wait_for_timeout(wait_ms)
            title = page.title()

            highlight_box: Optional[BoundingBox] = None

            # If highlight_text is requested, locate it and scroll into comfortable view
            if highlight_text:
                # Scroll target into view first
                js_find_and_scroll = """
                (text) => {
                    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
                    let node;
                    while ((node = walker.nextNode())) {
                        if (node.nodeValue && node.nodeValue.toLowerCase().includes(text.toLowerCase())) {
                            node.parentElement.scrollIntoView({ behavior: 'instant', block: 'center' });
                            return true;
                        }
                    }
                    return false;
                }
                """
                found = page.evaluate(js_find_and_scroll, highlight_text)
                if found:
                    page.wait_for_timeout(300)
                    js_get_rect = """
                    (text) => {
                        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
                        let node;
                        while ((node = walker.nextNode())) {
                            if (node.nodeValue && node.nodeValue.toLowerCase().includes(text.toLowerCase())) {
                                const range = document.createRange();
                                const idx = node.nodeValue.toLowerCase().indexOf(text.toLowerCase());
                                range.setStart(node, idx);
                                range.setEnd(node, Math.min(node.length, idx + text.length));
                                const rect = range.getBoundingClientRect();
                                return {
                                    x: rect.left,
                                    y: rect.top,
                                    width: rect.width,
                                    height: rect.height
                                };
                            }
                        }
                        return null;
                    }
                    """
                    box_data = page.evaluate(js_get_rect, highlight_text)
                    if box_data and box_data.get("width", 0) > 0:
                        scale = self.device_scale_factor
                        highlight_box = BoundingBox(
                            x=box_data["x"] * scale,
                            y=box_data["y"] * scale,
                            width=box_data["width"] * scale,
                            height=box_data["height"] * scale,
                        )
            elif scroll_selector:
                el = page.query_selector(scroll_selector)
                if el:
                    el.scroll_into_view_if_needed()
                    rect = el.bounding_box()
                    if rect:
                        scale = self.device_scale_factor
                        highlight_box = BoundingBox(
                            x=rect["x"] * scale,
                            y=rect["y"] * scale,
                            width=rect["width"] * scale,
                            height=rect["height"] * scale,
                        )

            # Wait a tick for rendering post-scroll
            page.wait_for_timeout(500)

            # Capture screenshot
            page.screenshot(path=str(out_path), full_page=False)

            browser.close()

        # Save metadata json alongside image
        meta_path = out_path.with_suffix(".json")
        meta = {
            "url": url,
            "title": title,
            "viewport_width": int(self.viewport_width * self.device_scale_factor),
            "viewport_height": int(self.viewport_height * self.device_scale_factor),
            "scale_factor": self.device_scale_factor,
            "highlight_box": highlight_box.to_dict() if highlight_box else None,
        }
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)

        return CaptureResult(
            image_path=out_path,
            url=url,
            title=title,
            viewport_width=int(self.viewport_width * self.device_scale_factor),
            viewport_height=int(self.viewport_height * self.device_scale_factor),
            scale_factor=self.device_scale_factor,
            highlight_box=highlight_box,
        )
