import { useContext, useState } from "react";
import axios from "axios";
import {UserContext} from "./UserContext"

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setUsername: setLoggedInUsername, setId} = useContext(UserContext)

  async function register (ev) {
    ev.preventDefault()
    console.log('registering', {username, password})
    const {data} = await axios.post('/register', {username, password})
    setLoggedInUsername(username)
    setId(data.id)
  }
  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={register}>
        <input
          type="text"
          placeholder="Username"
          className="block w-full rounded-xl border border-slate-100 p-2 mb-2"
          value={username}
          onChange={ev => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full rounded-xl border border-slate-100 p-2 mb-2"
          value={password}
          onChange={ev => setPassword(ev.target.value)}
        />
        <button className="bg-blue-600 text-white block w-full rounded-xl border p-2 border-slate-400">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
