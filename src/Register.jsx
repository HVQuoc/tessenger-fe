import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login"); // or 'register'
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function register(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === "login" ? "/login" : "/register";
    const response = await axios.post(url, { username, password });

    if (response.status === 200) {
      setLoggedInUsername(username);
      setId(response.data.id);
    } else {
      setError(response.error.message)
    }

  }
  return (
    <div className="bg-blue-50 h-screen flex items-center">
      {error && (<p className="text-sm text-center">{error}</p>)}
      <form className="w-64 mx-auto mb-12" onSubmit={register}>
        <input
          type="text"
          placeholder="Username"
          className="block w-full rounded-xl border border-slate-100 p-2 mb-2"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full rounded-xl border border-slate-100 p-2 mb-2"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button className="bg-blue-600 text-white block w-full mb-4 rounded-xl border p-2 border-slate-400">
          {isLoginOrRegister === "login" ? "Login" : "Register"}
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
