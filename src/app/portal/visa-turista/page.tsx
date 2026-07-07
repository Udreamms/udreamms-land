'use client';

import { useEffect } from 'react';
import { usePortal } from '../PortalContext';
import PlansGrid from '../components/PlansGrid';

export default function VisaTuristaPage() {
  const { setActiveTopSection } = usePortal();

  useEffect(() => {
    setActiveTopSection('visa-turista');
  }, [setActiveTopSection]);

  return <PlansGrid variant="turista" />;
}
