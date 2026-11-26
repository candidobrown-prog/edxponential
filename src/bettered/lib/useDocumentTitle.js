import { useEffect } from 'react';

const SUFFIX = 'BetterEd Solutions';

export function useDocumentTitle(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | ${SUFFIX}` : `${SUFFIX} | School Growth, Transformation & Investment`;

    let meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta ? meta.getAttribute('content') : null;
    if (description) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== null) meta.setAttribute('content', prevDescription);
    };
  }, [title, description]);
}
