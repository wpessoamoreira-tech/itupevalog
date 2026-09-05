import React from 'react';
import officialLogoImg from '../assets/images/itupeva_log_express_official_logo.jpg';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Official Itupeva Log Express Brand Logo
 * Direct rendering of the user's authentic brand image file (WhatsApp Image 2026-08-23 at 08.49.05).
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Balanced height scale for header, footer and other placements
  const sizeClasses = {
    sm: 'h-11 sm:h-12',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-36',
  };

  return (
    <div className={`inline-flex items-center ${className}`} id="brand-logo">
      <img
        src={officialLogoImg}
        alt="Itupeva Log Express - O Transporte Que Gira O Mundo"
        className={`${sizeClasses[size]} w-auto object-contain select-none`}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
