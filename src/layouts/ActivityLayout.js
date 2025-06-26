import React from "react";
import AddActivity from "../components/home/addActivity";

const ActivityLayout = ({ children }) => {
  return (
    <>
      <div style={{ position: "fixed", width: "18%" }}>
        <AddActivity />
      </div>
      <div style={{ marginLeft: "20%" }}>{children}</div>
    </>
  );
};

export default ActivityLayout;
