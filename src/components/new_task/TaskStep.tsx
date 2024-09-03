import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AllowedLanguages } from "../../types";
import AuthSubmit from "../form/CustomSubmit";
import CustomInput from "../form/CustomInput";
import { useState } from "react";
import {
  faChevronUp,
  faChevronDown,
  faPlus,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import FileForm from "./FileForm";
import TemplateFileForm from "./TemplateFileForm";

type OutputTestFile = {
  language: string;
  testCases: { name: string; input: string; expectedOutput: string }[];
  name: string;
  testFileBase64: string;
};

type OutputTemplateFile = {
  language: string;
  name: string;
  contentBase64: string;
};

const TaskStep = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  setValue,
  getValues,
  trigger,
}: {
  handleSubmit: any;
  onSubmit: any;
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  trigger: any;
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeTestFile, setActiveTestFile] = useState<number | false>(false);
  const [activeTemplateFile, setActiveTemplateFile] = useState<number | false>(
    false
  );
  const [showTestsFileForm, setShowTestsFileForm] = useState<boolean>(false);
  const [showTemplatesFileForm, setShowTemplatesFileForm] =
    useState<boolean>(false);

  const [, dummy] = useState(0);

  const forceUpdate = () => {
    dummy((prev) => prev + 1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <CustomInput
        id="title"
        label="Task title"
        type="text"
        register={register}
        getValues={getValues}
        error={errors?.title?.message}
      />

      <CustomInput
        id="instructions"
        label="Instructions"
        floatLabel={false}
        type="mdeditor"
        trigger={trigger}
        register={register}
        getValues={getValues}
        setValue={setValue}
        error={errors?.instructions?.message}
      />

      <div className="flex flex-wrap flex-row gap-4">
        <CustomInput
          className="flex-1"
          id="opensAt"
          label="Opens at"
          alwaysFloatLabel={true}
          type="datetime-local"
          register={register}
          error={errors?.opensAt?.message}
          setValue={setValue}
          getValues={getValues}
        />

        <CustomInput
          className="flex-1"
          id="closesAt"
          label="Closes at"
          alwaysFloatLabel={true}
          type="datetime-local"
          register={register}
          error={errors?.closesAt?.message}
          setValue={setValue}
          getValues={getValues}
        />
      </div>

      <CustomInput
        id="reward"
        label="Reward (credits)"
        hint="Sum of amounts of credits to be rewarded for this task"
        alwaysFloatLabel={true}
        type="number"
        register={register}
        error={errors?.reward?.message}
        setValue={setValue}
        getValues={getValues}
      />

      <CustomInput
        id="allowedLanguages"
        label="Allowed languages"
        placeholder="Type and press enter to add"
        type="select"
        options={Object.values(AllowedLanguages)}
        register={register}
        error={errors?.allowedLanguages?.message}
        setValue={setValue}
        getValues={getValues}
        multiple={true}
      />

      <p
        onClick={() => {
          setShowAdvanced((prev) => !prev);
        }}
        className="opacity-70 cursor-pointer flex items-center flex-row gap-2"
      >
        {showAdvanced ? (
          <>
            <span>Hide advanced</span>
            <FontAwesomeIcon icon={faChevronUp} />
          </>
        ) : (
          <>
            <span>Show advanced</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </>
        )}
      </p>
      <div
        className={`${
          showAdvanced ? "block" : "hidden"
        } flex flex-col gap-4 p-4 bg-main-darker rounded`}
      >
        <CustomInput
          id="memoryLimit"
          label="Memory limit (kb)"
          type="number"
          alwaysFloatLabel={true}
          register={register}
          error={errors?.memoryLimit?.message}
          getValues={getValues}
        />

        <CustomInput
          id="timeLimit"
          label="Time limit (s)"
          type="text"
          alwaysFloatLabel={true}
          register={register}
          error={errors?.timeLimit?.message}
          getValues={getValues}
        />

        <div className="bg-main-bg-input z-10 relative flex items-center rounded pl-4 pr-8 pb-4 pt-6 text-sm md:text-base w-full outline-none text-white box-border">
          <h2
            className={`absolute top-0 left-0 p-4 flex items-center transition-all duration-100 ease-linear whitespace-nowrap ${
              getValues("tests").length > 0
                ? "text-xs opacity-70 h-auto -translate-y-3"
                : "h-full text-sm text-white md:text-base cursor-text"
            }`}
          >
            Tests files
          </h2>
          <div className="flex flex-wrap flex-row gap-4 relative pr-12 min-h-8 w-full">
            {getValues("tests").map((file: OutputTestFile, index: number) => (
              <div
                key={index}
                className="flex flex-row gap-2 bg-main-bg-color rounded w-max items-center h-8 p-1 !box-border"
              >
                <span>{file.name}</span>
                <span>{file.language}</span>
                <FontAwesomeIcon
                  icon={faPen}
                  className="mx-2 text-xs cursor-pointer text-white hover:text-indigo-500 transition-colors duration-100 ease-linear rounded-r"
                  onClick={() => {
                    setActiveTestFile(index);
                    setShowTestsFileForm((prev) => !prev);
                  }}
                />
                <FontAwesomeIcon
                  icon={faXmark}
                  className="mr-2 text-base cursor-pointer text-white hover:text-error-color transition-colors duration-100 ease-linear rounded-r"
                  onClick={() => {
                    const prev = getValues("tests") as OutputTestFile[];
                    setValue(
                      "tests",
                      prev.filter((_, i) => i !== index)
                    );
                    forceUpdate();
                  }}
                />
              </div>
            ))}
            <button
              onClick={() => {
                setActiveTestFile(false);
                setShowTestsFileForm((prev) => !prev);
              }}
              type="button"
              className="absolute top-0 right-0 flex justify-center items-center w-8 h-8 text-sm text-white bg-main-bg-color hover:bg-main-darker transition-colors duration-100 ease-linear rounded"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>

        <div className="bg-main-bg-input z-10 relative flex items-center rounded pl-4 pr-8 pb-4 pt-6 text-sm md:text-base w-full outline-none text-white box-border">
          <h2
            className={`absolute top-0 left-0 p-4 flex items-center transition-all duration-100 ease-linear whitespace-nowrap ${
              getValues("templateFiles").length > 0
                ? "text-xs opacity-70 h-auto -translate-y-3"
                : "h-full text-sm text-white md:text-base cursor-text"
            }`}
          >
            Template files
          </h2>
          <div className="flex flex-wrap flex-row gap-4 relative pr-12 min-h-8 w-full">
            {getValues("templateFiles").map(
              (file: OutputTemplateFile, index: number) => (
                <div
                  key={index}
                  className="flex flex-row gap-2 bg-main-bg-color rounded w-max items-center h-8 p-1 !box-border"
                >
                  <span>{file.name}</span>
                  <span>{file.language}</span>
                  <FontAwesomeIcon
                    icon={faPen}
                    className="mx-2 text-xs cursor-pointer text-white hover:text-indigo-500 transition-colors duration-100 ease-linear rounded-r"
                    onClick={() => {
                      setActiveTemplateFile(index);
                      setShowTemplatesFileForm((prev) => !prev);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="mr-2 text-base cursor-pointer text-white hover:text-error-color transition-colors duration-100 ease-linear rounded-r"
                    onClick={() => {
                      const prev = getValues(
                        "templateFiles"
                      ) as OutputTemplateFile[];

                      setValue(
                        "templateFiles",
                        prev.filter((_, i) => i !== index)
                      );

                      forceUpdate();
                    }}
                  />
                </div>
              )
            )}
            <button
              onClick={() => {
                setActiveTemplateFile(false);
                setShowTemplatesFileForm((prev) => !prev);
              }}
              type="button"
              className="absolute top-0 right-0 flex justify-center items-center w-8 h-8 text-sm text-white bg-main-bg-color hover:bg-main-darker transition-colors duration-100 ease-linear rounded"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
      </div>

      <FileForm
        open={showTestsFileForm}
        setOpen={setShowTestsFileForm}
        languages={Object.values(AllowedLanguages)}
        getValues={getValues}
        setValue={setValue}
        data={activeTestFile}
      />

      <TemplateFileForm
        open={showTemplatesFileForm}
        setOpen={setShowTemplatesFileForm}
        languages={Object.values(AllowedLanguages)}
        getValues={getValues}
        setValue={setValue}
        data={activeTemplateFile}
      />

      <div className="flex w-full justify-end">
        <AuthSubmit className="w-full">Create job offer</AuthSubmit>
      </div>

      {errors?.root?.message && (
        <div className="bg-error-color text-white text-sm p-4 rounded animate-shake">
          {errors?.root?.message}
        </div>
      )}
    </form>
  );
};

export default TaskStep;
