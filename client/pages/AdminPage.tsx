import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  FileText,
  Camera,
  Users,
  MessageSquare,
  Trash2,
  Plus,
  Home as HomeIcon,
  LogOut,
  ShieldCheck,
  Upload,
  Link as LinkIcon,
  User,
  Phone,
  Star,
  IndianRupee,
  HandCoins,
  WalletCards,
  IdCard,
  Search,
  RefreshCw,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { useApp } from '../AppContext';
import FamilyQrCard from '../components/FamilyQrCard';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {

  // =====================================================
  // LOGIN
  // =====================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'dash' |
    'notices' |
    'gallery' |
    'villagers' |
    'home' |
    'reviews' |
    'puja' |
    'families'
  >('dash');


  // =====================================================
  // APP CONTEXT
  // =====================================================

  const {
    notices,
    villagers,
    gallery,
    complaints,
    homeConfig,
    reviews,

    // PUJA
    pujas,
    addPuja,
    deletePuja,

    addNotice,
    deleteNotice,
    addVillager,
    deleteVillager,
    addImage,
    deleteImage,
    updateHomeConfig,
    deleteComplaint,
    addReview,
    deleteReview,

    // DIGITAL VILLAGE ID
    families,
    fetchFamilies,
    addFamily,
    updateFamily,
    deleteFamily

  } = useApp();


  // =====================================================
  // FORM STATES
  // =====================================================

  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Panchayat',
    content: '',
    date: new Date().toISOString().split('T')[0]
  });


  const [newVillager, setNewVillager] = useState({
    name: '',
    occupation: '',
    contact: ''
  });


  const [newImage, setNewImage] = useState<{
    file: File | null;
    title: string;
    description: string;
  }>({
    file: null,
    title: '',
    description: ''
  });


  const [newReview, setNewReview] = useState({
    name: '',
    content: '',
    rating: 5,
    avatarUrl: ''
  });


  // =====================================================
  // PUJA FORM
  // =====================================================

  const [newPuja, setNewPuja] = useState({
    pujaName: '',
    memberName: '',
    amount: '',
    paymentMode: 'Cash' as 'Cash' | 'Online'
  });


  const [tempHome, setTempHome] = useState(homeConfig);

  // =====================================================
  // DIGITAL VILLAGE ID - FAMILY FORM
  // =====================================================

  type FamilyFormMember = {
    name: string;
    relation: string;
    age: string;
    gender: 'Male' | 'Female' | 'Other';
  };

  const emptyFamilyMember: FamilyFormMember = {
    name: '',
    relation: '',
    age: '',
    gender: 'Male'
  };

  const [newFamily, setNewFamily] = useState({
    familyHead: '',
    wardNumber: '',
    // STEP 3: Permanent address default
    address: 'At-Badapathuria, Post-Deuli, 752064',
    houseNumber: '',
    members: [{ ...emptyFamilyMember }]
  });

  const [familySearch, setFamilySearch] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [familySaving, setFamilySaving] = useState(false);
  const [familyMessage, setFamilyMessage] = useState('');


  // =====================================================
  // REFS
  // =====================================================

  const fileInputRef = useRef<HTMLInputElement>(null);

  const homeHeroFileInputRef =
    useRef<HTMLInputElement>(null);

  const reviewAvatarInputRef =
    useRef<HTMLInputElement>(null);


  // =====================================================
  // DIGITAL VILLAGE ID - FAMILY HANDLERS
  // =====================================================

  const handleAddFamilyMember = () => {
    setNewFamily(prev => ({
      ...prev,
      members: [...prev.members, { ...emptyFamilyMember }]
    }));
  };

  const handleRemoveFamilyMember = (index: number) => {
    setNewFamily(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const handleFamilyMemberChange = (
    index: number,
    field: keyof FamilyFormMember,
    value: string
  ) => {
    setNewFamily(prev => ({
      ...prev,
      members: prev.members.map((member, i) =>
        i === index
          ? { ...member, [field]: value }
          : member
      )
    }));
  };

  const handleFamilySubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setFamilySaving(true);
    setFamilyMessage('');

    try {
      const familyData = {
        familyHead: newFamily.familyHead.trim(),
        wardNumber: newFamily.wardNumber.trim(),
        address: newFamily.address.trim(),
        houseNumber: newFamily.houseNumber.trim(),
        members: newFamily.members
          .filter(member => member.name.trim() && member.relation.trim())
          .map(member => ({
            name: member.name.trim(),
            relation: member.relation.trim(),
            age: member.age ? Number(member.age) : undefined,
            gender: member.gender
          }))
      };

      const savedFamily = await addFamily(familyData);

      if (savedFamily) {
        setSelectedFamilyId(savedFamily.id);

        setNewFamily({
          familyHead: '',
          wardNumber: '',
          // STEP 3: Keep permanent address after reset
          address: 'At-Badapathuria, Post-Deuli, 752064',
          houseNumber: '',
          members: [{ ...emptyFamilyMember }]
        });
      } else {
        setFamilyMessage('Family registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Family registration error:', error);
      setFamilyMessage('Something went wrong while registering the family.');
    } finally {
      setFamilySaving(false);
    }
  };

  const handleFamilyStatusChange = async (
    familyId: string,
    currentStatus: 'Active' | 'Inactive'
  ) => {
    const newStatus =
      currentStatus === 'Active' ? 'Inactive' : 'Active';

    const success = await updateFamily(familyId, {
      status: newStatus
    });

    if (!success) {
      alert('Failed to update family status.');
    }
  };

  const handleFamilyDelete = async (familyId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this family profile?'
    );

    if (!confirmed) return;

    const success = await deleteFamily(familyId);

    if (!success) {
      alert('Failed to delete family profile.');
    } else if (selectedFamilyId === familyId) {
      setSelectedFamilyId(null);
    }

  };

  const filteredFamilies = families.filter(family => {
    const search = familySearch.toLowerCase();

    return (
      family.familyId.toLowerCase().includes(search) ||
      family.familyHead.toLowerCase().includes(search) ||
      family.wardNumber.toLowerCase().includes(search) ||
      family.address.toLowerCase().includes(search)
    );
  });


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = (e: React.FormEvent) => {

    e.preventDefault();

    if (
      email === 'admin@gmail.com' &&
      password === '909021'
    ) {

      setIsLoggedIn(true);
      setLoginError('');

    } else {

      setLoginError(
        'Invalid credentials. Please try again.'
      );

    }

  };


  // =====================================================
  // GALLERY IMAGE UPLOAD
  // =====================================================

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setNewImage(prev => ({
      ...prev,
      file
    }));

  };


  // =====================================================
  // HOME HERO UPLOAD
  // =====================================================

  const handleHomeHeroUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setTempHome({
        ...tempHome,
        heroImageUrl: reader.result as string
      });

    };

    reader.readAsDataURL(file);

  };


  // =====================================================
  // REVIEW AVATAR UPLOAD
  // =====================================================

  const handleReviewAvatarUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setNewReview({
        ...newReview,
        avatarUrl: reader.result as string
      });

    };

    reader.readAsDataURL(file);

  };


  // =====================================================
  // ADD PUJA
  // =====================================================

  const handleAddPuja = async () => {

    if (!newPuja.pujaName.trim()) {

      alert('Please enter Puja name.');

      return;

    }


    if (!newPuja.memberName.trim()) {

      alert('Please enter member name.');

      return;

    }


    if (!newPuja.amount) {

      alert('Please enter amount.');

      return;

    }


    const amount = Number(newPuja.amount);

    if (isNaN(amount) || amount <= 0) {

      alert('Please enter a valid amount.');

      return;

    }


    try {

      const success = await addPuja({

        pujaName: newPuja.pujaName.trim(),

        memberName:
          newPuja.memberName.trim(),

        amount,

        paymentMode:
          newPuja.paymentMode,

        date:
          new Date().toISOString().split('T')[0]

      });


      if (success) {

        alert(
          'Puja payment added successfully!'
        );


        setNewPuja({

          pujaName: '',

          memberName: '',

          amount: '',

          paymentMode: 'Cash'

        });

      } else {

        alert(
          'Failed to add puja payment.'
        );

      }

    } catch (error) {

      console.error(
        'Add puja error:',
        error
      );

      alert(
        'Something went wrong while adding puja payment.'
      );

    }

  };


  const adminTabs: {
    id: typeof activeTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'dash', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'home', label: 'Home Page', icon: <HomeIcon size={18} /> },
    { id: 'notices', label: 'Notices', icon: <FileText size={18} /> },
    { id: 'gallery', label: 'Gallery', icon: <Camera size={18} /> },
    { id: 'villagers', label: 'Directory', icon: <Users size={18} /> },
    { id: 'puja', label: 'Puja & Donations', icon: <HandCoins size={18} /> },
    { id: 'reviews', label: 'Reviews', icon: <Star size={18} /> },
    { id: 'families', label: 'Family ID', icon: <IdCard size={18} /> },
  ];


  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!isLoggedIn) {

    return (

      <div className="min-h-screen md:min-h-[80vh] flex items-center justify-center px-4 py-12 pt-20 md:pt-12">

        <Link
          to="/"
          className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-xl border border-[#88AB8E]/20 bg-white px-4 py-3 text-sm font-bold text-[#557B5D] shadow-md transition-colors hover:bg-[#88AB8E]/10"
        >
          <HomeIcon size={18} />
          Back to Portal
        </Link>

        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-2xl border border-[#88AB8E]/10 w-full max-w-md">

          <div className="flex flex-col items-center mb-10 text-center">

            <div className="bg-[#88AB8E] text-white p-3 rounded-2xl mb-4">

              <ShieldCheck size={32} />

            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-black">

              Admin Access

            </h1>

            <p className="text-black/40 text-sm mt-2">

              Manage Badapathuria Portal

            </p>

          </div>


          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >

            <div className="space-y-2">

              <label className="text-sm font-bold text-black/70 ml-1">

                Email Address

              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full px-5 py-4 bg-[#F9F8F4] border-none rounded-2xl focus:ring-2 focus:ring-[#88AB8E]/20"
                placeholder="admin@gmail.com"
                required
              />

            </div>


            <div className="space-y-2">

              <label className="text-sm font-bold text-black/70 ml-1">

                Password

              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full px-5 py-4 bg-[#F9F8F4] border-none rounded-2xl focus:ring-2 focus:ring-[#88AB8E]/20"
                placeholder="••••••"
                required
              />

            </div>


            {loginError && (

              <p className="text-red-500 text-xs font-bold text-center">

                {loginError}

              </p>

            )}


            <button
              type="submit"
              className="w-full bg-black text-white py-5 rounded-2xl font-bold hover:bg-[#333] transition-all shadow-xl shadow-black/10"
            >

              Unlock Dashboard

            </button>

          </form>

        </div>

      </div>

    );

  }


  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  return (

    <div className="w-full min-w-0 max-w-7xl mx-auto px-3 sm:px-6 pb-8 md:px-8 md:py-10">

      <div className="md:hidden -mx-3 sm:-mx-6 mb-6 bg-white border-b border-[#88AB8E]/15 shadow-sm">
        <div className="flex items-center justify-between h-16 px-3 sm:px-5 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="min-w-0">
              <span className="block truncate font-black text-sm text-black">Admin Panel</span>
              <span className="hidden sm:block truncate text-[11px] text-black/50">
                {adminTabs.find(tab => tab.id === activeTab)?.label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileNavOpen(open => !open)}
              aria-expanded={mobileNavOpen}
              aria-controls="admin-mobile-sections"
              aria-label={mobileNavOpen ? 'Close admin sections' : 'Open admin sections'}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#88AB8E]/20 bg-[#88AB8E]/10 text-[#426B49]"
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsLoggedIn(false)}
            className="flex flex-shrink-0 items-center gap-1.5 bg-black text-white px-3 py-2 rounded-lg text-xs font-bold"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
        {mobileNavOpen && (
          <nav
            id="admin-mobile-sections"
            aria-label="Admin sections"
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[#88AB8E]/15 bg-white px-3 pb-4"
          >
            <div className="flex items-center justify-between py-3">
              <span className="text-xs font-black uppercase tracking-wider text-black/50">Admin Sections</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close admin sections"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-black hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {adminTabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileNavOpen(false);
                  }}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`flex min-h-12 min-w-0 items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-bold ${
                    activeTab === tab.id
                      ? 'bg-[#88AB8E] text-white'
                      : 'bg-[#88AB8E]/10 text-black/70'
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span className="min-w-0 break-words leading-tight">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

{/* =====================================================
    DESKTOP HEADER
===================================================== */}
<div className="hidden md:flex items-center justify-between gap-8 mb-8 lg:mb-10">

  {/* DASHBOARD TITLE */}
  <div className="flex-1 min-w-0">
    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black leading-tight">
      Admin Dashboard
    </h1>

    <p className="text-sm text-black/55 mt-2">
      Logged in as admin
    </p>
  </div>

  {/* LOGOUT BUTTON */}
  <button
    type="button"
    onClick={() => setIsLoggedIn(false)}
    className="flex flex-shrink-0 items-center justify-center gap-2 bg-black text-white px-6 lg:px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#333] active:scale-95 transition-all shadow-sm"
  >
    <LogOut size={17} />
    <span>Logout</span>
  </button>

</div>


{/* =====================================================
    DESKTOP TAB NAVIGATION
===================================================== */}
<div className="hidden md:block mb-10">

  <div className="pb-2">

    <div className="flex flex-wrap items-center gap-2 lg:gap-3 border-b border-gray-200">

      {adminTabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id as any)}
          className={`relative flex items-center justify-center gap-2 px-3 lg:px-4 py-3 rounded-t-xl font-bold text-sm transition-all flex-shrink-0 border-b-[3px] -mb-[2px] ${
            activeTab === tab.id
              ? 'bg-[#88AB8E]/15 text-[#426B49] border-[#557B5D]'
              : 'text-black/55 hover:bg-[#88AB8E]/10 hover:text-[#426B49] border-transparent'
          }`}
        >
          <span className="flex-shrink-0">
            {tab.icon}
          </span>

          <span>
            {tab.label}
          </span>
        </button>
      ))}

    </div>

  </div>

</div>



      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      {activeTab === 'dash' && (

        <div className="space-y-12">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


            {[
              {
                label: 'Village Notices',
                value: notices.length,
                icon:
                  <FileText className="text-green-500" />
              },

              {
                label: 'Directory Size',
                value: villagers.length,
                icon:
                  <Users className="text-purple-500" />
              },

              {
                label: 'Gallery Photos',
                value: gallery.length,
                icon:
                  <Camera className="text-yellow-500" />
              },

              {
                label: 'Puja Entries',
                value: pujas.length,
                icon:
                  <HandCoins className="text-orange-500" />
              }

            ].map((stat, i) => (

              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-[#88AB8E]/10 shadow-sm flex items-center gap-4"
              >

                <div className="p-4 bg-[#F9F8F4] rounded-2xl">

                  {stat.icon}

                </div>

                <div>

                  <span className="text-xs font-bold text-black/40 uppercase tracking-wider">

                    {stat.label}

                  </span>

                  <div className="text-2xl font-bold text-black">

                    {stat.value}

                  </div>

                </div>

              </div>

            ))}

          </div>


          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10">

            <h3 className="text-xl font-bold text-black mb-6">

              Recent User Inquiries & Complaints

            </h3>


            <div className="space-y-4">

              {complaints.length === 0 ? (

                <div className="text-center py-20 bg-[#F9F8F4] rounded-3xl border border-dashed border-[#88AB8E]/20">

                  <MessageSquare
                    size={48}
                    className="mx-auto mb-4 text-[#88AB8E]/20"
                  />

                  <p className="text-black/30 italic">

                    No user submissions to display.

                  </p>

                </div>

              ) : (

                complaints.map(item => (

                  <div
                    key={item.id}
                    className="p-6 border border-gray-100 rounded-[32px] bg-white hover:border-[#88AB8E]/30 transition-all"
                  >

                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">

                      <div className="flex-1 w-full">

                        <div className="flex items-center gap-3 mb-3 flex-wrap">

                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.type === 'Public Grievance'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-blue-50 text-blue-600'
                            }`}
                          >

                            {item.type}

                          </span>

                          <span className="text-[10px] text-black/40 font-bold">

                            {item.date}

                          </span>

                        </div>


                        <p className="text-black/80 font-medium mb-4 leading-relaxed italic border-l-4 border-[#88AB8E]/20 pl-4 text-sm md:text-base">

                          "{item.description}"

                        </p>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                          <div className="flex items-center gap-2 text-xs text-black/60">

                            <User
                              size={14}
                              className="text-[#88AB8E]"
                            />

                            <span className="font-bold">

                              From:

                            </span>

                            {item.name}

                          </div>


                          <div className="flex items-center gap-2 text-xs text-black/60">

                            <Phone
                              size={14}
                              className="text-[#88AB8E]"
                            />

                            <span className="font-bold">

                              Contact:

                            </span>

                            {item.phone}

                          </div>

                        </div>

                      </div>


                      <button
                        onClick={() =>
                          deleteComplaint(item.id)
                        }
                        className="flex items-center gap-2 text-red-400 hover:text-red-600 text-xs font-bold transition-colors p-2"
                      >

                        <Trash2 size={16} />

                        Delete Entry

                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          PUJA SECTION
      ===================================================== */}

      {activeTab === 'puja' && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


          {/* =================================================
              ADD PUJA
          ================================================= */}

          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">

            <h3 className="text-xl font-bold text-black mb-2 flex items-center gap-2">

              <HandCoins
                size={22}
                className="text-[#88AB8E]"
              />

              Add Puja Payment

            </h3>

            <p className="text-sm text-black/40 mb-8">

              Record members and their contribution for village pujas.

            </p>


            <div className="space-y-5">


              {/* PUJA NAME */}

              <div className="space-y-2">

                <label className="text-xs font-bold text-black/40 uppercase ml-1">

                  Puja Name

                </label>

                <input
                  type="text"
                  placeholder="e.g. Maa Durga Puja"
                  value={newPuja.pujaName}
                  onChange={(e) =>
                    setNewPuja({
                      ...newPuja,
                      pujaName: e.target.value
                    })
                  }
                  className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#88AB8E]/20"
                />

              </div>


              {/* MEMBER NAME */}

              <div className="space-y-2">

                <label className="text-xs font-bold text-black/40 uppercase ml-1">

                  Member Name

                </label>

                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={newPuja.memberName}
                  onChange={(e) =>
                    setNewPuja({
                      ...newPuja,
                      memberName: e.target.value
                    })
                  }
                  className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#88AB8E]/20"
                />

              </div>


              {/* AMOUNT */}

              <div className="space-y-2">

                <label className="text-xs font-bold text-black/40 uppercase ml-1">

                  Amount Given

                </label>


                <div className="relative">

                  <IndianRupee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={newPuja.amount}
                    onChange={(e) =>
                      setNewPuja({
                        ...newPuja,
                        amount: e.target.value
                      })
                    }
                    className="w-full pl-11 pr-5 py-4 bg-[#F9F8F4] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#88AB8E]/20"
                  />

                </div>

              </div>


              {/* PAYMENT MODE */}

              <div className="space-y-2">

                <label className="text-xs font-bold text-black/40 uppercase ml-1">

                  Payment Mode

                </label>


                <div className="grid grid-cols-2 gap-3">


                  <button
                    type="button"
                    onClick={() =>
                      setNewPuja({
                        ...newPuja,
                        paymentMode: 'Cash'
                      })
                    }
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border transition-all ${
                      newPuja.paymentMode === 'Cash'
                        ? 'bg-[#88AB8E] text-white border-[#88AB8E] shadow-lg'
                        : 'bg-[#F9F8F4] text-black/50 border-transparent'
                    }`}
                  >

                    <HandCoins size={18} />

                    Cash

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setNewPuja({
                        ...newPuja,
                        paymentMode: 'Online'
                      })
                    }
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border transition-all ${
                      newPuja.paymentMode === 'Online'
                        ? 'bg-[#88AB8E] text-white border-[#88AB8E] shadow-lg'
                        : 'bg-[#F9F8F4] text-black/50 border-transparent'
                    }`}
                  >

                    <WalletCards size={18} />

                    Online

                  </button>

                </div>

              </div>


              {/* ADD BUTTON */}

              <button
                type="button"
                onClick={handleAddPuja}
                className="w-full bg-[#88AB8E] text-white py-5 rounded-2xl font-bold shadow-xl shadow-[#88AB8E]/20 hover:bg-[#6B8A7A] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >

                <Plus size={20} />

                Add Puja Payment

              </button>

            </div>

          </div>


          {/* =================================================
              PUJA PAYMENT LIST
          ================================================= */}

          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h3 className="text-xl font-bold text-black">

                  Puja Contributions

                </h3>

                <p className="text-xs text-black/40 mt-1">

                  All recorded village puja payments

                </p>

              </div>


              <div className="bg-[#88AB8E]/10 text-[#6B8A7A] px-4 py-2 rounded-xl font-bold text-sm">

                {pujas.length} Entries

              </div>

            </div>


            <div className="space-y-3 max-h-[650px] overflow-y-auto custom-scrollbar p-1">


              {pujas.length === 0 ? (

                <div className="text-center py-20 bg-[#F9F8F4] rounded-3xl border border-dashed border-[#88AB8E]/20">

                  <HandCoins
                    size={42}
                    className="mx-auto mb-4 text-[#88AB8E]/30"
                  />

                  <p className="text-black/30 text-sm">

                    No puja payments added yet.

                  </p>

                </div>

              ) : (

                pujas.map((puja) => (

                  <div
                    key={puja.id}
                    className="p-5 bg-[#F9F8F4] rounded-3xl border border-transparent hover:border-[#88AB8E]/20 transition-all"
                  >

                    <div className="flex justify-between items-start gap-4">


                      {/* LEFT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2 mb-2">

                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#88AB8E]">

                            Puja

                          </span>

                          <span className="text-[10px] text-black/30">

                            {puja.date}

                          </span>

                        </div>


                        <h4 className="font-bold text-black text-base">

                          {puja.pujaName}

                        </h4>


                        <div className="flex items-center gap-2 mt-2">

                          <User
                            size={14}
                            className="text-[#88AB8E]"
                          />

                          <span className="text-sm text-black/60">

                            {puja.memberName}

                          </span>

                        </div>


                        <div className="flex items-center gap-2 mt-3">

                          {puja.paymentMode === 'Cash' ? (

                            <HandCoins
                              size={14}
                              className="text-green-600"
                            />

                          ) : (

                            <WalletCards
                              size={14}
                              className="text-blue-600"
                            />

                          )}


                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              puja.paymentMode === 'Cash'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-blue-50 text-blue-600'
                            }`}
                          >

                            {puja.paymentMode}

                          </span>

                        </div>

                      </div>


                      {/* RIGHT */}

                      <div className="flex flex-col items-end gap-3 flex-shrink-0">


                        <div className="flex items-center gap-1 text-lg font-bold text-black">

                          <IndianRupee size={16} />

                          {Number(
                            puja.amount
                          ).toLocaleString('en-IN')}

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            deletePuja(puja.id)
                          }
                          className="text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
                        >

                          <Trash2 size={17} />

                        </button>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          HOME
      ===================================================== */}

      {activeTab === 'home' && (

        <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10 max-w-3xl mx-auto">

          <h3 className="text-xl font-bold text-black mb-8 flex items-center gap-2">

            <HomeIcon
              size={20}
              className="text-[#88AB8E]"
            />

            Manage Home Page

          </h3>


          <div className="space-y-8">


            <div className="space-y-4">

              <div className="space-y-2">

                <label className="text-sm font-bold text-black/70 ml-1">

                  Option 1: Hero Background URL

                </label>

                <div className="relative">

                  <LinkIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20"
                    size={16}
                  />

                  <input
                    type="text"
                    value={
                      tempHome.heroImageUrl.startsWith('data:')
                        ? ''
                        : tempHome.heroImageUrl
                    }
                    onChange={(e) =>
                      setTempHome({
                        ...tempHome,
                        heroImageUrl:
                          e.target.value
                      })
                    }
                    className="w-full pl-10 pr-5 py-4 bg-[#F9F8F4] border-none rounded-2xl text-sm"
                    placeholder="https://images.unsplash.com/..."
                  />

                </div>

              </div>


              <div className="space-y-2">

                <label className="text-sm font-bold text-black/70 ml-1">

                  Option 2: System Upload

                </label>


                <input
                  type="file"
                  ref={homeHeroFileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleHomeHeroUpload}
                />


                <button
                  onClick={() =>
                    homeHeroFileInputRef.current?.click()
                  }
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#88AB8E]/30 py-6 rounded-2xl text-[#88AB8E] font-bold hover:bg-[#88AB8E]/5 transition-all text-sm"
                >

                  <Upload size={20} />

                  {tempHome.heroImageUrl.startsWith('data:')
                    ? 'Hero Image Selected ✅'
                    : 'Choose from Device'}

                </button>

              </div>


              {tempHome.heroImageUrl && (

                <div className="relative w-full h-48 rounded-3xl overflow-hidden border border-[#88AB8E]/10 shadow-inner group">

                  <img
                    src={tempHome.heroImageUrl}
                    className="w-full h-full object-cover"
                    alt="Hero Preview"
                  />


                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

                    <button
                      onClick={() =>
                        setTempHome({
                          ...tempHome,
                          heroImageUrl: ''
                        })
                      }
                      className="bg-white text-red-500 p-3 rounded-full hover:scale-110 transition-transform shadow-xl"
                    >

                      <Trash2 size={20} />

                    </button>

                  </div>


                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#88AB8E]">

                    Current Preview

                  </div>

                </div>

              )}

            </div>


            <div className="pt-6 border-t border-gray-100 space-y-6">

              <div className="space-y-2">

                <label className="text-sm font-bold text-black/70">

                  Welcome Heading

                </label>

                <input
                  type="text"
                  value={tempHome.welcomeHeading}
                  onChange={(e) =>
                    setTempHome({
                      ...tempHome,
                      welcomeHeading:
                        e.target.value
                    })
                  }
                  className="w-full px-5 py-4 bg-[#F9F8F4] border-none rounded-2xl font-bold"
                />

              </div>


              <div className="space-y-2">

                <label className="text-sm font-bold text-black/70">

                  Welcome Subheading

                </label>

                <textarea
                  value={tempHome.welcomeSubheading}
                  onChange={(e) =>
                    setTempHome({
                      ...tempHome,
                      welcomeSubheading:
                        e.target.value
                    })
                  }
                  className="w-full px-5 py-4 bg-[#F9F8F4] border-none rounded-2xl min-h-[100px] leading-relaxed resize-none"
                />

              </div>

            </div>


            <button
              onClick={() => {

                updateHomeConfig(tempHome);

                alert(
                  'Home page configuration updated successfully!'
                );

              }}
              className="w-full bg-[#88AB8E] text-white py-5 rounded-2xl font-bold hover:bg-[#6B8A7A] shadow-xl shadow-[#88AB8E]/20 transition-all active:scale-95"
            >

              Apply Home Page Changes

            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          NOTICES
      ===================================================== */}

      {activeTab === 'notices' && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">

            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">

              <Plus size={20} />

              Add New Notice

            </h3>


            <div className="space-y-4">

              <input
                placeholder="Notice Title"
                value={newNotice.title}
                onChange={e =>
                  setNewNotice({
                    ...newNotice,
                    title: e.target.value
                  })
                }
                className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl"
              />


              <select
                value={newNotice.category}
                onChange={e =>
                  setNewNotice({
                    ...newNotice,
                    category: e.target.value
                  })
                }
                className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl"
              >

                <option>Panchayat</option>
                <option>Culture</option>
                <option>Health</option>
                <option>Emergency</option>

              </select>


              <textarea
                placeholder="Notice Content"
                value={newNotice.content}
                onChange={e =>
                  setNewNotice({
                    ...newNotice,
                    content: e.target.value
                  })
                }
                className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl min-h-[120px] resize-none"
              />


              <button
                onClick={async () => {

                  if (
                    !newNotice.title ||
                    !newNotice.content
                  ) {

                    alert(
                      'Please enter notice title and content.'
                    );

                    return;

                  }


                  const success =
                    await addNotice(newNotice);


                  if (success) {

                    alert(
                      'Notice published successfully!'
                    );


                    setNewNotice({

                      title: '',
                      category: 'Panchayat',
                      content: '',
                      date:
                        new Date()
                          .toISOString()
                          .split('T')[0]

                    });

                  } else {

                    alert(
                      'Failed to publish notice.'
                    );

                  }

                }}
                className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold"
              >

                Publish Notice

              </button>

            </div>

          </div>


          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar p-2">

            {notices.map(n => (

              <div
                key={n.id}
                className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-start gap-4 shadow-sm"
              >

                <div>

                  <span className="text-[10px] font-bold text-[#88AB8E] uppercase">

                    {n.category}

                  </span>

                  <h4 className="font-bold text-black text-sm md:text-base">

                    {n.title}

                  </h4>

                  <p className="text-xs text-black/40 mt-1 line-clamp-2">

                    {n.content}

                  </p>

                </div>


                <button
                  onClick={() =>
                    deleteNotice(n.id)
                  }
                  className="text-red-400 hover:text-red-600 p-2 flex-shrink-0 transition-colors"
                >

                  <Trash2 size={18} />

                </button>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* =====================================================
          GALLERY
      ===================================================== */}

      {activeTab === 'gallery' && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">

            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">

              <Plus size={20} />

              Add to Gallery

            </h3>


            <div className="space-y-6">


              <div className="space-y-2">

                <label className="text-xs font-bold text-black/40 uppercase ml-1">

                  System Upload

                </label>


                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />


                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#88AB8E]/30 py-6 rounded-2xl text-[#88AB8E] font-bold hover:bg-[#88AB8E]/5 transition-all text-sm"
                >

                  <Upload size={20} />

                  {newImage.file
                    ? 'Change Selected Image'
                    : 'Choose from Gallery'}

                </button>

              </div>


              {newImage.file && (

                <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">

                  <img
                    src={URL.createObjectURL(
                      newImage.file
                    )}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />


                  <button
                    type="button"
                    onClick={() => {

                      setNewImage(prev => ({
                        ...prev,
                        file: null
                      }));


                      if (fileInputRef.current) {

                        fileInputRef.current.value =
                          '';

                      }

                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black"
                  >

                    <Trash2 size={14} />

                  </button>

                </div>

              )}


              {newImage.file && (

                <div className="bg-[#88AB8E]/5 rounded-2xl p-4">

                  <p className="text-sm font-bold text-black truncate">

                    {newImage.file.name}

                  </p>

                  <p className="text-xs text-black/40 mt-1">

                    {(
                      newImage.file.size /
                      1024 /
                      1024
                    ).toFixed(2)} MB

                  </p>

                </div>

              )}


              <div className="space-y-4 pt-4 border-t border-gray-100">

                <input
                  placeholder="Photo Title"
                  value={newImage.title}
                  onChange={e =>
                    setNewImage(prev => ({
                      ...prev,
                      title: e.target.value
                    }))
                  }
                  className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl text-sm"
                />


                <input
                  placeholder="Description"
                  value={newImage.description}
                  onChange={e =>
                    setNewImage(prev => ({
                      ...prev,
                      description:
                        e.target.value
                    }))
                  }
                  className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl text-sm"
                />


                <button
                  type="button"
                  onClick={async () => {

                    if (!newImage.file) {

                      alert(
                        'Please choose an image'
                      );

                      return;

                    }


                    if (!newImage.title.trim()) {

                      alert(
                        'Please enter a photo title'
                      );

                      return;

                    }


                    const success =
                      await addImage({

                        file:
                          newImage.file,

                        title:
                          newImage.title,

                        description:
                          newImage.description

                      });


                    if (success) {

                      setNewImage({

                        file: null,
                        title: '',
                        description: ''

                      });


                      if (
                        fileInputRef.current
                      ) {

                        fileInputRef.current.value =
                          '';

                      }

                    }

                  }}
                  className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#88AB8E]/20 transition-transform active:scale-95"
                >

                  Add to Village Lens

                </button>

              </div>

            </div>

          </div>


          <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto p-2 custom-scrollbar">

            {gallery.map(img => (

              <div
                key={img.id}
                className="relative rounded-2xl overflow-hidden group border border-gray-100 shadow-sm aspect-video"
              >

                <img
                  src={img.url}
                  className="w-full h-full object-cover"
                  alt={img.title}
                />


                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">

                  <span className="text-white text-[10px] font-bold mb-2 line-clamp-1">

                    {img.title}

                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(img.id)
                    }
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >

                    <Trash2 size={14} />

                  </button>

                </div>

              </div>

            ))}


            {gallery.length === 0 && (

              <div className="col-span-2 text-center py-20 text-black/40">

                No gallery images yet.

              </div>

            )}

          </div>

        </div>

      )}


      {/* =====================================================
          VILLAGERS
      ===================================================== */}

      {activeTab === 'villagers' && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">

            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">

              <Plus size={20} />

              Register Resident

            </h3>


            <div className="space-y-4">

              <input
                placeholder="Full Name"
                value={newVillager.name}
                onChange={e =>
                  setNewVillager({
                    ...newVillager,
                    name: e.target.value
                  })
                }
                className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl"
              />


              <input
                placeholder="Occupation"
                value={newVillager.occupation}
                onChange={e =>
                  setNewVillager({
                    ...newVillager,
                    occupation: e.target.value
                  })
                }
                className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl"
              />


              <input
                placeholder="Contact Number (Optional)"
                value={newVillager.contact}
                onChange={e =>
                  setNewVillager({
                    ...newVillager,
                    contact: e.target.value
                  })
                }
                className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl"
              />


              <button
                onClick={() => {

                  if (
                    newVillager.name &&
                    newVillager.occupation
                  ) {

                    addVillager(
                      newVillager
                    );


                    setNewVillager({

                      name: '',
                      occupation: '',
                      contact: ''

                    });

                  }

                }}
                className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold"
              >

                Add Resident

              </button>

            </div>

          </div>


          <div className="space-y-2 max-h-[600px] overflow-y-auto p-2 custom-scrollbar">

            {villagers.map(v => (

              <div
                key={v.id}
                className="bg-white px-6 py-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm"
              >

                <div>

                  <div className="font-bold text-black text-sm md:text-base">

                    {v.name}

                  </div>

                  <div className="text-xs text-black/40">

                    {v.occupation}

                  </div>

                </div>


                <button
                  onClick={() =>
                    deleteVillager(v.id)
                  }
                  className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                >

                  <Trash2 size={18} />

                </button>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* =====================================================
          REVIEWS
      ===================================================== */}

      {activeTab === 'reviews' && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-[#88AB8E]/10 h-fit">

            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">

              <Plus size={20} />

              Add Villager Review

            </h3>


            <div className="space-y-6">


              <div className="space-y-4">

                <div className="space-y-2">

                  <label className="text-xs font-bold text-black/40 uppercase ml-1">

                    Option 1: Avatar URL

                  </label>


                  <div className="relative">

                    <LinkIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20"
                      size={16}
                    />


                    <input
                      placeholder="https://..."
                      value={
                        newReview.avatarUrl.startsWith(
                          'data:'
                        )
                          ? ''
                          : newReview.avatarUrl
                      }
                      onChange={e =>
                        setNewReview({
                          ...newReview,
                          avatarUrl:
                            e.target.value
                        })
                      }
                      className="w-full pl-10 pr-5 py-4 bg-[#F9F8F4] rounded-2xl text-sm"
                    />

                  </div>

                </div>


                <div className="space-y-2">

                  <label className="text-xs font-bold text-black/40 uppercase ml-1">

                    Option 2: System Upload

                  </label>


                  <input
                    type="file"
                    ref={reviewAvatarInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={
                      handleReviewAvatarUpload
                    }
                  />


                  <button
                    onClick={() =>
                      reviewAvatarInputRef.current?.click()
                    }
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#88AB8E]/30 py-6 rounded-2xl text-[#88AB8E] font-bold hover:bg-[#88AB8E]/5 transition-all text-sm"
                  >

                    <Upload size={20} />

                    {newReview.avatarUrl.startsWith(
                      'data:'
                    )
                      ? 'Avatar Selected ✅'
                      : 'Choose from Device'}

                  </button>

                </div>


                {newReview.avatarUrl && (

                  <div className="flex justify-center">

                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#88AB8E]/20 shadow-lg group">

                      <img
                        src={newReview.avatarUrl}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />


                      <button
                        onClick={() =>
                          setNewReview({
                            ...newReview,
                            avatarUrl: ''
                          })
                        }
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >

                        <Trash2 size={20} />

                      </button>

                    </div>

                  </div>

                )}

              </div>


              <div className="space-y-4 pt-4 border-t border-gray-100">

                <div className="space-y-2">

                  <label className="text-xs font-bold text-black/40 uppercase ml-1">

                    Villager Name

                  </label>


                  <input
                    placeholder="e.g. Ramesh Kumar"
                    value={newReview.name}
                    onChange={e =>
                      setNewReview({
                        ...newReview,
                        name: e.target.value
                      })
                    }
                    className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl text-sm"
                  />

                </div>


                <div className="space-y-2">

                  <label className="text-xs font-bold text-black/40 uppercase ml-1">

                    Review Content

                  </label>


                  <textarea
                    placeholder="What did they say about the village?"
                    value={newReview.content}
                    onChange={e =>
                      setNewReview({
                        ...newReview,
                        content:
                          e.target.value
                      })
                    }
                    className="w-full px-5 py-4 bg-[#F9F8F4] rounded-2xl min-h-[100px] text-sm resize-none"
                  />

                </div>


                <div className="space-y-2">

                  <label className="text-xs font-bold text-black/40 uppercase ml-1">

                    Rating (1-5)

                  </label>


                  <div className="flex gap-2">

                    {[1, 2, 3, 4, 5].map(
                      star => (

                        <button
                          key={star}
                          onClick={() =>
                            setNewReview({
                              ...newReview,
                              rating: star
                            })
                          }
                          className={`p-2.5 rounded-xl transition-all ${
                            newReview.rating >= star
                              ? 'text-yellow-500 bg-yellow-50'
                              : 'text-gray-300 bg-gray-50'
                          }`}
                        >

                          <Star
                            size={20}
                            fill={
                              newReview.rating >= star
                                ? 'currentColor'
                                : 'none'
                            }
                          />

                        </button>

                      )
                    )}

                  </div>

                </div>


                <button
                  onClick={() => {

                    if (
                      newReview.name &&
                      newReview.content &&
                      newReview.avatarUrl
                    ) {

                      addReview(
                        newReview
                      );


                      setNewReview({

                        name: '',
                        content: '',
                        rating: 5,
                        avatarUrl: ''

                      });

                    }

                  }}
                  className="w-full bg-[#88AB8E] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#88AB8E]/20 transition-transform active:scale-95"
                >

                  Publish Review

                </button>

              </div>

            </div>

          </div>


          <div className="space-y-4 max-h-[700px] overflow-y-auto p-2 custom-scrollbar">

            {reviews.map(review => (

              <div
                key={review.id}
                className="bg-white p-6 rounded-3xl border border-gray-100 flex gap-4 items-start shadow-sm hover:border-[#88AB8E]/20 transition-all"
              >

                <img
                  src={review.avatarUrl}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#88AB8E]/10 flex-shrink-0"
                  alt={review.name}
                />


                <div className="flex-1 min-w-0">

                  <div className="flex justify-between items-start gap-2">

                    <div className="min-w-0">

                      <h4 className="font-bold text-black text-sm md:text-base truncate">

                        {review.name}

                      </h4>


                      <div className="flex gap-0.5 mt-1">

                        {[...Array(5)].map(
                          (_, i) => (

                            <Star
                              key={i}
                              size={12}
                              className={
                                i <
                                review.rating
                                  ? 'text-yellow-500'
                                  : 'text-gray-200'
                              }
                              fill={
                                i <
                                review.rating
                                  ? 'currentColor'
                                  : 'none'
                              }
                            />

                          )
                        )}

                      </div>

                    </div>


                    <button
                      onClick={() =>
                        deleteReview(
                          review.id
                        )
                      }
                      className="text-red-400 hover:text-red-600 p-2 flex-shrink-0 transition-colors"
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>


                  <p className="text-sm text-black/60 mt-3 italic leading-relaxed">

                    "{review.content}"

                  </p>

                </div>

              </div>

            ))}


            {reviews.length === 0 && (

              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">

                <p className="text-gray-400">

                  No reviews yet.

                </p>

              </div>

            )}

          </div>

        </div>

      )}

      {/* =====================================================
          DIGITAL VILLAGE ID - FAMILY MANAGEMENT
      ===================================================== */}

      {activeTab === 'families' && (

        <div className="space-y-8">

          {/* HEADER */}

          <div className="flex flex-wrap justify-between items-center gap-4">

            <div>
              <h2 className="text-2xl font-black text-gray-800">
                Digital Village ID
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Register and manage village family profiles
              </p>
            </div>

            <button
              onClick={fetchFamilies}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#88AB8E]/10 text-[#557B5D] font-bold"
            >
              <RefreshCw size={17} />
              Refresh Families
            </button>

          </div>


          {/* SUMMARY */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500">Total Families</p>
              <h3 className="text-3xl font-black mt-2">
                {families.length}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500">Active Families</p>
              <h3 className="text-3xl font-black text-green-600 mt-2">
                {families.filter(f => f.status === 'Active').length}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500">Inactive Families</p>
              <h3 className="text-3xl font-black text-red-500 mt-2">
                {families.filter(f => f.status === 'Inactive').length}
              </h3>
            </div>

          </div>


          {/* REGISTRATION FORM */}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">

            <div className="flex items-center gap-3 mb-7">
              <div className="bg-[#88AB8E]/10 p-3 rounded-xl">
                <Users className="text-[#557B5D]" />
              </div>

              <div>
                <h3 className="text-xl font-black">
                  Register New Family
                </h3>

                <p className="text-sm text-gray-500">
                  Enter household and family member information
                </p>
              </div>
            </div>


            {familyMessage && (
              <div role="alert" className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 font-semibold text-sm">
                {familyMessage}
              </div>
            )}


            <form onSubmit={handleFamilySubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Family Head Name *
                  </label>

                  {/* STEP 1: Family Head is now a dropdown fed by the Directory */}
                  <select
                    required
                    value={newFamily.familyHead}
                    onChange={e =>
                      setNewFamily(prev => ({
                        ...prev,
                        familyHead: e.target.value
                      }))
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#88AB8E] bg-white"
                  >
                    <option value="">Select Family Head from Directory</option>

                    {[...villagers]
                      .filter(v => v.name?.trim())
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(villager => (
                        <option key={villager.id} value={villager.name}>
                          {villager.name}
                        </option>
                      ))}
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-bold mb-2">
                    Ward Number *
                  </label>

                  <input
                    required
                    value={newFamily.wardNumber}
                    onChange={e =>
                      setNewFamily(prev => ({
                        ...prev,
                        wardNumber: e.target.value
                      }))
                    }
                    placeholder="Enter ward number"
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#88AB8E]"
                  />
                </div>


                <div>
                  <label className="block text-sm font-bold mb-2">
                    Complete Address *
                  </label>

                  {/* STEP 2: Address is now fixed / read-only */}
                  <input
                    value="At-Badapathuria, Post-Deuli, 752064"
                    readOnly
                    className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>


                <div>
                  <label className="block text-sm font-bold mb-2">
                    House Number
                  </label>

                  <input
                    value={newFamily.houseNumber}
                    onChange={e =>
                      setNewFamily(prev => ({
                        ...prev,
                        houseNumber: e.target.value
                      }))
                    }
                    placeholder="Enter house number"
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#88AB8E]"
                  />
                </div>

              </div>


              {/* FAMILY MEMBERS */}

              <div className="border-t border-gray-100 pt-6">

                <div className="flex flex-wrap justify-between items-center gap-3 mb-5">

                  <div>
                    <h4 className="font-black text-lg">
                      Family Members
                    </h4>

                    <p className="text-sm text-gray-500">
                      Add all members belonging to this household
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFamilyMember}
                    className="flex items-center gap-2 bg-[#88AB8E] text-white px-4 py-2.5 rounded-xl font-bold text-sm"
                  >
                    <Plus size={17} />
                    Add Member
                  </button>

                </div>


                <div className="space-y-4">

                  {newFamily.members.map((member, index) => (

                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-gray-50 p-4 rounded-2xl"
                    >

                      <input
                        required
                        value={member.name}
                        onChange={e =>
                          handleFamilyMemberChange(
                            index,
                            'name',
                            e.target.value
                          )
                        }
                        placeholder="Member name"
                        className="border border-gray-200 rounded-xl p-3 bg-white outline-none"
                      />


                      <input
                        required
                        value={member.relation}
                        onChange={e =>
                          handleFamilyMemberChange(
                            index,
                            'relation',
                            e.target.value
                          )
                        }
                        placeholder="Relation (Son, Wife...)"
                        className="border border-gray-200 rounded-xl p-3 bg-white outline-none"
                      />


                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={member.age}
                        onChange={e =>
                          handleFamilyMemberChange(
                            index,
                            'age',
                            e.target.value
                          )
                        }
                        placeholder="Age"
                        className="border border-gray-200 rounded-xl p-3 bg-white outline-none"
                      />


                      <select
                        value={member.gender}
                        onChange={e =>
                          handleFamilyMemberChange(
                            index,
                            'gender',
                            e.target.value
                          )
                        }
                        className="border border-gray-200 rounded-xl p-3 bg-white outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>


                      <button
                        type="button"
                        disabled={newFamily.members.length === 1}
                        onClick={() => handleRemoveFamilyMember(index)}
                        className="flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-xl p-3 disabled:opacity-30"
                      >
                        <Trash2 size={17} />
                        Remove
                      </button>

                    </div>

                  ))}

                </div>

              </div>


              <button
                type="submit"
                disabled={familySaving}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#88AB8E] hover:bg-[#759B7C] text-white px-8 py-4 rounded-xl font-black disabled:opacity-50"
              >
                <Plus size={19} />

                {familySaving
                  ? 'Registering Family...'
                  : 'Register Family'}
              </button>

            </form>

          </div>


          {/* REGISTERED FAMILY LIST */}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">

              <div>
                <h3 className="text-xl font-black">
                  Registered Families
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Search and manage family records
                </p>
              </div>

              <span className="text-sm font-bold text-gray-500">
                {filteredFamilies.length} Records
              </span>

            </div>


            <div className="relative mb-6">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={familySearch}
                onChange={e => setFamilySearch(e.target.value)}
                placeholder="Search by Family ID, family head, ward or address..."
                className="w-full border border-gray-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#88AB8E]"
              />

            </div>


            <div className="space-y-4">

              {filteredFamilies.map(family => (

                <div
                  key={family.id}
                  className="border border-gray-100 rounded-2xl p-5 hover:border-[#88AB8E]/50 transition-all"
                >

                  <div className="flex flex-wrap justify-between gap-4">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2 mb-2">

                        <span className="font-black text-[#557B5D]">
                          {family.familyId}
                        </span>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            family.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {family.status}
                        </span>

                      </div>

                      <h4 className="font-black text-lg">
                        {family.familyHead}
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        Ward {family.wardNumber} · {family.address}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {family.members.length} Family Members
                      </p>

                    </div>


                    <div className="flex flex-wrap items-center gap-2">

                      <button
                        onClick={() =>
                          setSelectedFamilyId(
                            selectedFamilyId === family.id
                              ? null
                              : family.id
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm"
                      >
                        {selectedFamilyId === family.id
                          ? <ChevronUp size={16} />
                          : <ChevronDown size={16} />}

                        Details
                      </button>


                      <button
                        onClick={() =>
                          handleFamilyStatusChange(
                            family.id,
                            family.status
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-[#88AB8E]/10 text-[#557B5D] font-bold text-sm"
                      >
                        {family.status === 'Active'
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>


                      <button
                        onClick={() => handleFamilyDelete(family.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                        title="Delete family"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>


                  {/* FAMILY DETAILS */}

               {selectedFamilyId === family.id && (
  <div className="mt-5 pt-5 border-t border-gray-100">
    <div className="flex justify-center mb-5">
        <FamilyQrCard
          family={family}
          onClose={() => setSelectedFamilyId(null)}
        />
    </div>

    {/* Members table */}
    <h5 className="font-black mb-3">Family Member Details</h5>

                      <div className="overflow-x-auto">

                        <table className="w-full text-sm text-left">

                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-3">Name</th>
                              <th className="p-3">Relation</th>
                              <th className="p-3">Age</th>
                              <th className="p-3">Gender</th>
                            </tr>
                          </thead>

                          <tbody>

                            {family.members.map((member, index) => (

                              <tr
                                key={member._id || index}
                                className="border-b border-gray-100"
                              >
                                <td className="p-3 font-semibold">
                                  {member.name}
                                </td>

                                <td className="p-3">
                                  {member.relation}
                                </td>

                                <td className="p-3">
                                  {member.age ?? '—'}
                                </td>

                                <td className="p-3">
                                  {member.gender || '—'}
                                </td>
                              </tr>

                            ))}

                          </tbody>

                        </table>

                      </div>

                    </div>

                  )}

                </div>

              ))}


              {filteredFamilies.length === 0 && (

                <div className="text-center py-16 bg-gray-50 rounded-2xl">

                  <Users
                    size={40}
                    className="mx-auto text-gray-300 mb-3"
                  />

                  <p className="font-bold text-gray-500">
                    No family records found
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Register a family or change your search
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default AdminPage;