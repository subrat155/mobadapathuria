
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notice, Villager, GalleryImage, Complaint, Review } from './types';
import { INITIAL_NOTICES, INITIAL_VILLAGERS, GALLERY_IMAGES } from './constants';

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
  isSyncing: boolean;
  lastSync: string | null;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;
  addVillager: (villager: Omit<Villager, 'id'>) => void;
  deleteVillager: (id: string) => void;
  addImage: (image: Omit<GalleryImage, 'id'>) => boolean;
  deleteImage: (id: string) => void;
  addReview: (review: Omit<Review, 'id'>) => void;
  deleteReview: (id: string) => void;
  updateHomeConfig: (config: HomeConfig) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
  deleteComplaint: (id: string) => void;
  publishToCloud: () => Promise<void>;
  pullFromCloud: () => Promise<void>;
}

const INITIAL_REVIEWS: Review[] = [
  { 
    id: '1', 
    name: 'Suresh Chandra', 
    content: 'The new solar lights in our street have made a huge difference. Safety has improved significantly for our children.', 
    rating: 5, 
    avatarUrl: 'https://i.pravatar.cc/150?u=suresh' 
  },
  { 
    id: '2', 
    name: 'Meena Patra', 
    content: 'Panchayat updates on this portal are very helpful. I don\'t have to walk to the office anymore to check notices.', 
    rating: 4, 
    avatarUrl: 'https://i.pravatar.cc/150?u=meena' 
  }
];

// SHARED CLOUD CONSTANTS
// This unique ID links all devices together. 
const CLOUD_STORAGE_KEY = 'badapathuria_portal_v1_main';
const CLOUD_API_BASE = 'https://kvdb.io/A9zY6S9z8q5z2Xz1z7z_badapathuria/'; // Public shared bucket

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const safeJsonParse = (key: string, fallback: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const [notices, setNotices] = useState<Notice[]>(() => safeJsonParse('village_notices', INITIAL_NOTICES));
  const [villagers, setVillagers] = useState<Villager[]>(() => safeJsonParse('village_villagers', INITIAL_VILLAGERS));
  const [gallery, setGallery] = useState<GalleryImage[]>(() => safeJsonParse('village_gallery', GALLERY_IMAGES));
  const [reviews, setReviews] = useState<Review[]>(() => safeJsonParse('village_reviews', INITIAL_REVIEWS));
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(() => safeJsonParse('village_home_config', {
    heroImageUrl: 'https://picsum.photos/seed/badapathuria/1920/600',
    welcomeHeading: 'Welcome to Badapathuria Village',
    welcomeSubheading: 'Connecting our community through information, services, and announcements.'
  }));
  const [complaints, setComplaints] = useState<Complaint[]>(() => safeJsonParse('village_complaints', []));
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(() => localStorage.getItem('last_cloud_sync'));

  // Sync state to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('village_notices', JSON.stringify(notices));
      localStorage.setItem('village_villagers', JSON.stringify(villagers));
      localStorage.setItem('village_gallery', JSON.stringify(gallery));
      localStorage.setItem('village_reviews', JSON.stringify(reviews));
      localStorage.setItem('village_home_config', JSON.stringify(homeConfig));
      localStorage.setItem('village_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.error("Storage limit reached locally.");
    }
  }, [notices, villagers, gallery, reviews, homeConfig, complaints]);

  // CLOUD SYNC LOGIC
  const pullFromCloud = useCallback(async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`${CLOUD_API_BASE}${CLOUD_STORAGE_KEY}`);
      if (response.ok) {
        const cloudData = await response.json();
        if (cloudData) {
          if (cloudData.notices) setNotices(cloudData.notices);
          if (cloudData.villagers) setVillagers(cloudData.villagers);
          if (cloudData.gallery) setGallery(cloudData.gallery);
          if (cloudData.reviews) setReviews(cloudData.reviews);
          if (cloudData.homeConfig) setHomeConfig(cloudData.homeConfig);
          
          const now = new Date().toLocaleString();
          setLastSync(now);
          localStorage.setItem('last_cloud_sync', now);
        }
      }
    } catch (e) {
      console.warn("Cloud pull failed - device offline or server busy.");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const publishToCloud = async () => {
    setIsSyncing(true);
    try {
      const payload = {
        notices,
        villagers,
        gallery, // Note: large base64 might fail depending on server limits
        reviews,
        homeConfig,
        timestamp: Date.now()
      };

      const response = await fetch(`${CLOUD_API_BASE}${CLOUD_STORAGE_KEY}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const now = new Date().toLocaleString();
        setLastSync(now);
        localStorage.setItem('last_cloud_sync', now);
      } else {
        throw new Error("Cloud push failed");
      }
    } catch (e) {
      alert("Error syncing to everyone: Data too large for shared demo storage. Try removing some high-res images from gallery.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Initial Pull on Load
  useEffect(() => {
    pullFromCloud();
  }, [pullFromCloud]);

  const addNotice = (notice: Omit<Notice, 'id'>) => setNotices(prev => [{ ...notice, id: Date.now().toString() }, ...prev]);
  const deleteNotice = (id: string) => setNotices(prev => prev.filter(n => n.id !== id));
  const addVillager = (villager: Omit<Villager, 'id'>) => setVillagers(prev => [{ ...villager, id: Date.now().toString() }, ...prev]);
  const deleteVillager = (id: string) => setVillagers(prev => prev.filter(v => v.id !== id));
  
  const addImage = (image: Omit<GalleryImage, 'id'>): boolean => {
    if (gallery.length >= 40) return false;
    setGallery(prev => [{ ...image, id: Date.now().toString() }, ...prev]);
    return true;
  };

  const deleteImage = (id: string) => setGallery(prev => prev.filter(i => i.id !== id));
  const addReview = (review: Omit<Review, 'id'>) => setReviews(prev => [{ ...review, id: Date.now().toString() }, ...prev]);
  const deleteReview = (id: string) => setReviews(prev => prev.filter(r => r.id !== id));
  const updateHomeConfig = (config: HomeConfig) => setHomeConfig(config);
  const addComplaint = (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => {
    setComplaints(prev => [{ ...complaint, id: Date.now().toString(), date: new Date().toISOString().split('T')[0], status: 'pending' }, ...prev]);
  };
  const deleteComplaint = (id: string) => setComplaints(prev => prev.filter(c => c.id !== id));

  return (
    <AppContext.Provider value={{
      notices, villagers, gallery, reviews, homeConfig, complaints, isSyncing, lastSync,
      addNotice, deleteNotice, addVillager, deleteVillager,
      addImage, deleteImage, addReview, deleteReview, updateHomeConfig, addComplaint, deleteComplaint,
      publishToCloud, pullFromCloud
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
