import { TabsItem } from '../types';

const customizedTitleTabs = new WeakSet<TabsItem>();

export const hasCustomizedTitle = (tab: TabsItem) => customizedTitleTabs.has(tab);

export const withCustomizedTitle = (tab: TabsItem, label: TabsItem['label']): TabsItem => {
  const nextTab = { ...tab, label };
  customizedTitleTabs.add(nextTab);
  return nextTab;
};
