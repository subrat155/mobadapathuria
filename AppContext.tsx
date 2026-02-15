
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notice, Villager, GalleryImage, Complaint, Review } from './types';
import { 
  INITIAL_NOTICES, 
  INITIAL_VILLAGERS, 
  GALLERY_IMAGES, 
  INITIAL_REVIEWS,
  HOME_CONFIG, 
  SYSTEM_VERSION 
} from './constants';

interface HomeConfig {
  heroImageUrl: string;
  welcomeHeading: string;
  welcomeSubheading: string;
}

interface AppContextType {
  notices: Notice[];
  villagers: Villager[];
  gallery: GalleryImage[];
  reviews: Review[];
  homeConfig: HomeConfig;
  complaints: Complaint[];
  isProcessing: boolean;
  processMessage: string;
  lastUpdate: string | null;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;
  addVillager: (villager: Omit<Villager, 'id'>) => void;
  deleteVillager: (id: string) => void;
  addImage: (image: { url: string; title: string; description: string }) => Promise<boolean>;
  deleteImage: (id: string) => void;
  addReview: (review: Omit<Review, 'id'>) => void;
  deleteReview: (id: string) => void;
  updateHomeConfig: (config: HomeConfig) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
  deleteComplaint: (id: string) => void;
  resetSystem: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_GALLERY: 'bp_user_gallery',
  USER_REVIEWS: 'bp_user_reviews',
  COMPLAINTS: 'bp_complaints',
  LAST_UPDATE: 'bp_last_update',
  VERSION: 'bp_sys_version'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync version and handle resets
  useEffect(() => {
    const savedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (savedVersion !== SYSTEM_VERSION) {
      localStorage.setItem(STORAGE_KEYS.VERSION, SYSTEM_VERSION);
    }
  }, []);

  // --- Fixed Data (Strictly from constants.tsx) ---
  const [notices] = useState<Notice[]>(INITIAL_NOTICES);
  const [villagers] = useState<Villager[]>(INITIAL_VILLAGERS);
  const [homeConfig] = useState<HomeConfig>(HOME_CONFIG);
  const fixedGallery = GALLERY_IMAGES;
  const fixedReviews = INITIAL_REVIEWS;

  // --- Dynamic Data (Persistent in LocalStorage) ---
  const [userGallery, setUserGallery] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_GALLERY);
    return saved ? JSON.parse(saved) : [];
  });

  const [userReviews, setUserReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
    return saved ? JSON.parse(saved) : [];
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [lastUpdate, setLastUpdate] = useState<string | null>(localStorage.getItem(STORAGE_KEYS.LAST_UPDATE));
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState('');

  // Combined final lists for the UI
  const gallery = [...fixedGallery, ...userGallery];
  const reviews = [...fixedReviews, ...userReviews];

  // Auto-save user data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_GALLERY, JSON.stringify(userGallery));
  }, [userGallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(userReviews));
  }, [userReviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    const now = new Date().toLocaleString();
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, now);
    setLastUpdate(now);
  }, [complaints]);

  // Actions
  const addImage = async (image: { url: string; title: string; description: string }) => {
    if (gallery.length >= 60) return false;
    
    setIsProcessing(true);
    setProcessMessage('Saving contribution...');
    
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const newImg: GalleryImage = {
          id: `uimg_${Date.now()}`,
          ...image
        };
        setUserGallery(prev => [newImg, ...prev]);
        setIsProcessing(false);
        setProcessMessage('');
        resolve(true);
      }, 800);
    });
  };

  const deleteImage = (id: string) => {
    setUserGallery(prev => prev.filter(img => img.id !== id));
  };

  const addReview = (review: Omit<Review, 'id'>) => {
    setUserReviews(prev => [{ ...review, id: `urev_${Date.now()}` }, ...prev]);
  };

  const deleteReview = (id: string) => {
    setUserReviews(prev => prev.filter(r => r.id !== id));
  };

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => {
    const newEntry: Complaint = {
      ...complaint,
      id: `c_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setComplaints(prev => [newEntry, ...prev]);
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  // Manual-only placeholders
  const addNotice = () => {};
  const deleteNotice = () => {};
  const addVillager = () => {};
  const deleteVillager = () => {};
  const updateHomeConfig = () => {};

  const resetSystem = () => {
    if (window.confirm("Delete all user-added photos and messages?")) {
      localStorage.removeItem(STORAGE_KEYS.USER_GALLERY);
      localStorage.removeItem(STORAGE_KEYS.USER_REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
      window.location.reload();
    }
  };

  return (
    <AppContext.Provider value={{
      notices, villagers, gallery, reviews, homeConfig, complaints,
      isProcessing, processMessage, lastUpdate,
      addNotice, deleteNotice, addVillager, deleteVillager,
      addImage, deleteImage, addReview, deleteReview, updateHomeConfig,
      addComplaint, deleteComplaint, resetSystem
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
