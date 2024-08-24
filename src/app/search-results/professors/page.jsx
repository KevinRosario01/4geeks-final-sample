"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function ProfessorSearchResults() {
  const [professors, setProfessors] = useState([]);
  const [universityName, setUniversityName] = useState("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProfessorsAndUniversity = async () => {
      setLoading(true);

      const universityId = searchParams.get("university");
      const professorName = searchParams.get("professor");

      if (universityId) {
        const { data: universityData, error: universityError } = await supabase
          .from("universities")
          .select("name")
          .eq("university_id", universityId)
          .single();

        if (universityError) {
          console.error("Error fetching university name:", universityError);
        } else {
          setUniversityName(universityData.name);
        }

        if (professorName) {
          const { data: professorsData, error: professorError } = await supabase
            .from("professors")
            .select(
              "professor_id, first_name, last_name, department"
            )
            .eq("university_id", universityId)
            .or(`first_name.ilike.%${professorName}%,last_name.ilike.%${professorName}%`);

          if (professorError) {
            console.error("Error fetching professors:", professorError);
          } else {
            const professorIds = professorsData.map((prof) => prof.professor_id);

            const { data: reviewsData, error: reviewsError } = await supabase
              .from("reviews")
              .select("professor_id, rating, difficulty, would_take_again")
              .in("professor_id", professorIds);

            if (reviewsError) {
              console.error("Error fetching reviews:", reviewsError);
            } else {
              const aggregatedProfessors = professorsData.map((prof) => {
                const professorReviews = reviewsData.filter(
                  (review) => review.professor_id === prof.professor_id
                );

                const totalReviews = professorReviews.length;
                const totalRating = professorReviews.reduce(
                  (sum, review) => sum + (review.rating || 0),
                  0
                );
                const totalDifficulty = professorReviews.reduce(
                  (sum, review) => sum + (review.difficulty || 0),
                  0
                );
                const totalWouldTakeAgain = professorReviews.reduce(
                  (sum, review) => sum + (review.would_take_again ? 1 : 0),
                  0
                );

                const overallRating =
                  totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "N/A";
                const difficultyLevel =
                  totalReviews > 0 ? (totalDifficulty / totalReviews).toFixed(1) : "N/A";
                const wouldTakeAgainPercentage =
                  totalReviews > 0
                    ? ((totalWouldTakeAgain / totalReviews) * 100).toFixed(0)
                    : "N/A";

                return {
                  ...prof,
                  full_name: `${prof.last_name}, ${prof.first_name}`,
                  overallRating,
                  difficultyLevel,
                  wouldTakeAgainPercentage,
                  ratingCount: totalReviews,
                };
              });

              setProfessors(aggregatedProfessors);
            }
          }
        }
      }

      setLoading(false);
    };

    fetchProfessorsAndUniversity();
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
              {professors.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Professor Results</h2>
                  <ul className="space-y-4">
                    {professors.map((professor) => (
                      <li
                        key={professor.professor_id}
                        className="bg-white p-4 rounded-lg shadow-lg flex items-center"
                      >
                        <div className="flex-shrink-0 bg-green-200 rounded-lg p-4 text-center mr-4">
                          <div className="text-2xl font-bold text-black">
                            {professor.overallRating}
                          </div>
                          <div className="text-sm text-gray-600">
                            {professor.ratingCount} ratings
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-black text-xl font-bold">
                            {professor.full_name || "Professor Name"}
                          </h3>
                          <p className="text-gray-700">
                            {professor.department || "Department Name"}
                          </p>
                          <p className="text-gray-500">
                            {universityName || "University Name"}
                          </p>
                          <div className="mt-2">
                            <span className="font-bold text-black">
                              {professor.wouldTakeAgainPercentage}%
                            </span>{" "}
                            <span className="text-gray-600">
                              would take again |{" "}
                            </span>
                            <span className="font-bold text-black">
                              {professor.difficultyLevel}
                            </span>{" "}
                            <span className="text-gray-600">level of difficulty</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-auto">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => router.push(`/professor/${professor.professor_id}`)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h14M12 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
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
            <p className="text-lg text-gray-700">Don't see the professor you're looking for?</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => router.push('/add/professor')}
            >
              Add a Professor
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
