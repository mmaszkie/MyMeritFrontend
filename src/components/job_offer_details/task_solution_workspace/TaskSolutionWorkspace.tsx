import React, { useEffect, useState } from "react";
import MyFile from "../../../models/MyFile";
import Cookies from "universal-cookie";

import UserTaskDTO from "../../../models/dtos/UserTaskDTO";
import { useAuth } from "../../../hooks/useAuth";
import {
  downloadFilesForJob,
  submitSolution,
} from "../../../services/JobOfferService";
import {
  ContentType,
  languageToExtension,
} from "../../editor_workspace/utils/fileUtils";
import { errorToast, loadingToast, successToast } from "../../../main";
import {
  mergeFilesWithCookies,
  serializeFiles,
} from "../../editor_workspace/utils/cookieFunctions";
import EditorWorkspace from "../../editor_workspace/EditorWorkspace";
import SubmitButton from "./SubmitButton";
import { templateFile } from "../../../types";

const cookies = new Cookies();

type TransformedLanguageData = {
  [key: string]: {
    name: string;
    contentBase64: string;
  }[];
};

const transformByLanguages = (
  data: templateFile[]
): TransformedLanguageData => {
  return data.reduce((acc, item) => {
    if (!acc[item.language]) {
      acc[item.language] = [];
    }
    acc[item.language].push({
      name: item.name,
      contentBase64: item.contentBase64,
    });
    return acc;
  }, {} as TransformedLanguageData);
};

const TaskSolutionWorkspace: React.FC<{
  jobId: string;
  task: UserTaskDTO;
  isEditable: boolean;
  userId : string;
}> = ({ jobId, task, isEditable, userId }) => {
  const { accessToken} = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    task.templateFiles && Object.keys(task.templateFiles).length > 0
      ? Object.keys(transformByLanguages(task.templateFiles))[0]
      : task.allowedLanguages[0] ?? ""
  );
  const currentTaskCookies = cookies.get(
    jobId + "-" + currentLanguage ?? task?.allowedLanguages[0]
  );
  const [files, setFiles] = useState<MyFile[]>([]);
  const [filesFetched, setFilesFetched] = useState(false);
  const [mainFileIndex] = useState<number>(
    currentTaskCookies ? currentTaskCookies.mainFileIndex : 0
  );
  const [currentFileIndex] = useState<number>(
    currentTaskCookies ? currentTaskCookies.mainFileIndex : 0
  );

  const currentFile = files[currentFileIndex];

  useEffect(() => {
    const initializeFiles = async () => {
      if (task.userSolution) {
        try {
          const response = await downloadFilesForJob(jobId, accessToken!);
          if (response.ok) {
            const fetchedFiles = await response.json();
            const mergedFiles = currentTaskCookies
              ? mergeFilesWithCookies(fetchedFiles, currentTaskCookies)
              : fetchedFiles;
            setFiles(mergedFiles);
            setFilesFetched(true);
          } else {
            console.error("Error downloading files:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching solution files:", error);
        }
      } else if (currentTaskCookies) {
        console.log(currentLanguage);
        setFiles(
          currentTaskCookies.files.map(
            (file: MyFile) =>
              new MyFile(file.name, file.type, file.contentBase64)
          )
        );
        setFilesFetched(true);
      } else if (task.templateFiles && task.templateFiles.length > 0) {
        let templateFiles = [];

        // grouped by languages
        const groupedByLanguages = transformByLanguages(task.templateFiles);

        const currentLanguageFiles = groupedByLanguages[currentLanguage];

        if (currentLanguageFiles) {
          templateFiles = currentLanguageFiles;
        } else {
          const firstLanguage = Object.keys(groupedByLanguages)[0];
          templateFiles = groupedByLanguages[firstLanguage];
        }

        setFiles(
          templateFiles.map(
            (file) => new MyFile(file.name, ContentType.TXT, file.contentBase64)
          )
        );
      } else {
        setFiles([
          new MyFile(
            "main." +
              languageToExtension[
                currentLanguage.toLowerCase()
              ],
            ContentType.TXT,
            ""
          ),
        ]);
        setFilesFetched(true);
      }
    };
    initializeFiles();
  }, [task, accessToken, currentLanguage]);

  useEffect(() => {
    if (filesFetched) {
      cookies.set(
        jobId + "-" + currentLanguage + "-" + userId,
        serializeFiles(files, jobId, mainFileIndex, currentLanguage),
        { expires: new Date(task.closesAt) }
      );
    }
  }, [files, jobId, filesFetched, mainFileIndex, userId]);

  const submit = () => {
    const id = loadingToast("Submitting your solution...");

    const fetchData = async () => {
      try {
        if (accessToken) {
          const response = await submitSolution(
            jobId,
            files,
            accessToken,
            currentLanguage,
            files[mainFileIndex].name,
          );
          if (response.ok) {
            successToast("Submitted successfully!", id.toString());
          } else {
            errorToast("Something didn't work", id.toString());
          }
        } else {
          errorToast("Invalid access token", id.toString());
        }
      } catch (error) {
        errorToast("Credentials expired", id.toString());
      }
    };

    fetchData();
  };

  return (
    <div className="flex flex-col w-full lg:w-3/4 items-end h-auto">
      {currentFile && (
        <div className="flex flex-col w-full h-full">
          <EditorWorkspace
            files={files}
            setFiles={setFiles}
            isEditable={isEditable}
            isFeedbackView={task.companyFeedback !== null}
            task={task}
            mainFileIndex={mainFileIndex}
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
            submitComponent={
              <SubmitButton submitSolution={submit} isClosed={false} />
            }
          />
        </div>
      )}
    </div>
  );
};

export default TaskSolutionWorkspace;
