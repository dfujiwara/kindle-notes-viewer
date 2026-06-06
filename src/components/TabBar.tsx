import { useRef } from "react";

export type TabItem<T extends string = string> = {
  id: T;
  label: string;
  buttonId?: string;
  panelId?: string;
};

interface TabBarProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}

const getTabClassName = (isActive: boolean) => {
  const base =
    "px-6 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900";
  const active =
    "text-white bg-blue-600/20 border border-blue-500 hover:border-blue-400";
  const inactive =
    "text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-500";
  return `${base} ${isActive ? active : inactive}`;
};

export function TabBar<T extends string>({
  tabs,
  activeTab,
  onChange,
}: TabBarProps<T>) {
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    const direction = e.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
    onChange(nextTab.id);
    buttonRefs.current.get(nextTab.id)?.focus();
  };

  return (
    <div role="tablist" className="flex gap-4 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) buttonRefs.current.set(tab.id, el);
            else buttonRefs.current.delete(tab.id);
          }}
          type="button"
          role="tab"
          id={tab.buttonId}
          aria-selected={tab.id === activeTab}
          aria-controls={tab.panelId}
          tabIndex={tab.id === activeTab ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={handleKeyDown}
          className={getTabClassName(tab.id === activeTab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
