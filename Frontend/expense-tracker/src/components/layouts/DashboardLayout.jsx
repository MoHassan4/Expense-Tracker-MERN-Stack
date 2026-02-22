import React, { useContext } from "react";
import SideMenu from "./SideMenu";
import Navbar from "./Navbar";
import { UserContext } from "../../context/UserContext";

const DashboardLayout = ({ children, activeMenu }) => {
    const {user} = useContext(UserContext)
  return (
    <div>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1000px]:hidden">
            <SideMenu activeMenu={activeMenu}/>
          </div>
          {children}
        </div>
      )}
      
    </div>
  );
};

export default DashboardLayout;
