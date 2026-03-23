export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/blog", "/api", "/admin/portfolio", "/admin/settings", "/admin/users"],
      },
    ],
    sitemap: "https://yourdomain.com/sitemap.xml",
  };
}