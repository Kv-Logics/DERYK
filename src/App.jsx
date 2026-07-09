import React, { useState } from 'react';
import { 
  Search, 
  Sidebar as SidebarIcon,
  Bell, 
  ClipboardList,
  Activity, 
  Map, 
  MoreVertical,
  Plus,
  Mic,
  ArrowUp,
  ActivitySquare,
  Zap,
  Clock,
  AudioLines
} from 'lucide-react';
import './index.css';

const DerykLogo = () => (
  <img src="/design9.png" alt="DERYK Logo" className="w-[41px] h-[52px] object-cover flex-none" />
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const chatHistory = [
    "UAV Battery degradation pattern",
    "Geofence validation for SIM-04",
    "Fleet reroute – coastal survey",
    "PIMS retrieval latency review",
    "Marine vehicle obstacle trace",
    "UAV Battery degradation pattern",
    "Geofence validation for SIM-04",
    "Fleet reroute – coastal survey",
    "PIMS retrieval latency review",
    "Marine vehicle obstacle trace"
  ];

  return (
    <div className="flex h-screen w-full bg-[#070B11] overflow-hidden text-white font-sans">
      
      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} flex-shrink-0 flex flex-col justify-between`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top section: Logo and toggles */}
          <div className="flex items-center justify-between px-2 pt-2 pb-4">
            {sidebarOpen ? (
              <div className="flex flex-row justify-between items-center w-[230px] h-[52px] ml-[20px] mt-[28px] gap-[87px]">
                <DerykLogo />
                <div className="flex flex-row justify-between items-center w-[51px] h-[15px] gap-[17px] flex-none">
                  <Search size={15} className="cursor-pointer text-[#938F8F] hover:text-white flex-none" />
                  <SidebarIcon size={19} className="cursor-pointer text-[#938F8F] hover:text-white flex-none" onClick={toggleSidebar} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full gap-6 pt-4 mt-[28px]">
                <div className="flex items-center justify-center p-2 mb-4 w-[41px]">
                  <img src="/design9.png" alt="Logo" className="w-full h-auto object-cover" />
                </div>
                <SidebarIcon size={19} className="cursor-pointer text-[#938F8F] hover:text-white" onClick={toggleSidebar} />
              </div>
            )}
          </div>

          {/* Main Menu */}
          {sidebarOpen && (
            <div className="flex flex-col gap-1 mt-2">
              <div className="menu-item">
                <ClipboardList size={18} className="mr-3" />
                <span className="text-sm font-medium">Flight Records</span>
              </div>
              <div className="menu-item">
                <Activity size={18} className="mr-3" />
                <span className="text-sm font-medium">Telemetry Studio</span>
              </div>
              <div className="menu-item">
                <Map size={18} className="mr-3" />
                <span className="text-sm font-medium">Mission Studio</span>
              </div>
            </div>
          )}

          {/* Chat History Section */}
          {sidebarOpen && (
            <div className="flex flex-col flex-1 mt-8 overflow-hidden">
              <div className="flex items-center px-[18px] mb-6 text-[#94A3B8] hover:text-white cursor-pointer transition-colors">
                <Plus size={16} className="mr-2" />
                <span className="text-sm font-medium">New chat</span>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 flex flex-col gap-[27px] px-[18px]">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[0.85rem] text-[#94A3B8] cursor-pointer hover:text-white group transition-colors">
                    <span className="truncate mr-2 flex-1">{chat}</span>
                    <MoreVertical size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className={`p-4 border-t border-[#1F2937] flex items-center ${!sidebarOpen ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-sm bg-[#1A2330] flex-shrink-0">
            A
          </div>
          {sidebarOpen && <span className="ml-3 text-sm font-medium">Adarsh Kumar</span>}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content flex-1 flex flex-col relative">
        {/* Background Circles */}
        <div className="bg-circles">
          <div className="frame-35">
            <div className="ellipse-4"></div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-6 w-full relative z-10">
          <div className="text-xl font-semibold tracking-widest flex items-center gap-2">
             <span className="text-gray-300">D E R Y &lt;</span>
          </div>
          <Bell size={20} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-8 pb-32">
          
          <h1 className="neuton-font font-normal text-[70px] leading-[89px] mb-8">Hello User</h1>

          {/* Chat Input */}
          <div className="w-full max-w-[881px] h-[202px] bg-[#878787]/50 rounded-[30px] flex flex-col relative justify-between pt-[26px] pb-6 px-11 border border-transparent backdrop-blur-md">
            <input 
              type="text" 
              placeholder="what is your mission ?" 
              className="w-full bg-transparent border-none outline-none text-[24px] font-semibold text-white/50 h-[29px]"
            />
            
            <div className="flex items-center justify-end w-full gap-4 mt-auto mb-2">
              <span className="text-[19px] text-white/70 flex items-center cursor-pointer transition-colors mr-1">
                Mission Agent <span className="ml-2 text-xs border border-gray-500 rounded px-1.5 py-0.5">v</span>
              </span>
              
              <button className="w-[49px] h-[44px] rounded-[14px] bg-[#6495ED] flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer border-none outline-none">
                <ArrowUp size={24} strokeWidth={2.5} className="text-[#1E1E1E]" />
              </button>
              
              <Mic size={28} strokeWidth={1.5} className="text-white cursor-pointer hover:text-gray-200 transition-colors ml-2" />
              <AudioLines size={28} strokeWidth={1.5} className="text-white cursor-pointer hover:text-gray-200 transition-colors" />
            </div>
          </div>

          {/* Pill Suggestions */}
          <div className="flex flex-wrap justify-center gap-[22px] mt-8 w-full max-w-[881px]">
            <button className="flex items-center gap-[10px] px-4 py-3 bg-[#4F4F4F] rounded-[49px] text-[13px] text-white hover:bg-[#5a5a5a] transition-colors border-none outline-none">
              <ActivitySquare size={16} />
              Diagnose a telemetry anomaly
            </button>
            <button className="flex items-center gap-[10px] px-4 py-3 bg-[#4F4F4F] rounded-[43px] text-[15px] text-white hover:bg-[#5a5a5a] transition-colors border-none outline-none">
              <Zap size={16} />
              Plan a fleet mission
            </button>
            <button className="flex items-center gap-[10px] px-[19px] py-3 bg-[#4F4F4F] rounded-[34px] text-[15px] text-white hover:bg-[#5a5a5a] transition-colors border-none outline-none">
              <Clock size={20} />
              How PIMS retrieval works
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;
