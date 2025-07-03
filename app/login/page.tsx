import { Suspense } from 'react';
import { LoginPageContent } from '@/components/auth/login-page-content';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
