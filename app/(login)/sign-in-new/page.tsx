import { Suspense } from 'react';
import { Login } from '../login-new';

export default function NewSignInPage() {
  return (
    <Suspense>
      <Login mode="signin" />
    </Suspense>
  );
}
