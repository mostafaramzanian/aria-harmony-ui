import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gradient-text">۴۰۴</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">صفحه پیدا نشد</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          صفحه‌ای که دنبالش هستید وجود ندارد یا منتقل شده است.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">این صفحه بارگذاری نشد</h1>
        <p className="mt-2 text-sm text-muted-foreground">مشکلی پیش آمد. لطفا مجددا تلاش کنید.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-lg gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "آریا سیستم — ERP یکپارچه سازمانی" },
      { name: "description", content: "سامانه جامع منابع سازمانی آریا — مکاتبات، منابع انسانی، مالی، بازرگانی و کیفیت" },
      { property: "og:title", content: "آریا سیستم — ERP یکپارچه سازمانی" },
      { name: "twitter:title", content: "آریا سیستم — ERP یکپارچه سازمانی" },
      { property: "og:description", content: "سامانه جامع منابع سازمانی آریا — مکاتبات، منابع انسانی، مالی، بازرگانی و کیفیت" },
      { name: "twitter:description", content: "سامانه جامع منابع سازمانی آریا — مکاتبات، منابع انسانی، مالی، بازرگانی و کیفیت" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2816981-cf42-475a-8dd7-3b11905817de/id-preview-c276d80a--2daa827f-48b8-41d9-a23e-3de80a7d17f9.lovable.app-1779734023322.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2816981-cf42-475a-8dd7-3b11905817de/id-preview-c276d80a--2daa827f-48b8-41d9-a23e-3de80a7d17f9.lovable.app-1779734023322.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
