import { BookOpen, Users, Bot, Heart, Sparkles, GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0D1B2A] text-slate-300 font-sans border-t border-slate-800 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Col 1: Brand & Project Description */}
          <div className="md:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#2F5792] text-white rounded-2xl shadow-md shadow-blue-900/50">
                <BookOpen className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white tracking-wide">Book University</h3>
                <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider block">
                  UTCC Book Marketplace
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
              เว็บแอปพลิเคชันซื้อขายและแลกเปลี่ยนหนังสือเรียนสำหรับนักศึกษามหาวิทยาลัยหอการค้าไทย (UTCC) 
              พัฒนาขึ้นเพื่อช่วยให้การส่งต่อหนังสือเรียนมือสองเป็นไปได้อย่างสะดวก รวดเร็ว และปลอดภัย
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-300 text-xs font-semibold w-fit">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Mini Project รายวิชา Software Engineering (SE)</span>
            </div>
          </div>

          {/* Col 2: Development Team */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>คณะผู้จัดทำ (Team Members)</span>
            </h4>
            
            <p className="text-xs text-slate-400 font-medium">
              โครงงาน Mini Project สมาชิก 3 คน ผู้ร่วมพัฒนาในรายวิชาเรียน:
            </p>

            <ul className="space-y-2 text-xs font-semibold">
              <li className="flex items-center gap-2.5 text-slate-200 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Nontprawitch</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-200 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Chanidapha </span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-200 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Chaianun </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Maintenance & AI UI Note */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>การปรับปรุงระบบ (UI/UX)</span>
            </h4>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>AI Maintenance & UI Refactor</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                เนื่องจากภายหลังจบรายวิชาไม่ได้มีผู้พัฒนาต่อ จึงได้ใช้ **AI** 
                ช่วยปรับปรุงโครงสร้าง หน้าตา UI/UX และระบบให้มีความสวยงาม ใช้งานสะดวก และสมบูรณ์ยิ่งขึ้น
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© {new Date().getFullYear()} Book University. Mini Project for Software Engineering Course.</p>
          <div className="flex items-center gap-1">
            <span>Developed by</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" />
            <span className="text-slate-400 font-semibold">Nontprawitch, Chanidapha & Chaianun</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
