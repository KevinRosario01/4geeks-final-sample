"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function AddProfessorPage() {
  const [schoolName, setSchoolName] = useState("");
  const [schoolId, setSchoolId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const handleSchoolNameChange = async (e) => {
    setSchoolName(e.target.value);

    if (e.target.value.length > 2) {
      const { data, error } = await supabase
        .from("universities")
        .select("university_id, name")
        .ilike("name", `%${e.target.value}%`);

      if (error) {
        console.error("Error fetching schools:", error);
      } else {
        setSearchResults(data);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSchoolSelect = (school) => {
    setSchoolName(school.name);
    setSchoolId(school.university_id);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must accept the terms and conditions to proceed.");
      return;
    }

    if (schoolId && firstName && lastName && department) {
      const { error } = await supabase.from("professors").insert([
        {
          university_id: schoolId,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          department: department,
        },
      ]);

      if (error) {
        console.error("Error adding professor:", error);
      } else {
        // Redirect to the thank you page after successful submission
        router.push("/add/professor/success/");
      }
    } else {
      alert("Please fill out all required fields.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-100 p-6 flex flex-col items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-bold text-black mb-4">Add a Professor</h1>
          <p className="text-gray-600 mb-6 text-black">
            Please use the search bar above to make sure that the professor does not already exist at this school.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="school" className="block text-sm font-medium text-black">
                Name of School
              </label>
              <input
                type="text"
                id="school"
                value={schoolName}
                onChange={handleSchoolNameChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              />
              {searchResults.length > 0 && (
                <ul className="bg-white border border-gray-300 rounded-lg mt-2 text-black">
                  {searchResults.map((school) => (
                    <li
                      key={school.university_id}
                      className="p-2 cursor-pointer hover:bg-gray-200 text-black"
                      onClick={() => handleSchoolSelect(school)}
                    >
                      {school.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-black">
                Professor's First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="middleName" className="block text-sm font-medium text-black">
                Professor's Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-black">
                Professor's Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-black">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              >
                <option value="" disabled className="text-black">
                  Select Department
                </option>
                <option value="Computer Science" className="text-black">Computer Science</option>
                <option value="Mathematics" className="text-black">Mathematics</option>
                <option value="Physics" className="text-black">Physics</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="terms" className="flex items-center text-black">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mr-2"
                  required
                />
                I agree to the Terms of Use and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full text-black"
            >
              Add Professor
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
