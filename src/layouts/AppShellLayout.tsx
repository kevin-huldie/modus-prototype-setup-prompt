import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import './AppShellLayout.css';
import {
  ModusWcIcon,
  ModusWcNavbar,
  ModusWcSideNavigation,
  ModusWcMenu,
  ModusWcMenuItem,
} from '@trimble-oss/moduswebcomponents-react';

const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

export interface AppShellMenuItem {
  label: string;
  value: string;
  icon?: string;
}

export interface AppShellNavbarVisibility {
  ai?: boolean;
  apps?: boolean;
  help?: boolean;
  mainMenu?: boolean;
  notifications?: boolean;
  search?: boolean;
  searchInput?: boolean;
  user?: boolean;
}

export type AppShellNavbarRenderContext = {
  mobile: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export interface AppShellLayoutProps {
  children: React.ReactNode;
  contentId?: string;
  menuItems?: AppShellMenuItem[];
  selectedMenuItem?: string;
  /** When set, replaces the default blueprint navbar (use prototype setup AppNavbar). */
  renderNavbar?: (ctx: AppShellNavbarRenderContext) => React.ReactNode;
  navbarStart?: React.ReactNode;
  navbarCenter?: React.ReactNode;
  navbarEnd?: React.ReactNode;
  navbarVisibility?: AppShellNavbarVisibility;
  onMenuItemSelect?: (e: CustomEvent<{ value: string }>) => void;
  onMainMenuToggle?: () => void;
  useContainerWidth?: boolean;
  className?: string;
  contentClassName?: string;
  constrainMainContentWidth?: boolean;
}

const DEFAULT_NAVBAR_VISIBILITY: AppShellNavbarVisibility = {
  ai: false,
  apps: true,
  help: false,
  mainMenu: true,
  notifications: true,
  search: true,
  searchInput: false,
  user: true,
};

const DEFAULT_MENU_ITEMS: AppShellMenuItem[] = [
  { label: 'Home', value: 'home', icon: 'home' },
  { label: 'Dashboard', value: 'dashboard', icon: 'dashboard' },
  { label: 'Overview', value: 'overview', icon: 'cube' },
  { label: 'Settings', value: 'settings', icon: 'settings' },
];

function resolveLayoutFromWidth(width: number) {
  const mobile = width < MOBILE_BREAKPOINT;
  const medium =
    width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT;
  return {
    mobile,
    medium,
    desktop: !mobile && !medium,
    sidebarOpen: !mobile && !medium,
  };
}

export function AppShellLayout({
  children,
  contentId = 'app-shell-content',
  menuItems = DEFAULT_MENU_ITEMS,
  selectedMenuItem = 'home',
  renderNavbar,
  navbarStart,
  navbarCenter,
  navbarEnd,
  navbarVisibility = DEFAULT_NAVBAR_VISIBILITY,
  onMenuItemSelect,
  onMainMenuToggle,
  useContainerWidth = false,
  className = '',
  contentClassName = '',
  constrainMainContentWidth = false,
}: AppShellLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(() => {
    if (useContainerWidth) {
      return MOBILE_BREAKPOINT - 1;
    }
    return typeof window !== 'undefined' ? window.innerWidth : 1024;
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (useContainerWidth) return false;
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    return resolveLayoutFromWidth(w).sidebarOpen;
  });
  const [navTransitionsEnabled, setNavTransitionsEnabled] = useState(false);

  const mobile = containerWidth < MOBILE_BREAKPOINT;
  const medium =
    containerWidth >= MOBILE_BREAKPOINT && containerWidth < DESKTOP_BREAKPOINT;
  const desktop = !mobile && !medium;

  useLayoutEffect(() => {
    const w = useContainerWidth
      ? (containerRef.current?.offsetWidth ?? 0)
      : window.innerWidth;
    if (w <= 0) return;
    const layout = resolveLayoutFromWidth(w);
    setContainerWidth(w);
    setSidebarOpen(layout.sidebarOpen);
  }, [useContainerWidth]);

  useEffect(() => {
    if (useContainerWidth) {
      const el = containerRef.current;
      if (!el) return;

      const checkSize = () => setContainerWidth(el.offsetWidth);
      checkSize();
      const observer = new ResizeObserver(checkSize);
      observer.observe(el);
      return () => observer.disconnect();
    }

    const checkSize = () => setContainerWidth(window.innerWidth);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [useContainerWidth]);

  useLayoutEffect(() => {
    if (mobile || medium) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [mobile, medium]);

  useEffect(() => {
    let innerRaf = 0;
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => setNavTransitionsEnabled(true));
    });
    return () => {
      cancelAnimationFrame(outerRaf);
      if (innerRaf) cancelAnimationFrame(innerRaf);
    };
  }, []);

  const handleItemSelect = (e: CustomEvent<{ value: string }>) => {
    onMenuItemSelect?.(e);
    if (e.detail?.value && mobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const useTargetContentMargin = !mobile;

  const railWidthClass = sidebarOpen
    ? 'w-64 min-w-64 max-w-64'
    : 'w-16 min-w-16 max-w-16';

  const visibility = mobile
    ? {
        mainMenu: true,
        user: true,
        apps: false,
        help: false,
        notifications: false,
        search: false,
        searchInput: false,
        ai: false,
      }
    : { ...DEFAULT_NAVBAR_VISIBILITY, ...navbarVisibility };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    onMainMenuToggle?.();
  };

  const navbarChrome = renderNavbar ? (
    renderNavbar({ mobile, sidebarOpen, toggleSidebar })
  ) : (
    <ModusWcNavbar
      mainMenuOpen={false}
      condensed={mobile}
      visibility={visibility}
      onMainMenuOpenChange={toggleSidebar}
      customClass="sticky top-0 z-[120] flex-shrink-0"
    >
      {navbarStart ? <div slot="start">{navbarStart}</div> : null}
      {navbarCenter ? (
        <div slot="center" hidden={mobile} className="app-shell-navbar-center">
          {navbarCenter}
        </div>
      ) : null}
      {navbarEnd ? <div slot="end">{navbarEnd}</div> : null}
    </ModusWcNavbar>
  );

  return (
    <div
      ref={containerRef}
      className={`app-shell-layout flex flex-col flex-1 min-h-0 bg-[var(--modus-wc-color-base-page)] overflow-hidden relative isolate ${className}`}
      data-mobile={mobile}
      data-layout={mobile ? 'mobile' : desktop ? 'desktop' : 'tablet'}
      data-side-nav-expanded={sidebarOpen && !mobile ? true : undefined}
      data-sidebar-open={sidebarOpen ? true : undefined}
      data-nav-transitions={navTransitionsEnabled ? 'true' : undefined}
    >
      {navbarChrome}

      <div className="app-shell-layout-body flex flex-1 overflow-hidden relative min-h-0">
        {sidebarOpen && mobile ? (
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            role="presentation"
          >
            <button
              type="button"
              aria-label="Close sidebar"
              className="relative h-full w-full min-h-0 bg-black/50 pointer-events-auto border-0 p-0"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        ) : null}

        <div
          className={`${
            mobile
              ? sidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full hidden'
              : 'translate-x-0'
          } app-shell-side-rail absolute left-0 top-0 z-[130] h-full ${
            navTransitionsEnabled
              ? 'transition-transform duration-300 ease-in-out'
              : ''
          } ${railWidthClass}`}
        >
          <ModusWcSideNavigation
            key={mobile ? 'overlay' : 'push'}
            expanded={sidebarOpen}
            maxWidth="256px"
            mode={mobile ? 'overlay' : 'push'}
            targetContent={
              useTargetContentMargin ? `#${contentId}` : undefined
            }
            collapseOnClickOutside={mobile}
            customClass="h-full flex flex-col side-nav-page-bg"
            onExpandedChange={(e: CustomEvent<boolean>) => {
              setSidebarOpen(e.detail);
            }}
          >
            <ModusWcMenu size="md">
              {menuItems.map((item) => (
                <ModusWcMenuItem
                  key={item.value}
                  label={item.label}
                  value={item.value}
                  selected={selectedMenuItem === item.value}
                  onItemSelect={handleItemSelect}
                >
                  {item.icon ? (
                    <ModusWcIcon
                      slot="start-icon"
                      name={item.icon}
                      size="md"
                      decorative
                    />
                  ) : null}
                </ModusWcMenuItem>
              ))}
            </ModusWcMenu>
          </ModusWcSideNavigation>
        </div>

        <main
          id={contentId}
          className={`app-shell-layout-content flex-1 flex flex-col overflow-auto px-4 pt-2 pb-4 sm:px-6 sm:pt-3 sm:pb-6 space-y-4 bg-[var(--modus-wc-color-base-page)] relative z-10 min-w-0 min-h-0 ${contentClassName}`}
        >
          {constrainMainContentWidth ? (
            <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-1 flex-col min-h-0 space-y-4">
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default AppShellLayout;
