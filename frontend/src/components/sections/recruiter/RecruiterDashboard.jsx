const RecruiterDashboard = ({ user }) => {

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recruiter Dashboard</h1>

      <h3>User Details:</h3>

      <p><strong>Name:</strong> {user.name}</p>

      <p><strong>Email:</strong> {user.email}</p>

      <p><strong>Role:</strong> {user.role}</p>

      <p><strong>Status:</strong> {user.status}</p>

      <p><strong>User ID:</strong> {user.id}</p>

      <hr />

      <h3>Recruiter Actions:</h3>

      <ul>
        <li>Post new job</li>
        <li>View applicants</li>
        <li>Manage company profile</li>
      </ul>
    </div>
  );
};

export default RecruiterDashboard;
