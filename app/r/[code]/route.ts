import { type NextRequest, NextResponse } from "next/server";
import { buildRedirectResponse } from "@/lib/build-redirect-response";
import { getRedirectTarget } from "@/lib/redirect-codes";

type RouteContext = { params: Promise<{ code: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { code } = await context.params;
  const target = getRedirectTarget(code);

  if (!target) {
    return new NextResponse("Not found", { status: 404 });
  }

  return buildRedirectResponse(target);
}
