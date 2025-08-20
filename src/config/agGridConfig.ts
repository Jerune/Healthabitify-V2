'use client';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useEffect } from 'react';

// AG Grid Module Registration Component
export default function AGGridModuleRegistry() {
  useEffect(() => {
    // Register all community modules on the client side
    ModuleRegistry.registerModules([AllCommunityModule]);
  }, []);

  return null; // This component doesn't render anything
}
