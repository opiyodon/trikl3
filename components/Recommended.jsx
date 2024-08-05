import { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import RecommendedCard from "./RecommendedCard";
import FuturisticLoader from "./FuturisticLoader";

const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;

const Recommended = ({ userProfile }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (userProfile) {
        try {
          const query = `${userProfile.fieldOfStudy} internship in Kenya`;
          const response = await fetch(
            `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`,
            {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
              }
            }
          );

          if (!response.ok) {
            throw new Error('API request failed');
          }

          const data = await response.json();

          if (data.data && data.data.length > 0) {
            setRecommendations(data.data.slice(0, 4)); // Get the top 4 recommendations
          } else {
            console.log('No recommendations found');
          }
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRecommendations();
  }, [userProfile]);

  if (isLoading) {
    return <FuturisticLoader />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended Attachments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendations.map((rec, index) => (
          <RecommendedCard
            key={index}
            company={rec.employer_name}
            position={rec.job_title}
            location={rec.job_city || rec.job_country}
            jobUrl={rec.job_apply_link}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommended;