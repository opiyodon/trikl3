import { useState, useEffect } from 'react';
import RecommendedCard from "./RecommendedCard";
import FuturisticLoader from "./FuturisticLoader";

const Recommended = ({ userProfile }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to get AI-driven recommendations
    setTimeout(() => {
      setRecommendations([
        {
          company: "TechStart",
          position: "Junior Developer Intern",
          logo: "https://logo.clearbit.com/techstart.com",
          jobUrl: "https://techstart.com/careers",
          techField: "Software Engineering"
        },
        {
          company: "DataViz",
          position: "Data Visualization Intern",
          logo: "https://logo.clearbit.com/dataviz.com",
          jobUrl: "https://dataviz.com/internships",
          techField: "Data Science"
        },
        {
          company: "AILabs",
          position: "Machine Learning Intern",
          logo: "https://logo.clearbit.com/ailabs.com",
          jobUrl: "https://ailabs.com/join-us",
          techField: "Artificial Intelligence"
        },
        // Add more recommendations based on user profile
      ]);
      setIsLoading(false);
    }, 1000);
  }, [userProfile]);

  if (isLoading) {
    return <FuturisticLoader />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended Tech Attachments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendations.map((rec, index) => (
          <RecommendedCard key={index} {...rec} />
        ))}
      </div>
    </div>
  );
};

export default Recommended;