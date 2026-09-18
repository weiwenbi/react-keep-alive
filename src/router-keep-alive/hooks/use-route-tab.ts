import { ReactNode, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useKeepAliveContext } from '..';

/**
 * Updates the title of the current route tab.
 *
 * The returned function can also update another tab by passing its key.
 */
export const useRouteTab = () => {
  const { pathname, search } = useLocation();
  const { mode, setTabs } = useKeepAliveContext();
  const currentKey = mode === 'search' ? pathname + search : pathname;

  const setTitle = useCallback(
    (nextTitle: ReactNode, key = currentKey) => {
      setTabs((tabs) => {
        const index = tabs.findIndex((tab) => tab.key === key);
        if (index === -1 || tabs[index].label === nextTitle) {
          return tabs;
        }

        const nextTabs = [...tabs];
        nextTabs[index] = { ...nextTabs[index], label: nextTitle };
        return nextTabs;
      });
    },
    [currentKey, setTabs],
  );

  return { setTitle };
};
