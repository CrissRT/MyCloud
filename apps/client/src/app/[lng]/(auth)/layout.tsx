import { PropsWithChildren } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-(--bg-color) w-full h-full flex items-center justify-center">
      <main className="bg-(--secondary-bg-color) rounded-2xl p-10 shadow-2xl max-w-full max-md:h-full max-md:rounded-none">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
