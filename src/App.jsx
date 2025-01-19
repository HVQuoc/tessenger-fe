import "./App.css";
import axios from "axios";
import Register from "./Register";
import { UserContextProvider } from "./UserContext";
import Routes from "./Routes";

function App() {
  // axios.defaults.baseURL("http://localhost:4000")
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;

  return (
    <>
      <UserContextProvider>
        <Routes>
          <Register />
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
