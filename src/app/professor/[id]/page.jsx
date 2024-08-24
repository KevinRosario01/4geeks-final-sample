"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // for programmatic navigation if needed
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function ProfessorPage({ params: { id } }) {
  const [professor, setProfessor] = useState(null);
  const [universityName, setUniversityName] = useState("");
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]); // State for filtered reviews
  const [courses, setCourses] = useState({}); // Store course data in an object keyed by course_id
  const [tags, setTags] = useState([]); // Store tags data
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("All courses"); // State for selected course
  const [overallRating, setOverallRating] = useState(null);
  const [difficultyLevel, setDifficultyLevel] = useState(null);
  const [wouldTakeAgainPercentage, setWouldTakeAgainPercentage] =
    useState(null);
  const router = useRouter();

  // Parse tags safely
  function parseTags(tags) {
    if (!tags) return [];
    try {
      return typeof tags === "string" ? JSON.parse(tags) : tags;
    } catch (e) {
      console.error("Error parsing tags:", e);
      return [];
    }
  }

  useEffect(() => {
    const fetchProfessorData = async () => {
      if (!id) return;

      setLoading(true);

      // Fetch professor data
      const { data: professorData, error: professorError } = await supabase
        .from("professors")
        .select("*")
        .eq("professor_id", id)
        .single();

      if (professorError) {
        console.error("Error fetching professor data:", professorError);
      } else {
        setProfessor(professorData);

        // Fetch university name based on university_id
        const { data: universityData, error: universityError } = await supabase
          .from("universities")
          .select("name")
          .eq("university_id", professorData.university_id)
          .single();

        if (universityError) {
          console.error("Error fetching university name:", universityError);
        } else {
          setUniversityName(universityData.name);
        }

        // Fetch reviews related to the professor
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .eq("professor_id", id)
          .order("created_at", { ascending: false }); // Sort reviews by date in descending order

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        } else {
          // Parse tags in each review
          const parsedReviews = reviewsData.map((review) => ({
            ...review,
            tags: parseTags(review.tags),
          }));
          setReviews(parsedReviews);
          setFilteredReviews(parsedReviews); // Set initial filtered reviews

          // Calculate aggregate values
          const totalReviews = parsedReviews.length;
          if (totalReviews > 0) {
            const totalRating = parsedReviews.reduce(
              (sum, review) => sum + (review.rating || 0),
              0
            );
            const totalDifficulty = parsedReviews.reduce(
              (sum, review) => sum + (review.difficulty || 0),
              0
            );
            const totalWouldTakeAgain = parsedReviews.reduce(
              (sum, review) => sum + (review.would_take_again ? 1 : 0),
              0
            );

            setOverallRating((totalRating / totalReviews).toFixed(1));
            setDifficultyLevel((totalDifficulty / totalReviews).toFixed(1));
            setWouldTakeAgainPercentage(
              ((totalWouldTakeAgain / totalReviews) * 100).toFixed(0)
            );
          } else {
            setOverallRating("N/A");
            setDifficultyLevel("N/A");
            setWouldTakeAgainPercentage("N/A");
          }

          // Extract and count tags from reviews
          const tagCounts = {};
          parsedReviews.forEach((review) => {
            if (review.tags) {
              review.tags.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            }
          });

          // Sort tags by frequency and take the top ones
          const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map((tag) => tag[0]);

          setTags(sortedTags);

          // Fetch related courses based on course_id in reviews
          const courseIds = parsedReviews.map((review) => review.course_id);
          const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select("*")
            .in("course_id", courseIds);

          if (coursesError) {
            console.error("Error fetching courses:", coursesError);
          } else {
            const coursesMap = {};
            coursesData.forEach((course) => {
              coursesMap[course.course_id] = course;
            });
            setCourses(coursesMap);
          }
        }
      }

      setLoading(false);
    };

    fetchProfessorData();
  }, [id]);

  // Handle course selection change
  useEffect(() => {
    if (selectedCourse === "All courses") {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(
        reviews.filter(
          (review) => courses[review.course_id]?.course_code === selectedCourse
        )
      );
    }
  }, [selectedCourse, reviews, courses]);

  if (loading || !professor) {
    return <div>Loading...</div>;
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-100 p-6">
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black">
                {professor.first_name} {professor.last_name}
              </h1>
              <p className="text-gray-600">
                Professor in the {professor.department} department at{" "}
                {universityName} {/* Display university name */}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {overallRating}/5 {/* Display aggregated overall rating */}
              </p>
              <p className="text-gray-600">{reviews.length} reviews</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">
                {wouldTakeAgainPercentage}%{" "}
                {/* Display aggregated would take again percentage */}
              </p>
              <p className="text-gray-600">Would take again</p>
              <p className="text-xl font-bold text-red-600">
                {difficultyLevel} {/* Display aggregated difficulty level */}
              </p>
              <p className="text-gray-600">Level of difficulty</p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Rating Distribution
              </h2>
              {/* Placeholder for rating distribution chart */}
              <div className="bg-gray-200 p-4 rounded-lg h-24"></div>
            </div>
            <div className="flex-grow ml-6">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Professor's Top Tags
              </h2>
              {/* Display top tags from the reviews table */}
              <div className="flex flex-wrap">
                {tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600"></p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => router.push(`/add/professor-raiting/${id}`)} // Updated to navigate to the rating page
            >
              Rate
            </button>
            <button className="px-4 py-2 border border-gray-600 text-gray-600 bg-white rounded-lg hover:bg-gray-200">
              Compare
            </button>
            <button className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200">
              I'm Professor {professor.last_name}
            </button>
          </div>

          <hr className="my-6" />

          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">
              Student Reviews
            </h2>
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-black">
                {filteredReviews.length} Student Reviews
              </p>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg text-black bg-white"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option className="text-black">All courses</option>
                {Object.values(courses).map((course) => (
                  <option key={course.course_id} className="text-black">
                    {course.course_code}
                  </option>
                ))}
              </select>
            </div>

            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow mb-4 flex"
                >
                  {/* Quality and Difficulty Ratings */}
                  <div className="flex-shrink-0 text-center mr-6">
                    <div className="bg-green-200 p-4 rounded-lg mb-2">
                      <p className="text-lg font-bold text-green-600">
                        QUALITY
                      </p>
                      <p className="text-2xl font-bold text-black">
                        {review.rating ? review.rating.toFixed(1) : ""}
                      </p>
                    </div>
                    <div className="bg-red-200 p-4 rounded-lg">
                      <p className="text-lg font-bold text-red-600">
                        DIFFICULTY
                      </p>
                      <p className="text-2xl font-bold text-black">
                        {review.difficulty ? review.difficulty.toFixed(1) : ""}
                      </p>
                    </div>
                  </div>

                  {/* Course and Review Details */}
                  <div className="flex-grow">
                    <p className="text-lg font-bold text-black">
                      {courses[review.course_id]?.course_code ||
                        "Unknown Course"}
                    </p>
                    <p className="text-sm text-black">
                      For Credit:{" "}
                      <span className="font-bold text-black">
                        {review.for_credit ? "Yes" : "No"}
                      </span>
                      {"  "}Attendance:{" "}
                      <span className="font-bold text-black">
                        {review.attendance ? "Mandatory" : "Not Mandatory"}
                      </span>
                      {"  "}Grade:{" "}
                      <span className="font-bold text-black">
                        {review.grade_received || ""}
                      </span>{" "}
                      Textbook:{" "}
                      <span className="font-bold text-black">
                        {review.textbook_required ? "Yes" : "No"}
                      </span>
                    </p>
                    <p className="text-sm text-black">
                      {formatDate(review.created_at) || ""}
                    </p>
                    <p className="mt-2 text-black">
                      {review.text_review || ""}
                    </p>
                    <div className="mt-2 flex flex-wrap space-x-2">
                      {Array.isArray(review.tags) && review.tags.length > 0 ? (
                        review.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-lg"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-600">No tags available</span>
                      )}
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <p className="text-sm text-black">Helpful</p>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          padding: 5,
                          margin: 0,
                          border: 0,
                        }}
                        className="text-gray-600 hover:text-black text-xl"
                      >
                        <i className="fa-regular fa-thumbs-up text-gray-600 hover:text-black"></i>
                      </button>

                      <span className="text-sm text-black">0</span>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          padding: 5,
                          margin: 0,
                          border: 0,
                        }}
                        className="text-gray-600 hover:text-black text-xl"
                      >
                        <i className="fa-regular fa-thumbs-down text-gray-600 hover:text-black"></i>
                      </button>
                      <span className="text-sm text-black">0</span>
                    </div>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        padding: 5,
                        margin: 0,
                        border: 0,
                      }}
                      className="text-gray-600 hover:text-black text-xl"
                    >
                      <i className="fa-regular fa-bookmark text-gray-600 hover:text-black"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black">No reviews available.</p>
            )}
          </div>

          {/* Placeholder for Similar Professors section */}
          <hr className="my-6" />
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold text-black mb-4">
              Check out Similar Professors in the Computer Science Department
            </h2>
            <div className="flex space-x-4">
              {["Carlos Guerrero", "Cesar Zapata", "Christopher Marte"].map(
                (prof, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow text-center"
                  >
                    <p className="text-lg font-bold text-black">{prof}</p>
                    <p className="text-blue-600 text-xl">5.0</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
