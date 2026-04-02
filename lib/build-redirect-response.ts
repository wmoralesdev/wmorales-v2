import { NextResponse } from "next/server";

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * HTTP `Location` redirects often omit URL fragments. When `#` is present, use a
 * minimal HTML meta refresh so the browser navigates with the hash (no React UI).
 */
export function buildRedirectResponse(target: string): NextResponse {
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return new NextResponse("Invalid redirect URL", { status: 500 });
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return new NextResponse("Invalid redirect URL", { status: 500 });
  }

  const href = url.href;

  if (url.hash.length > 0) {
    const safe = escapeHtmlAttribute(href);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${safe}"></head><body></body></html>`;
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.redirect(href, 307);
}
