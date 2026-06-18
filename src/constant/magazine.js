const PROJECT_TYPES = [
  "Premium",
  "Special",
  "Service",
];

const MAGAZINES = [
  {
    magazine: "Energy Technology",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Energy Business",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Retail Technology",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Retail Business",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Food & Beverage Technology",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Food Business",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Healthcare",
    regions: ["US"],
  },
  {
    magazine: "Chemical",
    regions: ["US", "CANADA"],
  },
  {
    magazine: "HR Technology",
    regions: ["US", "CANADA", "EUROPE"],
  },
  {
    magazine: "CFO Tech",
    regions: ["US", "CANADA", "EUROPE", "APAC"],
  },
  {
    magazine: "Finance",
    regions: ["US", "CANADA", "LATIN"],
  },
  {
    magazine: "Manufacturing",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Utility",
    regions: ["US", "CANADA"],
  },
  {
    magazine: "Electric",
    regions: ["US", "CANADA"],
  },
  {
    magazine: "Aerospace",
    regions: ["US", "CANADA", "APAC"],
  },
  {
    magazine: "Logistics",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Agriculture",
    regions: ["US", "CANADA", "LATIN"],
    projects: [
      "Agi Bio Spcecial",
    ]
  },
  {
    magazine: "Cannabis",
    regions: ["US", "CANADA"],
  },
  {
    magazine: "MediTech",
    regions: ["US"],
  },
  {
    magazine: "CIO Applications",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Semiconductor",
    regions: ["US", "APAC"],
  },
  {
    magazine: "CIOReview",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Banking CIO",
    regions: ["US", "CANADA", "LATIN"],
  },
  {
    magazine: "AutoTech",
    regions: ["US", "CANADA", "EUROPE"],
  },
  {
    magazine: "Insurance",
    regions: ["US", "CANADA", "EUROPE"],
  },
  {
    magazine: "Applied Technology",
    regions: ["US", "CANADA", "LATIN", "EUROPE", "APAC"],
  },
  {
    magazine: "Pharma",
    regions: ["US", "EUROPE"],
  },
  {
    magazine: "Biotech",
    regions: ["US", "EUROPE"],
  },
  {
    magazine: "Cybersecurity",
    regions: ["US", "CANADA", "EUROPE", "APAC"],
  },
  {
    magazine: "MarTech",
    regions: ["US"],
  },
];

const magazines = [];

let id = 1;

MAGAZINES.forEach((mag) => {
 const projects = [
  ...PROJECT_TYPES,
  ...(mag.projects || [])
];

  mag.regions.forEach((region) => {
    projects.forEach((projectType) => {
      magazines.push({
        id: id++,
        magazine: mag.magazine,
        region,
        project: `${mag.magazine} ${region} ${projectType}`,
      });
    });
  });
});

export default magazines;