import React, { useEffect, useMemo, useState } from "react";
import magazines from "../constant/magazine";
import { countryToDomain } from "../constant/countryDomain";

const RevalidateForm = () => {
  const [formData, setFormData] = useState({
    type: "normal",
    companyName: "",
    companyUrl: "",
    category: "",
    stateCountry: "",
    country: "",
    region: "",
    magazine: "",
    project: "",
    conferenceName: "",
    conferenceUrl: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;

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
  };

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

  // Normal => hide Premium
  if (formData.type === "normal") {
    projects = projects.filter(
      (item) => !item.project.includes("Premium")
    );
  }

  return projects;
}, [
  formData.magazine,
  formData.region,
  formData.type,
]);

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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="font-semibold text-lg">
            Add Revalidate Company
          </h2>

          <button className="text-gray-300 text-xl">
            ×
          </button>
        </div>

        <form onSubmit={submitHandler} className="p-6">

          {/* Select Type */}
          <div className="border rounded-lg p-5 mb-6">
            <div className="flex items-center gap-10">

              <span className="text-xs uppercase font-semibold text-gray-500">
                Select Type *
              </span>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="normal"
                  checked={formData.type === "normal"}
                  onChange={handleChange}
                />
                Normal
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="coy"
                  checked={formData.type === "coy"}
                  onChange={handleChange}
                />
                COY
              </label>

            </div>
          </div>

          {/* Company Details */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mb-5">
            Company Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>

              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full h-11 border rounded-md px-3"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Company URL <span className="text-red-500">*</span>
              </label>

              <input
                name="companyUrl"
                value={formData.companyUrl}
                onChange={handleChange}
                className="w-full h-11 border rounded-md px-3"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Select Magazine
              </label>

              <select
                name="magazine"
                value={formData.magazine}
                onChange={handleChange}
                className="w-full h-11 border rounded-md px-3"
              >
                <option value="">
                  Select Magazine
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

            <div>
              <label className="block text-sm mb-1">
                Select Project
              </label>

              {availableProjects.length > 1 ? (
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full h-11 border rounded-md px-3"
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
                  className="w-full h-11 bg-gray-100 border rounded-md px-3"
                />
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">
                Category
              </label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-11 border rounded-md px-3"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Single State/Country
              </label>

              <input
                name="stateCountry"
                value={formData.stateCountry}
                onChange={handleChange}
                className="w-full h-11 border rounded-md px-3"
              />
            </div>

          </div>

          {/* Location */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mt-8 mb-5">
            Location
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm mb-1">
                Country <span className="text-red-500">*</span>
              </label>

              <input
                list="countries"
                value={formData.country}
                onChange={handleCountryChange}
                className="w-full h-11 border rounded-md px-3"
              />

              <datalist id="countries">
                {Object.keys(countryToDomain).map((country) => (
                  <option
                    key={country}
                    value={country}
                  />
                ))}
              </datalist>

              <p className="text-xs text-indigo-500 italic mt-2">
                Domain auto selected from country
              </p>
            </div>

            <div>
              <label className="block text-sm mb-1">
                Region
              </label>

              <input
                readOnly
                value={formData.region.toUpperCase()}
                className="w-full h-11 bg-gray-100 border rounded-md px-3"
              />
            </div>

          </div>

          {/* Event Details */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2 mt-8 mb-5">
            Event Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm mb-1">
                Conference Name
              </label>

              <input
                name="conferenceName"
                value={formData.conferenceName}
                onChange={handleChange}
                className="w-full h-11 border rounded-md px-3"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Conference URL
              </label>

              <input
                name="conferenceUrl"
                value={formData.conferenceUrl}
                onChange={handleChange}
                className="w-full h-11 border rounded-md px-3"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="border-t mt-8 pt-5 flex justify-end gap-3">

            <button
              type="button"
              className="border px-6 py-2 rounded-md"
            >
              Close
            </button>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
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