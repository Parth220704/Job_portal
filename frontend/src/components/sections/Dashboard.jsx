import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/user";
import RecruiterDashboard from "./recruiter/RecruiterDashboard";
import JobSeekerDashboard from "./jobSeeker/JobSeekerDashboard";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  if (!user) return <div>No user found</div>;

  // Role-based dashboard
  if (user.role === "recruiter") {
    return <RecruiterDashboard user={user} />;
  }

  if (user.role === "jobseeker") {
    return <JobSeekerDashboard user={user} />;
  }

  return <div>Unauthorized</div>;
};

export default Dashboard;
