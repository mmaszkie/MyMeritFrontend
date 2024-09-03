import React, { useEffect, useState } from "react";
import JobOfferList from "../../components/home_job_offers/JobOfferList";
import { getHomeJobOffers } from "../../services/JobOfferService";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/home_job_offers/Pagination";
import FilterPanel from "../../components/home_job_offers/FilterPanel";
import { defaultQueryParams, QueryParams } from "../../models/QueryParams";
import JobOfferListedDTO from "../../models/dtos/JobOfferListedDTO";
import SearchBar from "../../components/home_job_offers/SearchBar";
import SortPanel from "../../components/home_job_offers/SortPanel";
import { ThreeDots } from 'react-loader-spinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBorderAll, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import HomeMap from "../../components/home_job_offers/HomeMap.tsx";

const Home: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isFullView, setIsFullView] = useState(true);
    const [showMap, setShowMap] = useState(false);

    const initializeQueryParams = (): QueryParams =>
        ({
            search: searchParams.get("q")
                ? searchParams.get("q")
                : defaultQueryParams.search,
            languages:
                searchParams.get("languages")?.split(",") ||
                defaultQueryParams.languages,
            cities:
                searchParams.get("cities")?.split(", ") ||
                defaultQueryParams.cities,
            countries:
                searchParams.get("countries")?.split(", ") ||
                defaultQueryParams.countries,
            minCredits: searchParams.get("minCredits")
                ? parseInt(searchParams.get("minCredits")!)
                : defaultQueryParams.minCredits,
            maxCredits: searchParams.get("maxCredits")
                ? parseInt(searchParams.get("maxCredits")!)
                : defaultQueryParams.maxCredits,
            minSalary: searchParams.get("minSalary")
                ? parseInt(searchParams.get("minSalary")!)
                : defaultQueryParams.minSalary,
            maxSalary: searchParams.get("maxSalary")
                ? parseInt(searchParams.get("maxSalary")!)
                : defaultQueryParams.maxSalary,
            minOpensIn: searchParams.get("minOpensIn")
                ? searchParams.get("minOpensIn")
                : defaultQueryParams.minOpensIn,
            maxOpensIn: searchParams.get("maxOpensIn")
                ? searchParams.get("maxOpensIn")
                : defaultQueryParams.maxOpensIn,
            sort: searchParams.get("sort") || defaultQueryParams.sort,
            page: searchParams.get("page")
                ? parseInt(searchParams.get("page")!)
                : defaultQueryParams.page,
        } as QueryParams);

    const [queryParams, setQueryParams] = useState<QueryParams>(initializeQueryParams);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [jobOffers, setJobOffers] = useState<JobOfferListedDTO[]>([]);

    const handleQueryParamChange = (key: string, value: any) => {
        setQueryParams((prevParams) => ({ ...prevParams, [key]: value }));
    };

    const handleMarkerClick = (city: string, country: string) => {
        handleQueryParamChange('cities', [...(queryParams.cities || []), city]);
        handleQueryParamChange('countries', [...(queryParams.countries || []), country]);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getHomeJobOffers(queryParams);
                setMaxPage(response.totalPages);
                setJobOffers(response.content);
            } catch (error) {
                console.error("Error fetching jobOffers:", error);
            }
        };
        fetchData().then(() => {
            setTimeout(() => {
                setIsLoading(false); // fake delay
            }, 350);
        });
    }, [queryParams]);

    return (
        <div className="flex flex-col md:grid-cols-[200px_1fr] gap-4 h-full w-full items-center lg:items-baseline">
            <div className="w-full flex flex-col gap-4 lg:flex-row justify-center">
                <div className="hidden lg:block">
                    <FilterPanel
                        queryParams={queryParams}
                        handleChange={handleQueryParamChange}
                    />
                </div>
                <div className="w-full flex flex-col gap-4">
                    <div className="flex justify-between gap-4 flex-wrap">
                        <div className="w-full md:flex-1 h-full">
                            <SearchBar
                                searchValue={queryParams.search}
                                handleQueryParamChange={handleQueryParamChange}
                            />
                        </div>
                        <div className="block lg:hidden flex-1">
                            <FilterPanel
                                queryParams={queryParams}
                                handleChange={handleQueryParamChange}
                            />
                        </div>
                        <SortPanel
                            sortValue={queryParams.sort}
                            handleQueryParamChange={handleQueryParamChange}
                        />
                        <button
                            onClick={() => setIsFullView(!isFullView)}
                            className="hidden xl:block px-4 rounded bg-secondary-bg-color"
                        >
                            {isFullView ? <FontAwesomeIcon icon={faBars} /> : <FontAwesomeIcon icon={faBorderAll} />}
                        </button>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className="px-4 rounded bg-secondary-bg-color"
                        >
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </button>
                    </div>
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center p-2">
                            <ThreeDots
                                visible={true}
                                height="60"
                                width="60"
                                color="#fff"
                                radius="5"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full gap-4">
                            <div className="w-full lg:w-full flex flex-col gap-4">
                                {showMap && (
                                    <div className="w-full h-96 lg:h-auto">
                                        <HomeMap jobOffers={jobOffers} onMarkerClick={handleMarkerClick}/>
                                    </div>
                                )}
                                <div className="w-full flex flex-col gap-4">
                                    <div className="min-h-[27rem]">
                                        <JobOfferList jobOffers={jobOffers} isFullView={isFullView} />
                                    </div>
                                    <Pagination
                                        maxPages={maxPage}
                                        queryParams={queryParams}
                                        setQueryParams={setQueryParams}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
