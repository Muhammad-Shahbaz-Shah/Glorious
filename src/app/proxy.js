import { auth } from "./auth-lib";

/**
 * Admin Route Protection Proxy
 * Works with Express / custom Node server
 */
export default async function adminProxy(req, res, next) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Protect admin dashboard routes
    if (url.pathname.startsWith("/-admin")) {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      // Not logged in OR not admin
      if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        console.warn(
          `[ADMIN BLOCKED] ${session?.user?.email || "Guest"} tried accessing ${
            url.pathname
          }`
        );

        return res.redirect(302, "/");
      }
    }

    // Authorized → continue
    return next();
  } catch (error) {
    console.error("[ADMIN PROXY ERROR]", error);
    return res.redirect(302, "/");
  }
}
