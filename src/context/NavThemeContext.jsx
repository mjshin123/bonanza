import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NavThemeContext = createContext(null);

export function NavThemeProvider({ children }) {
  const [activeZones, setActiveZones] = useState(() => new Set());

  const setZoneActive = useCallback((key, isActive) => {
    setActiveZones((prev) => {
      const isCurrentlyActive = prev.has(key);
      if (isActive === isCurrentlyActive) return prev;
      const next = new Set(prev);
      if (isActive) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ dark: activeZones.size > 0, setZoneActive }), [activeZones, setZoneActive]);

  return <NavThemeContext.Provider value={value}>{children}</NavThemeContext.Provider>;
}

export function useNavTheme() {
  return useContext(NavThemeContext);
}
