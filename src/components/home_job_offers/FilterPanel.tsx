import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QueryParams } from "../../models/QueryParams";
import RangeInput from "../range_input/RangeInput";
import { buildURL } from "./URLHelper";

const FilterPanel: React.FC<{
  queryParams: QueryParams;
  handleChange: (key: string, value: any) => void;
}> = ({ queryParams, handleChange }) => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [languages] = useState([
    "Python",
    "Javascript",
    "Cpp",
    "Java",
    "Kotlin",
  ]);

  const [countryInput, setCountryInput] = useState<string>("");
  const [cityInput, setCityInput] = useState<string>("");

  useEffect(() => {
    let URL = buildURL(queryParams);
    if (URL.charAt(URL.length - 1) === "&") {
      URL = URL.slice(0, -1);
    }
    navigate(URL);
  }, [queryParams]);

  const handleFilterChange = (key: string, value: any) => {
    handleChange(key, value);
    handleChange("page", 0);
  };

  const toggleLanguage = (language: string) => {
    const updatedLanguages = queryParams.languages
      ? queryParams.languages.includes(language)
        ? queryParams.languages.filter((lang) => lang !== language)
        : [...queryParams.languages, language]
      : [language];
    handleFilterChange("languages", updatedLanguages);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const isSelected = (language: string) => {
    return queryParams.languages?.includes(language);
  };


  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityInput(e.target.value);
  };

  const addCity = () => {
    if (cityInput && !queryParams.cities?.includes(cityInput)) {
      const updatedCities = queryParams.cities
          ? [...queryParams.cities, cityInput]
          : [cityInput];
      handleFilterChange("cities", updatedCities);
      setCityInput("");
    }
  };

  const removeCity = (city: string) => {
    const updatedCities = queryParams.cities?.filter((c) => c !== city);
    handleFilterChange("cities", updatedCities);
  };

  const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountryInput(e.target.value);
  };

  const addCountry = () => {
    if (countryInput && !queryParams.countries?.includes(countryInput)) {
      const updatedCountries = queryParams.countries
          ? [...queryParams.countries, countryInput]
          : [countryInput];
      handleFilterChange("countries", updatedCountries);
      setCountryInput("");
    }
  };

  const removeCountry = (country: string) => {
    const updatedCountries = queryParams.countries?.filter(
        (c) => c !== country
    );
    handleFilterChange("countries", updatedCountries);
  };

  return (
    <div className="h-full">
      <div
        className={
          "max-md:absolute top-0 left-0 z-[1000] w-[100%] bg-secondary-bg-color px-5 py-4 mb-10 rounded lg:flex lg:flex-col justify-between " +
          (isPopupOpen ? "popup-open" : "hidden")
        }
      >
        <div className="lg:mt-0 h-[100%] flex flex-col lg:max-w-[22rem]">
          <div
            className={
              "flex justify-between border-b-[1px] mb-5 border-main-border " +
              (isPopupOpen ? "" : "hidden")
            }
          >
            <p className="font-medium text-sm text-task-lighter">FILTERS</p>
            <button
              onClick={togglePopup}
              className={
                "text-white text-sm mb-3 self-end hover:underline " +
                (isPopupOpen ? "" : "hidden")
              }
            >
              CLOSE
            </button>
          </div>
          <div className="flex flex-col h-full w-full gap-3">
            <div className="flex flex-col lg:items-start">
              <label className="pb-2.5 lg:pb-2 text-sm font-medium">
                Languages
              </label>
              <div className="flex flex-wrap text-sm font-medium">
                {languages.map((language) => (
                    <button
                        onClick={() => toggleLanguage(language)}
                        key={language}
                        className={
                            "px-4 py-2 rounded mr-2 mb-2 " +
                            (isSelected(language)
                                ? "border-2 border-emerald-400 text-emerald-300"
                                : "bg-main-lighter-2 border-2 border-main-lighter-2")
                        }
                    >
                      {language}
                    </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col lg:items-start">
              <label className="pb-2.5 lg:pb-2 text-sm font-medium">
                Countries
              </label>
              <div className="flex flex-col text-sm font-medium">
                <div className="flex">
                  <input
                      type="text"
                      value={countryInput}
                      onChange={handleCountryInputChange}
                      className="px-4 py-2 rounded mr-2 mb-0 bg-main-lighter-2 border-2 border-main-lighter-2"
                      placeholder="Add a country"
                  />
                  <button
                      onClick={addCountry}
                      className="px-4 py-2 rounded bg-success-color text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap mt-2">
                  {queryParams.countries?.map((country) => (
                      <div
                          key={country}
                          className="px-4 py-2 rounded mr-2 mb-2 border-2 border-emerald-400 text-emerald-300 flex items-center"
                      >
                        {country}
                        <button
                            onClick={() => removeCountry(country)}
                            className="ml-2 text-bg-main-lighter-2 hover:text-red-800"
                        >
                          &times;
                        </button>
                      </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:items-start">
              <label className="pb-2.5 lg:pb-2 text-sm font-medium">
                Cities
              </label>
              <div className="flex flex-col text-sm font-medium">
                <div className="flex">
                  <input
                      type="text"
                      value={cityInput}
                      onChange={handleCityInputChange}
                      className="px-4 py-2 rounded mr-2 mb-0 bg-main-lighter-2 border-2 border-main-lighter-2"
                      placeholder="Add a city"
                  />
                  <button
                      onClick={addCity}
                      className="px-4 py-2 rounded bg-success-color text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap mt-2">
                  {queryParams.cities?.map((city) => (
                      <div
                          key={city}
                          className="px-4 py-2 rounded mr-2 mb-2 border-2 border-emerald-400 text-emerald-300 flex items-center"
                      >
                        {city}
                        <button
                            onClick={() => removeCity(city)}
                            className="ml-2 text-bg-main-lighter-2 hover:text-red-800"
                        >
                          &times;
                        </button>
                      </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col pt-2 text-sm pb-2 lg:justify-center lg:items-stretch">
              <RangeInput
                  label="Merit Credits"
                  min={0}
                  max={1000}
                  minValue={queryParams.minCredits}
                  maxValue={queryParams.maxCredits}
                  onInputChange={(e) =>
                      handleFilterChange("minCredits", e.minValue)
                  }
              />
            </div>
            <div className="flex flex-col pt-2 pb-2 lg:items-stretch">
              <label className="pb-1.5 lg:pb-2 text-sm font-medium">
                Opens From
              </label>
              <input
                  type="date"
                  className="outline-none mt-1 p-2 px-3 w-[100%] rounded bg-main-lighter-2"
                  onChange={(e) =>
                      handleFilterChange("minOpensIn", e.target.value)
                  }
              />
            </div>
            <div className="flex flex-col pt-2 pb-2 lg:items-stretch">
              <label className="pb-1.5 lg:pb-2 text-sm font-medium">
                Opens To
              </label>
              <input
                  type="date"
                  className="outline-none mt-1 p-2 px-3 w-[100%] rounded bg-main-lighter-2"
                  onChange={(e) =>
                      handleFilterChange("maxOpensIn", e.target.value)
                  }
              />
            </div>
            <div className="flex flex-col pt-2 text-sm pb-2 lg:justify-center lg:items-stretch">
              <RangeInput
                  label="Salary"
                  min={0}
                  max={40000}
                  minValue={queryParams.minSalary}
                  maxValue={queryParams.maxSalary}
                  currency="$"
                  onInputChange={(e) =>
                      handleFilterChange("minSalary", e.minValue)
                  }
              />
            </div>
          </div>
          <button
              className={
                  "w-[100%] m-auto bg-emerald-400 text-sm mt-5 font-semibold rounded p-3 " +
                  (isPopupOpen ? "" : "hidden")
              }
              onClick={togglePopup}
          >
            FILTER
          </button>
        </div>
      </div>
      <button
          className="lg:hidden w-full text-center appearance-none text-sm font-medium outline-none py-3 rounded bg-secondary-bg-color"
          onClick={togglePopup}
      >
        {isPopupOpen ? "HIDE FILTERS" : "SHOW FILTERS"}
      </button>
    </div>
  );
};

export default FilterPanel;
