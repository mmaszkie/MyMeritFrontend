import UserProfileSidebar from "../../components/user_profile/UserProfileSidebar";
import ProfileSettings from "../../components/user_profile/profile_settings/ProfileSettings";
import UserPurchases from "../../components/user_profile/purchases/UserPurchases";
import MyTasks from "../my_tasks/MyTasks";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {useEffect, useState} from "react";
import {httpCallWithAuthorization} from "@api/HttpClient.ts";

const UserProfile = () => {
  const { pathname } = useLocation();
  const { isAuthenticatedCompany, accessToken } = useAuth();
  const [showSquare, setShowSquare] = useState(false);
  const [showGif, setShowGif] = useState(false);
  let page;

  switch (pathname) {
    case "/me":
      page = <ProfileSettings />;
      break;
    case "/me/purchases":
      page = <UserPurchases />;
      break;
    case "/me/tasks":
      if (isAuthenticatedCompany()) {
        page = <></>;
      } else {
        page = <MyTasks />;
      }

      break;
    default:
      page = <ProfileSettings />;
  }


  useEffect(() => {
    const checkTimeForSquare = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      if (minutes >= 15 && minutes < 20 && hours % 2 === 0) {
        setShowSquare(true);
      } else {
        setShowSquare(true);
      }
    };

    checkTimeForSquare();

    const interval = setInterval(checkTimeForSquare, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSquareClick = () => {
    setShowGif(true);
    if (accessToken) {
      triggerRickrollAchievement(accessToken)
    } else {
      console.error("User is not authenticated. Cannot trigger achievement.");
    }
  };

  const triggerRickrollAchievement = async (token: string) => {
    try {
      const URL = import.meta.env.VITE_API_URL + "/achievements/rickroll";
      await httpCallWithAuthorization({
        token,
        url: URL,
        method: "POST",
      });
    } catch (error) {
      console.error("Error triggering Rickroll achievement:", error);
    }
  };

  useEffect(() => {
    if (showGif) {
      const timer = setTimeout(() => {
        setShowGif(false);
        window.location.reload();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showGif]);

  return (
      <>
        <div className="pr-16 sm:pr-60 4xl:pr-16">{page}</div>
        <UserProfileSidebar />
        {showSquare && (
            <div
                onClick={handleSquareClick}
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  transform: "rotate(45deg)",
                  animation: "spin 2s linear infinite",
                }}
            />
        )}
        {showGif && (
            <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
            >
              <img src="rickroll.gif" alt="Rickroll" />
            </div>
        )}
      </>
  );
};

export default UserProfile;
