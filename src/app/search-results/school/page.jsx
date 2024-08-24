"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function SchoolSearchResults() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);

      const schoolName = searchParams.get("school");

      if (schoolName) {
        const { data, error } = await supabase
          .from("universities")
          .select("*")
          .ilike("name", `%${schoolName}%`);
        if (error) {
          console.error("Error fetching schools:", error);
        } else {
          setSchools(data);
        }
      }

      setLoading(false);
    };

    fetchSchools();
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-blue-200">
        <div className="container mx-auto p-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {schools.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">School Results</h2>
                  <ul>
                    {schools.map((school) => (
                      <li key={school.university_id} className="mb-2 p-4 border rounded-lg bg-white">
                        <h3 className="text-black text-xl font-bold">{school.name}</h3>
                        <p className="text-gray-600">{school.location}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No results found.</p>
              )}
            </>
          )}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700">Don't see the school you're looking for?</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => router.push('/add/school')}
            >
              Add a School
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
