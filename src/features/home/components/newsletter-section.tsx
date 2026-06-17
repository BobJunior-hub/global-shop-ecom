"use client";

import { useState } from "react";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleAction = async (formData: FormData) => {
    const val = formData.get("email") as string;
    if (!val) return;
    // Replace with real API call when backend is ready
    await new Promise((r) => setTimeout(r, 500));
    setEmail("");
    setSubmitted(true);
  };

  return (
    <section className="">
   
    </section>
  );
};