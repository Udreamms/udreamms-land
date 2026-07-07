'use client';

import { useEffect } from 'react';
import { usePortal } from '../PortalContext';
import PlansGrid from '../components/PlansGrid';

export default function VisaEstudiantePage() {
  const { setActiveTopSection } = usePortal();

  useEffect(() => {
    setActiveTopSection('visa-estudiante');
  }, [setActiveTopSection]);

  return <PlansGrid variant="estudiante" />;
}
