import { useEffect, useState } from 'react';

/**
 * コンポーネントがマウントされているかを確認するフック
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}
