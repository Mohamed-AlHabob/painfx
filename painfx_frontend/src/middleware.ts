import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES } from "../routes";
import { NextRequest, NextResponse } from 'next/server';

// Improved dynamic route matching function
function matchesDynamicRoute(path: string, routes: string[]): boolean {
    return routes.some(route => {
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        if (routeParts.length !== pathParts.length) return false;

        return routeParts.every((part, index) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                // Check if the path part is not empty for dynamic segments
                return pathParts[index].length > 0;
            }
            return part === pathParts[index];
        });
    });
}

export async function middleware(req: NextRequest) {
    try {
        const url = req.nextUrl.clone();
        const accessToken = req.cookies.get('access')?.value;
        const isLoggedIn = Boolean(accessToken);

        // Remove this line in production
        // console.log('Cookies in middleware:', req.cookies.getAll());

        const isPublicRoute = matchesDynamicRoute(url.pathname, PUBLIC_ROUTES);
        const isAuthRoute = matchesDynamicRoute(url.pathname, AUTH_ROUTES);

        // Handle auth routes
        if (isAuthRoute) {
            if (isLoggedIn) {
                return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
            }
            return NextResponse.next();
        }

        // Handle protected routes
        if (!isLoggedIn && !isPublicRoute) {
            const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
            return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${callbackUrl}`, req.url));
        }

        // Add security headers
        const response = NextResponse.next();
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return response;
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
      ],
};

console.log('Middleware loaded and ready');