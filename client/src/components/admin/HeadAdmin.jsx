import UTCC from "/src/assets/AdminUtcc.png";

function HeadAdmin() {
  return (
    <nav className="w-full bg-[#11233D]/95 backdrop-blur-md h-20 flex items-center justify-between px-8 border-b border-white/5 shadow-md relative z-20">
      <img src={UTCC} className="h-12 w-auto object-contain" alt="UTCC Admin Logo"/>
      <div className="flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-slate-400">System Live</span>
      </div>
    </nav>
  );
}

export default HeadAdmin;
