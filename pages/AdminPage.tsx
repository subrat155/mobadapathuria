
import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, FileText, Camera, Users, Settings, 
  MessageSquare, CheckCircle, Clock, AlertTriangle, 
  Trash2, Plus, Home as HomeIcon, LogOut, ShieldCheck,
  Upload, Link as LinkIcon, Image as ImageIcon, User, Phone,
  Star, AlertCircle, RefreshCw, Globe, Loader2, Send
} from 'lucide-react';
import { useApp } from '../AppContext';

const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dash' | 'notices' | 'gallery' | 'villagers' | 'home' | 'reviews'>('dash');

  const { 
    notices, villagers, gallery, complaints, homeConfig, reviews, isSyncing, syncProgress, lastSync,
    addNotice, deleteNotice, addVillager, deleteVillager,
    addImage, deleteImage, updateHomeConfig, deleteComplaint,
    addReview, deleteReview, publishToCloud, pullFromCloud
  } = useApp();

  // Form States
  const [newNotice, setNewNotice] = useState({ title: '', category: 'Panchayat', content: '', date: new Date().toISOString().split('T')[0] });
  const [newVillager, setNewVillager] = useState({ name: '', occupation: '', contact: '' });
  const [newImage, setNewImage] = useState({ url: '', title: '', description: '' });
  const [newReview, setNewReview] = useState({ name: '', content: '', rating: 5, avatarUrl: '' });
  const [tempHome, setTempHome] = useState(homeConfig);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === '909021') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials.');
    }
  };

  const handleCloudPublish = async () => {
    setSyncStatus("Starting broadcast...");
    try {
      await publishToCloud();
      setSyncStatus("Village successfully updated! ✅");
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      setAdminError("Sync failed. Check connection.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (gallery.length >= 30) {
      setAdminError("Gallery limit of 30 reached.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage({ ...newImage, url: reader.result as string });
      setAdminError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryImage = async () => {
    if (newImage.url && newImage.title) {
      setIsCompressing(true);
      const success = await addImage(newImage);
      setIsCompressing(false);
      if (success) {
        setNewImage({ url: '', title: '', description: '' });
        setAdminError(null);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-2xl border border-[#88AB8E]/10 w-full max-w-md text-center">
            <div className="bg-[#88AB8E] text-white p-3 rounded-2xl mb-4 inline-block">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-10">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-sm font-bold text-black/70 ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-[#F9F8F4] border-none rounded-2xl focus:ring-2 focus:ring-[#88AB8E]/20" placeholder="admin@gmail.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-black/70 ml-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 bg-[#F9F8F4] border-none rounded-2xl focus:ring-2 focus:ring-[#88AB8E]/20" placeholder="••••••" required />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-bold hover:bg-[#333] transition-all shadow-xl">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black">Admin Panel</h1>
          <p className="text-black/60 mt-1">Village Cloud Sync Enabled</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCloudPublish}
            disabled={isSyncing}
            className="bg-[#88AB8E] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#6B8A7A] transition-all flex items-center gap-2 shadow-lg shadow-[#88AB8E]/20 disabled:opacity-50"
          >
             {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />} 
             Publish Updates
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#333] flex items-center gap-2">
             <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-10 gap-2 border-b border-gray-100 custom-scrollbar whitespace-nowrap">
        {[
          { id: 'dash', label: 'Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'home', label: 'Home Page', icon: <HomeIcon size={18} /> },
          { id: 'notices', label: 'Notices Board', icon: <FileText size={18} /> },
          { id: 'gallery', label: 'Village Photos', icon: <Camera size={18} /> },
          { id: 'villagers', label: 'Resident Directory', icon: <Users size={18} /> },
          { id: 'reviews', label: 'Feedback', icon: <Star size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setAdminError(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all flex-shrink-0 ${
              activeTab === tab.id ? 'bg-[#88AB8E] text-white shadow-lg' : 'text-black/60 hover:bg-[#88AB8E]/10'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {isSyncing && (
        <div className="mb-6 bg-blue-500 text-white p-4 rounded-2xl flex items-center gap-3 animate-pulse">
           <Loader2 className="animate-spin" size={20} />
           <span className="font-bold">{syncProgress || "Connecting to village cloud..."}</span>
        </div>
      )}

      {syncStatus && !isSyncing && (
        <div className="mb-6 bg-[#88AB8E] text-white p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
           <CheckCircle size={20} />
           <span className="font-bold">{syncStatus}</span>
        </div>
      )}

      {adminError && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
           <AlertCircle size={20} />
           <span className="font-bold">{adminError}</span>
        </div>
      )}

      {activeTab === 'dash' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Notices', value: notices.length, icon: <FileText className="text-green-500" /> },
              { label: 'Residents', value: villagers.length, icon: <Users className="text-purple-500" /> },
              { label: 'Photos', value: gallery.length, icon: <Camera className="text-yellow-500" /> },
              { label: 'Inquiries', value: complaints.length, icon: <MessageSquare className="text-blue-500" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#88AB8E]/10 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-[#F9F8F4] rounded-2xl">{stat.icon}</div>
                <div>
                  <span className="text-xs font-bold text-black/40 uppercase tracking-wider">{stat.label}</span>
                  <div className="text-2xl font-bold text-black">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#88AB8E]/5 p-12 rounded-[50px] border border-[#88AB8E]/20 text-center">
            <Globe className="mx-auto mb-6 text-[#88AB8E]" size={64} />
            <h3 className="text-3xl font-bold text-black mb-4">Cloud Synchronization</h3>
            <p className="text-black/50 mb-10 max-w-lg mx-auto leading-relaxed">
              When you add or delete items, they save to this device only. <br />
              <b>Tap "Broadcast Changes" to update every phone in the village.</b>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleCloudPublish}
                disabled={isSyncing}
                className="bg-black text-white px-12 py-5 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-4 disabled:opacity-50 shadow-2xl"
              >
                 {isSyncing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} 
                 Broadcast All Changes
              </button>
              <button 
                onClick={pullFromCloud}
                disabled={isSyncing}
                className="bg-white text-black border border-black px-12 py-5 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center gap-4 disabled:opacity-50"
              >
                 <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} /> 
                 Refresh from Cloud
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-[#88AB8E]">
              <Clock size={14} /> Last Update: {lastSync || 'Never'}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">
              <h3 className="text-xl font-bold text-black mb-6">Add New Photo ({gallery.length}/30)</h3>
              <p className="text-xs text-black/40 mb-4">Images are automatically resized to fit cloud storage.</p>
              <div className="space-y-4">
                 <input placeholder="Short Title" value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
                 <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-[#88AB8E]/30 rounded-2xl text-[#88AB8E] font-bold text-sm hover:bg-[#88AB8E]/5 transition-colors">Select Image</button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                 
                 {newImage.url && (
                   <div className="relative border-4 border-[#88AB8E]/10 rounded-2xl overflow-hidden">
                     <img src={newImage.url} className="w-full h-40 object-cover" />
                     {isCompressing && (
                       <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs font-bold">
                          <Loader2 className="animate-spin mb-2" /> Optimizing...
                       </div>
                     )}
                   </div>
                 )}
                 
                 <button 
                  disabled={isCompressing || !newImage.url || !newImage.title}
                  onClick={handleAddGalleryImage} 
                  className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold shadow-lg disabled:opacity-50 active:scale-95 transition-all"
                >
                  {isCompressing ? "Compressing..." : "Save Image Locally"}
                </button>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-[40px] border border-[#88AB8E]/10 h-fit">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">Current Photos</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto p-1 custom-scrollbar">
                {gallery.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#88AB8E] transition-all shadow-sm group">
                    <img src={img.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => { deleteImage(img.id); }} 
                        className="bg-white text-red-500 p-3 rounded-full hover:scale-110 active:scale-90 transition-all shadow-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-2 py-20 text-center text-gray-400 font-bold bg-[#F9F8F4] rounded-3xl">No images found.</div>
                )}
              </div>
              <p className="text-[10px] text-red-500/60 mt-4 text-center italic">Tip: Tap 'Broadcast Changes' on Dashboard to update everyone else.</p>
           </div>
        </div>
      )}

      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">
            <h3 className="text-xl font-bold text-black mb-6">Post Notice</h3>
            <div className="space-y-4">
              <input placeholder="Title" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
              <select value={newNotice.category} onChange={e => setNewNotice({...newNotice, category: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl">
                <option>Panchayat</option><option>Culture</option><option>Health</option><option>Emergency</option>
              </select>
              <textarea placeholder="Details..." value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl min-h-[120px]"></textarea>
              <button onClick={() => { if (newNotice.title) { addNotice(newNotice); setNewNotice({ title: '', category: 'Panchayat', content: '', date: new Date().toISOString().split('T')[0] }); } }} className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold shadow-lg">Save Locally</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[40px] border border-[#88AB8E]/10 h-fit">
            <h3 className="text-xl font-bold text-black mb-6">Active Board</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto p-1 custom-scrollbar">
              {notices.map(n => (
                <div key={n.id} className="bg-[#F9F8F4] p-5 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-black text-sm">{n.title}</h4>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{n.category} • {n.date}</p>
                  </div>
                  <button onClick={() => deleteNotice(n.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'villagers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">
            <h3 className="text-xl font-bold text-black mb-6">Register Resident</h3>
            <div className="space-y-4">
              <input placeholder="Full Name" value={newVillager.name} onChange={e => setNewVillager({...newVillager, name: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
              <input placeholder="Occupation" value={newVillager.occupation} onChange={e => setNewVillager({...newVillager, occupation: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
              <button onClick={() => { if (newVillager.name) { addVillager(newVillager); setNewVillager({ name: '', occupation: '', contact: '' }); } }} className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold">Add to List</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[40px] border border-[#88AB8E]/10 h-fit">
            <h3 className="text-xl font-bold text-black mb-6">Residents</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar p-1">
              {villagers.map(v => (
                <div key={v.id} className="bg-[#F9F8F4] px-6 py-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                  <div><div className="font-bold text-black text-sm">{v.name}</div><div className="text-[10px] text-black/40">{v.occupation}</div></div>
                  <button onClick={() => deleteVillager(v.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'home' && (
        <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-black mb-8 flex items-center gap-2"><HomeIcon size={20} /> Website Text</h3>
          <div className="space-y-6">
             <div className="space-y-4">
                <label className="text-xs font-bold text-black/40 uppercase tracking-widest ml-1">Hero Title</label>
                <input type="text" value={tempHome.welcomeHeading} onChange={(e) => setTempHome({...tempHome, welcomeHeading: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl font-bold" />
                <label className="text-xs font-bold text-black/40 uppercase tracking-widest ml-1">Description</label>
                <textarea value={tempHome.welcomeSubheading} onChange={(e) => setTempHome({...tempHome, welcomeSubheading: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl min-h-[100px] text-sm"></textarea>
             </div>
             <button onClick={() => { updateHomeConfig(tempHome); alert('Changes saved locally.'); }} className="w-full bg-[#88AB8E] text-white py-5 rounded-2xl font-bold shadow-lg">Apply Locally</button>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">
            <h3 className="text-xl font-bold text-black mb-6">Add Feedback</h3>
            <div className="space-y-4">
              <input placeholder="Name" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
              <textarea placeholder="Feedback..." value={newReview.content} onChange={e => setNewReview({...newReview, content: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl min-h-[100px] text-sm"></textarea>
              <button onClick={() => { if (newReview.name && newReview.content) { addReview(newReview); setNewReview({ name: '', content: '', rating: 5, avatarUrl: 'https://i.pravatar.cc/150' }); } }} className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold">Save Feedback</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[40px] border border-[#88AB8E]/10 h-fit">
            <h3 className="text-xl font-bold text-black mb-6">Recent Feedback</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar p-1">
              {reviews.map(r => (
                <div key={r.id} className="bg-[#F9F8F4] p-4 rounded-3xl border border-gray-100 flex justify-between items-start">
                  <div><h4 className="font-bold text-black text-sm">{r.name}</h4><p className="text-[10px] text-black/60 italic leading-relaxed">"{r.content}"</p></div>
                  <button onClick={() => deleteReview(r.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
