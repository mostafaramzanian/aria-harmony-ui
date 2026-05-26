import { useEffect, useMemo, useRef, useState } from "react";
import {
  Hash, Calendar, Edit3, Tag, Flame, Users2, Copy, EyeOff,
  Bold, Italic, Underline as UIcon, Strikethrough, AlignRight, AlignCenter, AlignLeft, AlignJustify,
  List, ListOrdered, Link2, Image as ImageIcon, Palette, Highlighter, Quote, Code2, Undo2, Redo2,
  Heading1, Heading2, PaintBucket, Type,
  PenLine, Upload, Trash2, CheckCircle2, Save, Send, Paperclip, FileText, X, Plus, Eye, Sparkles,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Urgency = "normal" | "important" | "urgent" | "critical";
const urgencyMeta: Record<Urgency, { label: string; cls: string; dot: string }> = {
  normal:    { label: "عادی",       cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/25", dot: "bg-emerald-400" },
  important: { label: "مهم",        cls: "bg-amber-500/10 text-amber-300 border-amber-400/25",     dot: "bg-amber-400" },
  urgent:    { label: "فوری",       cls: "bg-orange-500/10 text-orange-300 border-orange-400/25",  dot: "bg-orange-400" },
  critical:  { label: "خیلی فوری",  cls: "bg-rose-500/10 text-rose-300 border-rose-400/25",        dot: "bg-rose-400" },
};

const categories = [
  "مکاتبات اداری", "درخواست مرخصی", "گزارش مالی", "درخواست خرید", "اطلاعیه", "سایر",
];

const peopleDirectory = [
  "علی محمدی — مدیرعامل",
  "زهرا احمدی — مدیر منابع انسانی",
  "حسین کریمی — مدیر مالی",
  "مریم رضوی — مدیر بازرگانی",
  "رضا نوری — دبیرخانه مرکزی",
  "فاطمه شریفی — تضمین کیفیت",
  "محسن طاهری — طرح و برنامه",
];

function todayFa() {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date()).replace(/\//g, "/");
}
function nowFa() {
  return new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

export function NewLetterPage() {
  const [letterNo, setLetterNo] = useState("AR-" + Math.floor(10000 + Math.random() * 89999));
  const [editingNo, setEditingNo] = useState(false);
  const [date, setDate] = useState(todayFa());
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [urgency, setUrgency] = useState<Urgency>("normal");
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [body, setBody] = useState<string>(
    `<p>با سلام و احترام،</p><p>به استحضار می‌رساند ...</p>`
  );
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [saveSignature, setSaveSignature] = useState(true);
  const [drawOpen, setDrawOpen] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sigInputRef = useRef<HTMLInputElement | null>(null);

  const wordCount = useMemo(
    () => (body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length),
    [body]
  );

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    setBody(editorRef.current?.innerHTML ?? "");
  };

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((p) => [...p, ...Array.from(list).map((f) => ({ name: f.name, size: f.size }))]);
  };

  const onSig = (list: FileList | null) => {
    const f = list?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => setSignatureUrl(String(r.result));
    r.readAsDataURL(f);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col" dir="rtl">
      {/* Page header */}
      <div className="px-6 lg:px-8 pt-6 pb-4 max-w-[1700px] w-full mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">ایجاد نامه جدید</h1>
              <p className="text-xs text-muted-foreground mt-0.5">نگارش، پیش‌نمایش و ارسال نامه‌ی رسمی سازمانی</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-2.5 py-1">
              <Eye className="size-3" /> پیش‌نمایش زنده فعال
            </span>
          </div>
        </div>
      </div>

      {/* Body: split view */}
      <div className="flex-1 min-h-0 px-6 lg:px-8 pb-28 max-w-[1700px] w-full mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[65fr_35fr] gap-6">
          {/* LEFT: Form */}
          <div className="space-y-5">
            {/* Header info card */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="شماره نامه" icon={Hash}>
                  <div className="relative">
                    <input
                      readOnly={!editingNo}
                      value={letterNo}
                      onChange={(e) => setLetterNo(e.target.value)}
                      className={cn(
                        "w-full h-11 rounded-xl border bg-secondary/60 px-3 pl-10 text-sm font-mono tracking-wide outline-none transition",
                        editingNo ? "border-primary ring-2 ring-primary/20" : "border-border text-muted-foreground"
                      )}
                    />
                    <button
                      onClick={() => setEditingNo((s) => !s)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 size-7 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                      aria-label="ویرایش شماره نامه"
                    >
                      {editingNo ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Edit3 className="size-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="تاریخ نامه" icon={Calendar}>
                  <div className="relative">
                    <input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-secondary/60 px-3 pl-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </Field>
              </div>
            </Card>

            {/* Subject */}
            <Card>
              <Field label="موضوع نامه" required>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="موضوع نامه را وارد کنید…"
                  className="w-full h-13 py-3 rounded-xl border border-border bg-secondary/60 px-4 text-base font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition placeholder:text-muted-foreground/60"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field label="طبقه‌بندی" icon={Tag}>
                  <NativeSelect value={category} onChange={setCategory} options={categories} />
                </Field>
                <Field label="فوریت نامه" icon={Flame}>
                  <UrgencySelect value={urgency} onChange={setUrgency} />
                </Field>
              </div>
            </Card>

            {/* Recipients */}
            <Card>
              <PeoplePicker label="گیرندگان" icon={Users2} value={to} onChange={setTo} accent="primary" required />
              <div className="mt-4">
                <PeoplePicker label="رونوشت (CC)" icon={Copy} value={cc} onChange={setCc} />
              </div>
              <div className="mt-4">
                <PeoplePicker label="مخفی (BCC)" icon={EyeOff} value={bcc} onChange={setBcc} />
              </div>
            </Card>

            {/* Editor */}
            <Card padded={false}>
              <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  بدنه نامه
                </div>
                <div className="text-[11px] text-muted-foreground">{wordCount} کلمه</div>
              </div>

              {/* Toolbar */}
              <div className="px-3 py-2 mx-3 rounded-xl bg-secondary/50 border border-border flex flex-wrap items-center gap-1">
                <TBGroup>
                  <TB title="بازگردانی" onClick={() => exec("undo")}><Undo2 className="size-4" /></TB>
                  <TB title="انجام مجدد" onClick={() => exec("redo")}><Redo2 className="size-4" /></TB>
                </TBGroup>
                <Divider />
                <TBGroup>
                  <select
                    onChange={(e) => { exec("fontSize", e.target.value); e.target.value = ""; }}
                    className="h-8 rounded-lg bg-background/50 border border-border text-xs px-2 outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>اندازه</option>
                    <option value="2">کوچک</option>
                    <option value="3">متوسط</option>
                    <option value="5">بزرگ</option>
                    <option value="6">خیلی بزرگ</option>
                  </select>
                  <TB title="عنوان ۱" onClick={() => exec("formatBlock", "<h1>")}><Heading1 className="size-4" /></TB>
                  <TB title="عنوان ۲" onClick={() => exec("formatBlock", "<h2>")}><Heading2 className="size-4" /></TB>
                  <TB title="متن عادی" onClick={() => exec("formatBlock", "<p>")}><Type className="size-4" /></TB>
                </TBGroup>
                <Divider />
                <TBGroup>
                  <TB title="ضخیم" onClick={() => exec("bold")}><Bold className="size-4" /></TB>
                  <TB title="مورب" onClick={() => exec("italic")}><Italic className="size-4" /></TB>
                  <TB title="زیرخط" onClick={() => exec("underline")}><UIcon className="size-4" /></TB>
                  <TB title="خط‌خورده" onClick={() => exec("strikeThrough")}><Strikethrough className="size-4" /></TB>
                </TBGroup>
                <Divider />
                <TBGroup>
                  <ColorPicker icon={<Palette className="size-4" />} title="رنگ متن" onPick={(c) => exec("foreColor", c)} />
                  <ColorPicker icon={<Highlighter className="size-4" />} title="رنگ هایلایت" onPick={(c) => exec("hiliteColor", c)} />
                  <ColorPicker icon={<PaintBucket className="size-4" />} title="رنگ پس‌زمینه" onPick={(c) => exec("backColor", c)} />
                </TBGroup>
                <Divider />
                <TBGroup>
                  <TB title="راست‌چین" onClick={() => exec("justifyRight")}><AlignRight className="size-4" /></TB>
                  <TB title="وسط" onClick={() => exec("justifyCenter")}><AlignCenter className="size-4" /></TB>
                  <TB title="چپ‌چین" onClick={() => exec("justifyLeft")}><AlignLeft className="size-4" /></TB>
                  <TB title="هم‌تراز" onClick={() => exec("justifyFull")}><AlignJustify className="size-4" /></TB>
                </TBGroup>
                <Divider />
                <TBGroup>
                  <TB title="لیست نشانه‌دار" onClick={() => exec("insertUnorderedList")}><List className="size-4" /></TB>
                  <TB title="لیست شماره‌دار" onClick={() => exec("insertOrderedList")}><ListOrdered className="size-4" /></TB>
                  <TB title="نقل‌قول" onClick={() => exec("formatBlock", "<blockquote>")}><Quote className="size-4" /></TB>
                  <TB title="کد" onClick={() => exec("formatBlock", "<pre>")}><Code2 className="size-4" /></TB>
                </TBGroup>
                <Divider />
                <TBGroup>
                  <TB title="افزودن پیوند" onClick={() => { const u = prompt("نشانی پیوند:"); if (u) exec("createLink", u); }}><Link2 className="size-4" /></TB>
                  <TB title="افزودن تصویر" onClick={() => { const u = prompt("نشانی تصویر:"); if (u) exec("insertImage", u); }}><ImageIcon className="size-4" /></TB>
                </TBGroup>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setBody((e.target as HTMLDivElement).innerHTML)}
                className="mx-3 mb-3 mt-3 min-h-[280px] max-h-[520px] overflow-auto rounded-xl border border-border bg-background/40 px-5 py-4 text-[14.5px] leading-loose outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition prose-editor"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </Card>

            {/* Signature */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold flex items-center gap-2">
                  <PenLine className="size-4 text-primary" />
                  امضای دیجیتال
                </div>
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={saveSignature}
                    onChange={(e) => setSaveSignature(e.target.checked)}
                    className="size-3.5 accent-[var(--color-primary)]"
                  />
                  ذخیره برای استفاده بعدی
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
                <div
                  className={cn(
                    "relative rounded-xl border-2 border-dashed bg-secondary/30 min-h-[150px] grid place-items-center text-center px-4 transition",
                    signatureUrl ? "border-primary/40" : "border-border hover:border-primary/40"
                  )}
                >
                  {signatureUrl ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                      <img src={signatureUrl} alt="امضا" className="max-h-[110px] object-contain" />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setDrawOpen(true)}
                          className="text-[11px] text-primary hover:opacity-80 inline-flex items-center gap-1"
                        >
                          <PenLine className="size-3" /> ترسیم مجدد
                        </button>
                        <button
                          onClick={() => setSignatureUrl(null)}
                          className="text-[11px] text-rose-300 hover:text-rose-200 inline-flex items-center gap-1"
                        >
                          <Trash2 className="size-3" /> حذف امضا
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-5">
                      <div className="size-10 mx-auto rounded-xl gradient-primary grid place-items-center shadow-glow mb-2">
                        <PenLine className="size-5 text-primary-foreground" />
                      </div>
                      <div className="text-sm font-medium">امضای خود را بارگذاری یا ترسیم کنید</div>
                      <div className="text-[11px] text-muted-foreground mt-1">PNG شفاف، حداکثر ۲ مگابایت</div>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <button
                          onClick={() => sigInputRef.current?.click()}
                          className="h-9 px-3 rounded-lg gradient-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 shadow-glow"
                        >
                          <Upload className="size-3.5" /> بارگذاری
                        </button>
                        <button
                          onClick={() => setDrawOpen(true)}
                          className="h-9 px-3 rounded-lg border border-border bg-secondary/60 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-secondary transition"
                        >
                          <PenLine className="size-3.5" /> ترسیم
                        </button>
                      </div>
                      <input ref={sigInputRef} type="file" accept="image/*" hidden onChange={(e) => onSig(e.target.files)} />
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-gradient-to-b from-secondary/40 to-background/40 p-4">
                  <div className="text-[11px] text-muted-foreground mb-2">پیش‌نمایش امضا</div>
                  <div className="h-[110px] rounded-lg bg-background/60 grid place-items-center border border-dashed border-border">
                    {signatureUrl
                      ? <img src={signatureUrl} alt="امضا" className="max-h-[90px] object-contain" />
                      : <span className="text-[11px] text-muted-foreground">هنوز امضا ثبت نشده</span>}
                  </div>
                  <div className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                    محمد رضایی<br/><span className="opacity-70">مدیر سامانه</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Attachments */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold flex items-center gap-2">
                  <Paperclip className="size-4 text-primary" />
                  پیوست‌ها
                </div>
                <div className="text-[11px] text-muted-foreground">{files.length} فایل</div>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
                className="rounded-xl border-2 border-dashed border-border bg-secondary/30 hover:border-primary/40 transition px-4 py-6 text-center"
              >
                <div className="size-10 mx-auto rounded-xl bg-secondary grid place-items-center mb-2">
                  <Upload className="size-5 text-muted-foreground" />
                </div>
                <div className="text-sm">فایل‌ها را اینجا رها کنید یا</div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 shadow-glow"
                >
                  <Plus className="size-3.5" /> انتخاب فایل
                </button>
                <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => onFiles(e.target.files)} />
                <div className="text-[11px] text-muted-foreground mt-2">PDF, DOCX, XLSX, JPG, PNG — حداکثر ۱۰ مگابایت</div>
              </div>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2">
                      <div className="size-8 rounded-lg bg-primary/15 text-primary grid place-items-center">
                        <FileText className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{f.name}</div>
                        <div className="text-[11px] text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <button
                        onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                        className="size-8 grid place-items-center rounded-lg hover:bg-rose-500/15 text-muted-foreground hover:text-rose-300 transition"
                        aria-label="حذف فایل"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* RIGHT: Live preview */}
          <div className="xl:sticky xl:top-[88px] xl:self-start">
            <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-gradient-to-l from-primary/10 to-transparent">
                <div className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="size-4 text-primary" /> پیش‌نمایش زنده
                </div>
                <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-medium rounded-full border px-2 py-0.5", urgencyMeta[urgency].cls)}>
                  <span className={cn("size-1.5 rounded-full", urgencyMeta[urgency].dot)} />
                  {urgencyMeta[urgency].label}
                </span>
              </div>

              <div className="p-5 max-h-[calc(100vh-220px)] overflow-auto">
                {/* Letterhead */}
                <div className="relative rounded-xl bg-gradient-to-b from-white to-slate-50 text-slate-900 shadow-xl ring-1 ring-black/5 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 gradient-primary" />
                  <div className="px-6 pt-6 pb-4 border-b border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-xl gradient-primary grid place-items-center shadow-glow">
                        <Sparkles className="size-5 text-white" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-800">آریا سیستم</div>
                        <div className="text-[10px] text-slate-500">Aria ERP — سامانه مکاتبات سازمانی</div>
                      </div>
                    </div>
                    <div className="text-left text-[11px] text-slate-600 leading-tight">
                      <div>شماره: <span className="font-mono font-semibold text-slate-800">{letterNo}</span></div>
                      <div>تاریخ: <span className="font-semibold text-slate-800">{date}</span></div>
                      <div>ساعت: <span className="font-semibold text-slate-800">{nowFa()}</span></div>
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">موضوع</div>
                      <div className="text-base font-bold text-slate-800">
                        {subject || <span className="text-slate-400 font-normal">— موضوع نامه —</span>}
                      </div>
                    </div>

                    {to.length > 0 && (
                      <div className="text-[12px] text-slate-700">
                        <span className="text-slate-500">گیرنده: </span>
                        {to.join("، ")}
                      </div>
                    )}
                    {cc.length > 0 && (
                      <div className="text-[11px] text-slate-600">
                        <span className="text-slate-400">رونوشت: </span>{cc.join("، ")}
                      </div>
                    )}

                    <div className="h-px bg-slate-200" />

                    <div
                      className="text-[13px] leading-loose text-slate-800 prose-preview"
                      dangerouslySetInnerHTML={{ __html: body || "<p class='text-slate-400'>متن نامه اینجا نمایش داده می‌شود…</p>" }}
                    />

                    <div className="pt-4 mt-4 border-t border-dashed border-slate-200 flex items-end justify-between gap-3">
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        با تشکر،<br/>
                        <span className="text-slate-700 font-semibold">محمد رضایی</span><br/>
                        مدیر سامانه
                      </div>
                      <div className="text-center">
                        {signatureUrl ? (
                          <img src={signatureUrl} alt="امضا" className="max-h-[64px] object-contain" />
                        ) : (
                          <div className="h-[64px] w-[140px] rounded border border-dashed border-slate-300 grid place-items-center text-[10px] text-slate-400">
                            محل امضا
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1">امضای دیجیتال</div>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="pt-3 border-t border-slate-200">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">پیوست‌ها ({files.length})</div>
                        <ul className="space-y-1">
                          {files.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-[11px] text-slate-700">
                              <Paperclip className="size-3 text-slate-400" />
                              <span className="truncate">{f.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1700px] mx-auto px-6 lg:px-8 h-[76px] flex items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground hidden md:block">
            آخرین ذخیره خودکار: لحظاتی پیش
          </div>
          <div className="flex items-center gap-2 ms-auto">
            <button className="h-11 px-5 rounded-xl border border-border bg-secondary/60 hover:bg-secondary text-sm font-medium inline-flex items-center gap-2 transition">
              <Save className="size-4" /> ذخیره به عنوان پیش‌نویس
            </button>
            <button className="h-11 px-6 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 shadow-glow hover:opacity-95 transition">
              <Send className="size-4" /> ارسال نامه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------- helpers ----------- */
function Card({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl border border-border bg-card shadow-card",
      padded && "p-5"
    )}>{children}</div>
  );
}

function Field({
  label, icon: Icon, required, children,
}: { label: string; icon?: any; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5 text-[12px] font-medium text-foreground/85">
        {Icon && <Icon className="size-3.5 text-muted-foreground" />}
        {label}
        {required && <span className="text-rose-400">*</span>}
      </div>
      {children}
    </div>
  );
}

function NativeSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 appearance-none rounded-xl border border-border bg-secondary/60 px-3 pl-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function UrgencySelect({ value, onChange }: { value: Urgency; onChange: (v: Urgency) => void }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {(Object.keys(urgencyMeta) as Urgency[]).map((u) => {
        const m = urgencyMeta[u];
        const active = value === u;
        return (
          <button
            key={u}
            onClick={() => onChange(u)}
            className={cn(
              "h-11 rounded-xl border text-[12px] font-medium inline-flex items-center justify-center gap-1.5 transition",
              active ? cn(m.cls, "ring-2 ring-current/30 shadow") : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
            )}
          >
            <span className={cn("size-1.5 rounded-full", m.dot)} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

function PeoplePicker({
  label, icon: Icon, value, onChange, required, accent,
}: {
  label: string; icon?: any; value: string[]; onChange: (v: string[]) => void;
  required?: boolean; accent?: "primary";
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const suggestions = peopleDirectory.filter((p) => p.includes(q) && !value.includes(p));

  return (
    <Field label={label} icon={Icon} required={required}>
      <div
        className={cn(
          "min-h-[48px] w-full rounded-xl border bg-secondary/60 px-2 py-1.5 flex flex-wrap items-center gap-1.5 transition",
          accent === "primary" ? "border-primary/30" : "border-border",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        )}
      >
        {value.map((p) => (
          <span
            key={p}
            className="inline-flex items-center gap-1.5 text-[12px] rounded-lg bg-primary/15 text-primary-foreground border border-primary/30 px-2 py-1"
          >
            <span className="size-5 rounded-full gradient-primary grid place-items-center text-[9px] font-bold text-primary-foreground">
              {p.charAt(0)}
            </span>
            <span className="text-foreground/90">{p.split(" — ")[0]}</span>
            <button
              onClick={() => onChange(value.filter((x) => x !== p))}
              className="text-muted-foreground hover:text-rose-300"
              aria-label="حذف"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <div className="flex-1 min-w-[160px] relative">
          <input
            value={q}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onChange={(e) => setQ(e.target.value)}
            placeholder={value.length === 0 ? "جستجو و افزودن…" : ""}
            className="w-full h-8 bg-transparent text-sm outline-none px-1"
          />
          {open && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 right-0 left-0 rounded-xl border border-border bg-popover shadow-xl overflow-hidden max-h-56 overflow-y-auto">
              {suggestions.slice(0, 6).map((p) => (
                <button
                  key={p}
                  onMouseDown={(e) => { e.preventDefault(); onChange([...value, p]); setQ(""); }}
                  className="w-full text-right px-3 py-2 text-[12.5px] hover:bg-secondary flex items-center gap-2"
                >
                  <span className="size-6 rounded-full gradient-primary grid place-items-center text-[10px] font-bold text-primary-foreground">{p.charAt(0)}</span>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Field>
  );
}

function TB({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/60 transition"
    >
      {children}
    </button>
  );
}
function TBGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}
function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" />;
}

function ColorPicker({ icon, title, onPick }: { icon: React.ReactNode; title: string; onPick: (c: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <TB title={title} onClick={() => ref.current?.click()}>{icon}</TB>
      <input
        ref={ref}
        type="color"
        className="hidden"
        onChange={(e) => onPick(e.target.value)}
      />
    </>
  );
}
