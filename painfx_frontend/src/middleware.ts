import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES } from "../routes";
import { NextRequest, NextResponse } from 'next/server';

// Helper function to check if the path matches any route with dynamic segments
function matchesDynamicRoute(path: string, routes: string[]): boolean {
    return routes.some(route => {
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        if (routeParts.length !== pathParts.length) return false;

        return routeParts.every((part, index) => {
            return part.startsWith('[') || part === pathParts[index];
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

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url.origin));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        const callbackUrl = `${url.pathname}${url.search || ''}`.replace('//', '/');
        const fallbackRoute = '/';
        const validCallbackUrl = callbackUrl.startsWith('/') ? callbackUrl : fallbackRoute;

        return NextResponse.redirect(
            new URL(`/sign-in?callbackUrl=${encodeURIComponent(validCallbackUrl)}`, url.origin)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
