import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyCompany } from "../../../api/company";
import { createJob } from "../../../api/job";
import { getSkillSuggestions } from "../../../api/skill";

import {
  HiOutlineExclamationCircle,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineCurrencyRupee,
} from "react-icons/hi2";

const PostJob = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [skillInput, setSkillInput] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: [],
    location: "",
    salary: "",
    minExperience: "",
    maxExperience: "",
    expiryDate: "",
  });

  // Check company
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getMyCompany();

        setCompany(data);
      } catch {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch suggestions
  const handleSkillInputChange = async (e) => {
    const value = e.target.value;

    setSkillInput(value);

    setActiveSuggestion(-1);

    if (value.length < 2) {
      setSuggestions([]);

      setShowSuggestions(false);

      return;
    }

    const data = await getSkillSuggestions(value);

    setSuggestions(data);

    setShowSuggestions(true);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      setActiveSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (activeSuggestion >= 0) {
        selectSkill(suggestions[activeSuggestion].name);
      } else {
        addSkill();
      }
    }
  };

  // Add typed skill
  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (!formData.requiredSkills.includes(skillInput)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skillInput],
      });
    }

    setSkillInput("");

    setSuggestions([]);

    setShowSuggestions(false);
  };

  // Select suggestion
  const selectSkill = (skillName) => {
    if (!formData.requiredSkills.includes(skillName)) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skillName],
      });
    }

    setSkillInput("");

    setSuggestions([]);

    setShowSuggestions(false);

    setActiveSuggestion(-1);
  };

  const removeSkill = (index) => {
    const updated = formData.requiredSkills.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      requiredSkills: updated,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.requiredSkills.length === 0) {
      setError("Please add at least one required skill");

      return;
    }

    if (!formData.expiryDate) {
      setError("Expiry date is required");

      return;
    }

    try {
      const response = await createJob(formData);

      alert(response.message || "Job Posted Successfully");

      setFormData({
        title: "",
        description: "",
        requiredSkills: [],
        location: "",
        salary: "",
        minExperience: "",
        maxExperience: "",
        expiryDate: "",
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <HiOutlineExclamationCircle className="text-blue-600 text-xl" />

          <p className="text-gray-700">
            Please{" "}
            <span
              onClick={() => navigate("/company-profile")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              create your company profile
            </span>{" "}
            first before posting jobs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <HiOutlineBriefcase className="text-blue-600 text-3xl" />

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Post a New Job</h1>

          <p className="text-gray-500 text-sm">
            Create a job posting to find the right candidates
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6 border">
        <h2 className="font-semibold text-lg mb-4 text-gray-700">
          Job Details
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block font-medium text-sm mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>

            <input
              name="title"
              required
              onChange={handleChange}
              placeholder="e.g. Senior React Developer"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-sm mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>

            <textarea
              name="description"
              required
              rows="4"
              onChange={handleChange}
              placeholder="Describe job responsibilities..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Skills */}
          <div className="relative">
            <label className="block font-medium text-sm mb-1">
              Required Skills <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={handleSkillInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type skill and click Add"
                className="flex-1 border rounded-lg px-3 py-2"
              />

              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full bg-white border rounded-lg shadow mt-1 z-10 max-h-40 overflow-y-auto">
                {suggestions.map((skill, index) => (
                  <div
                    key={skill._id}
                    onClick={() => selectSkill(skill.name)}
                    className={`px-3 py-2 cursor-pointer ${
                      index === activeSuggestion
                        ? "bg-blue-100"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  onClick={() => removeSkill(index)}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                >
                  {skill} ×
                </span>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium text-sm mb-1">Location</label>

            <div className="flex items-center border rounded-lg px-3 py-2">
              <HiOutlineMapPin className="text-gray-400 mr-2" />

              <input
                name="location"
                onChange={handleChange}
                placeholder="City or Remote"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block font-medium text-sm mb-1">Salary</label>

            <div className="flex items-center border rounded-lg px-3 py-2">
              <HiOutlineCurrencyRupee className="text-gray-400 mr-2" />

              <input
                name="salary"
                onChange={handleChange}
                placeholder="5-10 LPA"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="minExperience"
              required
              placeholder="Min Experience"
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="number"
              name="maxExperience"
              required
              placeholder="Max Experience"
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          {/* Expiry */}
          <label className="block font-medium text-sm mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            required
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
