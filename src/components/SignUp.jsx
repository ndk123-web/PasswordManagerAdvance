// problem with google and signup duplicate user is accessing
// solution -> need to add query and where and validate in DBWork Function
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { nanoid } from "nanoid";
import { app, database } from "../firebaseConfig/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { myContext } from "../contextprovider/sessionprovider";

const Signup = () => {
  const { emailPass, setEmailPass , isLoggedIn , setIsLoggedIn } = useContext(myContext);
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmailPass((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const ResetEmailPass = () => {
    setEmailPass({ username: "", password: "" });
  };

  const DbWork = async (username, password, imageURL, uid) => {
    try {
      const passwordDB = collection(database, "passwordDB");

      const userExistQuery = query(
        passwordDB,
        where("username", "==", emailPass.username || username)
      );

      const querySnapshot = await getDocs(userExistQuery);

      if (!querySnapshot.empty) {
        alert("User already exists in database!");
        return;
      }

      const myListRef = await addDoc(passwordDB, {
        username: emailPass.username || username,
        password: emailPass.password || password,
        url: imageURL || "",
        uid: uid || nanoid(16),
      });

      collection(database, "passwordDB", myListRef.id, "userLists");
      setIsLoggedIn(true);
      alert("Success Sign Up");
      navigate("/");
      ResetEmailPass();
    } catch (error) {
      console.error("Error in DbWork:", error.message);
      alert("Something went wrong. Try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (emailPass.username === "" || emailPass.password === "") {
        alert("Enter Fields");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailPass.username,
        emailPass.password
      );

      const uid = userCredential.user.uid;
      DbWork(emailPass.username, emailPass.password, "", uid);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("User already exists!");
      } else {
        alert(err.message);
      }
    }
  };

  // ✅ Detect mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  console.log(navigator.userAgent)

  const handleGoogleSignup = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const response = await signInWithPopup(auth, googleProvider);
        await DbWork(
          response.user.email,
          nanoid(16),
          response.user.photoURL,
          response.user.uid
        );
        alert("Successfully Sign Up With Google");
        navigate("/");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGithubSignup = async () => {
    const githubProvider = new GithubAuthProvider();
    try {
      if (isMobile) {
        await signInWithRedirect(auth, githubProvider);
      } else {
        const response = await signInWithPopup(auth, githubProvider);
        await DbWork(
          response.user.email,
          nanoid(16),
          response.user.photoURL,
          response.user.uid
        );
        alert("Success Github Sign Up");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Handle redirect result (after Google/Github sign in from mobile)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          DbWork(
            result.user.email,
            nanoid(16),
            result.user.photoURL,
            result.user.uid
          );
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("Redirect SignIn Error:", err.message);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900 px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Create Account
        </h2>

        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={handleGoogleSignup}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-xl cursor-pointer"
            title="Signup with Google"
          >
            <FaGoogle className="text-xl text-red-500" />
          </button>
          <button
            onClick={handleGithubSignup}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md hover:shadow-xl cursor-pointer"
            title="Signup with GitHub"
          >
            <FaGithub className="text-xl text-black" />
          </button>
        </div>

        <div className="relative text-center text-white mb-6 animate-bounce">
          <span className="text-sm">or sign up with email</span>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            name="username"
            value={emailPass.username}
            onChange={handleChange}
            required
            placeholder="Email"
            autoComplete="username"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
          <input
            type="password"
            name="password"
            value={emailPass.password}
            onChange={handleChange}
            required
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-xl"
          >
            Sign Up
          </button>
        </form>

        <p className="text-white text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
