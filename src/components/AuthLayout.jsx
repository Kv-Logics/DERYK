export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#070B11] px-4 py-10 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6495ED]/10 blur-[120px]" />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
        <img src="/logo.png" alt="DERYK Logo" className="mx-auto mb-6 h-auto w-28 object-contain" />
        <h1 className="neuton-font mb-1 text-center text-2xl font-normal">{title}</h1>
        {subtitle && <p className="mb-6 text-center text-sm text-white/50">{subtitle}</p>}
        {children}
        {footer && <div className="mt-6 text-center text-sm text-white/50">{footer}</div>}
      </div>
    </div>
  );
}
