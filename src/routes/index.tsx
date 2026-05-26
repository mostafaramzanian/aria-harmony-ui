import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search, Bell, Sun, Moon, Filter, Calendar, ChevronDown,
  MoreHorizontal, Eye, CheckCircle2, AlertCircle, Circle,
  Mail, Users, ClipboardList, Wallet, ShoppingBag, ShieldCheck,
  ArrowUpDown, Sparkles, TrendingUp, Clock3, Inbox as InboxIcon,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { HomeDashboard } from "@/components/HomeDashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: AriaApp });

type Status = "unread" | "read" | "action";
type Dept = "mail" | "hr" | "plan" | "finance" | "commerce" | "quality";

const deptMeta: Record<Dept, { label: string; icon: any; color: string }> = {
  mail:     { label: "مکاتبات",       icon: Mail,         color: "from-blue-500/20 to-blue-500/5 text-blue-300 border-blue-400/20" },
  hr:       { label: "منابع انسانی",  icon: Users,        color: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-400/20" },
  plan:     { label: "طرح و برنامه",  icon: ClipboardList,color: "from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-400/20" },
  finance:  { label: "مالی",          icon: Wallet,       color: "from-violet-500/20 to-violet-500/5 text-violet-300 border-violet-400/20" },
  commerce: { label: "بازرگانی",      icon: ShoppingBag,  color: "from-rose-500/20 to-rose-500/5 text-rose-300 border-rose-400/20" },
  quality:  { label: "کیفیت",         icon: ShieldCheck,  color: "from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-400/20" },
};

type Row = {
  id: string; subject: string; sender: string; dept: Dept;
  date: string; time: string; status: Status;
};

const seed: Row[] = [
  { id: "AR-10293", subject: "ابلاغ بخشنامه ساعت کاری تابستان ۱۴۰۴", sender: "دبیرخانه مرکزی", dept: "mail", date: "۱۴۰۴/۰۳/۰۴", time: "۰۹:۲۳", status: "unread" },
  { id: "HR-58821", subject: "درخواست مرخصی استحقاقی شما تایید شد", sender: "واحد منابع انسانی", dept: "hr", date: "۱۴۰۴/۰۳/۰۴", time: "۰۸:۵۱", status: "read" },
  { id: "FN-77410", subject: "صدور فیش حقوقی اردیبهشت ماه", sender: "امور مالی", dept: "finance", date: "۱۴۰۴/۰۳/۰۳", time: "۲۲:۰۴", status: "action" },
  { id: "PL-22019", subject: "ارسال گزارش روزانه پروژه فاز ۲ الزامی است", sender: "دفتر طرح و برنامه", dept: "plan", date: "۱۴۰۴/۰۳/۰۳", time: "۱۷:۴۰", status: "action" },
  { id: "CM-31200", subject: "تایید نهایی درخواست کالای شماره ۸۸۲", sender: "واحد بازرگانی", dept: "commerce", date: "۱۴۰۴/۰۳/۰۳", time: "۱۴:۱۲", status: "unread" },
  { id: "QA-91003", subject: "گزارش ممیزی داخلی سه‌ماهه اول", sender: "تضمین کیفیت", dept: "quality", date: "۱۴۰۴/۰۳/۰۲", time: "۱۱:۳۰", status: "read" },
  { id: "AR-10287", subject: "نامه ورودی از وزارت صمت — اولویت بالا", sender: "دبیرخانه مرکزی", dept: "mail", date: "۱۴۰۴/۰۳/۰۲", time: "۰۹:۱۵", status: "unread" },
  { id: "HR-58801", subject: "یادآوری: نظرسنجی رضایت کارکنان", sender: "منابع انسانی", dept: "hr", date: "۱۴۰۴/۰۳/۰۱", time: "۱۶:۰۰", status: "action" },
  { id: "FN-77389", subject: "گزارش هزینه‌های پروژه برج نگین آماده شد", sender: "حسابداری پروژه", dept: "finance", date: "۱۴۰۴/۰۲/۳۱", time: "۱۳:۲۲", status: "read" },
  { id: "CM-31195", subject: "افزودن کارفرمای جدید: شرکت پارس‌سازه", sender: "واحد بازرگانی", dept: "commerce", date: "۱۴۰۲/۰۲/۳۱", time: "۱۰:۰۵", status: "read" },
];

function AriaApp() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("home");
  const [dark, setDark] = useState(true);
  const [q, setQ] = useState("");
  const [deptFilter, setDeptFilter] = useState<"all" | Dept>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const toggleTheme = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const rows = useMemo(() => {
    return seed.filter((r) => {
      if (deptFilter !== "all" && r.dept !== deptFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (q && !`${r.subject} ${r.sender} ${r.id}`.includes(q)) return false;
      return true;
    });
  }, [q, deptFilter, statusFilter]);

  const stats = [
    { label: "پیام‌های خوانده نشده", value: "۲۴", change: "+۸٪", icon: InboxIcon, tone: "text-[var(--color-primary-glow)]" },
    { label: "نیازمند اقدام", value: "۰۹", change: "اولویت بالا", icon: AlertCircle, tone: "text-amber-400" },
    { label: "ورودی امروز", value: "۱۲", change: "+۳ نسبت به دیروز", icon: TrendingUp, tone: "text-emerald-400" },
    { label: "میانگین پاسخ", value: "۱.۸س", change: "بهینه", icon: Clock3, tone: "text-cyan-400" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((s) => !s)}
        active={active}
        onSelect={setActive}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 glass border-b border-border">
          <div className="flex items-center justify-between gap-3 px-6 h-[72px]">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <label htmlFor="aria-global-search" className="sr-only">جستجو در همه ماژول‌ها</label>
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="aria-global-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="جستجو در همه ماژول‌ها… (پیام، فرستنده، شناسه)"
                  aria-label="جستجو در همه ماژول‌ها"
                  className="w-full h-11 rounded-xl bg-secondary/60 border border-border pr-10 pl-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
                <kbd className="hidden md:block absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
              </div>
            </div>
            <div className="items-center gap-1.5 flex flex-row text-left">
              <button onClick={toggleTheme} className="size-10 grid place-items-center rounded-xl hover:bg-secondary transition" aria-label={dark ? "روشن کردن حالت روز" : "فعال کردن حالت شب"}>
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              <button className="relative size-10 grid place-items-center rounded-xl hover:bg-secondary transition" aria-label="اعلان‌ها">
                <Bell className="size-4" />
                <span className="absolute top-2 left-2 size-2 rounded-full bg-[var(--color-primary-glow)] ring-2 ring-background" />
              </button>
              <div className="mx-1 h-6 w-px bg-border" />
              <div className="flex items-center gap-2.5 pl-2">
                <div className="size-9 rounded-lg gradient-primary grid place-items-center text-xs font-bold text-primary-foreground">م.ر</div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-sm font-medium">محمد رضایی</div>
                  <div className="text-[11px] text-muted-foreground">مدیر سامانه</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        {active === "home" ? (
          <HomeDashboard onOpenInbox={() => setActive("inbox")} />
        ) : (
        <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">

          {/* Hero header */}
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-card">
            <div className="absolute inset-0 hero-glow" />
            <div className="absolute -top-20 -left-20 size-72 rounded-full gradient-primary opacity-20 blur-3xl" />
            <div className="relative p-6 lg:p-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--color-primary-glow)] bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
                  <Sparkles className="size-3" /> صندوق دریافت هوشمند
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                  صندوق دریافت <span className="gradient-text">هوشمند آریا</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                  صبح بخیر محمد — امروز <strong className="text-foreground">۹ پیام</strong> نیازمند اقدام شما هستند.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 gradient-primary text-primary-foreground text-sm font-medium rounded-xl px-5 h-11 shadow-glow hover:opacity-95 transition">
                <Sparkles className="size-4" />
                ایجاد نامه جدید
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition">
                  <div className="absolute -bottom-6 -left-6 size-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                      <div className="mt-2 text-2xl font-bold tracking-tight">{s.value}</div>
                      <div className={cn("mt-1 text-[11px]", s.tone)}>{s.change}</div>
                    </div>
                    <div className={cn("size-10 rounded-xl bg-secondary grid place-items-center", s.tone)}>
                      <Icon className="size-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-border bg-card p-4 lg:p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">فیلترهای پیشرفته</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* Dept chips */}
              <div className="lg:col-span-7">
                <div className="text-[11px] text-muted-foreground mb-2">بخش</div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={deptFilter === "all"} onClick={() => setDeptFilter("all")}>همه</Chip>
                  {(Object.keys(deptMeta) as Dept[]).map((d) => (
                    <Chip key={d} active={deptFilter === d} onClick={() => setDeptFilter(d)}>{deptMeta[d].label}</Chip>
                  ))}
                </div>
              </div>
              {/* Date range */}
              <div className="lg:col-span-3">
                <div className="text-[11px] text-muted-foreground mb-2" id="aria-date-range-label">بازه زمانی</div>
                <div className="flex gap-2" role="group" aria-labelledby="aria-date-range-label">
                  <DateInput placeholder="از تاریخ" aria-label="از تاریخ" />
                  <DateInput placeholder="تا تاریخ" aria-label="تا تاریخ" />
                </div>
              </div>
              {/* Status */}
              <div className="lg:col-span-2">
                <div className="text-[11px] text-muted-foreground mb-2">وضعیت</div>
                <Select
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v as any)}
                  aria-label="فیلتر وضعیت پیام"
                  options={[
                    { value: "all", label: "همه" },
                    { value: "unread", label: "خوانده نشده" },
                    { value: "read", label: "خوانده شده" },
                    { value: "action", label: "نیازمند اقدام" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold">پیام‌ها و اعلان‌ها</h2>
                <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">{rows.length} مورد</span>
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
                مرتب‌سازی <ArrowUpDown className="size-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40">
                    <Th>شناسه</Th>
                    <Th>موضوع</Th>
                    <Th>فرستنده</Th>
                    <Th>بخش</Th>
                    <Th>تاریخ و ساعت</Th>
                    <Th>وضعیت</Th>
                    <Th className="text-left">اقدامات</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const dm = deptMeta[r.dept];
                    const DIcon = dm.icon;
                    return (
                      <tr key={r.id} className="border-t border-border hover:bg-secondary/40 transition group">
                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            {r.status === "unread" && <span className="size-2 rounded-full bg-[var(--color-primary-glow)] shadow-[0_0_8px_var(--color-primary-glow)]" />}
                            <span className={cn("text-[13.5px]", r.status === "unread" ? "font-semibold text-foreground" : "text-foreground/85")}>
                              {r.subject}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">{r.sender}</td>
                        <td className="px-5 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full border px-2.5 py-1 bg-gradient-to-l",
                            dm.color,
                          )}>
                            <DIcon className="size-3" />
                            {dm.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground tabular-nums">
                          <div>{r.date}</div>
                          <div className="text-[11px] opacity-70">{r.time}</div>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition">
                            <IconBtn aria-label={`مشاهده پیام ${r.id}`}><Eye className="size-4" /></IconBtn>
                            <IconBtn aria-label={`علامت‌گذاری به عنوان خوانده‌شده ${r.id}`}><CheckCircle2 className="size-4" /></IconBtn>
                            <IconBtn aria-label={`گزینه‌های بیشتر برای ${r.id}`}><MoreHorizontal className="size-4" /></IconBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-16 text-muted-foreground">موردی یافت نشد</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-muted-foreground">
              <span>نمایش {rows.length} از {seed.length} پیام</span>
              <div className="flex items-center gap-1">
                <PageBtn>قبلی</PageBtn>
                <PageBtn active>۱</PageBtn>
                <PageBtn>۲</PageBtn>
                <PageBtn>۳</PageBtn>
                <PageBtn>بعدی</PageBtn>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Chip({ children, active, onClick }: any) {
  return (
    <button onClick={onClick} className={cn(
      "text-xs font-medium rounded-full px-3.5 h-8 border transition",
      active
        ? "gradient-primary text-primary-foreground border-transparent shadow-glow"
        : "border-border bg-secondary/50 text-foreground/80 hover:bg-secondary",
    )}>{children}</button>
  );
}
function Th({ children, className }: any) {
  return <th className={cn("px-5 py-3 font-medium", className)}>{children}</th>;
}
function IconBtn({ children, "aria-label": ariaLabel }: { children: any; "aria-label"?: string }) {
  return <button aria-label={ariaLabel} className="size-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition">{children}</button>;
}
function PageBtn({ children, active }: any) {
  return (
    <button className={cn(
      "h-8 min-w-8 px-2.5 rounded-lg text-xs transition",
      active ? "gradient-primary text-primary-foreground shadow-glow" : "hover:bg-secondary",
    )}>{children}</button>
  );
}
function StatusBadge({ status }: { status: Status }) {
  const map = {
    unread: { label: "خوانده نشده", cls: "bg-blue-500/10 text-blue-300 border-blue-400/20", Icon: Circle },
    read:   { label: "خوانده شده",  cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20", Icon: CheckCircle2 },
    action: { label: "نیازمند اقدام", cls: "bg-amber-500/10 text-amber-300 border-amber-400/20", Icon: AlertCircle },
  } as const;
  const m = map[status];
  const I = m.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full border px-2.5 py-1", m.cls)}>
      <I className="size-3" /> {m.label}
    </span>
  );
}
function DateInput({ placeholder, "aria-label": ariaLabel }: { placeholder: string; "aria-label"?: string }) {
  return (
    <div className="relative flex-1">
      <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
      <input type="text" placeholder={placeholder} aria-label={ariaLabel ?? placeholder} className="w-full h-10 rounded-lg bg-secondary/60 border border-border pr-8 pl-3 text-xs outline-none focus:border-primary transition" />
    </div>
  );
}
function Select({ value, onChange, options, "aria-label": ariaLabel }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; "aria-label"?: string }) {
  return (
    <div className="relative">
      <select aria-label={ariaLabel} value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none w-full h-10 rounded-lg bg-secondary/60 border border-border pr-3 pl-8 text-xs outline-none focus:border-primary transition cursor-pointer">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}
