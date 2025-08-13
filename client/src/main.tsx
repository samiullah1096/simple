import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add structured data for website
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ToolsUniverse",
  "url": window.location.origin,
  "description": "Professional online tools for PDF, Image, Audio, Text, and Finance operations",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${window.location.origin}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ToolsUniverse",
    "logo": {
      "@type": "ImageObject",
      "url": `${window.location.origin}/logo.png`
    }
  }
};

// Inject structured data
const script = document.createElement('script');
script.type = 'application/ld+json';
script.textContent = JSON.stringify(websiteSchema);
document.head.appendChild(script);

createRoot(document.getElementById("root")!).render(<App />);
