import React, { useEffect, useState } from "react";
import TaskList from "../../components/home_tasks/TaskList";
import Task from "../../models/Task";
import {getHomeTasks} from "../../services/TaskService";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/home_tasks/Pagination";
import FilterPanel from "../../components/home_tasks/FilterPanel";
import QueryParams from "../../models/QueryParams";
import SecondWrapper from "../../components/SecondWrapper";

const Home: React.FC = () => {
  const searchParams = new URLSearchParams(useLocation().search);

  const page = searchParams.get("page")
      ? parseInt(searchParams.get("page"), 10)
      : 1;

  const languages = searchParams.get("languages");

  const minCredits = searchParams.get("minCredits")
      ? parseInt(searchParams.get("minCredits"))
      : undefined;
  const maxCredits = searchParams.get("maxCredits")
      ? parseInt(searchParams.get("maxCredits"))
      : undefined;

  const timeLeft = searchParams.get("timeLeft")
      ? parseInt(searchParams.get("timeLeft"))
      : undefined;


    const queryParams: QueryParams = {
        languages: languages,
        minCredits: minCredits,
        maxCredits:maxCredits
    };

  const [maxPage, setMaxPage] = useState<number>(1);
  const [tasks, setTasks] = useState<Task[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHomeTasks(page, queryParams);
        if (response.ok) {
          const json = await response.json();
          setMaxPage(json.totalPages);
          setTasks(json.content);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [page, languages, minCredits, maxCredits, timeLeft]);


  return (
    // <div className="flex flex-col justify-between w-full xl:w-[60%] mx-auto">
    <SecondWrapper>
      <div className="flex flex-col gap-x-10 h-full w-[100%]  items-center lg:items-baseline">
        <div className="w-full flex flex-col-reverse gap-x-10 lg:flex-row">
          <div className="w-full lg:w-[70%]">
            <TaskList tasks={tasks} />
            <Pagination page={page} maxPages={maxPage} queryParams={queryParams} />
          </div>
          <FilterPanel queryParams={queryParams} tasks={tasks} />
        </div>
      </div>
    </SecondWrapper>
    // </div>
  );
};

export default Home;
