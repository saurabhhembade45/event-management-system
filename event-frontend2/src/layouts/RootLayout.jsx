import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background relative selection:bg-indigo-500/30">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 pb-8 md:px-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
