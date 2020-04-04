/* global document */
import { useEffect, useState } from 'react';

function setTitle(s) {
  document.title = s;
}

export default function useDocumentTitle(title) {
  const [initialTitle] = useState(document.title);

  useEffect(() => {
    setTitle(title);

    return () => {
      setTitle(initialTitle);
    };
  }, [initialTitle, title]);
}
