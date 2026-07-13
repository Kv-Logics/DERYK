import { useEffect, useState } from 'react';
import {
  Search,
  Sidebar as SidebarIcon,
  Menu,
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
  AudioLines,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const DerykLogo = () => (
  <img src="/sidebar-logo.png" alt="DERYK Logo" className="w-[41px] h-[52px] object-cover flex-none" />
);

export default function MissionControl() {
  const { user, token, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [missionText, setMissionText] = useState('');
  const [sending, setSending] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const displayName = user?.display_name || user?.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!token) return;
    api.listChats(token).then(setChats).catch(() => {});
  }, [token]);

  const handleSend = async () => {
    const title = missionText.trim();
    if (!title || sending) return;
    setSending(true);
    try {
      const chat = await api.createChat(token, title);
      setChats((prev) => [chat, ...prev]);
      setMissionText('');
    } catch {
      // leave the input as-is so the user can retry
    } finally {
      setSending(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#070B11] overflow-hidden text-white font-sans">

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="sidebar-backdrop md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} ${mobileOpen ? 'sidebar-mobile-open' : ''} flex-shrink-0 flex flex-col justify-between`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top section: Logo and toggles */}
          <div className="flex items-center justify-between px-2 pt-2 pb-4">
            {sidebarOpen ? (
              <div className="flex flex-row justify-between items-center w-[230px] h-[52px] ml-[20px] mt-[28px] gap-[87px]">
                <DerykLogo />
                <div className="flex flex-row justify-between items-center w-[51px] h-[15px] gap-[17px] flex-none">
                  <Search size={15} className="cursor-pointer text-[#938F8F] hover:text-white flex-none" />
                  <SidebarIcon
                    size={19}
                    className="cursor-pointer text-[#938F8F] hover:text-white flex-none"
                    onClick={toggleSidebar}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full gap-6 pt-4 mt-[28px]">
                <div className="flex items-center justify-center p-2 mb-4 w-[41px]">
                  <img src="/sidebar-logo.png" alt="Logo" className="w-full h-auto object-cover" />
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
                {chats.length === 0 && (
                  <span className="text-[0.8rem] text-[#5b6472]">No missions yet — type one below to get started.</span>
                )}
                {chats.map((chat) => (
                  <div key={chat.id} className="flex justify-between items-center text-[0.85rem] text-[#94A3B8] cursor-pointer hover:text-white group transition-colors">
                    <span className="truncate mr-2 flex-1">{chat.title}</span>
                    <MoreVertical size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className={`p-4 border-t border-[#1F2937] flex items-center ${!sidebarOpen ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-sm bg-[#1A2330] flex-shrink-0">
              {initial}
            </div>
            {sidebarOpen && <span className="ml-3 text-sm font-medium truncate">{displayName}</span>}
          </div>
          {sidebarOpen && (
            <LogOut
              size={16}
              className="text-[#938F8F] hover:text-white cursor-pointer flex-shrink-0"
              onClick={signOut}
            />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content flex-1 flex flex-col relative min-w-0">
        {/* Background Circles */}
        <div className="bg-circles">
          <div className="frame-35">
            <div className="ellipse-4"></div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 w-full relative z-10">
          <div className="flex items-center gap-3">
            <Menu
              size={22}
              className="text-gray-300 cursor-pointer hover:text-white transition-colors md:hidden"
              onClick={() => setMobileOpen(true)}
            />
            <img src="/logo.png" alt="DERYK Logo" className="w-[110px] sm:w-[140px] h-auto object-contain" />
          </div>
          <Bell size={22} className="text-gray-400 cursor-pointer hover:text-white transition-colors mr-2" />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-4 sm:px-8 pb-16 sm:pb-32">

          <h1 className="neuton-font font-normal text-3xl sm:text-4xl md:text-5xl mb-6 text-center">
            Hello {displayName}
          </h1>

          {/* Chat Input */}
          <div className="w-full max-w-2xl min-h-[130px] bg-[#878787]/50 rounded-[20px] flex flex-col relative justify-between pt-4 pb-3 px-4 sm:px-6 border border-transparent backdrop-blur-md">
            <input
              type="text"
              placeholder="what is your mission ?"
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="w-full bg-transparent border-none outline-none text-base sm:text-lg font-semibold text-white/50"
            />

            <div className="flex items-center justify-end w-full gap-3 mt-auto flex-wrap">
              <span className="text-sm text-white/70 flex items-center cursor-pointer transition-colors mr-1">
                Mission Agent <span className="ml-1 text-[9px] border border-gray-500 rounded px-1 py-0.5">v</span>
              </span>

              <button
                onClick={handleSend}
                disabled={sending || !missionText.trim()}
                className="w-8 h-7 rounded-lg bg-[#6495ED] flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer border-none outline-none disabled:opacity-50"
              >
                <ArrowUp size={16} strokeWidth={2.5} className="text-[#1E1E1E]" />
              </button>

              <Mic size={18} strokeWidth={1.5} className="text-white cursor-pointer hover:text-gray-200 transition-colors ml-1" />
              <AudioLines size={18} strokeWidth={1.5} className="text-white cursor-pointer hover:text-gray-200 transition-colors" />
            </div>
          </div>

          {/* Pill Suggestions */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 w-full max-w-2xl">
            <button
              onClick={() => setMissionText('Diagnose a telemetry anomaly')}
              className="flex items-center gap-2 px-3 py-2 bg-[#4F4F4F] rounded-full text-xs text-white hover:bg-[#5a5a5a] transition-colors border-none outline-none"
            >
              <ActivitySquare size={12} />
              Diagnose a telemetry anomaly
            </button>
            <button
              onClick={() => setMissionText('Plan a fleet mission')}
              className="flex items-center gap-2 px-3 py-2 bg-[#4F4F4F] rounded-full text-xs text-white hover:bg-[#5a5a5a] transition-colors border-none outline-none"
            >
              <Zap size={12} />
              Plan a fleet mission
            </button>
            <button
              onClick={() => setMissionText('How PIMS retrieval works')}
              className="flex items-center gap-2 px-4 py-2 bg-[#4F4F4F] rounded-full text-xs text-white hover:bg-[#5a5a5a] transition-colors border-none outline-none"
            >
              <Clock size={12} />
              How PIMS retrieval works
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
