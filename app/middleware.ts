import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const path = request.nextUrl.pathname;

    // Public routes
    if (
        path.startsWith("/login") ||
        path.startsWith("/signup")
    ) {
        return NextResponse.next();
    }

    // Not logged in
    if (!token) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/customer/:path*",
    ],
};
