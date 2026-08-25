import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  Notice,
  Villager,
  GalleryImage,
  Complaint,
  Review,
  Puja,
} from './types';

import {
  INITIAL_VILLAGERS,
  GALLERY_IMAGES,
  INITIAL_REVIEWS,
  HOME_CONFIG,
  SYSTEM_VERSION,
} from './constants';

// ========================================
// HOME CONFIG TYPE
// ========================================

interface HomeConfig {
  heroImageUrl: string;
  welcomeHeading: string;
  welcomeSubheading: string;
}

// ========================================
// PUJA FORM TYPE
// ========================================

export interface NewPuja {
  pujaName: string;
  memberName: string;
  amount: number;
  paymentMode: 'Cash' | 'Online';
}

// ========================================
// CONTEXT TYPE
// ========================================

interface AppContextType {
  notices: Notice[];
  villagers: Villager[];
  gallery: GalleryImage[];
  reviews: Review[];
  homeConfig: HomeConfig;
  complaints: Complaint[];
  pujas: Puja[];

  isProcessing: boolean;
  processMessage: string;
  lastUpdate: string | null;

  // NOTICES
  addNotice: (notice: Omit<Notice, 'id'>) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;

  // VILLAGERS
  addVillager: (villager: Omit<Villager, 'id'>) => Promise<void>;
  deleteVillager: (id: string) => Promise<void>;

  // GALLERY
  addImage: (image: { file: File; title: string; description: string }) => Promise<boolean>;
  deleteImage: (id: string) => Promise<void>;

  // REVIEWS
  addReview: (review: Omit<Review, 'id'>) => void;
  deleteReview: (id: string) => void;

  // HOME
  updateHomeConfig: (config: HomeConfig) => void;

  // COMPLAINTS
  addComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => Promise<void>;
  deleteComplaint: (id: string) => Promise<void>;

  // PUJA
  addPuja: (puja: NewPuja) => Promise<boolean>;
  deletePuja: (id: string) => Promise<void>;

  // RESET
  resetSystem: () => void;
}

// ========================================
// CREATE CONTEXT
// ========================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ========================================
// LOCAL STORAGE KEYS
// ========================================

const STORAGE_KEYS = {
  USER_GALLERY: 'bp_user_gallery',
  USER_REVIEWS: 'bp_user_reviews',
  COMPLAINTS: 'bp_complaints',
  LAST_UPDATE: 'bp_last_update',
  VERSION: 'bp_sys_version',
  PUJAS: 'bp_pujas', // NEW
};

// ========================================
// BACKEND API URL
// ========================================

const API_URL = import.meta.env.VITE_API_URL;

