"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/shop'); // go to shop after refresh
  }, []);

  return <div>Processing...</div>; // Optional loader
}
