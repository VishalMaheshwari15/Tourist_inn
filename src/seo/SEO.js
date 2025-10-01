export function SEO({ title, description, canonical, jsonLd }) {
  // Works without react-helmet: direct DOM updates
  if (title) document.title = title;
  const set = (name, content, attr = "name") => {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  set("description", description || "Premium rooms in New Delhi. Book direct.");
  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
  }
  // Open Graph mirrors
  set("og:title", title, "property");
  set("og:description", description, "property");
  set("og:url", canonical, "property");

  // JSON-LD injection
  if (jsonLd) {
    let script = document.getElementById("page-json-ld");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-json-ld";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(jsonLd);
  }
  return null;
}
