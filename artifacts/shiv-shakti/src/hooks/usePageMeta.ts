import { useEffect } from "react";

interface PageMetaOptions {
  title: string;
  description: string;
  canonical?: string;
  schema?: object;
}

export function usePageMeta({ title, description, canonical, schema }: PageMetaOptions) {
  useEffect(() => {
    const setAttr = (sel: string, attr: string, val: string) => {
      const el = document.querySelector(sel);
      if (el && val) el.setAttribute(attr, val);
    };

    const prev = {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "",
      ogDesc: document.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? "",
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? "",
    };

    document.title = title;
    setAttr('meta[name="description"]', "content", description);
    if (canonical) {
      setAttr('link[rel="canonical"]', "href", canonical);
      setAttr('meta[property="og:url"]', "content", canonical);
    }
    setAttr('meta[property="og:title"]', "content", title);
    setAttr('meta[property="og:description"]', "content", description);

    let schemaEl: HTMLScriptElement | null = null;
    if (schema) {
      schemaEl = document.createElement("script");
      schemaEl.id = "page-schema-dynamic";
      schemaEl.type = "application/ld+json";
      schemaEl.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaEl);
    }

    return () => {
      document.title = prev.title;
      setAttr('meta[name="description"]', "content", prev.desc);
      setAttr('link[rel="canonical"]', "href", prev.canonical);
      setAttr('meta[property="og:title"]', "content", prev.ogTitle);
      setAttr('meta[property="og:description"]', "content", prev.ogDesc);
      setAttr('meta[property="og:url"]', "content", prev.ogUrl);
      schemaEl?.remove();
    };
  }, [title, description, canonical]); // eslint-disable-line react-hooks/exhaustive-deps
}
