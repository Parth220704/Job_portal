import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { HiOutlineUser } from "react-icons/hi2";
import { getSkillSuggestions } from "../../../api/skill";
import { getMyProfile, updateProfile } from "../../../api/profile";
import toast from "react-hot-toast";
import {
  HiOutlineAcademicCap,
  HiOutlineTrash,
  HiOutlineBriefcase,
  HiOutlineArrowUpTray,
} from "react-icons/hi2";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    phone: "",
    city: "",
    gender: "",
    dob: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const [skills, setSkills] = useState([]);

  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [removeResume, setRemoveResume] = useState(false);

  /* ==============================
      LOAD PROFILE DATA
  ============================== */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();

        if (!data) return;

        setFormData({
          email: user?.email,
          name: user?.name,
          phone: data.phone || "",
          city: data.city || "",
          gender: data.gender || "",
          dob: data.DOB ? data.DOB.split("T")[0] : "",
        });

        setSummary(data.summary || "");
        setSkills(data.skills || []);
        setEducation(data.education || []);
        setExperience(data.experience || []);
        if (data.resumeUrl) {
          const displayName = data.resumeName || data.resumeUrl.split("/").pop();
          setResumeFile({ name: displayName, url: data.resumeUrl });
        } else {
          setResumeFile(null);
        }
      } catch (error) {
        console.log("Profile not found yet");
      }
    };

    fetchProfile();
  }, [user]);

  /* ==============================
      INPUT CHANGE
  ============================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ==============================
      SKILLS
  ============================== */

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

  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (!skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
    }

    setSkillInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const selectSkill = (skillName) => {
    if (!skills.includes(skillName)) {
      setSkills([...skills, skillName]);
    }

    setSkillInput("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);

    setSkills(updated);
  };

  /* ==============================
      EDUCATION
  ============================== */
  const handleEducationChange = (index, e) => {
    const updated = [...education];
    updated[index][e.target.name] = e.target.value;
    setEducation(updated);
  };

  const addEducation = () => {
    setEducation([...education, { degree: "", institute: "", year: "" }]);
  };
  const removeEducation = (index) => {
    const updated = education.filter((_, i) => i !== index);
    setEducation(updated);
  };

  /* ==============================
      EXPERIENCE
  ============================== */

  const addExperience = () => {
    setExperience([...experience, { companyName: "", role: "", years: "" }]);
  };

  const removeExperience = (index) => {
    const updated = experience.filter((_, i) => i !== index);
    setExperience(updated);
  };

  const handleExperienceChange = (index, e) => {
    const updated = [...experience];
    updated[index][e.target.name] = e.target.value;
    setExperience(updated);
  };

  /* ==============================
      RESUME
  ============================== */

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    setResumeFile(file);
    setRemoveResume(false);
  };

  const deleteResume = () => {
    setResumeFile(null);
    setRemoveResume(true);
    setSkills([]);
  };

  /* ==============================
      SAVE PROFILE
  ============================== */

  const handleSaveProfile = async () => {
    try {
      const form = new FormData();

      form.append("phone", formData.phone);
      form.append("city", formData.city);
      form.append("gender", formData.gender);
      form.append("DOB", formData.dob);
      form.append("summary", summary);

      form.append("skills", JSON.stringify(skills));
      form.append("education", JSON.stringify(education));
      form.append("experience", JSON.stringify(experience));

      if (resumeFile && resumeFile instanceof File) {
        form.append("resume", resumeFile);
      }
      form.append("removeResume", removeResume ? "true" : "false");

      const response = await updateProfile(form);
      const updatedProfile = response?.data;

      if (updatedProfile) {
        setFormData((prev) => ({
          ...prev,
          phone: updatedProfile.phone || "",
          city: updatedProfile.city || "",
          gender: updatedProfile.gender || "",
          dob: updatedProfile.DOB ? updatedProfile.DOB.split("T")[0] : "",
        }));

        setSummary(updatedProfile.summary || "");
        setSkills(updatedProfile.skills || []);
        setEducation(updatedProfile.education || []);
        setExperience(updatedProfile.experience || []);

        if (updatedProfile.resumeUrl) {
          const displayName = updatedProfile.resumeName || updatedProfile.resumeUrl.split("/").pop();
          setResumeFile({ name: displayName, url: updatedProfile.resumeUrl });
        } else {
          setResumeFile(null);
        }
      }

      setRemoveResume(false);
      toast.success(response?.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <HiOutlineUser size={24} className="text-green-600" />

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>

          <p className="text-gray-500 text-sm">
            Manage your personal information
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Personal Information
        </h2>

        <p className="text-gray-500 text-sm mb-4">Update your basic details</p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-600">Email</label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500 text-sm"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>

            <input
              type="text"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium text-gray-600">City</label>

            <input
              type="text"
              name="city"
              placeholder="Your city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-medium text-gray-600">Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Date of Birth
            </label>

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </form>
      </div>
      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Professional Summary
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          Write a brief summary about yourself
        </p>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          name="summary"
          rows="4"
          placeholder="A brief overview of your professional background, strengths, and career goals..."
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Skills</h2>

        <p className="text-gray-500 text-sm mb-4">
          Add your skills to get matched with relevant jobs
        </p>

        <div className="relative">
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={handleSkillInputChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g. React, Python, SQL..."
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />

            <button
              type="button"
              onClick={addSkill}
              className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
            >
              +
            </button>
          </div>

          {/* Suggestions */}
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
        </div>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              onClick={() => removeSkill(index)}
              className="bg-green-100 text-blue-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200"
            >
              {skill} ×
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <h2 className="text-lg font-semibold text-gray-800">Education</h2>

        <p className="text-gray-500 text-sm mb-4">
          Add your educational background
        </p>

        {/* Education Forms */}
        {education.map((edu, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 relative">
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute top-3 right-3 text-red-500"
            >
              <HiOutlineTrash />
            </button>

            {/* Degree */}
            <div className="mb-3">
              <label className="text-sm font-medium">Degree</label>
              <input
                name="degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, e)}
                placeholder="e.g. B.Tech in Computer Science"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
            </div>

            {/* Institute */}
            <div className="mb-3">
              <label className="text-sm font-medium">Institute</label>
              <input
                name="institute"
                value={edu.institute}
                onChange={(e) => handleEducationChange(index, e)}
                placeholder="e.g. IIT Bombay"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
            </div>

            {/* Year */}
            <div>
              <label className="text-sm font-medium">Year of Completion</label>
              <input
                name="year"
                value={edu.year}
                onChange={(e) => handleEducationChange(index, e)}
                placeholder="e.g. 2023"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
            </div>
          </div>
        ))}

        {/* Add Button */}
        <button
          type="button"
          onClick={addEducation}
          className="w-full border rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-gray-50"
        >
          + Add Education
        </button>
      </div>
      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <HiOutlineBriefcase className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Experience</h2>
        </div>

        <p className="text-gray-500 text-sm mb-4">Add your work experience</p>

        {experience.map((exp, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 relative">
            {/* Delete */}
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="absolute top-3 right-3 text-red-500"
            >
              <HiOutlineTrash />
            </button>

            {/* Company */}
            <div className="mb-3">
              <label className="text-sm font-medium">Company Name</label>
              <input
                name="companyName"
                value={exp.companyName}
                onChange={(e) => handleExperienceChange(index, e)}
                placeholder="e.g. Google"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="text-sm font-medium">Role</label>
              <input
                name="role"
                value={exp.role}
                onChange={(e) => handleExperienceChange(index, e)}
                placeholder="e.g. Software Engineer"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
            </div>

            {/* Years */}
            <div>
              <label className="text-sm font-medium">Years of Experience</label>
              <input
                name="years"
                value={exp.years}
                onChange={(e) => handleExperienceChange(index, e)}
                placeholder="e.g. 3"
                className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExperience}
          className="w-full border rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-gray-50"
        >
          + Add Experience
        </button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-5 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <HiOutlineArrowUpTray className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Resume</h2>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Upload your resume (PDF only, max 5MB)
        </p>

        {/* Upload Button */}
        {!resumeFile && (
          <label className="flex items-center justify-center border rounded-lg py-3 cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
            Upload Resume
          </label>
        )}

        {/* Resume File Display */}
        {resumeFile && (
          <div className="flex items-center justify-between border rounded-lg px-4 py-2">
            {resumeFile.url ? (
              <a
                href={`http://localhost:5000/${resumeFile.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resumeFile.name}
              </a>
            ) : (
              <span>{resumeFile.name}</span>
            )}

            <button
              onClick={deleteResume}
              className="text-red-500 hover:text-red-600"
            >
              <HiOutlineTrash size={18} />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleSaveProfile}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Save Profile
      </button>
    </div>
  );
};

export default Profile;
