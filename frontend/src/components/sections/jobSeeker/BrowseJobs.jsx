import { useEffect, useState, useContext } from "react";
import { getAllJobs } from "../../../api/job";
import { getMyProfile } from "../../../api/profile";
import { AuthContext } from "../../../context/AuthContext";
import {
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineMagnifyingGlass,
  HiOutlineBuildingOffice,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const BrowseJobs = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  const [filters, setFilters] = useState({
    title: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobs();
    loadProfile();
  }, []);

  const loadJobs = async () => {
    const data = await getAllJobs();
    setJobs(data.data);
  };

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchJobs(filters);
    }, 500); // wait 500ms after typing

    return () => clearTimeout(delay);
  }, [filters]);

  const handleSearch = async () => {
    const data = await getAllJobs(filters);

    setJobs(data.data);
  };

  const fetchJobs = async (filterData = filters) => {
    try {
      setLoading(true); // start loading

      const data = await getAllJobs(filterData);

      setJobs(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <HiOutlineBriefcase className="text-green-600" size={24} />
        <h1 className="text-2xl font-semibold">Browse Jobs</h1>
      </div>

      <p className="text-gray-500 mb-6">Find your next opportunity</p>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center border rounded px-3 w-full">
          <HiOutlineMagnifyingGlass className="text-gray-400" />
          <input
            name="title"
            placeholder="Job title or keyword..."
            value={filters.title}
            onChange={handleChange}
            className="px-2 py-2 w-full outline-none"
          />
        </div>

        <div className="flex items-center border rounded px-3 w-full">
          <HiOutlineMapPin className="text-gray-400" />
          <input
            name="location"
            placeholder="Location..."
            value={filters.location}
            onChange={handleChange}
            className="px-2 py-2 w-full outline-none"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-5 rounded flex items-center gap-1"
        >
          <HiOutlineMagnifyingGlass />
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mb-4">Loading jobs...</p>
      )}

      {/* No Jobs Found */}
      {!loading && jobs.length === 0 && (
        <div className="text-center py-20">
          <HiOutlineBriefcase
            size={50}
            className="mx-auto text-gray-300 mb-4"
          />

          <h2 className="text-xl font-semibold text-gray-700">No Jobs Found</h2>

          <p className="text-gray-500 mt-2">
            Try adjusting your search keywords or location
          </p>
        </div>
      )}

      {/* Job Cards */}
      {!loading && jobs.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <h2
                onClick={() => navigate(`/jobseeker/jobs/${job._id}`)}
                className="text-lg font-semibold cursor-pointer hover:text-green-600"
              >
                {job.title}
              </h2>

              <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                <div
                  onClick={() =>
                    navigate(`/jobseeker/companies/${job.companyId._id}`)
                  }
                  className="text-green-600 cursor-pointer hover:underline flex items-center gap-1 text-sm"
                >
                  <HiOutlineBuildingOffice />
                  {job.companyId?.companyName}
                </div>
              </div>

              <p className="text-gray-500 mt-3">
                {job.description?.slice(0, 120)}...
              </p>

              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                <HiOutlineMapPin />
                {job.location}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {job.requiredSkills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-2 py-1 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Apply Button */}
              {profile?.resumeUrl ? (
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Apply Job
                </button>
              ) : (
                <button
                  disabled
                  className="mt-4 w-full border border-red-500 text-red-500 py-2 rounded"
                >
                  Upload Resume to Apply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;
