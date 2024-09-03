import { User } from "../../types";
import { Experience } from "@types";
import WorkLocation from "../WorkLocation.ts";

interface JobOfferListedDTO {
  id: string;
  jobTitle: string;
  workLocations: WorkLocation[];
  technologies: string[];
  reward: number;
  opensAt: Date;
  closesAt: Date;
  company: User;
  status: "OPEN" | "NOT_YET_OPEN" | "EXPIRED";
  experience: Experience;
}

export default JobOfferListedDTO;
