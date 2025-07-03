import { PropsWithChildren } from 'react';
import { GuestRoute } from '@client/layouts';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-(--bg-color) w-full min-h-full flex items-center justify-center max-md:items-start max-md:h-full max-md:overflow-y-auto">
      <main className="bg-(--secondary-bg-color) rounded-2xl p-10 shadow-2xl max-w-full max-md:h-auto max-md:min-h-full max-md:min-w-full max-md:rounded-none max-sm:p-1">
        <GuestRoute>{children}</GuestRoute>
      </main>
    </div>
  );
};

export default AuthLayout;
