import { auth } from "@/lib/auth";
export default auth((req) => {
    if (!req.auth) {
        const newUrl = new URL("/", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
})

export const config = {
    matcher: "/((?!_next/static|_next/image|favicon.ico|api|public|$).*)"
};
