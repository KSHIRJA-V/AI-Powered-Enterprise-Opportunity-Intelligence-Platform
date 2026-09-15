import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'pipeline'
  | 'opportunities'
  | 'telemetry'
  | 'guardrails'
  | 'trust';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  opportunityCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  opportunityCount
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Executive Summary', icon: LayoutDashboard },
    { id: 'pipeline' as ActiveTab, label: '5-Agent Analysis Pipeline', icon: Cpu },
    {
      id: 'opportunities' as ActiveTab,
      label: 'Scored Opportunities',
      icon: TrendingUp,
      badge: opportunityCount > 0 ? opportunityCount : undefined
    },
    { id: 'telemetry' as ActiveTab, label: 'Financial & News Telemetry', icon: Database },
    { id: 'guardrails' as ActiveTab, label: '8 Guardrails & Risk Audit', icon: ShieldCheck },
    { id: 'trust' as ActiveTab, label: 'Hallucination Detection', icon: CheckCircle2 },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 mb-2 font-semibold">
          Decision Intelligence Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ' +
                (isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent')
              }
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={'w-4 h-4 ' + (isActive ? 'text-blue-400' : 'text-slate-500')} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-900 bg-slate-950/60">
        <div className="text-[11px] font-mono text-slate-400 font-semibold">5-Agent AI Architecture</div>
        <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
          NewsAPI + Alpha Vantage evidence fusion with custom opportunity scoring and 8 guardrails.
        </div>
      </div>
    </aside>
  );
};
