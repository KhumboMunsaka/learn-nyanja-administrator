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

  function SignOut() {
    signOut(auth)
      .then(() => {
        navigate("/");
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  }
  return (
    <main className={styles.dashboardContainer}>
      <PageNavigation />
      <h3 className={styles.smallScreen}>
        Please Revert to using a larger screen to continue as an
        administrator
      </h3>
      <section className={styles.dashboard}>
        <Outlet />
      </section>
      <button onClick={SignOut} className={styles.signOutButton}>
        Sign out
      </button>
    </main>
  );
}

export default Dashboard;
