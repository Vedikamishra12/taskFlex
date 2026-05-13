const BrandLogo = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="brand-mark">
        <span>TF</span>
      </div>
      {!compact && (
        <div>
          <div className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-lg font-extrabold text-transparent">TaskFlex Pro</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Team workspace</div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
