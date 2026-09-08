"use client";

import { useEffect, useState } from "react";

interface CreditsResponse {
  authenticated: boolean;
  bypass?: boolean;
  balance: number | null;
  guestRemaining: number | null;
}

export function CreditBalance() {
  const [data, setData] = useState<CreditsResponse | null>(null);

  useEffect(() => {
    fetch("/api/credits")
      .then((res) => (res.ok ? res.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <span className="font-mono text-xs text-muted">credits --</span>;
  }

  if (data.bypass) {
    return (
      <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-accent-2">
        test mode
      </span>
    );
  }

  if (data.authenticated) {
    return (
      <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-accent">
        {data.balance} credits
      </span>
    );
  }

  return (
    <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-accent-2">
      {data.guestRemaining} free left
    </span>
  );
}
