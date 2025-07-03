'use client';

import { useAuth } from '@client/hooks';

const Page = () => {
  const { user } = useAuth();
  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }
  return (
    <div>
      <h1>
        Welcome, {user.firstName} {user.lastName}!
      </h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Sex: {user.sex}</p>
      <p>Birth date: {new Date(user.birthDate).toLocaleDateString()}</p>
    </div>
  );
};

export default Page;
