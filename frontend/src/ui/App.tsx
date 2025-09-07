import React, { useCallback, useState } from 'react';
import GoogleLoginButton from './components/GoogleLoginButton';
import { HttpAuthBackend } from '../infrastructure/http/HttpAuthBackend';
import { AuthenticateWithGoogle } from '../domain/auth/usecases/AuthenticateWithGoogle';
import type { Session } from '../domain/auth/Session';

const backend = new HttpAuthBackend();
const authUseCase = new AuthenticateWithGoogle(backend);

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredential = useCallback(async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const s = await authUseCase.execute(idToken);
      console.log('Sesión iniciadaaa:', s);
      setSession(s);
    } catch (e: any) {
      console.error('Error de autenticación:', e);
      setError(e?.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    await backend.logout();
    setSession(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
          <header className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acceso</h1>
            <p className="text-slate-500 text-sm">Autentícate con tu cuenta de Google</p>
          </header>

          {!session ? (
            <>
              <GoogleLoginButton
                onCredential={handleCredential}
                className="flex justify-center"
              />
              {loading && <p className="text-center text-sm text-slate-500">Validando…</p>}
              {error && (
                <p className="text-center text-sm text-red-600">
                  {error}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex flex-col items-center gap-2">
                {session.user.picture && (
                  <img
                    src={session.user.picture}
                    alt={session.user.name}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-slate-500 text-sm">{session.user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-slate-50 transition"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          <footer className="text-xs text-slate-400 text-center">
            Google Auth
          </footer>
        </div>
      </div>
    </div>
  );
}
