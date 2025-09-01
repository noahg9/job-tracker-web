import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
