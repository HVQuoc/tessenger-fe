import "./App.css";
import axios from "axios";
import Register from "./Register";
import { UserContextProvider } from "./UserContext";
import Routes from "./Routes";
import { BE_HTTPS_URL } from "./config/urls";

function App() {
  axios.defaults.baseURL = BE_HTTPS_URL;
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
