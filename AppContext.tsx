
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
  syncProgress: string;
  lastSync: string | null;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;
  addVillager: (villager: Omit<Villager, 'id'>) => void;
  deleteVillager: (id: string) => void;
  addImage: (image: Omit<GalleryImage, 'id'>) => Promise<boolean>;
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

// SHARED CLOUD CONSTANTS - Version 4 (Individual Key Strategy)
const BUCKET_ID = 'badapathuria_v4_final';
const CLOUD_API_BASE = `https://kvdb.io/A9zY6S9z8q5z2Xz1z7z_${BUCKET_ID}/`;
const KEY_META = 'meta'; // Notices, Villagers, etc.
const KEY_GALLERY_MANIFEST = 'gallery_manifest'; // List of image IDs and metadata (no base64)
const IMG_KEY_PREFIX = 'img_data_';

// Aggressive compression to ensure each individual image is well under 64KB
const compressImage = (base64Str: string, maxWidth = 400): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.5));
    };
    img.onerror = () => resolve(base64Str);
  });
};

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
  const [syncProgress, setSyncProgress] = useState('');
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
    setSyncProgress('Connecting...');
    try {
      // 1. Pull Meta
      const metaRes = await fetch(`${CLOUD_API_BASE}${KEY_META}`);
      if (metaRes.ok) {
        const data = await metaRes.json();
        if (data.notices) setNotices(data.notices);
        if (data.villagers) setVillagers(data.villagers);
        if (data.reviews) setReviews(data.reviews);
        if (data.homeConfig) setHomeConfig(data.homeConfig);
      }

      // 2. Pull Gallery Manifest
      const manifestRes = await fetch(`${CLOUD_API_BASE}${KEY_GALLERY_MANIFEST}`);
      if (manifestRes.ok) {
        const manifest = await manifestRes.json(); // Array of {id, title, description}
        if (Array.isArray(manifest)) {
          setSyncProgress(`Loading ${manifest.length} images...`);
          const fullGallery: GalleryImage[] = [];
          
          for (const item of manifest) {
            try {
              const imgDataRes = await fetch(`${CLOUD_API_BASE}${IMG_KEY_PREFIX}${item.id}`);
              if (imgDataRes.ok) {
                const base64 = await imgDataRes.text();
                // KVDB might return text with quotes if saved as JSON string
                const cleanBase64 = base64.replace(/^"|"$/g, '');
                fullGallery.push({ ...item, url: cleanBase64 });
              }
            } catch (err) { console.error("Failed to load image", item.id); }
          }
          if (fullGallery.length > 0) setGallery(fullGallery);
        }
      }

      const now = new Date().toLocaleString();
      setLastSync(now);
      localStorage.setItem('last_cloud_sync', now);
    } catch (e) {
      console.warn("Sync pull failed.");
    } finally {
      setIsSyncing(false);
      setSyncProgress('');
    }
  }, []);

  const publishToCloud = async () => {
    setIsSyncing(true);
    setSyncProgress('Saving Village Data...');
    try {
      // 1. Publish Metadata (Notices, residents, etc.)
      const metaPayload = { notices, villagers, reviews, homeConfig };
      await fetch(`${CLOUD_API_BASE}${KEY_META}`, {
        method: 'PUT',
        body: JSON.stringify(metaPayload),
      });

      // 2. Publish Gallery Manifest (Names/IDs only)
      const manifest = gallery.map(({ id, title, description }) => ({ id, title, description }));
      await fetch(`${CLOUD_API_BASE}${KEY_GALLERY_MANIFEST}`, {
        method: 'PUT',
        body: JSON.stringify(manifest),
      });

      // 3. Publish Individual Images
      for (let i = 0; i < gallery.length; i++) {
        setSyncProgress(`Uploading Image ${i + 1}/${gallery.length}...`);
        const img = gallery[i];
        await fetch(`${CLOUD_API_BASE}${IMG_KEY_PREFIX}${img.id}`, {
          method: 'PUT',
          body: JSON.stringify(img.url),
        });
      }

      const now = new Date().toLocaleString();
      setLastSync(now);
      localStorage.setItem('last_cloud_sync', now);
    } catch (e) {
      alert("Sync failed. The cloud might be busy. Please try again in a few minutes.");
    } finally {
      setIsSyncing(false);
      setSyncProgress('');
    }
  };

  useEffect(() => { pullFromCloud(); }, [pullFromCloud]);

  const addNotice = (notice: Omit<Notice, 'id'>) => setNotices(prev => [{ ...notice, id: Date.now().toString() }, ...prev]);
  const deleteNotice = (id: string) => setNotices(prev => prev.filter(n => n.id !== id));
  const addVillager = (villager: Omit<Villager, 'id'>) => setVillagers(prev => [{ ...villager, id: Date.now().toString() }, ...prev]);
  const deleteVillager = (id: string) => setVillagers(prev => prev.filter(v => v.id !== id));
  
  const addImage = async (image: Omit<GalleryImage, 'id'>): Promise<boolean> => {
    if (gallery.length >= 30) return false;
    const compressedUrl = await compressImage(image.url);
    const newImage = { ...image, url: compressedUrl, id: Date.now().toString() };
    setGallery(prev => [newImage, ...prev]);
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
      notices, villagers, gallery, reviews, homeConfig, complaints, isSyncing, syncProgress, lastSync,
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
