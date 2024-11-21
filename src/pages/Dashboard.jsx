import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import PageNavigation from "../components/PageNavigation";
import styles from "../styles/Dashboard.module.css";
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
    <main>
      <h3>Hi Administrator!</h3>
      <section className={styles.dashboard}>
        <PageNavigation />
        <Outlet />
      </section>
    </main>
  );
}

export default Dashboard;
