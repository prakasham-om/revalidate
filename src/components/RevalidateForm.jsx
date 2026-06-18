import React, { useEffect, useMemo, useState, useRef } from "react";
import magazines from "../constant/magazine";
import { countryToDomain } from "../constant/countryDomain";

const RevalidateForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: "normal",
    companyName: "Project Interactions",
    companyUrl: "projectinteractions.com",
    category: "",
    stateCountry: "",
    country: "",
    region: "",
    magazine: "",
    project: "",
    conferenceName: "",
    conferenceUrl: "",
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef(null);

  // Get all country names
  const countryList = useMemo(() => Object.keys(countryToDomain).sort(), []);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return countryList;
    return countryList.filter(country =>
      country.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch, countryList]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCountrySelect = (country) => {
    const matchedCountry = Object.keys(countryToDomain).find(
      (item) => item.toLowerCase() === country.toLowerCase()
    );

    const region = matchedCountry
      ? countryToDomain[matchedCountry]
      : "";

    setFormData((prev) => ({
      ...prev,
      country,
      region,
      magazine: "",
      project: "",
    }));
    
    setCountrySearch(country);
    setIsCountryDropdownOpen(false);
  };

  const handleCountryInputChange = (e) => {
    const value = e.target.value;
    setCountrySearch(value);
    setIsCountryDropdownOpen(true);
    
    // If input is cleared, reset form data
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        country: "",
        region: "",
        magazine: "",
        project: "",
      }));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
        // If country is selected, keep it, otherwise reset search
        if (!formData.country) {
          setCountrySearch("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formData.country]);

  // Update search input when country is set from other methods
  useEffect(() => {
    if (formData.country) {
      setCountrySearch(formData.country);
    }
  }, [formData.country]);

  const availableMagazines = useMemo(() => {
    if (!formData.region) return [];

    return [
      ...new Map(
        magazines
          .filter(
            (item) =>
              item.region === formData.region.toUpperCase()
          )
          .map((item) => [item.magazine, item])
      ).values(),
    ];
  }, [formData.region]);

  const availableProjects = useMemo(() => {
    if (!formData.magazine || !formData.region) return [];

    let projects = magazines.filter(
      (item) =>
        item.magazine === formData.magazine &&
        item.region === formData.region.toUpperCase()
    );

    if (formData.type === "normal") {
      projects = projects.filter(
        (item) => !item.project.includes("Premium")
      );
    }

    return projects;
  }, [formData.magazine, formData.region, formData.type]);

  useEffect(() => {
    if (availableProjects.length === 1) {
      setFormData((prev) => ({
        ...prev,
        project: availableProjects[0].project,
      }));
    } else if (availableProjects.length === 0) {
      setFormData((prev) => ({
        ...prev,
        project: "Not Available",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        project: "",
      }));
    }
  }, [availableProjects]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="font-semibold text-lg">
            Add Revalidate Company
          </h2>

          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-light"
          >
            ×
          </button>
        </div>

        <form onSubmit={submitHandler} className="p-6">

          {/* Select Type */}
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <div className="flex items-center gap-10">

              <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Select Type *
              </span>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="normal"
                  checked={formData.type === "normal"}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                Normal
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="coy"
                  checked={formData.type === "coy"}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                COY
              </label>

            </div>
          </div>

          {/* Company Details */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mb-5">
            COMPANY DETAILS
          </h3>

          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>

              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company URL <span className="text-red-500">*</span>
              </label>

              <input
                name="companyUrl"
                value={formData.companyUrl}
                onChange={handleChange}
                placeholder="Enter company URL"
                className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Magazine
              </label>

              <select
                name="magazine"
                value={formData.magazine}
                onChange={handleChange}
                className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                disabled={!formData.region}
              >
                <option value="">
                  {formData.region ? "Select Magazine" : "Select country first"}
                </option>

                {availableMagazines.map((item) => (
                  <option
                    key={`${item.magazine}-${item.region}`}
                    value={item.magazine}
                  >
                    {item.magazine}
                  </option>
                ))}
              </select>
            </div>

            {formData.magazine && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Project
                </label>

                {availableProjects.length > 1 ? (
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                  >
                    <option value="">
                      Select Project
                    </option>

                    {availableProjects.map((item) => (
                      <option
                        key={item.id}
                        value={item.project}
                      >
                        {item.project}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    readOnly
                    value={formData.project}
                    className="w-full h-11 bg-gray-100 border border-gray-300 rounded-md px-3 text-gray-700"
                  />
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category name"
                className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Single State/Country
              </label>

              <select
                name="stateCountry"
                value={formData.stateCountry}
                onChange={handleChange}
                className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="">Select</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

          </div>

          {/* Location */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mt-8 mb-5">
            LOCATION
          </h3>

          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">

            <div ref={countryDropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={countrySearch}
                  onChange={handleCountryInputChange}
                  onFocus={() => setIsCountryDropdownOpen(true)}
                  placeholder="Search country..."
                  className="w-full h-11 border border-gray-300 rounded-md px-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isCountryDropdownOpen && filteredCountries.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm transition-colors duration-150 flex items-center gap-2"
                    >
                      {formData.country === country && (
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={formData.country === country ? "font-medium text-indigo-600" : ""}>
                        {country}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {isCountryDropdownOpen && filteredCountries.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500 text-sm">
                  No countries found
                </div>
              )}

              <p className="text-xs text-indigo-600 font-medium mt-2">
                Add only company with US Presence
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>

              <input
                readOnly
                value={formData.region.toUpperCase()}
                className="w-full h-11 bg-gray-100 border border-gray-300 rounded-md px-3 text-gray-700 cursor-not-allowed"
              />
            </div>

          </div>

          {/* Event Details */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mt-8 mb-5">
            EVENT DETAILS
          </h3>

          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conference Name
              </label>

              <input
                name="conferenceName"
                value={formData.conferenceName}
                onChange={handleChange}
                placeholder="Enter conference name"
                className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conference URL
              </label>

              <input
                name="conferenceUrl"
                value={formData.conferenceUrl}
                onChange={handleChange}
                placeholder="Enter conference URL"
                className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="border-t mt-8 pt-5 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-md font-medium transition-colors"
            >
              Submit
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default RevalidateForm;