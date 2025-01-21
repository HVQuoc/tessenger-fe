import React, { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import Register from "./Register";
import Chat from "./Chat";

const Routes = () => {
  const { username, id } = useContext(UserContext);

  if (username) {
    return <Chat /> 
  }
  return (
    <div>
      <Register />
    </div>
  );
};

export default Routes;
