import React, { useState } from "react";
import {
  faLocationDot,
  faDollarSign,
  faUser,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskStatusDisplay from "../task_info/TaskStatusDisplay";
import JobOfferDetailsDTO from "../../../models/dtos/JobOfferDetailsDTO";
import { useAuth } from "../../../hooks/useAuth";
import {
  addToBookmarks,
  removeFromBookmarks,
} from "../../../services/JobOfferService";
import { successToast } from "../../../main";
import { Link } from "react-router-dom";
import MapComponent from "./MapComponent.tsx";

const JobOfferInfo: React.FC<{ jobOffer: JobOfferDetailsDTO }> = ({
  jobOffer,
}) => {
  const { accessToken, userData } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(jobOffer.isBookmarked);

  const addJobToBookmarks = () => {
    addToBookmarks(accessToken!, jobOffer.id).then((r) => {
      if (r.success) {
        successToast("Bookmark added");
        setIsBookmarked(true);
      }
    });
  };

  const removeJobFromBookmarks = () => {
    removeFromBookmarks(accessToken!, jobOffer.id).then((r) => {
      if (r.success) {
        successToast("Bookmark removed");
        setIsBookmarked(false);
      }
    });
  };

  return (
    <div className="flex flex-col w-[100%] lg:w-[45%] lg:max-w-[45rem]">
      <div className="flex justify-between">
        {userData?.id !== jobOffer.company.id ? (
          <TaskStatusDisplay status={jobOffer.status} />
        ) : (
          <a
            className="flex justify-center items-center gap-2  bg-emerald-500 text-job-primary p-2 px-3  rounded text-xs font-semibold text-white"
            href={"/job/" + jobOffer.id + "/solution"}
          >
            GO TO SOLUTIONS
          </a>
        )}

        {isBookmarked !== null ? (
          isBookmarked ? (
            <button
              className="flex items-center font-semibold text-task-lighter truncate max-w-[12rem] px-4 bg-task-bck rounded text-xs hover:bg-red-400 hover:text-white duration-200"
              onClick={removeJobFromBookmarks}
            >
              <FontAwesomeIcon icon={faBookmark} className="mr-2" /> REMOVE
              BOOKMARK
            </button>
          ) : (
            <button
              className="flex items-center font-semibold text-task-lighter truncate max-w-[12rem] px-4 bg-task-bck rounded text-xs hover:bg-emerald-450 hover:text-white duration-200"
              onClick={addJobToBookmarks}
            >
              <FontAwesomeIcon icon={faBookmark} className="mr-2" /> BOOKMARK
            </button>
          )
        ) : (
          <></>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex mt-5 gap-5">
          <img
            src={jobOffer.company.imageBase64}
            className="w-[8rem] h-[8rem] rounded  rounded object-cover img-anchor"
          />
          <div className="flex flex-col gap-3">
            <p className="flex gap-3 items-center">
              {jobOffer.company.username}
              <Link
                to={`/profile/${jobOffer.company.id}`}
                className="text-xs font-semibold text-emerald-400"
              >
                SEE MORE ABOUT THIS COMPANY
              </Link>
            </p>
            <h3 className="text-3xl font-bold leading-7 mb-1">
              {jobOffer.jobTitle}
            </h3>
            <div className="flex gap-3 w-full  flex-wrap">
              <p className="flex justify-center items-center gap-2 bg-task-bck px-3 py-1.5 rounded text-sm font-semibold">
                <FontAwesomeIcon icon={faUser} /> {jobOffer.experience}
              </p>

              <p className="flex justify-center items-center gap-2 bg-task-bck px-3 py-1.5 rounded text-sm font-semibold">
                <FontAwesomeIcon icon={faDollarSign} /> {jobOffer.salary}$/month
              </p>

              {jobOffer.workLocations.map((location, index) => (
                <p
                  key={index}
                  className="flex justify-center items-center gap-2 bg-task-bck px-3 py-1.5 rounded text-sm font-semibold"
                >
                  <FontAwesomeIcon icon={faLocationDot} />
                  {`${location.city}, ${location.country}`}
                </p>
              ))}
            </div>
          </div>
        </div>
        <p className="leading-7 bg-secondary-bg-color px-4 py-2 rounded">
          {jobOffer.description}
        </p>
        <div>
          <h3 className="text-sm text-task-lighter font-semibold mb-3">
            MUST HAVE SKILLS
          </h3>
          <ul className="flex gap-3 flex-wrap">
            {jobOffer.requiredSkills.map((skill) => {
              return (
                <li
                  className="inline-block px-3 py-1.5 font-medium bg-transparent border-2 border-job-primary rounded text-sm text-job-primary"
                  key={skill}
                >
                  {skill}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3 className="text-sm text-task-lighter font-semibold mb-3">
            NICE TO HAVE SKILLS
          </h3>
          <ul className="flex gap-3 flex-wrap">
            {jobOffer.preferredSkills.map((skill) => {
              return (
                <li
                  className="inline-block px-3 py-1.5 font-medium bg-transparent border-2 border-job-primary rounded text-sm text-job-primary"
                  key={skill}
                >
                  {skill}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="mt-5">
        <MapComponent locations={jobOffer.workLocations} />
      </div>
    </div>
  );
};

export default JobOfferInfo;
