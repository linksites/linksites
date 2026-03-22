import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { login, magicLink, signup } from "@/app/login/actions";
import { LanguageToggle } from "@/components/language-toggle";
import { appContent } from "@/data/app-content";
import { sanitizeNextPath } from "@/lib/auth-redirect";
import { getServerLocale } from "@/lib/locale-server";
import { getCurrentViewer } from "@/lib/viewer";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
    mode?: string;
  }>;
};

function Notice({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-rose-400/24 bg-rose-400/10 text-rose-100"
          : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
      }`}
    >
      {children}
    </div>
  );
}

function resolveFeedback(copy: Record<string, string>, value?: string) {
  if (!value) {
    return null;
  }

  return copy[value] ?? value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const locale = await getServerLocale();
  const content = appContent[locale];
  const viewer = await getCurrentViewer();
  const next = sanitizeNextPath(params.next);
  const activeMode = params.mode === "signup" ? "signup" : "signin";
  const isCommentReturn = next.includes("#post-");
  const commentReturnCopy =
    locale === "ptBR"
      ? {
          notice: "Depois de entrar, você volta para o mesmo post e já pode comentar.",
          panelEyebrow: "Volta para a conversa",
          panelTitle: "Seu comentário está a um passo",
          panelDescription:
            "Entre ou crie sua conta para voltar ao mesmo perfil, no mesmo post, pronto para participar da conversa.",
          panelPoints: [
            "Você volta automaticamente para o mesmo post",
            "O campo de comentário fica pronto para uso",
            "Sua conta também libera curtidas, conexões e notificações",
          ],
          signInCard: "Entrar para comentar",
          signUpCard: "Criar conta e comentar",
          signInButton: "Entrar e voltar ao post",
          signUpButton: "Criar conta e continuar",
          magicTitle: "Receber link rápido para comentar",
          magicDescription:
            "Se preferir, receba um magic link e volte direto para o post assim que confirmar o acesso.",
          signInHint: "Já tem conta? Entre e continue de onde parou.",
          signUpHint: "Novo por aqui? Crie sua conta para participar da rede.",
        }
      : {
          notice: "After you sign in, you will return to the same post and can comment right away.",
          panelEyebrow: "Return to the conversation",
          panelTitle: "Your comment is one step away",
          panelDescription:
            "Sign in or create an account to return to the same profile, on the same post, ready to join the conversation.",
          panelPoints: [
            "You return to the same post automatically",
            "The comment field is ready for you",
            "Your account also unlocks likes, follows, and notifications",
          ],
          signInCard: "Sign in to comment",
          signUpCard: "Create account and comment",
          signInButton: "Sign in and return to post",
          signUpButton: "Create account and continue",
          magicTitle: "Get a quick sign-in link",
          magicDescription:
            "If you prefer, receive a magic link and go straight back to the post as soon as you confirm access.",
          signInHint: "Already have an account? Sign in and continue where you left off.",
          signUpHint: "New here? Create your account and join the network.",
        };
  const loginViewCopy = isCommentReturn
    ? commentReturnCopy
    : {
        notice: null,
        panelEyebrow: content.login.productEyebrow,
        panelTitle: content.login.productTitle,
        panelDescription: null,
        panelPoints: content.login.bullets,
        signInCard: content.login.signInCard,
        signUpCard: content.login.signUpCard,
        signInButton: content.login.signInButton,
        signUpButton: content.login.signUpButton,
        magicTitle: content.login.magicTitle,
        magicDescription: content.login.magicDescription,
        signInHint: null,
        signUpHint: null,
      };

  if (viewer.user && !viewer.isMock) {
    redirect(next);
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/8 bg-[var(--panel)] p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">{content.login.eyebrow}</div>
              <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {content.login.title}
              </h1>
            </div>
            <LanguageToggle
              locale={locale}
              label={content.shared.languageLabel}
              locales={content.shared.locales}
            />
          </div>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/66">
            {content.login.description}
          </p>

          <div className="mt-8 space-y-3">
            {params.error ? <Notice tone="error">{resolveFeedback(content.login.feedback, params.error)}</Notice> : null}
            {params.message ? (
              <Notice tone="info">{resolveFeedback(content.login.feedback, params.message)}</Notice>
            ) : null}
            {loginViewCopy.notice ? <Notice tone="info">{loginViewCopy.notice}</Notice> : null}
          </div>

          {isCommentReturn ? (
            <div className="mt-8 rounded-[1.7rem] border border-cyan-300/18 bg-cyan-300/8 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/70">
                {loginViewCopy.panelEyebrow}
              </div>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-white">
                {loginViewCopy.panelTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/78">
                {loginViewCopy.panelDescription}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {loginViewCopy.panelPoints.map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/74">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <form
              action={login}
              className={`rounded-[1.7rem] border p-5 ${
                activeMode === "signin"
                  ? "border-cyan-300/24 bg-cyan-300/8"
                  : "border-white/8 bg-white/4"
              }`}
            >
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="mode" value="signin" />
              <div className="text-sm font-semibold text-white">{loginViewCopy.signInCard}</div>
              {loginViewCopy.signInHint ? (
                <p className="mt-2 text-sm leading-7 text-white/60">{loginViewCopy.signInHint}</p>
              ) : null}
              <div className="mt-4 space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/46">{content.login.emailLabel}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    placeholder={content.login.emailPlaceholder}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/46">{content.login.passwordLabel}</span>
                  <input
                    name="password"
                    type="password"
                    required
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    placeholder={content.login.passwordPlaceholder}
                  />
                </label>
              </div>
              <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-px">
                {loginViewCopy.signInButton}
              </button>
            </form>

            <form
              action={signup}
              className={`rounded-[1.7rem] border p-5 ${
                activeMode === "signup"
                  ? "border-cyan-300/24 bg-cyan-300/8"
                  : "border-white/8 bg-white/4"
              }`}
            >
              <input type="hidden" name="next" value={next} />
              <input type="hidden" name="mode" value="signup" />
              <div className="text-sm font-semibold text-white">{loginViewCopy.signUpCard}</div>
              {loginViewCopy.signUpHint ? (
                <p className="mt-2 text-sm leading-7 text-white/60">{loginViewCopy.signUpHint}</p>
              ) : null}
              <div className="mt-4 space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/46">{content.login.emailLabel}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    placeholder={content.login.emailPlaceholder}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/46">{content.login.passwordLabel}</span>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    placeholder={content.login.signupPasswordPlaceholder}
                  />
                </label>
              </div>
              <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]/30 hover:text-[var(--accent)]">
                {loginViewCopy.signUpButton}
              </button>
            </form>
          </div>

          <form action={magicLink} className="mt-5 rounded-[1.7rem] border border-white/8 bg-white/3 p-5">
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="mode" value={activeMode} />
            <div className="text-sm font-semibold text-white">{loginViewCopy.magicTitle}</div>
            <p className="mt-2 text-sm leading-7 text-white/60">{loginViewCopy.magicDescription}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                name="email"
                type="email"
                required
                className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                placeholder={content.login.emailPlaceholder}
              />
              <button className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/22 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:-translate-y-px">
                {content.login.magicButton}
              </button>
            </div>
          </form>

          <Link href="/" className="mt-6 inline-flex text-sm text-white/58 transition hover:text-[var(--accent)]">
            {content.login.backHome}
          </Link>
        </section>

        <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(8,17,31,0.92),rgba(7,15,26,0.9))] p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">{loginViewCopy.panelEyebrow}</div>
          <h2 className="mt-4 font-[var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {loginViewCopy.panelTitle}
          </h2>
          {loginViewCopy.panelDescription ? (
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/66">{loginViewCopy.panelDescription}</p>
          ) : null}
          <div className="mt-6 grid gap-4">
            {loginViewCopy.panelPoints.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-sm font-semibold text-[var(--accent)]">
                  0{index + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-white/66">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
