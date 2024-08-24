"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to home page after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-100 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Thank You!</h1>
          <p className="text-gray-700 mb-6">
            Thank you for adding a university. Your submission will be under review to ensure it meets our standards.
          </p>
          <p className="text-gray-600">You will be redirected to the home page shortly.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
