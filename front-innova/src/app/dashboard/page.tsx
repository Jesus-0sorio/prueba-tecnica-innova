"use client";

import AdminProjectList from "@/ui/admin/projects/AdminProjectList";
import UserTaskList from "@/ui/user/tasks/UserTasksList.view";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ExtendedUser = {
  email?: string | null;
  image?: string | null;
  role?: string | null;
  status?: string | null;
};

const Page = () => {
  const { data: session, status} = useSession();
  const user = session?.user as ExtendedUser;
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/login"); 
    return null
  }
  
  const isAdmin = user?.role === "administrador";

  return (
    <>
      {isAdmin && <AdminProjectList />}
      {!isAdmin && <UserTaskList />}
    </>
  );
};

export default Page;
