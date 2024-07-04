import React from 'react';
import RecommendedCard from "./RecommendedCard";

const Recommended = () => {
  const recommendations = [
    {
      company: "Facebook",
      position: "Software Engineer Intern",
      logo: "https://logo.clearbit.com/facebook.com",
      jobUrl: "https://www.facebook.com/careers/students-and-grads/?teams[0]=internship-opportunities",
      techField: "Software Engineering"
    },
    {
      company: "Google",
      position: "Product Design Intern",
      logo: "https://logo.clearbit.com/google.com",
      jobUrl: "https://careers.google.com/students/",
      techField: "UX/UI Design"
    },
    {
      company: "Netflix",
      position: "Data Analyst Intern",
      logo: "https://logo.clearbit.com/netflix.com",
      jobUrl: "https://jobs.netflix.com/search?q=intern",
      techField: "Data Science"
    },
    {
      company: "Apple",
      position: "Software Engineer Intern",
      logo: "https://logo.clearbit.com/apple.com",
      jobUrl: "https://www.apple.com/careers/us/students.html",
      techField: "Software Engineering"
    },
    {
      company: "Amazon",
      position: "Product Design Intern",
      logo: "https://logo.clearbit.com/amazon.com",
      jobUrl: "https://www.amazon.jobs/en/teams/internships-for-students",
      techField: "UX/UI Design"
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended Tech Attachments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recommendations.map((rec, index) => (
          <RecommendedCard key={index} {...rec} />
        ))}
      </div>
    </div>
  );
};

export default Recommended;