import { PropsWithChildren } from 'react';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return <section className="bg-(--bg-color)">{children}</section>;
};

export default DashboardLayout;
