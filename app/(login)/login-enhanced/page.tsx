import { Suspense } from 'react';
import { EnhancedLogin } from '../components/enhanced-login';

export default function LoginPage() {
  return (
    <Suspense>
      <EnhancedLogin />
    </Suspense>
  );
}
