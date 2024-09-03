import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import TaskInfo from "../../components/job_offer_details/task_info/TaskInfo";
import TaskSolutionWorkspace from "../../components/job_offer_details/task_solution_workspace/TaskSolutionWorkspace";
import { getJobOfferById } from "../../services/JobOfferService";
import { useAuth } from "../../hooks/useAuth";
import JobOfferDetailsDTO from "../../models/dtos/JobOfferDetailsDTO";
import { TaskStatus } from "../../models/TaskStatus";
import CompanySolutions from "../../components/job_offer_details/solution_list/CompanySolutions";
import TaskFeedbackWorkspace from "../../components/job_offer_details/feedback_workspace/TaskFeedbackWorkspace";
import FeedbackMessage from "../../components/job_offer_details/task_info/FeedbackMessage";

const TaskSolutionDetails: React.FC = () => {
  const { id: jobOfferId } = useParams<{ id: string }>();
  const [jobOffer, setJobOffer] = useState<JobOfferDetailsDTO | null>(null);
  const { accessToken, userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken && jobOfferId) {
          const response = await getJobOfferById(jobOfferId, accessToken);
          setJobOffer(response);
        } else {
          console.log("No access token provided or job offer ID missing");
        }
      } catch (error) {
        console.error("Error fetching job offer details:", error);
      }
    };
    fetchData();
  }, [accessToken, jobOfferId]);

  if (!jobOffer) {
    return <p>Loading...</p>;
  }

  const { task, solutions } = jobOffer;
  const feedback = task.companyFeedback;

  if (!task || (task.status !== TaskStatus.OPEN && !task.userSolution)) {
    return <Navigate to={`/job/${jobOfferId}`} />;
  }

  console.log("Rendering TaskSolutionDetails");
  console.log("userId:", userId);
  console.log("jobOfferId:", jobOfferId);
  console.log("jobOffer:", jobOffer);
  console.log("task:", task);
  console.log("feedback:", feedback);
  console.log("solutions:", solutions);
  return (
    <div className="flex flex-col gap-3 lg:flex-row mx-auto h-full lg:h-[calc(100vh-120px)] h-full">
      <div className="h-full flex flex-col h-full flex-1 mb-4 lg:mb-0">
        <TaskInfo
          task={task}
          jobId={jobOfferId}
          withToggle={feedback !== undefined && feedback !== null}
          feedbackElement={
            feedback ? <FeedbackMessage feedback={feedback} /> : undefined
          }
        />
      </div>
      {solutions ? (
        <CompanySolutions solutions={solutions} />
      ) : feedback ? (
        <>
          <TaskFeedbackWorkspace
            // jobId={jobOfferId!}
            task={task}
            isEditable={false}
            solutionId={task.userSolution.id}
          />
        </>
      ) : (
        <TaskSolutionWorkspace
          jobId={jobOfferId!}
          task={task}
          isEditable={task.status === TaskStatus.OPEN}
          userId={userId!}
        />
      )}
    </div>
  );
};

export default TaskSolutionDetails;
