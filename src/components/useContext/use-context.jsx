import { useState } from "react";
import Dashboard from "./Dashboard";
import { DashboardContext } from "./context";

export default function UseContext() {
  const [user] = useState({
    isInterested: true,
    name: "You",
  });
  return (
    <div>
      <DashboardContext.Provider value={user}>
        <Dashboard user={user} />
      </DashboardContext.Provider>
    </div>
  );
}

//useContext - It is a way to store any kind of data and have it be accessible to components no matter where they are in your application in the tree even if it's for the entire application.Having data without having to pass it through props.
