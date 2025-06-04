import { createContext, useContext, useMemo } from 'react';

const WardContext = createContext();

export function WardProvider({ children, wardId }) {
  // Use our custom hook to manage all ward data
  const wardData = wardData(wardId);

  // Memoize the context value to optimize performance
  const contextValue = useMemo(() => ({
    ...wardData,
    wardId
  }), [wardData, wardId]);

  return (
    <WardContext.Provider value={contextValue}>
      {children}
    </WardContext.Provider>
  );
}

// Custom hook for consuming the context
export function useWard() {
  const context = useContext(WardContext);
  if (context === undefined) {
    throw new Error('useWard must be used within a WardProvider');
  }
  return context;
}