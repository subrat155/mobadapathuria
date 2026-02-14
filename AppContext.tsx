
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
  { id: '1', name: 'Suresh Chandra', content: 'The new solar lights in our street have made a huge difference.', rating: 5, avatarUrl: 'https://i.pravatar.cc/150?u=suresh' },
  { id: '2', name: 'Meena Patra', content: 'Panchayat updates on this portal are very helpful.', rating: 4, avatarUrl: 'https://i.pravatar.cc/150?u=meena' }
];

// SHARED CLOUD CONSTANTS - Split into segments to avoid "Too Large" errors
const CLOUD_API_BASE = 'https://kvdb.io/A9zY6S9z8q5z2Xz1z7z_badapathuria/';
const KEY_META = 'v1_metadata'; // Notices, Villagers, Reviews, HomeConfig
const KEY_GALLERY = 'v1_gallery'; // Gallery list

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const safeJsonParse = (key: string, fallback: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) { return fallback; }
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

  useEffect(() => {
    localStorage.setItem('village_notices', JSON.stringify(notices));
    localStorage.setItem('village_villagers', JSON.stringify(villagers));
    localStorage.setItem('village_gallery', JSON.stringify(gallery));
    localStorage.setItem('village_reviews', JSON.stringify(reviews));
    localStorage.setItem('village_home_config', JSON.stringify(homeConfig));
    localStorage.setItem('village_complaints', JSON.stringify(complaints));
  }, [notices, villagers, gallery, reviews, homeConfig, complaints]);

  const pullFromCloud = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Pull Metadata (Small)
      const metaRes = await fetch(`${CLOUD_API_BASE}${KEY_META}`);
      if (metaRes.ok) {
        const data = await metaRes.json();
        if (data.notices) setNotices(data.notices);
        if (data.villagers) setVillagers(data.villagers);
        if (data.reviews) setReviews(data.reviews);
        if (data.homeConfig) setHomeConfig(data.homeConfig);
      }
      
      // Pull Gallery (Large - separate request)
      const galleryRes = await fetch(`${CLOUD_API_BASE}${KEY_GALLERY}`);
      if (galleryRes.ok) {
        const data = await galleryRes.json();
        if (data) setGallery(data);
      }

      const now = new Date().toLocaleString();
      setLastSync(now);
      localStorage.setItem('last_cloud_sync', now);
    } catch (e) {
      console.warn("Sync failed - using local data.");
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const publishToCloud = async () => {
    setIsSyncing(true);
    try {
      // 1. Publish Metadata
      const metaPayload = { notices, villagers, reviews, homeConfig };
      const metaRes = await fetch(`${CLOUD_API_BASE}${KEY_META}`, {
        method: 'PUT',
        body: JSON.stringify(metaPayload),
      });

      if (!metaRes.ok) throw new Error("Meta Sync Failed");

      // 2. Publish Gallery (This is the heavy one)
      // If gallery is still too big, we notify the user
      const galleryRes = await fetch(`${CLOUD_API_BASE}${KEY_GALLERY}`, {
        method: 'PUT',
        body: JSON.stringify(gallery),
      });

      if (!galleryRes.ok) throw new Error("Gallery Sync Failed - Too many images?");

      const now = new Date().toLocaleString();
      setLastSync(now);
      localStorage.setItem('last_cloud_sync', now);
    } catch (e) {
      alert("Notice: Some data might be too large for the free cloud storage. Try reducing the number of high-quality images in the gallery.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => { pullFromCloud(); }, [pullFromCloud]);

  const addNotice = (notice: Omit<Notice, 'id'>) => setNotices(prev => [{ ...notice, id: Date.now().toString() }, ...prev]);
  const deleteNotice = (id: string) => setNotices(prev => prev.filter(n => n.id !== id));
  const addVillager = (villager: Omit<Villager, 'id'>) => setVillagers(prev => [{ ...villager, id: Date.now().toString() }, ...prev]);
  const deleteVillager = (id: string) => setVillagers(prev => prev.filter(v => v.id !== id));
  
  const addImage = (image: Omit<GalleryImage, 'id'>): boolean => {
    if (gallery.length >= 40) return false;
    setGallery(prev => [{ ...image, id: Date.now().toString() }, ...prev]);
    return true;
  };

  const deleteImage = (id: string) => {
    setGallery(prev => prev.filter(i => i.id !== id));
  };

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
