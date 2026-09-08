import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) return null;

  return {
    id,
    email: session.user?.email ?? "",
    name: session.user?.name ?? null,
  };
}
