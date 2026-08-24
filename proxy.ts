import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale negotiation and prefixing. Named `proxy` per the Next.js 16
 * convention that replaces `middleware`.
 */
export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(fa|en)/:path*"],
};
