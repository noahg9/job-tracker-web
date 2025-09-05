import { useState, useEffect } from "react";

export const useSWAAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/.auth/me");
        if (!res.ok) throw new Error("Not logged in");

        const data = await res.json();
        setUser(data.clientPrincipal);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
