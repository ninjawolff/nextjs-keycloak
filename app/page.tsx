'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="p-6 text-center">
      {session ? (
        <>
          <h1 className="text-xl mb-4">
            Hello, {session.user?.name}
          </h1>
          <p>{session.user?.id}</p>
          <p>{session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn('keycloak')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In with Keycloak
        </button>
      )}
    </div>
  );
}
