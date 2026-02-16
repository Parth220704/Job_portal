import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Head from "../components/sections/Head";
import Choose from "../components/sections/Choose";
import Action from "../components/sections/Action";
import Dashboard from "../components/sections/dashboard";

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="page">
      {isLoggedIn ? (

        
        <Dashboard/>



      ) : (
        <>
          <Head />
          <Choose />
          <Action />
        </>
      )}
    </div>
  );
};

export default Home;
