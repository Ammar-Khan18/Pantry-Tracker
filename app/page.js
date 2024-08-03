'use client';

import LandingPage from './landing/page.js';
import SignInPage from './signin/page.js';
import PantryPage from './pantry/page.js';
import SignUpPage from './signup/page.js';
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();

  if (pathname === '/signin') {
    return <SignInPage />;
  }

  if (pathname === '/signup') {
    return <SignUpPage />;
  }

  if (pathname === '/pantry') {
    return <PantryPage />;
  }

  return <LandingPage />;
};

export default Page;