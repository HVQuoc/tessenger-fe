import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto">
        <input
          type="text"
          placeholder="Username"
          className="block w-full rounded-md border border-slate-100 p-2 mb-2"
          value={username}
          onChange={ev => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full rounded-md border border-slate-100 p-2 mb-2"
          value={password}
          onChange={ev => setPassword(ev.target.value)}
        />
        <button className="bg-blue-600 text-white block w-full rounded-md border p-2 border-slate-400">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
