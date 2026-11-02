import { useEffect, useRef, useState } from 'react';
import {
  ModusWcAvatar,
  ModusWcButton,
  ModusWcIcon,
  ModusWcNavbar,
  ModusWcProfileMenu,
} from '@trimble-oss/moduswebcomponents-react';
import type { IProfileMenuProps } from '@trimble-oss/moduswebcomponents';
import type { ThemeMode } from '../theme';

const PRODUCT_NAME = 'Modus Prototype Setup Prompt Test';

const profileProps: IProfileMenuProps = {
  headerName: PRODUCT_NAME,
  userName: 'Prototype User',
  userEmail: 'prototype.user@example.com',
  profileImageUrl: '',
  manageTrimbleId: {
    link: 'https://myprofile.trimble.com/',
    target: '_blank',
  },
};

const navbarVisibility = {
  ai: true,
  apps: true,
  help: true,
  logo: true,
  mainMenu: true,
  notifications: true,
  search: true,
  searchInput: true,
  user: false,
} as const;

type AppNavbarProps = {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  condensed?: boolean;
  /** Wired to modus-wc-navbar hamburger — toggles blueprint side navigation. */
  onMainMenuToggle?: () => void;
};

export function AppNavbar({
  themeMode,
  onToggleTheme,
  condensed = false,
  onMainMenuToggle,
}: AppNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const wrapper = profileRef.current;
      if (wrapper && !wrapper.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [profileOpen]);

  const themeLabel =
    themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <ModusWcNavbar
      condensed={condensed}
      mainMenuOpen={false}
      visibility={navbarVisibility}
      onMainMenuOpenChange={() => {
        onMainMenuToggle?.();
      }}
      customClass="sticky top-0 z-[120] flex-shrink-0"
    >
      <div slot="main-menu" hidden>
        Main menu placeholder
      </div>

      <div slot="end" className="navbar-theme">
        <ModusWcButton
          size="sm"
          variant="borderless"
          shape="square"
          buttonAriaLabel={themeLabel}
          onButtonClick={onToggleTheme}
        >
          <ModusWcIcon
            name={themeMode === 'light' ? 'moon' : 'sun'}
            size="xs"
            decorative
          />
        </ModusWcButton>
      </div>

      <div slot="end" className="navbar-profile" ref={profileRef}>
        <ModusWcButton
          size="sm"
          variant="borderless"
          shape="circle"
          buttonAriaLabel="Open profile menu"
          onButtonClick={() => setProfileOpen((open) => !open)}
        >
          <ModusWcAvatar size="sm" shape="circle" initials="Prototype User" />
        </ModusWcButton>
        <div
          className="navbar-profile-panel"
          hidden={!profileOpen}
          inert={profileOpen ? undefined : true}
        >
          <ModusWcProfileMenu
            profileProps={profileProps}
            showSignOut
            onSignOutClick={() => {
              setProfileOpen(false);
            }}
          />
        </div>
      </div>
    </ModusWcNavbar>
  );
}
