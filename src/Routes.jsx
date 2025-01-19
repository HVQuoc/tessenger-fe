import React, { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import Register from "./Register";

const Routes = () => {
  const { username, id } = useContext(UserContext);

  if (username) return <p>Logged in! + {username}</p>;
  return <div>
    <Register />
  </div>;
};

export default Routes;
