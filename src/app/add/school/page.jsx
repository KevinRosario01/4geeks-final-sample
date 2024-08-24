"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function AddSchoolPage() {
  const [schoolName, setSchoolName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must accept the terms and conditions to proceed.");
      return;
    }

    if (schoolName && country && state && city && email) {
      const location = `${city}, ${state}`;
      const { error } = await supabase.from("universities").insert([
        {
          name: schoolName,
          country: country,
          location: location,
          website: website,
          contact_email: email,
        },
      ]);

      if (error) {
        console.error("Error adding school:", error);
      } else {
        // Redirect to a thank you page or confirmation page after successful submission
        router.push("/add/school/success/");
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
          <h1 className="text-4xl font-bold text-black mb-4">Add a School</h1>
          <p className="text-gray-600 mb-6 text-black">
            Please use the search bar above to make sure that the school does not already exist.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="schoolName" className="block text-sm font-medium text-black">
                Name of School
              </label>
              <input
                type="text"
                id="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="country" className="block text-sm font-medium text-black">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              >
                <option value="" disabled className="text-black">
                  Select Country
                </option>
                <option value="USA" className="text-black">USA</option>
                <option value="Canada" className="text-black">Canada</option>
                <option value="UK" className="text-black">UK</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="state" className="block text-sm font-medium text-black">
                State/Province
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              >
                <option value="" disabled className="text-black">
                  Select State/Province
                </option>
                <option value="Florida" className="text-black">Florida</option>
                <option value="Ontario" className="text-black">Ontario</option>
                <option value="California" className="text-black">California</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-black">
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="website" className="block text-sm font-medium text-black">
                Website
              </label>
              <input
                type="url"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full bg-white text-black"
                required
              />
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
              Add School
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
