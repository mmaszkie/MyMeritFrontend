import ProfileSettingsSection from "../ProfileSettingsSection";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../../../../hooks/useAuth";
import Achievement from "./Achievement";
import { Achievement as AchievementType } from "@types";

const Achievements = () => {
  const { userData, isLoading } = useAuth();

  return (
    <ProfileSettingsSection title="Your achievements">
      <div>
        {isLoading || !userData ? (
          <Skeleton height={96} count={3} />
        ) : (
          <div className="text-lg h-full flex flex-row flex-wrap gap-4 items-center overflow-hidden">
            {userData.achievements.length > 0 ? (
              userData.achievements.map(
                (achievement: AchievementType, index: number) => (
                  <Achievement achievement={achievement} key={index} />
                )
              )
            ) : (
              <span className="opacity-50">No achievements yet</span>
            )}
          </div>
        )}
      </div>
    </ProfileSettingsSection>
  );
};

export default Achievements;
