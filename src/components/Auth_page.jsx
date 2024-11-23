import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

const provider = new GoogleAuthProvider();

function Auth_page() {
  const [user, setUser] = useState({});
  const [signIn, setSignIn] = useState(false);
  const navigator = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (signIn) {
        await signInWithEmailAndPassword(auth, user.email, user.password);
        navigator("/home");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);

        await addDoc(collection(db, "user"), {
          email: userCredential.user.email,
          password: user.password, 
        });

        navigator("/home");
      }
    } catch (err) {
      alert(err.code);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userCredential = result.user;

      await addDoc(collection(db, "user"), {
        email: userCredential.email,
      });

      navigator("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-right">
        <div className="form-container">
          <h2>{signIn ? "Sign In" : "Create Account"}</h2>
          <p className="form-subtitle">
            {signIn ? "Sign in to continue your journey." : "Sign up to join our amazing community."}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={user.password || ""}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              {signIn ? "Sign In" : "Sign Up"}
            </button>
          </form>
          <div className="toggle-container">
            <button
              type="button"
              onClick={() => setSignIn(!signIn)}
              className="btn-secondary"
            >
              {signIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

          <button onClick={handleGoogleAuth} className="btn btn-primary mt-2">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth_page;
