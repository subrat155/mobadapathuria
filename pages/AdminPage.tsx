
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
  const [activeTab, setActiveTab] = useState<'dash' | 'sync' | 'notices' | 'gallery' | 'villagers' | 'home' | 'reviews'>('dash');

  const { 
    notices, villagers, gallery, complaints, homeConfig, reviews, isSyncing, lastSync,
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const homeHeroFileInputRef = useRef<HTMLInputElement>(null);
  const reviewAvatarInputRef = useRef<HTMLInputElement>(null);

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
    setSyncStatus("Broadcasting to all devices...");
    await publishToCloud();
    setSyncStatus("Successfully updated all village devices! ✅");
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (gallery.length >= 40) {
      setAdminError("Gallery limit reached.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setNewImage({ ...newImage, url: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleHomeHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setTempHome({ ...tempHome, heroImageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleReviewAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewReview({ ...newReview, avatarUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-2xl border border-[#88AB8E]/10 w-full max-w-md">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-[#88AB8E] text-white p-3 rounded-2xl mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">Admin Access</h1>
            <p className="text-black/40 text-sm mt-2">Manage Badapathuria Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
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
          <h1 className="text-3xl md:text-4xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-black/60 mt-1">Village Cloud Control Active</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCloudPublish}
            disabled={isSyncing}
            className="bg-[#88AB8E] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#6B8A7A] transition-all flex items-center gap-2 shadow-lg shadow-[#88AB8E]/20"
          >
             {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />} 
             Publish to Village
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#333] flex items-center gap-2">
             <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-10 gap-2 border-b border-gray-100 custom-scrollbar whitespace-nowrap">
        {[
          { id: 'dash', label: 'Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'sync', label: 'Cloud Sync', icon: <RefreshCw size={18} /> },
          { id: 'home', label: 'Home Page', icon: <HomeIcon size={18} /> },
          { id: 'notices', label: 'Notices', icon: <FileText size={18} /> },
          { id: 'gallery', label: 'Gallery', icon: <Camera size={18} /> },
          { id: 'villagers', label: 'Directory', icon: <Users size={18} /> },
          { id: 'reviews', label: 'Reviews', icon: <Star size={18} /> },
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

      {syncStatus && (
        <div className="mb-6 bg-[#88AB8E] text-white p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
           <CheckCircle size={20} />
           <span className="font-bold">{syncStatus}</span>
        </div>
      )}

      {activeTab === 'dash' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Village Notices', value: notices.length, icon: <FileText className="text-green-500" /> },
              { label: 'Directory Size', value: villagers.length, icon: <Users className="text-purple-500" /> },
              { label: 'Gallery Photos', value: gallery.length, icon: <Camera className="text-yellow-500" /> },
              { label: 'User Inquiries', value: complaints.length, icon: <MessageSquare className="text-blue-500" /> },
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

          <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/20 text-center">
            <Globe className="mx-auto mb-4 text-[#88AB8E]" size={48} />
            <h3 className="text-2xl font-bold text-black mb-2">Push Changes to All Devices</h3>
            <p className="text-black/50 mb-8 max-w-lg mx-auto">
              You have made changes locally. To make these updates visible to every villager on their own phones, click the publish button.
            </p>
            <button 
              onClick={handleCloudPublish}
              className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-3 mx-auto"
            >
               <Send size={18} /> Update All Village Devices
            </button>
          </div>
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10 max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <RefreshCw className={`mx-auto mb-4 text-[#88AB8E] ${isSyncing ? 'animate-spin' : ''}`} size={48} />
            <h3 className="text-2xl font-bold text-black">Cloud Sync Management</h3>
            <p className="text-black/50 mt-2">Manage how your data is shared across the community.</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 bg-[#F9F8F4] rounded-3xl border border-[#88AB8E]/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-black/70">Last Server Broadcast</span>
                <span className="text-xs font-bold text-[#88AB8E]">{lastSync || 'Never'}</span>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={pullFromCloud}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-[#88AB8E]/20 py-4 rounded-2xl font-bold text-sm hover:bg-white/80"
                >
                  <RefreshCw size={18} /> Refresh from Server
                </button>
                <button 
                  onClick={handleCloudPublish}
                  className="w-full flex items-center justify-center gap-2 bg-[#88AB8E] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#6B8A7A]"
                >
                  <Globe size={18} /> Broadcast Local Data
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-yellow-50 rounded-3xl border border-yellow-100 flex gap-4">
               <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
               <p className="text-xs text-yellow-700 leading-relaxed">
                  <strong>Warning:</strong> Broadcasting will overwrite whatever is currently on the server. If other admins have made changes, make sure to "Refresh from Server" first to merge updates.
               </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'home' && (
        <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-black mb-8 flex items-center gap-2"><HomeIcon size={20} /> Manage Home Page</h3>
          <div className="space-y-6">
             <div className="space-y-4">
                <label className="text-sm font-bold text-black/70 ml-1">Hero Image URL</label>
                <input type="text" value={tempHome.heroImageUrl} onChange={(e) => setTempHome({...tempHome, heroImageUrl: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" placeholder="https://..." />
                <div className="flex gap-4">
                   <button onClick={() => homeHeroFileInputRef.current?.click()} className="flex-1 border-2 border-dashed border-[#88AB8E]/30 py-4 rounded-2xl text-[#88AB8E] font-bold text-sm">Upload File</button>
                   <input type="file" ref={homeHeroFileInputRef} className="hidden" accept="image/*" onChange={handleHomeHeroUpload} />
                </div>
             </div>
             <div className="space-y-4">
                <label className="text-sm font-bold text-black/70 ml-1">Welcome Heading</label>
                <input type="text" value={tempHome.welcomeHeading} onChange={(e) => setTempHome({...tempHome, welcomeHeading: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
                <label className="text-sm font-bold text-black/70 ml-1">Subheading</label>
                <textarea value={tempHome.welcomeSubheading} onChange={(e) => setTempHome({...tempHome, welcomeSubheading: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl min-h-[100px]"></textarea>
             </div>
             <button onClick={() => { updateHomeConfig(tempHome); alert('Applied locally! Don\'t forget to Publish to Everyone.'); }} className="w-full bg-[#88AB8E] text-white py-5 rounded-2xl font-bold">Apply Locally</button>
          </div>
        </div>
      )}

      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10">
            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2"><Plus size={20} /> Add Notice</h3>
            <div className="space-y-4">
              <input placeholder="Title" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
              <select value={newNotice.category} onChange={e => setNewNotice({...newNotice, category: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl">
                <option>Panchayat</option><option>Culture</option><option>Health</option><option>Emergency</option>
              </select>
              <textarea placeholder="Content" value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl min-h-[120px]"></textarea>
              <button onClick={() => { if (newNotice.title) { addNotice(newNotice); setNewNotice({ title: '', category: 'Panchayat', content: '', date: new Date().toISOString().split('T')[0] }); } }} className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold">Add Notice</button>
            </div>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {notices.map(n => (
              <div key={n.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div><h4 className="font-bold text-black">{n.title}</h4><p className="text-xs text-black/40">{n.category}</p></div>
                <button onClick={() => deleteNotice(n.id)} className="text-red-400 p-2"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs remain largely the same, but they interact with the enhanced AppContext */}
      {activeTab === 'villagers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10">
            <h3 className="text-xl font-bold text-black mb-6">Register Resident</h3>
            <div className="space-y-4">
              <input placeholder="Full Name" value={newVillager.name} onChange={e => setNewVillager({...newVillager, name: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
              <input placeholder="Occupation" value={newVillager.occupation} onChange={e => setNewVillager({...newVillager, occupation: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
              <button onClick={() => { if (newVillager.name) { addVillager(newVillager); setNewVillager({ name: '', occupation: '', contact: '' }); } }} className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold">Register</button>
            </div>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {villagers.map(v => (
              <div key={v.id} className="bg-white px-6 py-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                <div><div className="font-bold text-black">{v.name}</div><div className="text-xs text-black/40">{v.occupation}</div></div>
                <button onClick={() => deleteVillager(v.id)} className="text-red-400 p-2"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10">
              <h3 className="text-xl font-bold text-black mb-6">Gallery ({gallery.length}/40)</h3>
              <div className="space-y-4">
                 <input placeholder="Title" value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
                 <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-[#88AB8E]/30 rounded-2xl text-[#88AB8E] font-bold">Select Image</button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                 {newImage.url && <img src={newImage.url} className="w-full h-32 object-cover rounded-2xl" />}
                 <button onClick={() => { if (newImage.url && newImage.title) { addImage(newImage); setNewImage({ url: '', title: '', description: '' }); } }} className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold">Save Locally</button>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto p-2">
              {gallery.map(img => (
                <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden border">
                   <img src={img.url} className="w-full h-full object-cover" />
                   <button onClick={() => deleteImage(img.id)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><Trash2 size={12} /></button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-[#88AB8E]/10">
            <h3 className="text-xl font-bold text-black mb-6">Add Review</h3>
            <div className="space-y-4">
              <input placeholder="Name" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl" />
              <textarea placeholder="Comment" value={newReview.content} onChange={e => setNewReview({...newReview, content: e.target.value})} className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl min-h-[100px]"></textarea>
              <button onClick={() => { if (newReview.name && newReview.content) { addReview(newReview); setNewReview({ name: '', content: '', rating: 5, avatarUrl: 'https://i.pravatar.cc/150' }); } }} className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold">Publish Review</button>
            </div>
          </div>
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-start">
                <div><h4 className="font-bold text-black text-sm">{r.name}</h4><p className="text-xs text-black/60 italic">"{r.content}"</p></div>
                <button onClick={() => deleteReview(r.id)} className="text-red-400 p-2"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
