import { useState } from "react";
import {
  Mail, AlertCircle, Plane, FolderKanban, ShoppingBag, TrendingUp,
  ArrowLeft, Megaphone, User, Sparkles, Calendar, Clock3,
  CheckCircle2, Circle, Users, Wallet, ShieldCheck, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Dept = "mail" | "hr" | "plan" | "finance" | "commerce" | "quality";
const deptMeta: Record<Dept, { label: string; icon: any; color: string }> = {
  mail:     { label: "مکاتبات",      icon: Mail,         color: "from-blue-500/20 to-blue-500/5 text-blue-300 border-blue-400/20" },
  hr:       { label: "منابع انسانی", icon: Users,        color: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-400/20" },
  plan:     { label: "طرح و برنامه", icon: ClipboardList,color: "from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-400/20" },
  finance:  { label: "مالی",         icon: Wallet,       color: "from-violet-500/20 to-violet-500/5 text-violet-300 border-violet-400/20" },
  commerce: { label: "بازرگانی",     icon: ShoppingBag,  color: "from-rose-500/20 to-rose-500/5 text-rose-300 border-rose-400/20" },
  quality:  { label: "کیفیت",        icon: ShieldCheck,  color: "from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-400/20" },
};

const kpis = [
  { label: "نامه‌های خوانده نشده", value: "۲۴", delta: "+۸٪ این هفته", icon: Mail, tone: "text-blue-300", glow: "from-blue-500/20", ring: "ring-blue-400/20" },
  { label: "نیازمند اقدام فوری",   value: "۰۹", delta: "اولویت بالا",   icon: AlertCircle, tone: "text-amber-300", glow: "from-amber-500/20", ring: "ring-amber-400/20" },
  { label: "مرخصی‌های منتظر تأیید", value: "۰۵", delta: "۲ مورد امروز", icon: Plane, tone: "text-emerald-300", glow: "from-emerald-500/20", ring: "ring-emerald-400/20" },
  { label: "پروژه‌های فعال",       value: "۱۷", delta: "۳ پروژه جدید",  icon: FolderKanban, tone: "text-cyan-300", glow: "from-cyan-500/20", ring: "ring-cyan-400/20" },
  { label: "درخواست‌های بازرگانی",  value: "۱۲", delta: "+۴ نسبت به دیروز", icon: ShoppingBag, tone: "text-rose-300", glow: "from-rose-500/20", ring: "ring-rose-400/20" },
  { label: "بهره‌وری این ماه",     value: "۹۲٪", delta: "بالاتر از هدف", icon: TrendingUp, tone: "text-[var(--color-primary-glow)]", glow: "from-violet-500/20", ring: "ring-violet-400/20" },
];

const kartable: { status: "unread" | "read" | "action"; sender: string; subject: string; dept: Dept; id: string; date: string }[] = [
  { status: "unread", sender: "دبیرخانه مرکزی",   subject: "ابلاغ بخشنامه ساعت کاری تابستان ۱۴۰۴", dept: "mail",     id: "AR-10293", date: "۱۴۰۴/۰۳/۰۴" },
  { status: "action", sender: "امور مالی",         subject: "صدور فیش حقوقی اردیبهشت ماه",          dept: "finance",  id: "FN-77410", date: "۱۴۰۴/۰۳/۰۳" },
  { status: "action", sender: "دفتر طرح و برنامه", subject: "ارسال گزارش روزانه پروژه فاز ۲",       dept: "plan",     id: "PL-22019", date: "۱۴۰۴/۰۳/۰۳" },
  { status: "unread", sender: "واحد بازرگانی",    subject: "تایید نهایی درخواست کالای شماره ۸۸۲",  dept: "commerce", id: "CM-31200", date: "۱۴۰۴/۰۳/۰۳" },
  { status: "read",   sender: "تضمین کیفیت",      subject: "گزارش ممیزی داخلی سه‌ماهه اول",       dept: "quality",  id: "QA-91003", date: "۱۴۰۴/۰۳/۰۲" },
  { status: "unread", sender: "منابع انسانی",     subject: "یادآوری: نظرسنجی رضایت کارکنان",       dept: "hr",       id: "HR-58801", date: "۱۴۰۴/۰۳/۰۱" },
];

const orgNotices = [
  { title: "ابلاغ ساعات کاری جدید تابستان", body: "از اول تیرماه ساعات کاری از ۷:۳۰ تا ۱۴:۳۰ خواهد بود. لطفاً برنامه‌ریزی لازم را انجام دهید.", date: "امروز · ۰۹:۳۰", priority: "مهم" },
  { title: "بازنگری در آیین‌نامه مأموریت‌ها", body: "نسخه جدید آیین‌نامه مأموریت‌های اداری در پورتال منتشر شد و از هفته آینده اجرایی می‌شود.", date: "دیروز · ۱۶:۱۲", priority: "اطلاعیه" },
  { title: "برگزاری مجمع عمومی سالیانه",     body: "مجمع عمومی شرکت روز پنج‌شنبه ساعت ۱۰ صبح در سالن اجتماعات برگزار خواهد شد.", date: "۲ روز پیش", priority: "رویداد" },
  { title: "به‌روزرسانی سامانه آریا نسخه ۴.۲", body: "بهبود عملکرد ماژول مالی و رفع چندین مشکل گزارش‌شده در ماژول مکاتبات.", date: "۳ روز پیش", priority: "سامانه" },
];

const personalNotices = [
  { title: "درخواست مرخصی شما تایید شد", body: "مرخصی استحقاقی برای روز چهارشنبه ۸ خرداد توسط مدیر مستقیم تایید شد.", date: "امروز · ۰۸:۵۱" },
  { title: "یک وظیفه جدید به شما اختصاص یافت", body: "بررسی پیش‌نویس قرارداد شرکت پارس‌سازه — مهلت: ۷ خرداد", date: "دیروز · ۱۴:۲۰" },
  { title: "یادآوری جلسه هفتگی تیم",      body: "جلسه هفتگی تیم طرح و برنامه فردا ساعت ۱۰ در اتاق کنفرانس B", date: "دیروز · ۱۰:۰۰" },
  { title: "فیش حقوقی شما صادر شد",       body: "فیش حقوقی اردیبهشت ماه قابل مشاهده و دانلود است.", date: "۲ روز پیش" },
];

export function HomeDashboard({ onOpenInbox }: { onOpenInbox: () => void }) {
  const [tab, setTab] = useState<"org" | "personal">("org");

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-[1600px] w-full mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border shadow-card">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute -top-24 -left-24 size-80 rounded-full gradient-primary opacity-25 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 size-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative p-7 lg:p-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--color-primary-glow)] bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
              <Sparkles className="size-3" /> داشبورد اصلی آریا
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              خوش آمدید، <span className="gradient-text">محمد رضایی</span>
            </h1>
            <p className="text-sm lg:text-[15px] text-muted-foreground mt-2 max-w-xl leading-7">
              نمای کلی از وضعیت سازمان شما — امروز <strong className="text-foreground">۹ مورد</strong> نیازمند اقدام فوری شماست و <strong className="text-foreground">۴ اطلاعیه سازمانی</strong> جدید منتشر شده است.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-4" /> چهارشنبه · ۴ خرداد ۱۴۰۴
            <span className="mx-2 h-4 w-px bg-border" />
            <Clock3 className="size-4" /> ۰۹:۴۲
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary/30",
              )}
            >
              <div className={cn("absolute -top-10 -left-10 size-32 rounded-full blur-2xl opacity-60 bg-gradient-to-br", k.glow, "to-transparent group-hover:opacity-100 transition")} />
              <div className="relative">
                <div className={cn("size-10 rounded-xl bg-secondary/70 grid place-items-center ring-1", k.ring, k.tone)}>
                  <Icon className="size-5" />
                </div>
                <div className="mt-4 text-[11px] text-muted-foreground leading-tight">{k.label}</div>
                <div className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums">{k.value}</div>
                <div className={cn("mt-1 text-[10.5px]", k.tone)}>{k.delta}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Kartable summary — 2 cols */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--color-primary-glow)]" />
                خلاصه کارتابل هوشمند
              </h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">آخرین موارد ورودی به کارتابل شما</p>
            </div>
            <button
              onClick={onOpenInbox}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary-glow)] hover:text-primary transition rounded-lg px-3 h-9 hover:bg-primary/10 border border-primary/20"
            >
              مشاهده همه
              <ArrowLeft className="size-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-right text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40">
                  <th className="px-5 py-3 font-medium">وضعیت</th>
                  <th className="px-5 py-3 font-medium">فرستنده</th>
                  <th className="px-5 py-3 font-medium">موضوع</th>
                  <th className="px-5 py-3 font-medium">بخش</th>
                  <th className="px-5 py-3 font-medium">شناسه</th>
                  <th className="px-5 py-3 font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {kartable.map((r) => {
                  const dm = deptMeta[r.dept];
                  const DIcon = dm.icon;
                  return (
                    <tr key={r.id} className="border-t border-border hover:bg-secondary/40 transition cursor-pointer">
                      <td className="px-5 py-4"><StatusPill status={r.status} /></td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{r.sender}</td>
                      <td className="px-5 py-4 max-w-[280px]">
                        <span className={cn("text-[13.5px]", r.status === "unread" ? "font-semibold text-foreground" : "text-foreground/85")}>
                          {r.subject}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full border px-2.5 py-1 bg-gradient-to-l", dm.color)}>
                          <DIcon className="size-3" />
                          {dm.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                      <td className="px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap">{r.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <aside className="rounded-2xl border border-border bg-card shadow-card overflow-hidden flex flex-col">
          <div className="px-5 py-5 border-b border-border">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Megaphone className="size-4 text-[var(--color-primary-glow)]" />
              اطلاعیه‌ها و اعلامیه‌ها
            </h2>
            <div className="mt-4 flex gap-1.5 p-1 rounded-xl bg-secondary/60 border border-border">
              <TabBtn active={tab === "org"} onClick={() => setTab("org")} highlight>
                <Megaphone className="size-3.5" />
                سازمانی
                <span className="text-[10px] bg-white/15 rounded-full px-1.5 py-0.5 mr-1">۴</span>
              </TabBtn>
              <TabBtn active={tab === "personal"} onClick={() => setTab("personal")}>
                <User className="size-3.5" />
                شخصی
                <span className="text-[10px] bg-foreground/10 rounded-full px-1.5 py-0.5 mr-1">۴</span>
              </TabBtn>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[640px]">
            {tab === "org"
              ? orgNotices.map((n, i) => (
                  <article
                    key={i}
                    className="group relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4 transition-all hover:border-primary/50 hover:shadow-glow"
                  >
                    <div className="absolute -top-10 -left-10 size-24 rounded-full bg-[var(--color-primary-glow)]/15 blur-2xl group-hover:bg-[var(--color-primary-glow)]/25 transition" />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="size-9 rounded-xl gradient-primary grid place-items-center shadow-glow shrink-0">
                            <Megaphone className="size-4 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="text-[13.5px] font-bold text-foreground leading-tight">{n.title}</h3>
                            <span className="text-[10px] text-[var(--color-primary-glow)] font-medium">{n.date}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider gradient-primary text-primary-foreground rounded-md px-2 py-1 shrink-0">
                          {n.priority}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-muted-foreground leading-6 pr-1">{n.body}</p>
                    </div>
                  </article>
                ))
              : personalNotices.map((n, i) => (
                  <article
                    key={i}
                    className="group rounded-xl border border-border bg-secondary/30 p-3.5 transition-all hover:border-border/80 hover:bg-secondary/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-lg bg-secondary grid place-items-center text-muted-foreground shrink-0">
                        <User className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[13px] font-semibold text-foreground/90 leading-tight">{n.title}</h3>
                        <p className="text-[12px] text-muted-foreground leading-6 mt-1">{n.body}</p>
                        <span className="text-[10px] text-muted-foreground/70 mt-1.5 inline-block">{n.date}</span>
                      </div>
                    </div>
                  </article>
                ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function TabBtn({ children, active, onClick, highlight }: { children: any; active: boolean; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 inline-flex items-center justify-center gap-1.5 text-[12.5px] font-medium rounded-lg h-9 transition-all",
        active
          ? highlight
            ? "gradient-primary text-primary-foreground shadow-glow"
            : "bg-card text-foreground shadow-card border border-border"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: "unread" | "read" | "action" }) {
  const map = {
    unread: { label: "خوانده نشده",   cls: "bg-blue-500/10 text-blue-300 border-blue-400/20",       Icon: Circle },
    read:   { label: "خوانده شده",    cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20", Icon: CheckCircle2 },
    action: { label: "نیازمند اقدام", cls: "bg-amber-500/10 text-amber-300 border-amber-400/20",    Icon: AlertCircle },
  } as const;
  const m = map[status];
  const I = m.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full border px-2.5 py-1 whitespace-nowrap", m.cls)}>
      <I className="size-3" /> {m.label}
    </span>
  );
}
