import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth"; // Import Firebase authentication methods
import { useContext } from "react"; // Import useContext for accessing context
import { useNavigate, Link } from "react-router-dom"; // Import navigation and linking utilities
import { FaGoogle, FaGithub } from "react-icons/fa"; // Import Google and GitHub icons
import { nanoid } from "nanoid"; // Import nanoid for generating unique IDs
import { app, database } from "../firebaseConfig/config"; // Import Firebase app and database configuration
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"; // Import Firestore methods
import { myContext } from "../contextprovider/sessionprovider"; // Import custom context provider
import { toast } from "react-toastify"; // Import toast for notifications

const Signup = () => {
  const { emailPass, setEmailPass, isLoggedIn, setIsLoggedIn } =
    useContext(myContext); // Access context values for email/password and login state
  const auth = getAuth(app); // Initialize Firebase authentication
  const navigate = useNavigate(); // Initialize navigation utility

  const handleChange = (e) => {
    setEmailPass((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    })); // Update email/password state on input change
  };

  const ResetEmailPass = () => {
    setEmailPass({ username: "", password: "" }); // Reset email/password state
  };

  const DbWork = async (username, password, imageURL, uid) => {
    try {
      if (!username) {
        toast.error("Username is missing. Please try again."); // Show error if username is missing
        return;
      }

      const passwordDB = collection(database, "passwordDB"); // Reference to Firestore collection
      const userExistQuery = query(
        passwordDB,
        where("username", "==", username)
      ); // Query to check if user already exists
      const querySnapshot = await getDocs(userExistQuery); // Execute query

      if (!querySnapshot.empty) {
        toast.error("User already exists in database!"); // Show error if user exists
        return;
      }

      await addDoc(passwordDB, {
        username: username,
        password: password,
        url: imageURL || "",
        uid: uid || nanoid(16),
      }); // Add new user to Firestore

      setIsLoggedIn(true); // Update login state
      toast.success("Successfully signed up!"); // Show success message
      navigate("/"); // Navigate to home page
      ResetEmailPass(); // Reset email/password state
    } catch (error) {
      console.error("Error in DbWork:", error.message); // Log error
      toast.error("Something went wrong. Try again."); // Show error message
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      if (emailPass.username === "" || emailPass.password === "") {
        toast.error("Please fill in all fields"); // Show error if fields are empty
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailPass.username,
        emailPass.password
      ); // Create user with email and password

      const uid = userCredential.user.uid; // Get user ID
      DbWork(emailPass.username, emailPass.password, "", uid); // Perform database operations
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("User already exists!"); // Show error if email is already in use
      } else {
        toast.error(err.message); // Show other errors
      }
    }
  };

  const handleGoogleSignup = async () => {
    const googleProvider = new GoogleAuthProvider(); // Initialize Google provider
    try {
      const response = await signInWithPopup(auth, googleProvider); // Sign in with Google

      if (!response.user.email) {
        toast.error("Failed to retrieve email from Google."); // Show error if email is missing
        return;
      }

      await DbWork(
        response.user.email,
        nanoid(16),
        response.user.photoURL,
        response.user.uid
      ); // Perform database operations
      toast.success("Successfully signed up with Google!"); // Show success message
      navigate("/"); // Navigate to home page
    } catch (err) {
      console.error("Google signup error:", err); // Log error
      toast.error(err.message); // Show error message
    }
  };

  const handleGithubSignup = async () => {
    const githubProvider = new GithubAuthProvider(); // Initialize GitHub provider
    githubProvider.addScope("user:email"); // Add email scope to GitHub provider

    try {
      const response = await signInWithPopup(auth, githubProvider); // Sign in with GitHub

      if (!response.user.email) {
        toast.error("Failed to retrieve email from GitHub."); // Show error if email is missing
        return;
      }

      await DbWork(
        response.user.email,
        nanoid(16),
        response.user.photoURL,
        response.user.uid
      ); // Perform database operations
      toast.success("Successfully signed up with GitHub!"); // Show success message
      navigate("/"); // Navigate to home page
    } catch (err) {
      console.error("GitHub signup error:", err); // Log error
      toast.error(err.message); // Show error message
    }
  };

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

