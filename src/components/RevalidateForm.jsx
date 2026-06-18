import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import magazines from "../constant/magazine";
import { countryToDomain } from "../constant/countryDomain";
import stateCountry from "../constant/stateOfCountry";

// Mapping between full country names and state keys
const countryToStateKey = {
  "United States": "USA",
  "Canada": "CANADA",
  "Australia": "AUSTRALIA"
};

// Get state key from country name
const getStateKey = (countryName) => {
  return countryToStateKey[countryName] || null;
};

// Check if country has states
const hasStates = (countryName) => {
  return countryToStateKey[countryName] !== undefined;
};

const RevalidateForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: "normal",
    country: "",
    region: "",
    stateCountry: "",
    companyName: "Project Interactions",
    companyUrl: "projectinteractions.com",
    category: "",
    magazine: "",
    project: "",
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const countryDropdownRef = useRef(null);

  // Memoized country list
  const countryList = useMemo(() => Object.keys(countryToDomain).sort(), []);
  
  // Filter countries based on search
  const filteredCountries = useMemo(() => 
    countryList.filter(country => 
      country.toLowerCase().includes(countrySearch.toLowerCase())
    ),
    [countrySearch, countryList]
  );

  // Get states for selected country
  const availableStates = useMemo(() => {
    if (!formData.country) return [];
    const stateKey = getStateKey(formData.country);
    return stateKey ? stateCountry[stateKey] || [] : [];
  }, [formData.country]);

  // Check if selected country has states
  const showStateDropdown = useMemo(() => {
    return formData.country && hasStates(formData.country);
  }, [formData.country]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCountrySelect = useCallback((country) => {
    const matchedCountry = Object.keys(countryToDomain).find(
      item => item.toLowerCase() === country.toLowerCase()
    );
    const region = matchedCountry ? countryToDomain[matchedCountry] : "";

    setFormData(prev => ({
      ...prev,
      country,
      region,
      stateCountry: "",
      magazine: "",
      project: "",
    }));
    
    setCountrySearch(country);
    setIsCountryDropdownOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const handleCountryInputChange = useCallback((e) => {
    const value = e.target.value;
    setCountrySearch(value);
    setIsCountryDropdownOpen(true);
    setHighlightedIndex(-1);
    
    if (value === "") {
      setFormData(prev => ({
        ...prev,
        country: "",
        region: "",
        stateCountry: "",
        magazine: "",
        project: "",
      }));
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isCountryDropdownOpen || filteredCountries.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
          handleCountrySelect(filteredCountries[highlightedIndex]);
        } else if (filteredCountries.length === 1) {
          // Auto-select if only one result
          handleCountrySelect(filteredCountries[0]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsCountryDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
      
      default:
        break;
    }
  }, [isCountryDropdownOpen, filteredCountries, highlightedIndex, handleCountrySelect]);

  // Auto-select when there's only one match and user types
  useEffect(() => {
    if (filteredCountries.length === 1 && countrySearch && isCountryDropdownOpen) {
      // Auto-select after a small delay to allow typing
      const timer = setTimeout(() => {
        if (filteredCountries.length === 1) {
          handleCountrySelect(filteredCountries[0]);
        }
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    }
  }, [filteredCountries, countrySearch, isCountryDropdownOpen, handleCountrySelect]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
        if (!formData.country) setCountrySearch("");
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formData.country]);

  useEffect(() => {
    if (formData.country) setCountrySearch(formData.country);
  }, [formData.country]);

  const availableMagazines = useMemo(() => {
    if (!formData.region) return [];
    
    return [...new Map(
      magazines
        .filter(item => item.region === formData.region.toUpperCase())
        .map(item => [item.magazine, item])
    ).values()];
  }, [formData.region]);

  // Get magazines with region display (exclude region for CANADA, LATIN, USA)
  const magazineOptions = useMemo(() => {
    if (!formData.region) return [];
    
    const EXCLUDED_REGIONS = ["LATIN", "CANADA", "USA"];
    
    return magazines
      .filter(item => item.region === formData.region.toUpperCase())
      .map(item => {
        const isExcluded = EXCLUDED_REGIONS.includes(item.region?.toUpperCase());
        return {
          value: item.magazine,
          label: isExcluded ? item.magazine : `${item.magazine} ${item.region}`
        };
      });
  }, [formData.region]);

  const availableProjects = useMemo(() => {
    if (!formData.magazine || !formData.region) return [];
    
    let projects = magazines.filter(
      item => item.magazine === formData.magazine && 
              item.region === formData.region.toUpperCase()
    );

    if (formData.type === "normal") {
      projects = projects.filter(item => !item.project.includes("Premium"));
    }

    return projects;
  }, [formData.magazine, formData.region, formData.type]);

  useEffect(() => {
    if (availableProjects.length === 1) {
      setFormData(prev => ({ ...prev, project: availableProjects[0].project }));
    } else if (availableProjects.length === 0) {
      setFormData(prev => ({ ...prev, project: "Not Available" }));
    } else {
      setFormData(prev => ({ ...prev, project: "" }));
    }
  }, [availableProjects]);

  const submitHandler = useCallback((e) => {
    e.preventDefault();
    console.log(formData);
    // Add your API call here
  }, [formData]);

  // Reusable input field component
  const InputField = useCallback(({ name, label, required, placeholder, readOnly, value }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={value || formData[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}`}
      />
    </div>
  ), [formData, handleChange]);

  // Reusable select field component
  const SelectField = useCallback(({ name, label, value, onChange, options, disabled, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full h-11 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors hover:border-gray-400"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  ), []);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center rounded-t-xl sticky top-0 z-10">
          <h2 className="font-semibold text-lg">Add Revalidate Company</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl font-light transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={submitHandler} className="p-6">
          {/* Select Type */}
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <div className="flex items-center gap-10 flex-wrap">
              <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Select Type *</span>
              {["normal", "coy"].map(type => (
                <label key={type} className="flex items-center gap-2 text-sm cursor-pointer hover:text-indigo-600 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  {type.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mb-5">LOCATION</h3>
          
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
                  onKeyDown={handleKeyDown}
                  placeholder="Search country..."
                  className="w-full h-11 border border-gray-300 rounded-md px-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors hover:border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Toggle country dropdown"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isCountryDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country, index) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center gap-2 ${
                          highlightedIndex === index 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'hover:bg-indigo-50'
                        }`}
                      >
                        {formData.country === country && (
                          <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className={formData.country === country ? "font-medium text-indigo-600" : ""}>
                          {country}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">No countries found</div>
                  )}
                </div>
              )}
            </div>

            {/* State dropdown - only show if country has states */}
            {showStateDropdown && (
              <SelectField
                name="stateCountry"
                label="State/Province"
                value={formData.stateCountry}
                onChange={handleChange}
                options={availableStates}
                disabled={!availableStates.length}
                placeholder="Select State/Province"
              />
            )}

            <InputField name="region" label="Domain" readOnly value={formData.region?.toUpperCase() || ""} />
          </div>

          {/* Company Details */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mt-8 mb-5">COMPANY DETAILS</h3>
          
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <InputField name="companyName" label="Company Name" required placeholder="Enter company name" />
            <InputField name="companyUrl" label="Company URL" required placeholder="Enter company URL" />
            
            <SelectField
              name="magazine"
              label="Select Magazine"
              value={formData.magazine}
              onChange={handleChange}
              options={magazineOptions}
              disabled={!formData.region || !magazineOptions.length}
              placeholder={formData.region ? "Select Magazine" : "Select country first"}
            />

            {formData.magazine && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
                {availableProjects.length > 1 ? (
                  <SelectField
                    name="project"
                    label=""
                    value={formData.project}
                    onChange={handleChange}
                    options={availableProjects.map(item => item.project)}
                    placeholder="Select Project"
                  />
                ) : (
                  <input
                    readOnly
                    value={formData.project}
                    className="w-full h-11 bg-gray-100 border border-gray-300 rounded-md px-3 text-gray-700 cursor-not-allowed"
                  />
                )}
              </div>
            )}

            <InputField name="category" label="Category" placeholder="Category name" />
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-md font-medium transition-colors shadow-sm hover:shadow-md"
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