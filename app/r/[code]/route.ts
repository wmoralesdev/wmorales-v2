import { NextResponse } from "next/server";

const REDIRECTS: Record<string, string> = {
  "tent-card-front-01":
    "https://cursorelsalvador.com/cafe-cursor-jet#menu",
};

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { code } = await context.params;
  const target = REDIRECTS[code];
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.redirect(target, 307);
}

export async function HEAD(_request: Request, context: RouteContext) {
  const { code } = await context.params;
  const target = REDIRECTS[code];
  if (!target) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.redirect(target, 307);
}
