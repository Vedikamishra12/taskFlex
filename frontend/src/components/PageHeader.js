const PageHeader = ({ eyebrow, title, description, action }) => {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300/90">{eyebrow}</p>
        <h1 className="mt-2 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-slate-400">{description}</p>
        )}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
    </div>
  );
};

export default PageHeader;
