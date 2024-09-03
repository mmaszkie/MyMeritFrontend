import UserTaskDTO from "./UserTaskDTO";
import { EmploymentType, Experience } from "../JobOffer";
// import JobOfferListedDTO from "./SolutionListedDTO";
import SolutionListedDTO from "./SolutionListedDTO";
import { User } from "@types";
import WorkLocation from "../WorkLocation.ts";

interface JobOfferDetailsDTO {
  id: string;
  jobTitle: string;
  description: string;
  experience: Experience;
  salary: number;
  employmentType: EmploymentType;
  requiredSkills: string[];
  preferredSkills: string[];
  workLocations: WorkLocation[];
  opensAt: Date;
  closesAt: Date;
  company: User;
  task: UserTaskDTO;
  solutions: SolutionListedDTO[];
  templateFiles?: Map<string, string[]>;
  status: "OPEN" | "NOT_YET_OPEN" | "EXPIRED";
  isBookmarked: boolean;
}

export default JobOfferDetailsDTO;
