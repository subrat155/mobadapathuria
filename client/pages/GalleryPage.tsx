import React, { useRef, useState } from 'react';
import { useApp } from '../AppContext';
import {
  Image as ImageIcon,
  Camera,
  Upload,
  CheckCircle,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

const GalleryPage: React.FC = () => {
  const { gallery, addImage } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ========================================
  // FULL IMAGE MODAL
  // ========================================

  const [selectedImageIndex, setSelectedImageIndex] =
    useState<number | null>(null);

  // ========================================
  // OPEN IMAGE
  // ========================================

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  // ========================================
  // CLOSE IMAGE
  // ========================================

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  // ========================================
  // PREVIOUS IMAGE
  // ========================================

  const previousImage = () => {
    if (selectedImageIndex === null || gallery.length === 0) {
      return;
    }

    setSelectedImageIndex(
      selectedImageIndex === 0
        ? gallery.length - 1
        : selectedImageIndex - 1
    );
  };

  // ========================================
  // NEXT IMAGE
  // ========================================

  const nextImage = () => {
    if (selectedImageIndex === null || gallery.length === 0) {
      return;
    }

    setSelectedImageIndex(
      selectedImageIndex === gallery.length - 1
        ? 0
        : selectedImageIndex + 1
    );
  };

  // ========================================
  // UPLOAD IMAGE
  // ========================================

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10 MB.');
      return;
    }

    try {
      setIsUploading(true);

      const success = await addImage({
        file: file,
        title: 'Community Contribution',
        description: `Uploaded by a community member on ${new Date().toLocaleDateString()}`
      });

      if (success) {
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  // ========================================
  // OPEN FILE SELECTOR
  // ========================================

  const openFileSelector = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="text-center mb-16">

        <div className="inline-flex items-center gap-2 text-[#88AB8E] font-bold mb-4 uppercase tracking-[0.2em] text-sm">
          <Camera size={16} />
          Village Lens
        </div>

        <h1 className="text-5xl font-bold text-black mb-6">
          Memories of Badapathuria
        </h1>

        <p className="text-black/60 max-w-2xl mx-auto text-lg italic">
          “Celebrating our unity, heritage, and the beautiful everyday
          moments of our culture.”
        </p>

      </div>


      {/* ========================================
          COMMUNITY COLLECTION HEADER
      ======================================== */}

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">

        <h3 className="text-2xl font-bold text-black uppercase tracking-wider">
          Community Collection
        </h3>

        <div className="flex gap-3">

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />

          <button
            onClick={openFileSelector}
            disabled={isUploading}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#333] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {isUploading ? (
              <Loader2
                className="animate-spin"
                size={18}
              />
            ) : (
              <Upload size={18} />
            )}

            {isUploading
              ? 'Uploading...'
              : 'Upload Your Photo'
            }

          </button>


          <div className="flex gap-1 p-1 bg-[#88AB8E]/5 rounded-2xl border border-[#88AB8E]/10">

            <button className="px-4 py-2 rounded-xl bg-[#88AB8E] text-white font-bold text-xs">
              All
            </button>

            <button className="px-4 py-2 rounded-xl text-black/50 font-bold text-xs hover:bg-white transition-colors">
              History
            </button>

          </div>

        </div>

      </div>


      {/* ========================================
          SUCCESS MESSAGE
      ======================================== */}

      {showSuccess && (

        <div className="mb-8 bg-[#88AB8E] text-white p-4 rounded-2xl flex items-center justify-center gap-3 animate-in zoom-in duration-300">

          <CheckCircle size={20} />

          <span className="font-bold">
            Photo successfully added to the village lens!
          </span>

        </div>

      )}


      {/* ========================================
          GALLERY GRID
      ======================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {gallery.map((img, index) => (

          <div
            key={img.id}
            className="bg-white rounded-[32px] overflow-hidden border border-[#88AB8E]/10 shadow-lg group hover:scale-[1.03] transition-all"
          >

            {/* IMAGE */}

            <div
              className="h-60 overflow-hidden relative cursor-pointer"
              onClick={() => openImage(index)}
            >

              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* HOVER OVERLAY */}

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full text-black shadow-xl">

                  <Maximize2 size={22} />

                </div>

              </div>

            </div>


            {/* IMAGE INFORMATION */}

            <div className="p-5">

              <h4 className="font-bold text-black mb-1 line-clamp-1">
                {img.title}
              </h4>

              <p className="text-xs text-black/50 line-clamp-2">
                {img.description}
              </p>

            </div>

          </div>

        ))}


        {/* EMPTY GALLERY */}

        {gallery.length === 0 && (

          <div className="col-span-full text-center py-20">

            <Camera
              size={48}
              className="mx-auto mb-4 text-[#88AB8E]/20"
            />

            <p className="text-black/40">
              No photos shared yet. Be the first to upload!
            </p>

          </div>

        )}

      </div>


      {/* ========================================
          PRESERVE HERITAGE
      ======================================== */}

      <div className="mt-20 bg-[#F9F8F4] p-12 rounded-[50px] border border-dashed border-[#88AB8E]/30 text-center">

        <h4 className="text-2xl font-bold text-black mb-2">
          Preserve the Heritage
        </h4>

        <p className="text-black/50 max-w-lg mx-auto mb-8">
          Have old photos of Badapathuria? Help us build a digital
          archive of our village history.
        </p>

        <button
          onClick={openFileSelector}
          disabled={isUploading}
          className="bg-[#88AB8E] text-white px-10 py-4 rounded-full font-bold hover:bg-[#6B8A7A] shadow-xl shadow-[#88AB8E]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >

          {isUploading
            ? 'Uploading...'
            : 'Start Uploading'
          }

        </button>

      </div>


      {/* ========================================
          FULL IMAGE VIEWER
      ======================================== */}

      {selectedImageIndex !== null &&
        gallery[selectedImageIndex] && (

        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={closeImage}
        >

          {/* CLOSE BUTTON */}

          <button
            onClick={closeImage}
           className="
  absolute
  top-6
  right-6
  z-50
  bg-black
  hover:bg-black/90
  text-white
  p-3
  rounded-full
  border
  border-white/10
  shadow-2xl
  transition-all
"
          >
            <X size={26} />
          </button>


          {/* PREVIOUS BUTTON */}

          {gallery.length > 1 && (

            <button
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
             className="
  absolute
  left-4
  md:left-8
  z-50
  bg-black
  hover:bg-black/90
  text-white
  p-3
  md:p-4
  rounded-full
  border
  border-white/10
  shadow-[0_8px_30px_rgba(0,0,0,0.6)]
  transition-all
"
            >
              <ChevronLeft size={28} />
            </button>

          )}


          {/* IMAGE AREA */}

          <div
            className="max-w-6xl w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={gallery[selectedImageIndex].url}
              alt={gallery[selectedImageIndex].title}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />


            {/* IMAGE DETAILS */}

            <div className="text-center mt-6 max-w-2xl">

              <h3 className="text-xl md:text-2xl bg-black font-bold text-white">
                {gallery[selectedImageIndex].title}
              </h3>

              <p className="text-white/60 bg-black text-sm mt-2">
                {gallery[selectedImageIndex].description}
              </p>

              <p className="text-white/30 text-xs mt-3">
                {selectedImageIndex + 1} / {gallery.length}
              </p>

            </div>

          </div>


          {/* NEXT BUTTON */}

    {gallery.length > 1 && (

      <button
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
        className="
          absolute
          right-3
          md:right-6
          top-1/2
          -translate-y-1/2
          z-50
          bg-black/40
          hover:bg-black/70
          text-white
          w-9
          h-9
          md:w-10
          md:h-10
          rounded-full
          flex
          items-center
          justify-center
          backdrop-blur-md
          transition-all
          border
          border-white/10
        "
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>


          )}

        </div>

      )}

    </div>
  );
};

export default GalleryPage;