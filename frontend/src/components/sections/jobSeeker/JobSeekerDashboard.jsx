const JobSeekerDashboard = ({ user }) => {

  return (
    <div style={{ padding: "20px" }}>
      <h1>Job Seeker Dashboard</h1>

      <h3>User Details:</h3>

      <p><strong>Name:</strong> {user.name}</p>

      <p><strong>Email:</strong> {user.email}</p>

      <p><strong>Role:</strong> {user.role}</p>

      <p><strong>Status:</strong> {user.status}</p>

      <p><strong>User ID:</strong> {user.id}</p>

      <hr />

      <h3>Job Seeker Actions:</h3>

      <ul>
        <li>Search jobs</li>
        <li>Apply for jobs</li>
        <li>View application status</li>
        <li>Update profile</li>
      </ul>
    </div>
  );
};

export default JobSeekerDashboard;
