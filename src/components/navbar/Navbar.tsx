import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="fixed w-full top-0 h-14 z-[1000] flex items-center bg-secondary-bg-color text-base border-b-[1px] border-main-border border-solid">
      <div className="w-[90%] mx-auto">
        <ul className="flex flex-row gap-8 w-full xl:w-[60%] mx-auto list-none">
          <li>
            <Link to="/">home</Link>{" "}
          </li>

          {user && (
            <li>
              <Link to="/mytasks">my tasks</Link>
            </li>
          )}

          {/* {location.pathname == "/tasks" && */}
          <li>
            <Link to="/contact">contact</Link>
          </li>
          {/* } */}

          {user && (
            <li>
              <Link to="/rewards">rewards</Link>
            </li>
          )}

          {user && (
              <li>
                <Link to="/newtask">new task</Link>
              </li>
          )}

          <li className="ml-auto">
            {user ? (
              <button onClick={signOut}>sign out</button>
            ) : (
              <Link to="/login">sign in</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
