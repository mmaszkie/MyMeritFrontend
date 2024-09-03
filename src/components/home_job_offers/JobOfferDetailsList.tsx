import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faGraduationCap,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import JobOfferListedDTO from "../../models/dtos/JobOfferListedDTO";
import { TaskStatus } from "../../models/TaskStatus";
import TechnologyTags from "./TechnologyTags";
import { Link } from "react-router-dom";

const languageColors = {
  JAVA: "#ec9b2a",
  PYTHON: "#40a5f8",
  JAVASCRIPT: "#f1e05a",
  CPP: "#f34b7d",
  GO: "#00ADD8",
  KOTLIN: "#A97BFF",
  TYPESCRIPT: "#46d595",
  PHP: "#c72eb3",
};

const CompanyDetails: React.FC<{ jobOffer: JobOfferListedDTO }> = ({
  jobOffer,
}) => (
  <Link
    to={`/profile/${jobOffer.company.id}`}
    className="flex items-center w-[20rem] xs:w-auto"
  >
    <img
      src={jobOffer.company.imageBase64}
      className="block xs:hidden w-[1.5rem] h-[1.5rem] rounded mr-2 object-cover img-anchor"
      alt={jobOffer.company.username}
    />
    {jobOffer.company.username}
  </Link>
);

const WorkLocations: React.FC<{ jobOffer: JobOfferListedDTO }> = ({
  jobOffer,
}) => (
  <div className="flex gap-2 text-task-lighter items-center">
    <FontAwesomeIcon icon={faLocationDot} />
    <ul className="flex">
      {jobOffer.workLocations.map((location, index) => (
        <li key={index}>
          {`${location.city.toUpperCase()}, ${location.country.toUpperCase()}`}
          {index !== jobOffer.workLocations.length - 1 && (
            <span className="mx-1">/</span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const Experience: React.FC<{ jobOffer: JobOfferListedDTO }> = ({
  jobOffer,
}) => (
  <div className="flex gap-2 text-task-lighter items-center">
    <FontAwesomeIcon icon={faGraduationCap} />
    {jobOffer.experience}
  </div>
);

const JobOfferDetailsList: React.FC<{
  jobOffer: JobOfferListedDTO;
  isFullView: boolean;
}> = ({ jobOffer, isFullView }) => {
  return (
    <div>
      <div className="flex items-center px-4 pb-4 mt-1">
        {jobOffer.company.imageBase64 ? (
          <img
            src={jobOffer.company.imageBase64}
            className="hidden xs:block w-[4.5rem] h-[4.5rem] rounded object-cover img-anchor"
            alt="company image"
          />
        ) : (
          <FontAwesomeIcon
            icon={faUser}
            className="w-[4.5rem] h-[4.5rem] p-4 !box-border text-white"
          />
        )}
        <div className="flex h-full xs:pl-4 w-full gap-3 xs:gap-1 flex-col truncate ...">
          <h3 className="text-2xl font-semibold w-full hover:underline truncate ... ">
            <a
              href={`job/${jobOffer.id}${
                jobOffer.status === TaskStatus.NOT_YET_OPEN ? "" : "/solution"
              }`}
            >
              {jobOffer.jobTitle}
            </a>
          </h3>
          {!isFullView && (
            <TechnologyTags
              technologies={jobOffer.technologies}
              languageColors={languageColors}
            />
          )}
          {isFullView && (
            <div className="flex w-full sm:gap-6 xs:gap-4 gap-3 text-sm font-medium xs:justify-between flex-wrap">
              <div className="flex flex-wrap sm:gap-x-7 gap-x-4 gap-y-4">
                <CompanyDetails jobOffer={jobOffer} />
                <WorkLocations jobOffer={jobOffer} />
                <Experience jobOffer={jobOffer} />
              </div>
              <TechnologyTags
                technologies={jobOffer.technologies}
                languageColors={languageColors}
              />
            </div>
          )}
        </div>
      </div>
      {!isFullView && (
        <div className="flex w-full sm:gap-6 xs:gap-4 gap-3 text-sm font-medium xs:justify-between flex-wrap pb-4 px-4">
          <div className="flex flex-wrap sm:gap-x-7 gap-x-4 gap-y-4">
            <CompanyDetails jobOffer={jobOffer} />
            <WorkLocations jobOffer={jobOffer} />
            <Experience jobOffer={jobOffer} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOfferDetailsList;
