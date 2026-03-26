import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatchedJobs } from "../../../api/job";
import {
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineBuildingOffice,
  HiOutlineBriefcase
} from "react-icons/hi2";

function MatchJobs() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [minMatch, setMinMatch] = useState(60);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMatchedJobs();
      setMatches(response?.data || []);
    } catch (err) {
      const errorMsg =
        err.message ||
        err?.response?.data?.message ||
        "Failed to load matched jobs";
      setError(errorMsg);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = useMemo(() => {
    const text = query.trim().toLowerCase();

    return matches.filter((item) => {
      const title = item?.job?.title?.toLowerCase() || "";
      const company = item?.job?.companyId?.companyName?.toLowerCase() || "";
      const location = item?.job?.location?.toLowerCase() || "";
      const percentage = Number(item?.matchPercentage || 0);

      const passesText =
        !text ||
        title.includes(text) ||
        company.includes(text) ||
        location.includes(text);

      return passesText && percentage >= minMatch;
    });
  }, [matches, query, minMatch]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-1">
        <HiOutlineSparkles className="text-green-600" size={24} />
        <h1 className="text-2xl font-semibold">Best Matches</h1>
      </div>

      <p className="text-gray-500 mb-6">
        Jobs ranked by resume skills, semantic similarity, and experience fit
      </p>

      <div className="grid md:grid-cols-5 gap-3 mb-6">
        <div className="md:col-span-3 flex items-center border rounded px-3">
          <HiOutlineMagnifyingGlass className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, company, location..."
            className="px-2 py-2 w-full outline-none"
          />
        </div>

        <div className="md:col-span-2 border rounded px-3 py-2 flex items-center gap-2">
          <label htmlFor="minMatch" className="text-sm text-gray-500">
            Min Match:
          </label>

          <select
            id="minMatch"
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
            className="w-full outline-none text-sm"
          >
            <option value={0}>All</option>
            <option value={40}>40%+</option>
            <option value={60}>60%+</option>
            <option value={75}>75%+</option>
            <option value={85}>85%+</option>
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500 py-10">Calculating best matches...</p>
      )}

      {!loading && error && (
        <div className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-6 mb-6 text-center">
          {error.toLowerCase().includes("resume") ? (
            <>
              <HiOutlineBriefcase size={48} className="mx-auto text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Resume Required
              </h3>
              <p className="text-yellow-700 mb-4">{error}</p>
              <button
                onClick={() => navigate("/jobseeker/profile")}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Go to Profile & Upload Resume
              </button>
            </>
          ) : (
            <p className="text-red-600">{error}</p>
          )}
        </div>
      )}

      {!loading && !error && filteredMatches.length === 0 && (
        <div className="text-center py-20 border rounded-xl bg-white">
          <HiOutlineSparkles size={48} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-xl font-semibold text-gray-700">No matched jobs found</h2>
          <p className="text-gray-500 mt-2">
            Try lowering the match filter or update your profile skills/resume.
          </p>
        </div>
      )}

      {!loading && !error && filteredMatches.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredMatches.map((item) => {
            const job = item.job;
            const scoreColor =
              item.matchPercentage >= 80
                ? "text-green-600"
                : item.matchPercentage >= 60
                  ? "text-yellow-600"
                  : "text-red-600";

            return (
              <div
                key={job._id}
                className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2
                      onClick={() => navigate(`/jobseeker/jobs/${job._id}`)}
                      className="text-lg font-semibold cursor-pointer hover:text-green-600"
                    >
                      {job.title}
                    </h2>

                    <div className="text-green-600 text-sm flex items-center gap-1 mt-1">
                      <HiOutlineBuildingOffice />
                      {job.companyId?.companyName}
                    </div>
                  </div>

                  <div className={`font-semibold text-lg ${scoreColor}`}>
                    {item.matchPercentage}%
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                  <span className="flex items-center gap-1">
                    <HiOutlineMapPin />
                    {job.location || "Remote"}
                  </span>

                  <span className="flex items-center gap-1">
                    <HiOutlineBriefcase />
                    {job.minExperience} - {job.maxExperience} years
                  </span>
                </div>

                <p className="text-gray-500 mt-3 text-sm">
                  <span
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {job.description || "No description provided."}
                  </span>
                </p>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">Match Score</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${item.matchPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                  <div className="bg-gray-50 border rounded p-2 text-center">
                    <p className="text-gray-500">Semantic</p>
                    <p className="font-semibold text-gray-700">
                      {item.scoreBreakdown?.semanticScore ?? 0}%
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded p-2 text-center">
                    <p className="text-gray-500">Skills</p>
                    <p className="font-semibold text-gray-700">
                      {item.scoreBreakdown?.skillScore ?? 0}%
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded p-2 text-center">
                    <p className="text-gray-500">Experience</p>
                    <p className="font-semibold text-gray-700">
                      {item.scoreBreakdown?.experienceScore ?? 0}%
                    </p>
                  </div>
                </div>

                {item.matchedSkills?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">Matched Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {item.matchedSkills.slice(0, 6).map((skill, idx) => (
                        <span
                          key={`${skill}-${idx}`}
                          className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/jobseeker/jobs/${job._id}`)}
                  className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MatchJobs;