// ========================================
// APP PROVIDER
// ========================================

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ========================================
  // SYSTEM VERSION
  // ========================================

  useEffect(() => {
    const savedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (savedVersion !== SYSTEM_VERSION) {
      localStorage.setItem(STORAGE_KEYS.VERSION, SYSTEM_VERSION);
    }
  }, []);

  // ========================================
  // NOTICES
  // ========================================

  const [notices, setNotices] = useState<Notice[]>([]);

  // ========================================
  // FETCH NOTICES
  // ========================================

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_URL}/notices`);
      const data = await response.json();
      console.log('Notices response:', data);

      if (!response.ok || !data.success) {
        console.error('Failed to fetch notices:', data.message);
        return;
      }

      const formattedNotices: Notice[] = data.notices.map((notice: any) => ({
        id: notice._id,
        title: notice.title,
        category: notice.category,
        content: notice.content,
        date: notice.date,
      }));

      setNotices(formattedNotices);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ========================================
  // VILLAGERS
  // ========================================

  const [villagers, setVillagers] = useState<Villager[]>(INITIAL_VILLAGERS);

  // ========================================
  // FETCH VILLAGERS
  // ========================================
const fetchVillagers = async () => {
  try {
    const response = await fetch(`${API_URL}/villagers`);
    const data = await response.json();

    console.log('Villagers response:', data);

    if (!response.ok || !data.success) {
      console.error('Failed to fetch villagers:', data.message);
      return;
    }

    const formattedVillagers: Villager[] = data.villagers.map(
      (villager: any) => ({
        id: villager._id,
        name: villager.name,
        occupation: villager.occupation,
        contact: villager.contact,
      })
    );

    setVillagers(formattedVillagers);

  } catch (error) {
    console.error('Failed to fetch villagers:', error);
  }
};

useEffect(() => {
  fetchVillagers();
}, []);

  // ========================================
  // HOME CONFIG
  // ========================================

  const [homeConfig] = useState<HomeConfig>(HOME_CONFIG);

  // ========================================
  // STATIC DATA
  // ========================================

  const fixedGallery = GALLERY_IMAGES;
  const fixedReviews = INITIAL_REVIEWS;

  // ========================================
  // BACKEND GALLERY
  // ========================================

  const [backendGallery, setBackendGallery] = useState<GalleryImage[]>([]);

  // ========================================
  // USER REVIEWS
  // ========================================

  const [userReviews, setUserReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
    return saved ? JSON.parse(saved) : [];
  });

  // ========================================
  // COMPLAINTS
  // ========================================

  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // ========================================
  // PUJAS – NOW WITH LOCALSTORAGE PERSISTENCE
  // ========================================

  const [pujas, setPujas] = useState<Puja[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PUJAS);
    return saved ? JSON.parse(saved) : [];
  });

  // ========================================
  // LAST UPDATE
  // ========================================

  const [lastUpdate, setLastUpdate] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.LAST_UPDATE)
  );

  // ========================================
  // PROCESSING STATE
  // ========================================

  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState('');

  // ========================================
  // COMBINED DATA
  // ========================================

  const gallery = [...fixedGallery, ...backendGallery];
  const reviews = [...fixedReviews, ...userReviews];

  // ========================================
  // SAVE REVIEWS
  // ========================================

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(userReviews));
  }, [userReviews]);

  // ========================================
  // SAVE PUJAS TO LOCALSTORAGE ON CHANGE
  // ========================================

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PUJAS, JSON.stringify(pujas));
  }, [pujas]);

  // ========================================
  // GALLERY – FETCH
  // ========================================

  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API_URL}/gallery`);
      const data = await response.json();
      console.log('Gallery response:', data);

      if (!response.ok || !data.success) {
        console.error('Failed to fetch gallery:', data.message);
        return;
      }

      const formattedGallery: GalleryImage[] = data.gallery.map((image: any) => ({
        id: image._id,
        url: image.url,
        title: image.title,
        description: image.description,
      }));

      setBackendGallery(formattedGallery);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // ========================================
  // COMPLAINTS – FETCH
  // ========================================

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${API_URL}/complaints`);
      const data = await response.json();
      console.log('Complaints response:', data);

      if (!response.ok || !data.success) {
        console.error('Failed to fetch complaints:', data.message);
        return;
      }

      const formattedComplaints: Complaint[] = data.complaints.map(
        (complaint: any) => ({
          id: complaint._id,
          name: complaint.name,
          phone: complaint.phone,
          type: complaint.type,
          description: complaint.description,
          date: complaint.date,
          status: complaint.status,
        })
      );

      setComplaints(formattedComplaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ========================================
  // PUJA – FETCH (UPDATED TO SAVE TO LOCALSTORAGE)
  // ========================================

  const fetchPujas = async () => {
    try {
      const response = await fetch(`${API_URL}/puja`);
      const data = await response.json();
      console.log('Pujas response:', data);

      if (!response.ok || !data.success) {
        console.error('Failed to fetch pujas:', data.message);
        return;
      }

      const formattedPujas: Puja[] = data.pujas.map((puja: any) => ({
        id: puja._id,
        pujaName: puja.pujaName,
        memberName: puja.memberName,
        amount: puja.amount,
        paymentMode: puja.paymentMode,
      }));

      setPujas(formattedPujas);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.PUJAS, JSON.stringify(formattedPujas));
    } catch (error) {
      console.error('Failed to fetch pujas:', error);
    }
  };

  // ========================================
  // FETCH PUJAS WHEN APP LOADS
  // ========================================

  useEffect(() => {
    fetchPujas();
  }, []);

  // ========================================
  // NOTICE – ADD
  // ========================================

  const addNotice = async (notice: Omit<Notice, 'id'>): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setProcessMessage('Publishing notice...');

      const response = await fetch(`${API_URL}/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
      });

      const data = await response.json();
      console.log('Add notice response:', data);

      if (!response.ok || !data.success) {
        alert(data.message || 'Backend failed to create notice');
        return false;
      }

      const newNotice: Notice = {
        id: data.notice._id,
        title: data.notice.title,
        category: data.notice.category,
        content: data.notice.content,
        date: data.notice.date,
      };

      setNotices((prev) => [newNotice, ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding notice:', error);
      return false;
    } finally {
      setIsProcessing(false);
      setProcessMessage('');
    }
  };

  // ========================================
  // NOTICE – DELETE
  // ========================================

  const deleteNotice = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/notices/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log('Delete notice response:', data);

      if (!response.ok || !data.success) {
        console.error('Failed to delete notice:', data);
        return false;
      }

      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting notice:', error);
      return false;
    }
  };

  // ========================================
  // GALLERY – ADD IMAGE
  // ========================================

  const addImage = async (image: {
    file: File;
    title: string;
    description: string;
  }): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setProcessMessage('Saving contribution...');

      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('title', image.title);
      formData.append('description', image.description);

      const response = await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Add gallery response:', data);

      if (!response.ok || !data.success) {
        console.error('GALLERY BACKEND ERROR:', data);
        alert(data.message || data.error || `Upload failed with status ${response.status}`);
        return false;
      }

      const newGalleryImage: GalleryImage = {
        id: data.gallery._id,
        url: data.gallery.url,
        title: data.gallery.title,
        description: data.gallery.description,
      };

      setBackendGallery((prev) => [newGalleryImage, ...prev]);
      return true;
    } catch (error) {
      console.error('Add gallery image error:', error);
      alert('Failed to upload gallery image');
      return false;
    } finally {
      setIsProcessing(false);
      setProcessMessage('');
    }
  };

  // ========================================
  // GALLERY – DELETE IMAGE
  // ========================================

  const deleteImage = async (id: string): Promise<void> => {
    const isLocalImage = fixedGallery.some((image) => image.id === id);
    if (isLocalImage) {
      alert('This is a local gallery image and cannot be deleted.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/gallery/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to delete gallery image');
        return;
      }

      setBackendGallery((prev) => prev.filter((image) => image.id !== id));
    } catch (error) {
      console.error('Delete gallery error:', error);
      alert('Failed to delete gallery image');
    }
  };

  // ========================================
  // REVIEWS – ADD & DELETE
  // ========================================

  const addReview = (review: Omit<Review, 'id'>) => {
    setUserReviews((prev) => [
      { ...review, id: `urev_${Date.now()}` },
      ...prev,
    ]);
  };

  const deleteReview = (id: string) => {
    setUserReviews((prev) => prev.filter((review) => review.id !== id));
  };

  // ========================================
  // COMPLAINTS – ADD
  // ========================================

  const addComplaint = async (
    complaint: Omit<Complaint, 'id' | 'date' | 'status'>
  ): Promise<void> => {
    try {
      setIsProcessing(true);
      setProcessMessage('Submitting complaint...');

      const response = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: complaint.name,
          phone: complaint.phone,
          type: complaint.type,
          description: complaint.description,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to submit complaint');
        return;
      }

      const newComplaint: Complaint = {
        id: data.complaint._id,
        name: data.complaint.name,
        phone: data.complaint.phone,
        type: data.complaint.type,
        description: data.complaint.description,
        date: data.complaint.date,
        status: data.complaint.status,
      };

      setComplaints((prev) => [newComplaint, ...prev]);
    } catch (error) {
      console.error('Add complaint error:', error);
      alert('Failed to submit complaint');
    } finally {
      setIsProcessing(false);
      setProcessMessage('');
    }
  };

  // ========================================
  // COMPLAINTS – DELETE
  // ========================================

  const deleteComplaint = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to delete complaint');
        return;
      }

      setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));
    } catch (error) {
      console.error('Delete complaint error:', error);
      alert('Failed to delete complaint');
    }
  };

  // ========================================
  // VILLAGERS – ADD
  // ========================================

  const addVillager = async (villager: Omit<Villager, 'id'>): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/villagers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(villager),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to add villager');
        return;
      }

      const newVillager: Villager = {
        id: data.villager._id,
        name: data.villager.name,
        occupation: data.villager.occupation,
        contact: data.villager.contact,
      };

      setVillagers((prev) => [newVillager, ...prev]);
    } catch (error) {
      console.error('Add villager error:', error);
      alert('Failed to add villager');
    }
  };

  // ========================================
  // VILLAGERS – DELETE
  // ========================================

  const deleteVillager = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/villagers/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to delete villager');
        return;
      }

      setVillagers((prev) => prev.filter((villager) => villager.id !== id));
    } catch (error) {
      console.error('Delete villager error:', error);
      alert('Failed to delete villager');
    }
  };

  // ========================================
  // PUJA – ADD (UPDATED TO PERSIST IN LOCALSTORAGE)
  // ========================================

  const addPuja = async (puja: NewPuja): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setProcessMessage('Adding puja contribution...');

      const response = await fetch(`${API_URL}/puja`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pujaName: puja.pujaName,
          memberName: puja.memberName,
          amount: Number(puja.amount),
          paymentMode: puja.paymentMode,
        }),
      });

      const data = await response.json();
      console.log('Add puja response:', data);

      if (!response.ok || !data.success) {
        console.error('Failed to add puja:', data);
        return false;
      }

      const newPuja: Puja = {
        id: data.puja._id,
        pujaName: data.puja.pujaName,
        memberName: data.puja.memberName,
        amount: data.puja.amount,
        paymentMode: data.puja.paymentMode,
      };

      setPujas((prev) => [newPuja, ...prev]);
      // localStorage update is handled by the useEffect above
      return true;
    } catch (error) {
      console.error('Add puja error:', error);
      alert('Failed to add puja contribution');
      return false;
    } finally {
      setIsProcessing(false);
      setProcessMessage('');
    }
  };

  // ========================================
  // PUJA – DELETE (UPDATED TO PERSIST IN LOCALSTORAGE)
  // ========================================

  const deletePuja = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/puja/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log('Delete puja response:', data);

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to delete puja');
        return;
      }

      setPujas((prev) => prev.filter((puja) => puja.id !== id));
      // localStorage update is handled by the useEffect above
    } catch (error) {
      console.error('Delete puja error:', error);
      alert('Failed to delete puja');
    }
  };

  // ========================================
  // HOME CONFIG
  // ========================================

  const updateHomeConfig = (config: HomeConfig) => {
    console.log('Home config backend not connected yet:', config);
  };

  // ========================================
  // RESET SYSTEM
  // ========================================

  const resetSystem = () => {
    if (window.confirm('Delete all user-added photos and messages?')) {
      localStorage.removeItem(STORAGE_KEYS.USER_GALLERY);
      localStorage.removeItem(STORAGE_KEYS.USER_REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.PUJAS); // Also clear pujas
      window.location.reload();
    }
  };

  // ========================================
  // PROVIDER
  // ========================================

  return (
    <AppContext.Provider
      value={{
        notices,
        villagers,
        gallery,
        reviews,
        homeConfig,
        complaints,
        pujas,

        isProcessing,
        processMessage,
        lastUpdate,

        addNotice,
        deleteNotice,
        addVillager,
        deleteVillager,
        addImage,
        deleteImage,
        addReview,
        deleteReview,
        updateHomeConfig,
        addComplaint,
        deleteComplaint,
        addPuja,
        deletePuja,
        resetSystem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ========================================
// useApp HOOK
// ========================================

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};