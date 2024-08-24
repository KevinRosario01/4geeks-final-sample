"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();
const SearchForm = dynamic(() => import("@/components/SearchForm"), { ssr: false });

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('first_name, role')
          .eq('email', authData.user.email)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
        } else {
          setUser({ ...authData.user, first_name: profileData.first_name, role: profileData.role });
        }
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} setUser={setUser} />

      <main className="flex-grow">
        <section className="bg-blue-200 py-12">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Rate and Review Your Professors</h1>
            <p className="text-xl mb-8">
              Find and review your professors to help others make informed decisions.
            </p>
            <SearchForm />
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Featured Professors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Professor John Doe</h3>
                <p className="text-gray-700">Department of Mathematics</p>
                <p className="mt-4 text-gray-600">
                  "Professor Doe is an excellent teacher who makes complex topics easy to understand."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Professor Jane Smith</h3>
                <p className="text-gray-700">Department of History</p>
                <p className="mt-4 text-gray-600">
                  "Professor Smith has a passion for history that makes every class engaging."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Professor Alice Johnson</h3>
                <p className="text-gray-700">Department of Chemistry</p>
                <p className="mt-4 text-gray-600">
                  "Professor Johnson's lectures are thorough and well-organized."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
