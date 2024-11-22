import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import styles from "../styles/Login.module.css";

function Login() {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
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

    // add validation
    if (
      email !== "khumbolane11@gmail.com" ||
      email !== "chimschibuta@gmail.com" ||
      email !== "cheembelabusi@gmail.com" ||
      email !== "malipengalusekelo77@gmail.com" ||
      email !== "lukundonkapambala@gmail.com" ||
      email !== "luzandombewe68@gmail.com"
    ) {
      setErrorMessage("This user is not an admin");
      return;
    }

    setErrorMessage(null);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  }

  function handleForgotSubmit(e) {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetMessage("Password reset email sent!");
      })
      .catch((error) => {
        const errorMessage = error.message;
        setResetMessage(errorMessage);
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
              <p className={styles.errorMessage}>{errorMessage}</p>
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={styles.input}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.button}>Login</button>
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
              <div className={styles.inputGroup}>
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
                <Button className={styles.button}>Reset Password</Button>
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
