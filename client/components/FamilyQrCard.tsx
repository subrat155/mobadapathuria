import React, { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, House, Sprout, X } from 'lucide-react';
import { Family } from '../AppContext';

export const buildFamilyQrText = (family: Family): string => {
  const members =
    family.members.length > 0
      ? family.members
          .map((member) => {
            const age =
              member.age === undefined || member.age === null
                ? '-'
                : String(member.age);

            return `${member.name} | ${member.relation} | Age ${age} | ${member.gender || '-'}`;
          })
          .join('\n')
      : 'None';

  return [
    'Badapathuria Family ID',
    `Family ID: ${family.familyId}`,
    `Family Head: ${family.familyHead}`,
    `Ward: ${family.wardNumber}`,
    `House No: ${family.houseNumber || '-'}`,
    `Address: ${family.address}`,
    `Status: ${family.status}`,
    'Members:',
    members,
  ].join('\n');
};

interface FamilyQrCardProps {
  family: Family;
  onClose?: () => void;
}

const FamilyQrCard: React.FC<FamilyQrCardProps> = ({
  family,
  onClose,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [qrSize, setQrSize] = useState(140);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const next = Math.min(180, Math.max(110, Math.floor(w)));
      setQrSize(next);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const downloadQr = () => {
    const canvas = wrapRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${family.familyId}-qr.png`;
    link.click();
  };

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[300px] mx-auto">
      <div className="absolute -inset-2 rounded-[28px] bg-[#C9A24D]/20 blur-md" />

      <div className="relative flex flex-col bg-[#FFFDF7] border-2 border-[#C47A4D] rounded-[24px] shadow-[0_16px_40px_rgba(92,66,38,0.18)] overflow-hidden h-[390px] sm:h-[430px]">
        <div className="h-1.5 flex-shrink-0 bg-[repeating-linear-gradient(90deg,#557B5D_0,#557B5D_12px,#C47A4D_12px,#C47A4D_24px,#C9A24D_24px,#C9A24D_30px)]" />

        <div className="flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-[#C47A4D]/30 bg-[#FFF5DA] text-black">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="relative flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#C47A4D] bg-[#FFFDF7] text-black flex items-center justify-center">
              <House size={20} strokeWidth={2.4} />
              <Sprout size={10} className="absolute -bottom-1 -right-1 rounded-full border border-[#C47A4D] bg-[#FFFDF7] p-0.5 text-black" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-black">
                Badapathuria Village
              </span>
              <span className="text-xs font-black truncate text-black">
                {family.familyHead}'s Family
              </span>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={downloadQr}
              title="Download QR"
              aria-label="Download QR"
              className="flex h-10 flex-shrink-0 items-center justify-center gap-1.5 rounded-lg border border-black/30 bg-white px-2.5 text-black transition-colors hover:bg-[#F2D69B] sm:h-11 sm:px-3"
            >
              <Download size={18} />
              <span className="text-xs font-bold">Download</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Close"
                aria-label="Close QR"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-black/30 bg-white text-black hover:bg-[#F2D69B] transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="family-qr-scroll flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-[radial-gradient(circle_at_top,#FFF5DA_0,#FFFDF7_42%,#F7F0DF_100%)]">

          <div
            ref={wrapRef}
            className="relative w-full max-w-[180px] mx-auto aspect-square bg-[#FFFDF7] rounded-[18px] p-2 flex items-center justify-center overflow-hidden"
          >
            <QRCodeCanvas
              value={buildFamilyQrText(family)}
              size={qrSize}
              level="M"
              includeMargin={true}
              fgColor="#31583A"
              bgColor="#FFFDF7"
              title={`Family QR for ${family.familyHead}`}
              style={{
                width: `${qrSize}px`,
                height: `${qrSize}px`,
                display: 'block',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>

          <div className="w-full flex items-center justify-center px-3 py-2 rounded-full border border-[#C9A24D]/50 bg-[#FFF5DA] text-center">
            <span className="text-xs font-black text-black truncate">
              {family.familyHead}
            </span>
          </div>

          {/* DETAILS */}
          <div className="w-full rounded-xl border border-[#557B5D]/10 bg-white/70 p-3 text-[11px] text-black space-y-1.5">
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-black min-w-[52px]">Ward</span>
              <span className="truncate">{family.wardNumber}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-black min-w-[52px]">House</span>
              <span className="truncate">{family.houseNumber || '—'}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-black min-w-[52px]">Address</span>
              <span className="break-words">{family.address}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-black min-w-[52px]">Members</span>
              <span>{family.members.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyQrCard;