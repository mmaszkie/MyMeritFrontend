import { Achievement as AchievementType } from "@types";

const Achievement = ({ achievement }: { achievement: AchievementType }) => {
  return (
      <div className="flex flex-col gap-2 justify-center items-center p-2 group">
          <div className="rounded-lg w-10 h-10 bg-white p-2 box-content">
              <img
                  className="w-full h-full object-contain rounded-lg"
                  src={achievement.base64image}
                  alt="achievement"
              />
          </div>
          <p className="text-gray-400 text-center text-xs md:text-base">
              {achievement.name}
          </p>
          <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
              {achievement.description}
          </div>
      </div>
  );
};

export default Achievement;
