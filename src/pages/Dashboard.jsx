import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import PageNavigation from "../components/PageNavigation";

function Dashboard() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to home if not logged in
    }
  }, [user, navigate]);
  return (
    <>
      <h3>Hi Administrator!</h3>
      <PageNavigation />
      <Outlet />
    </>
  );
}

export default Dashboard;
