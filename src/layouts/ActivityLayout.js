import React from "react";
import { Outlet } from "react-router-dom";
import AddActivity from "../components/home/addActivity";

const ActivityLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Fixed Sidebar */}
      <div style={{ 
        position: "fixed", 
        width: "18%",
        height: "100vh",
        overflow: "auto"
      }}>
        <AddActivity />
      </div>
      
      {/* Main Content Area */}
      <div style={{ 
        marginLeft: "18%", 
        width: "82%",
        padding: "20px"
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default ActivityLayout;