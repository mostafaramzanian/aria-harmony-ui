import { useState, useMemo } from "react";
import {
  Inbox, Mail, Users, ClipboardList, Wallet, ShoppingBag, ShieldCheck,
  ChevronDown, FilePlus, FileEdit, Send, Search, Archive, Trash2,
  CalendarClock, UserCheck, Plane, Clock, MessageSquare,
  FileBarChart, TrendingUp, FolderKanban, ListTodo,
  Receipt, BadgeDollarSign, PackagePlus, Building2,
  PanelRightClose, PanelRightOpen, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { label: string; icon: any; key: string };
type Group = { label: string; icon: any; key: string; items?: Item[] };

function usePersianDate() {
  return useMemo(() => {
    const now = new Date();
    const d = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }).formatToParts(now);
    const day = d.find((p) => p.type === "day")?.value ?? "";
    const month = d.find((p) => p.type === "month")?.value ?? "";
    const year = d.find((p) => p.type === "year")?.value ?? "";
    const weekday = d.find((p) => p.type === "weekday")?.value ?? "";
    return { day, month, year, weekday, full: `${day} ${month} ${year}` };
  }, []);
}

function PersianDateDay() {
  const { day } = usePersianDate();
  return <span>{day}</span>;
}
function PersianDateFull() {
  const { full } = usePersianDate();
  return <span>{full}</span>;
}
function PersianDateWeekday() {
  const { weekday } = usePersianDate();
  return <span>{weekday}</span>;
}

const groups: Group[] = [
  { label: "صندوق دریافت", icon: Inbox, key: "inbox" },
  {
    label: "مکاتبات", icon: Mail, key: "mail",
    items: [
      { label: "ایجاد نامه جدید", icon: FilePlus, key: "mail-new" },
      { label: "پیش‌نویس‌ها", icon: FileEdit, key: "mail-drafts" },
      { label: "نامه‌های ارسالی", icon: Send, key: "mail-sent" },
      { label: "جستجو", icon: Search, key: "mail-search" },
      { label: "بایگانی", icon: Archive, key: "mail-archive" },
      { label: "نامه‌های حذف شده", icon: Trash2, key: "mail-trash" },
    ],
  },
  {
    label: "منابع انسانی", icon: Users, key: "hr",
    items: [
      { label: "حضور و غیاب فردی", icon: UserCheck, key: "hr-attendance" },
      { label: "گزارش تردد پرسنل", icon: CalendarClock, key: "hr-report" },
      { label: "مرخصی", icon: Plane, key: "hr-leave" },
      { label: "ماموریت", icon: Plane, key: "hr-mission" },
      { label: "اضافه کاری", icon: Clock, key: "hr-overtime" },
      { label: "نظرسنجی کارکنان", icon: MessageSquare, key: "hr-survey" },
    ],
  },
  {
    label: "طرح و برنامه", icon: ClipboardList, key: "plan",
    items: [
      { label: "گزارش روزانه", icon: FileBarChart, key: "plan-daily" },
      { label: "بهره‌وری", icon: TrendingUp, key: "plan-productivity" },
      { label: "لیست پروژه‌ها", icon: FolderKanban, key: "plan-projects" },
      { label: "مدیریت وظایف", icon: ListTodo, key: "plan-tasks" },
    ],
  },
  {
    label: "مالی", icon: Wallet, key: "finance",
    items: [
      { label: "گزارش مالی پروژه‌ها", icon: Receipt, key: "fin-projects" },
      { label: "فیش حقوقی", icon: BadgeDollarSign, key: "fin-payslip" },
    ],
  },
  {
    label: "بازرگانی", icon: ShoppingBag, key: "commerce",
    items: [
      { label: "درخواست کالا و خدمات", icon: PackagePlus, key: "com-request" },
      { label: "لیست کارفرمایان", icon: Building2, key: "com-clients" },
    ],
  },
  { label: "کیفیت", icon: ShieldCheck, key: "quality" },
];

export function AppSidebar({
  collapsed, onToggle, active, onSelect,
}: {
  collapsed: boolean;
  onToggle: () => void;
  active: string;
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ mail: true });

  return (
    <aside
      className={cn(
        "relative h-screen sticky top-0 shrink-0 transition-[width] duration-300 ease-out",
        collapsed ? "w-[78px]" : "w-[280px]",
      )}
      style={{ background: "var(--gradient-sidebar)", color: "var(--color-sidebar-foreground)" }}
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 hero-glow opacity-60" />

      <div className="relative flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-4 h-[72px] border-b border-[var(--color-sidebar-border)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="size-10 rounded-xl gradient-primary grid place-items-center shadow-glow">
                <Sparkles className="size-5 text-primary-foreground" />
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-lg font-bold leading-tight gradient-text">آریا سیستم</div>
                <div className="text-[11px] text-white/50">Aria ERP Platform</div>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-white/60 hover:text-white hover:bg-white/5 transition"
            aria-label={collapsed ? "باز کردن منوی کناری" : "بستن منوی کناری"}
          >
            {collapsed ? <PanelRightOpen className="size-4" /> : <PanelRightClose className="size-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {groups.map((g) => {
            const Icon = g.icon;
            const isActive = active === g.key;
            const hasItems = !!g.items?.length;
            const isOpen = !!open[g.key];
            return (
              <div key={g.key}>
                <button
                  onClick={() => {
                    if (hasItems && !collapsed) setOpen((s) => ({ ...s, [g.key]: !s[g.key] }));
                    else onSelect(g.key);
                  }}
                  aria-label={g.label}
                  aria-expanded={hasItems ? isOpen : undefined}
                  className={cn(
                    "group relative w-full flex items-center gap-3 rounded-xl px-3 h-11 text-sm font-medium transition-all",
                    isActive
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-white/70 hover:text-white hover:bg-white/5",
                    collapsed && "justify-center px-0",
                  )}
                >
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l-full gradient-primary" />
                  )}
                  <Icon className={cn("size-[18px] shrink-0", isActive && "text-[var(--color-primary-glow)]")} />
                  {!collapsed && <span className="flex-1 text-right">{g.label}</span>}
                  {!collapsed && hasItems && (
                    <ChevronDown className={cn("size-4 text-white/40 transition", isOpen && "rotate-180")} />
                  )}
                </button>

                {!collapsed && hasItems && isOpen && (
                  <div className="mt-1 mr-4 pr-3 border-r border-white/10 space-y-0.5">
                    {g.items!.map((it) => {
                      const IIcon = it.icon;
                      const sub = active === it.key;
                      return (
                        <button
                          key={it.key}
                          onClick={() => onSelect(it.key)}
                          className={cn(
                            "w-full flex items-center gap-2.5 rounded-lg px-3 h-9 text-[13px] transition",
                            sub
                              ? "bg-white/10 text-white"
                              : "text-white/55 hover:text-white hover:bg-white/5",
                          )}
                        >
                          <IIcon className="size-3.5 shrink-0 opacity-80" />
                          <span className="flex-1 text-right">{it.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Date */}
        <div className="px-3 pb-4">
          <div className={cn(
            "rounded-xl p-3 bg-white/5 border border-white/10 flex items-center gap-3",
            collapsed && "justify-center p-2"
          )}>
            <div className="size-9 rounded-lg gradient-primary grid place-items-center text-sm font-bold text-primary-foreground shrink-0 leading-none">
              <PersianDateDay />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate"><PersianDateFull /></div>
                <div className="text-[11px] text-white/50 truncate"><PersianDateWeekday /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
