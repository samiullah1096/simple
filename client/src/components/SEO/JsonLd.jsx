import { useEffect } from 'react';

export default function JsonLd({ type, data }) {
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    script.id = `jsonld-${type}`;

    // Remove existing script with same ID
    const existing = document.getElementById(script.id);
    if (existing) {
      document.head.removeChild(existing);
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(script.id);
      if (scriptToRemove && document.head.contains(scriptToRemove)) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [type, data]);

  return null;
}
