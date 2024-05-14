import { EmploymentType } from "../../types";
import AuthSubmit from "../form/AuthSubmit";
import CustomInput from "../form/CustomInput";

const JobStep = ({
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
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <CustomInput
        id="jobTitle"
        label="Job Title"
        type="text"
        register={register}
        getValues={getValues}
        error={errors?.jobTitle?.message}
      />

      <CustomInput
        id="description"
        label="Description"
        type="textarea"
        register={register}
        getValues={getValues}
        error={errors?.description?.message}
      />

      <div className="flex flex-row gap-4">
        <CustomInput
          className="flex-1"
          id="salary"
          label="Salary (USD)"
          alwaysFloatLabel={true}
          type="number"
          register={register}
          getValues={getValues}
          error={errors?.salary?.message}
        />

        <CustomInput
          className="flex-1"
          id="employmentType"
          label="Employment type"
          type="select"
          options={Object.values(EmploymentType)}
          register={register}
          getValues={getValues}
          error={errors?.experience?.message}
        />
      </div>

      {/* <div className="w-full flex flex-row gap-4"> */}
      <CustomInput
        className="flex-1"
        id="requiredSkills"
        label="Required skills"
        type="TagsInput"
        placeholder="Type and press enter to add"
        register={register}
        error={errors?.requiredSkills?.message}
        setValue={setValue}
        getValues={getValues}
        trigger={trigger}
      />

      <CustomInput
        className="flex-1"
        id="preferredSkills"
        label="Preferred Skills"
        placeholder="Type and press enter to add"
        type="TagsInput"
        register={register}
        error={errors?.preferredSkills?.message}
        setValue={setValue}
        getValues={getValues}
        trigger={trigger}
      />
      {/* </div> */}

      {/* <div className="flex flex-row gap-4"> */}
      <CustomInput
        className="flex-1"
        id="workLocations"
        label="Work Locations"
        placeholder="Type and press enter to add"
        type="TagsInput"
        register={register}
        error={errors?.workLocations?.message}
        setValue={setValue}
        getValues={getValues}
        trigger={trigger}
      />

      <CustomInput
        className="flex-1"
        id="technologies"
        label="Technologies"
        placeholder="Type and press enter to add"
        type="TagsInput"
        register={register}
        error={errors?.technologies?.message}
        setValue={setValue}
        getValues={getValues}
        trigger={trigger}
      />
      {/* </div> */}

      <div className="flex w-full justify-end">
        <AuthSubmit>Next</AuthSubmit>
      </div>
    </form>
  );
};

export default JobStep;