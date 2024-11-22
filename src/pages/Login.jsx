import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import SpinnerItem from "../components/SpinnerItem";

function Login() {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  function HandleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    // List of valid admin emails
    const validAdminEmails = [
      "khumbolane11@gmail.com",
      "chimschibuta@gmail.com",
      "cheembelabusi@gmail.com",
      "malipengalusekelo77@gmail.com",
      "lukundonkapambala@gmail.com",
      "luzandombewe68@gmail.com",
    ];
    if (email == "" || password == " ") {
      setErrorMessage("Please Fill In All Fields");
      setIsLoading(false);
      return;
    }
    // Check if the email is in the list of valid admin emails
    if (!validAdminEmails.includes(email)) {
      setErrorMessage("This User is not an Admininstrator");
      setIsLoading(false);

      return;
    }
    setErrorMessage(null);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/dashboard", { replace: true });
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
        setIsLoading(false);
      });
  }

  function handleForgotSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetMessage("Password reset email sent!");
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setResetMessage(errorMessage);
        setIsLoading(false);
      });
    setEmail("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}>
        <img />
      </div>
      <div className={styles.form}>
        <h1 className={styles.heading}>Administrator Login</h1>
        {!resetEmail ? (
          <div className={styles.loginFormContainer}>
            <form onSubmit={HandleSubmit} className={styles.loginForm}>
              <p
                className={styles.errorMessage}
                style={{ color: "red", fontSize: "24px", fontWeight: "bold" }}
              >
                {errorMessage}
              </p>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="Enter You Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Enter Your Password"
                  className={styles.input}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.button}>
                  {!isLoading ? "Login" : <SpinnerItem />}
                </button>
              </div>
            </form>
            <button
              onClick={() => setResetEmail(true)}
              className={styles.button}
            >
              Forgotten Password?
            </button>
          </div>
        ) : (
          <div className={styles.resetFormContainer}>
            <form onSubmit={handleForgotSubmit} className={styles.resetForm}>
              <p className={styles.resetMessage}>{resetMessage}</p>
              <div className={styles.inputGroupReset}>
                <label htmlFor="email" className={styles.label}>
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.button}>
                  {!isLoading ? "Reset Password" : <SpinnerItem />}
                </button>
              </div>
            </form>
            <button
              onClick={() => setResetEmail(false)}
              className={styles.button}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
