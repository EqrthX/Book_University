import UTCC from "/src/assets/AdminUtcc.png";

function HeadAdmin() {
  

  return (
    <nav className="w-full bg-gradient-to-r from-[#192F4E] via-[#396AB1] to-[#396AB1] h-20 flex items-center px-6 md:px-10">
      <img src={UTCC} className="h-16 w-auto object-contain cursor-pointer" alt="UTCC Logo"/>
    </nav>
  );
}
export default HeadAdmin;
