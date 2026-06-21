'use client';

import { QRCodeSVG } from 'qrcode.react';

const UDreammsLogo = '/icons/new-icon-udreamms.png';

interface BrandedQrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function BrandedQrCode({ value, size = 280, className = '' }: BrandedQrCodeProps) {
  const logoSize = Math.round(size * 0.16);

  return (
    <div
      className={`inline-flex items-center justify-center bg-white rounded-2xl p-2 w-fit mx-auto overflow-hidden ${className}`}
    >
      <div className="rounded-xl overflow-hidden leading-none">
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          marginSize={3}
          bgColor="#ffffff"
          fgColor="#0f172a"
          title="Código QR de pago"
          imageSettings={{
            src: UDreammsLogo,
            height: logoSize,
            width: logoSize,
            excavate: true,
            crossOrigin: 'anonymous',
          }}
        />
      </div>
    </div>
  );
}
