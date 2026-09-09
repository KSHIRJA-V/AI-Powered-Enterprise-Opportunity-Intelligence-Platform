import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Radar,
  AlertTriangle,
  GitBranch,
  Database,
  BarChart3,
  BookOpen
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'pipeline'
  | 'readiness'
  | 'contradictions'
  | 'roadmap'
  | 'evidence'
  | 'benchmark'
  | 'docs';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  contradictionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  contradictionCount
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'pipeline' as ActiveTab, label: 'Live Multi-Agent Stream', icon: Cpu },
    { id: 'readiness' as ActiveTab, label: '5-Axis Readiness Tensor', icon: Radar },
    {
      id: 'contradictions' as ActiveTab,
      label: 'Contradiction Matrix',
      icon: AlertTriangle,
      badge: contradictionCount > 0 ? contradictionCount : undefined
    },
    { id: 'roadmap' as ActiveTab, label: '3-Horizon DAG Roadmap', icon: GitBranch },
    { id: 'evidence' as ActiveTab, label: 'Multi-Source Evidence', icon: Database },
    { id: 'benchmark' as ActiveTab, label: 'Evaluation & Novelty', icon: BarChart3 },
    { id: 'docs' as ActiveTab, label: 'Patent & Methodology', icon: BookOpen },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 mb-2 font-semibold">
          Strategic Decision Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Framework Footnote */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/60">
        <div className="text-[11px] font-mono text-slate-400 font-semibold">MEFF Decision Framework</div>
        <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
          Multi-Source Enterprise Evidence Fusion Engine with Bayesian Credibility Weighting.
        </div>
      </div>
    </aside>
  );
};
