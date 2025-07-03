'use client';

import dayjs from 'dayjs';

import { useAuth } from '@client/hooks';

const Page = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>
        Welcome, {user?.firstName} {user?.lastName}!
      </h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Sex: {user?.sex}</p>
      <p>Birth date: {dayjs(user?.birthDate).format('MMMM D, YYYY')}</p>
    </div>
  );
};

export default Page;
