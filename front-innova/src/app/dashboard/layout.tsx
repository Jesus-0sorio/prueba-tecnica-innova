"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ExtendedUser = {
  email?: string | null;
  image?: string | null;
  role?: string | null;
  status?: string | null;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const user = session?.user as ExtendedUser;
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const isAdmin = user?.role === "administrador";

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <main className="h-screen w-screen">
      <nav className="border-b-2 text-black flex justify-between py-6 px-16">
        <h1 className="text-2xl">Prueba Tecnica Fullstack</h1>
        <div>
          {isAdmin && (
            <>
              <Link href="/dashboard">
                <span className="mx-2">Proyectos</span>
              </Link>
              <Link href="/dashboard/tasks">
                <span className="mx-2">Tareas</span>
              </Link>
            </>
          )}
          <button onClick={handleLogout}>
            <span className="mx-2" onClick={handleLogout}>
              Cerrar sesion
            </span>
          </button>
        </div>
      </nav>

      {children}
    </main>
  );
};

export default Layout;
