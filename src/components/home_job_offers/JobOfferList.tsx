import React from "react";
import JobOffer from "./JobOffer";
import JobOfferListedDTO from "../../models/dtos/JobOfferListedDTO";
import NoItemsFound from "../NoItemsFound";

const JobOfferList: React.FC<{ jobOffers: JobOfferListedDTO[] }> = ({ jobOffers }) => {
  return (
    <div
      className={`w-full flex flex-col align-center justify-center gap-4`}
    >
      {!jobOffers || jobOffers.length === 0
        ? <div className="h-[32rem]"><NoItemsFound itemName="tasks"/></div>
        : jobOffers.map((jobOffer) => <JobOffer key={jobOffer.id} jobOffer={jobOffer} />)}
    </div>
  );
};

export default JobOfferList;
