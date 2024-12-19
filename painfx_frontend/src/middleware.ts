import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES } from "../routes";
import { NextRequest, NextResponse } from 'next/server';

// Helper function to check if the path matches any route with dynamic segments
function matchesDynamicRoute(path: string, routes: string[]): boolean {
    return routes.some(route => {
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        if (routeParts.length !== pathParts.length) return false;

        return routeParts.every((part, index) => {
            // Dynamic segments start with [ and end with ]
            return part.startsWith('[') && part.endsWith(']') || part === pathParts[index];
        });
    });
}

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const accessCookie = req.cookies.get('access');
    const isLoggedIn = Boolean(accessCookie?.value);

    console.log('Cookies in middleware:', req.cookies.getAll());

    const isPublicRoute = matchesDynamicRoute(url.pathname, PUBLIC_ROUTES);
    const isAuthRoute = matchesDynamicRoute(url.pathname, AUTH_ROUTES);

    // Handle routes that require authentication
    if (isAuthRoute) {
        if (isLoggedIn) {
            // Redirect logged-in users away from auth routes
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url.origin));
        }
        return NextResponse.next();
    }

    // Redirect non-logged-in users trying to access private routes
    if (!isLoggedIn && !isPublicRoute) {
        const callbackUrl = `${url.pathname}${url.search}`.replace(/\/+/g, '/'); // Normalize slashes
        const fallbackRoute = '/';
        const validCallbackUrl = callbackUrl.startsWith('/') ? callbackUrl : fallbackRoute;

        return NextResponse.redirect(
            new URL(`/sign-in?callbackUrl=${encodeURIComponent(validCallbackUrl)}`, url.origin)
        );
    }

    // Allow access to public or private routes if logged in
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
          Match all routes except:
          - Static assets (_next, .html, .css, .js, images, fonts, etc.)
          - API routes (handled separately)
        */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(html|css|js|json|jpg|jpeg|png|gif|svg|webp|ttf|woff|woff2|eot)).*)',
        '/(api|trpc)(.*)', // API and tRPC routes
    ],
};
