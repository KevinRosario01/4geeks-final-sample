"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook

const supabase = createClient();

export default function AddProfessorRatingPage({ params: { id } }) {
  const { user } = useAuth(); // Get the logged-in user
  const [professor, setProfessor] = useState(null);
  const [universityName, setUniversityName] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [qualityRating, setQualityRating] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(0);
  const [wouldTakeAgain, setWouldTakeAgain] = useState(null);
  const [forCredit, setForCredit] = useState(null);
  const [textbookRequired, setTextbookRequired] = useState(null);
  const [attendanceMandatory, setAttendanceMandatory] = useState(null);
  const [gradeReceived, setGradeReceived] = useState("");
  const [tags, setTags] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const router = useRouter();

  const availableTags = [
    "Tough Grader",
    "Get Ready To Read",
    "Participation Matters",
    "Extra Credit",
    "Group Projects",
    "Amazing Lectures",
    "Clear Grading Criteria",
    "Gives Good Feedback",
    "Inspirational",
    "Lots Of Homework",
    "Hilarious",
    "Beware Of Pop Quizzes",
    "So Many Papers",
    "Caring",
    "Respected",
    "Lecture Heavy",
    "Test Heavy",
    "Graded By Few Things",
    "Accessible Outside Class",
    "Online Savvy",
  ];

  useEffect(() => {
    const fetchProfessorData = async () => {
      if (!id) return;

      // Fetch professor data
      const { data: professorData, error: professorError } = await supabase
        .from("professors")
        .select("*")
        .eq("professor_id", id)
        .single();

      if (professorError) {
        console.error("Error fetching professor data:", professorError);
        return;
      }

      setProfessor(professorData);

      // Fetch university name based on university_id
      const { data: universityData, error: universityError } = await supabase
        .from("universities")
        .select("name")
        .eq("university_id", professorData.university_id)
        .single();

      if (universityError) {
        console.error("Error fetching university name:", universityError);
        return;
      }

      setUniversityName(universityData.name);

      // Fetch related courses based on university_id
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("course_id, course_code")
        .eq("university_id", professorData.university_id);

      if (coursesError) {
        console.error("Error fetching courses:", coursesError);
        return;
      }

      setCourses(coursesData);
    };

    fetchProfessorData();
  }, [id]);

  const handleTagSelect = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 3) {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const { error } = await supabase.from("reviews").insert([
      {
        professor_id: id,
        course_id: selectedCourse,
        rating: qualityRating,
        difficulty: difficultyRating,
        would_take_again: wouldTakeAgain,
        for_credit: forCredit,
        textbook_required: textbookRequired,
        attendance: attendanceMandatory,
        grade_received: gradeReceived,
        tags: tags,
        text_review: reviewText,
        user_id: user.id, // Include the user_id of the person leaving the review
      },
    ]);

    if (error) {
      console.error("Error submitting review:", error);
    } else {
      router.push(`/professor/${id}`);
    }
  };

  if (!professor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-100 p-6">
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-black">
            Rate: {professor.first_name} {professor.last_name}
          </h1>
          <p className="text-black mb-4">
            {professor.department} at {universityName}
          </p>

          {/* Course Selection */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Select Course Code *
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-3 mt-2 border rounded text-black"
            >
              <option value="" className="text-black">
                Select Course Code
              </option>
              {courses.map((course) => (
                <option
                  key={course.course_id}
                  value={course.course_id}
                  className="text-black"
                >
                  {course.course_code}
                </option>
              ))}
            </select>
            <div className="flex items-center mt-2">
              <input type="checkbox" id="online-course" />
              <label htmlFor="online-course" className="ml-2 text-black">
                This is an online course
              </label>
            </div>
          </div>

          {/* Quality Rating */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Rate your professor *
            </label>
            <div className="flex justify-between text-black">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    name="quality-rating"
                    value={num}
                    checked={qualityRating === num}
                    onChange={() => setQualityRating(num)}
                    className="mr-2"
                  />
                  {num}
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Rating */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              How difficult was this professor? *
            </label>
            <div className="flex justify-between text-black">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    name="difficulty-rating"
                    value={num}
                    checked={difficultyRating === num}
                    onChange={() => setDifficultyRating(num)}
                    className="mr-2"
                  />
                  {num}
                </label>
              ))}
            </div>
          </div>

          {/* Would Take Again */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Would you take this professor again? *
            </label>
            <div className="flex items-center space-x-4 mt-2 text-black">
              <label>
                <input
                  type="radio"
                  name="would-take-again"
                  value="Yes"
                  checked={wouldTakeAgain === "Yes"}
                  onChange={() => setWouldTakeAgain("Yes")}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="would-take-again"
                  value="No"
                  checked={wouldTakeAgain === "No"}
                  onChange={() => setWouldTakeAgain("No")}
                />
                No
              </label>
            </div>
          </div>

          {/* For Credit */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Was this class taken for credit? *
            </label>
            <div className="flex items-center space-x-4 mt-2 text-black">
              <label>
                <input
                  type="radio"
                  name="for-credit"
                  value="Yes"
                  checked={forCredit === "Yes"}
                  onChange={() => setForCredit("Yes")}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="for-credit"
                  value="No"
                  checked={forCredit === "No"}
                  onChange={() => setForCredit("No")}
                />
                No
              </label>
            </div>
          </div>

          {/* Textbook Required */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Did this professor use textbooks? *
            </label>
            <div className="flex items-center space-x-4 mt-2 text-black">
              <label>
                <input
                  type="radio"
                  name="textbook-required"
                  value="Yes"
                  checked={textbookRequired === "Yes"}
                  onChange={() => setTextbookRequired("Yes")}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="textbook-required"
                  value="No"
                  checked={textbookRequired === "No"}
                  onChange={() => setTextbookRequired("No")}
                />
                No
              </label>
            </div>
          </div>

          {/* Attendance Mandatory */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Was attendance mandatory? *
            </label>
            <div className="flex items-center space-x-4 mt-2 text-black">
              <label>
                <input
                  type="radio"
                  name="attendance-mandatory"
                  value="Yes"
                  checked={attendanceMandatory === "Yes"}
                  onChange={() => setAttendanceMandatory("Yes")}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="attendance-mandatory"
                  value="No"
                  checked={attendanceMandatory === "No"}
                  onChange={() => setAttendanceMandatory("No")}
                />
                No
              </label>
            </div>
          </div>

          {/* Grade Received */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Select grade received *
            </label>
            <select
              value={gradeReceived}
              onChange={(e) => setGradeReceived(e.target.value)}
              className="w-full p-3 mt-2 border rounded text-black"
            >
              <option value="" className="text-black">
                Select Grade
              </option>
              <option value="A" className="text-black">
                A
              </option>
              <option value="B" className="text-black">
                B
              </option>
              <option value="C" className="text-black">
                C
              </option>
              <option value="D" className="text-black">
                D
              </option>
              <option value="F" className="text-black">
                F
              </option>
            </select>
          </div>

          {/* Select Tags */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Select up to 3 tags
            </label>
            <div className="flex flex-wrap">
              {availableTags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`cursor-pointer px-3 py-2 m-1 rounded-lg ${
                    tags.includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Write a Review */}
          <div className="mb-6">
            <label className="text-xl font-bold text-black">
              Write a Review *
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 mt-2 border rounded text-black"
              rows="5"
              maxLength="350"
              placeholder="What do you want other students to know about this professor?"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Rating
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
