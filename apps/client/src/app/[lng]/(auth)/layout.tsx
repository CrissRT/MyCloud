import { PropsWithChildren } from 'react';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-(--bg-color) w-full h-full flex items-center justify-center max-md:px-5">
      <main className="bg-(--secondary-bg-color) rounded-2xl p-10 shadow-2xl max-w-full max-md:h-full">{children}</main>
    </div>
  );
};

export default AuthLayout;
