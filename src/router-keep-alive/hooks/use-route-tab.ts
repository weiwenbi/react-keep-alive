import { ReactNode, useCallback, useRef } from 'react';
import { useLocation } from 'react-router';
import { useKeepAliveContext } from '..';
import { hasCustomizedTitle, withCustomizedTitle } from '../route-tab-title';

/**
 * Updates the title of the current route tab.
 *
 * The returned function can also update another tab by passing its key.
 */
export const useRouteTab = () => {
  const { pathname, search } = useLocation();
  const { mode, setTabs } = useKeepAliveContext();
  // 缓存页面不会卸载，必须记住 Hook 所属的初始路由，不能随全局 location 切换。
  const routeKeyRef = useRef(mode === 'search' ? pathname + search : pathname);

  const setTitle = useCallback(
    (nextTitle: ReactNode, key = routeKeyRef.current) => {
      setTabs((tabs) => {
        const index = tabs.findIndex((tab) => tab.key === key);
        if (index === -1 || (tabs[index].label === nextTitle && hasCustomizedTitle(tabs[index]))) {
          return tabs;
        }

        const nextTabs = [...tabs];
        nextTabs[index] = withCustomizedTitle(nextTabs[index], nextTitle);
        return nextTabs;
      });
    },
    [setTabs],
  );

  return { setTitle };
};
