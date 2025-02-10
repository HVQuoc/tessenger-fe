import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login"); // or 'register'
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function register(ev) {
    ev.preventDefault();
    if (!username || !password) {
      setError("You must fill out all fields.")
      setTimeout(() => {setError("")}, 3000)
      return
    }
    const url = isLoginOrRegister === "login" ? "/login" : "/register";
    try {
      setIsLoading(true);
      const response = await axios.post(url, { username, password });
      if (response.status === 200 || response.status === 201) {
        setLoggedInUsername(username);
        setId(response.data.id);
      } else {
        setError(response?.error?.message);
      }
    } catch (err) {
      console.log("err login form ", err);
      if (err.status === 404) {
        setError("Could not found username " + username);
      } else if (err.status === 401) {
        setError("Bad credentials. Wrong password or username.");
      } else if (err.status === 409) {
        setError(err?.response.data?.message ?? "Username is already used.");
      } else {
        setError(err?.message);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }
  return (
    <div className="bg-blue-50 h-screen flex flex-col justify-center items-center">
      <div className="py-4 text-center">
        <h2 className="text-2xl my-2">Welcome to Tessenger</h2>
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
      </div>
      <form className="w-64 mx-auto mb-12" onSubmit={register}>
        <input
          type="text"
          placeholder="Username"
          className="block w-full rounded-xl border border-slate-100 p-2 mb-2"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="block w-full rounded-xl border border-slate-100 p-2"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <span
            className="absolute right-2 top-2 text-gray-400"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </span>
        </div>
        <button
          className={
            "bg-blue-600 flex justify-center items-center text-white w-full mb-4 rounded-xl border p-2 border-slate-400" +
            (isLoading ? " opacity-50" : "")
          }
          disabled={isLoading}
        >
          <span className="mx-2">
            {isLoginOrRegister === "login" ? "Login" : "Register"}
          </span>
          {isLoading && (
            <span>
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                ></path>
              </svg>
            </span>
          )}
        </button>
        {isLoginOrRegister === "register" && (
          <div className="text-center text-sm">
            Already a member?{" "}
            <button onClick={() => setIsLoginOrRegister("login")}>Login</button>
          </div>
        )}

        {isLoginOrRegister === "login" && (
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <button onClick={() => setIsLoginOrRegister("register")}>
              Register
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
