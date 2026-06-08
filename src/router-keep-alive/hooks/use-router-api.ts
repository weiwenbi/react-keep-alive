import { useLocation, useNavigate } from 'react-router';
import { useKeepAliveContext } from '..';
import { useCallback } from 'react';

export const useRouterApi = () => {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const { active, setActive, tabs, setTabs, activateds, setActivateds, deactivateds, setDeactivateds } =
    useKeepAliveContext();

  const clearLifeCycle = (key) => {
    delete activateds[key];
    setActivateds({ ...activateds });
    delete deactivateds[key];
    setDeactivateds({ ...deactivateds });
  };

  const close = (key?: string) => {
    const tabKey = key || pathname;
    const index = tabs.findIndex((item) => item.key === tabKey);
    if (index !== -1 && tabs.length > 1) {
      // 关闭缓存同时要清除生命周期
      clearLifeCycle(tabKey);

      const newTabs = [...tabs];
      newTabs.splice(index, 1);
      setTabs(newTabs);
      if (active === tabKey) {
        // 优先跳转到前一个tab，如果前一个不存在则跳转到第一个
        const targetIndex = Math.max(0, index - 1);
        navigator(newTabs[targetIndex].key);
      }
    }
  };

  const closeNavigator = (url: string) => {
    const index = tabs.findIndex((item) => item.key === pathname);
    if (index !== -1) {
      // 关闭缓存同时要清除生命周期
      clearLifeCycle(pathname);
      tabs.splice(index, 1);
      setTabs([...tabs]);
      navigator(url);
    }
  };

  const closeAll = useCallback(() => {
    setTabs([tabs.find((item) => item.key === active)]);
    tabs.forEach((item) => {
      if (item.key !== active) {
        delete activateds[item.key];
        delete deactivateds[item.key];
      }
    });
    setActivateds({ ...activateds });
    setDeactivateds({ ...deactivateds });
  }, [active, activateds, deactivateds]);

  return {
    active,
    tabs,
    setTabs,
    setActive,
    close,
    closeNavigator,
    closeAll,
  };
};
