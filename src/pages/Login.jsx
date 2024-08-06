import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";

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
    if (email != "khumbolane11@gmail.com") {
      console.log("This user is not an admin");
      return;
    }

    setErrorMessage(null);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        // ...
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
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
        const errorCode = error.code;
        const errorMessage = error.message;
        setResetMessage(errorMessage);
        // ..
      });
    setEmail("");
  }
  return (
    <>
      <h1>Administrator Login</h1>
      {!resetEmail ? (
        <div>
          <form onSubmit={HandleSubmit}>
            <p>{errorMessage}</p>
            <div>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <Button>Login</Button>
            </div>
          </form>
          <button onClick={() => setResetEmail(true)}>
            Forgotten Password?
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleForgotSubmit}>
            <p>{resetMessage}</p>
            <div>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Button>Reset Password</Button>
            </div>
          </form>
          <button onClick={() => setResetEmail(false)}>Back</button>
        </div>
      )}
    </>
  );
}

export default Login;
