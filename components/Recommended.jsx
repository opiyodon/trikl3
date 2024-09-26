import { useState, useEffect } from 'react';
import RecommendedCard from "./RecommendedCard";
import FuturisticLoader from "./FuturisticLoader";

const API_KEYS = [
  process.env.NEXT_PUBLIC_RAPID_API_KEY_1,
  process.env.NEXT_PUBLIC_RAPID_API_KEY_2,
  process.env.NEXT_PUBLIC_RAPID_API_KEY_3
];

const Recommended = ({ userProfile }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (userProfile) {
        try {
          // Fetch local attachments
          const localResponse = await fetch('/api/attachments');
          const localData = await localResponse.json();

          // Fetch API attachments
          let apiData = [];
          if (userProfile.skills && userProfile.skills.length > 0) {
            const skillQueries = userProfile.skills.map(skill => `${skill} internship in Kenya`);
            for (const query of skillQueries) {
              try {
                const response = await fetch(
                  `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`,
                  {
                    method: 'GET',
                    headers: {
                      'X-RapidAPI-Key': API_KEYS[currentKeyIndex],
                      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                    }
                  }
                );

                if (response.status === 429) {
                  setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % API_KEYS.length);
                  continue; // Try the next skill with a new API key
                }

                if (!response.ok) {
                  throw new Error('API request failed');
                }

                const data = await response.json();
                if (data.data && data.data.length > 0) {
                  apiData = [...apiData, ...data.data];
                }
              } catch (error) {
                console.error('Failed to fetch API recommendations:', error);
              }
            }
          } else {
            // Fetch general attachments if no skills
            try {
              const response = await fetch(
                `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent("internship in Kenya")}&num_pages=1`,
                {
                  method: 'GET',
                  headers: {
                    'X-RapidAPI-Key': API_KEYS[currentKeyIndex],
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                  }
                }
              );

              if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                  apiData = data.data;
                }
              }
            } catch (error) {
              console.error('Failed to fetch general API recommendations:', error);
            }
          }

          // Filter out attachments with malformed URLs
          const validLocalAttachments = localData.filter(att => {
            try {
              new URL(att.url);
              return true;
            } catch {
              return false;
            }
          });

          const validApiAttachments = apiData.filter(att => {
            try {
              new URL(att.job_apply_link);
              return true;
            } catch {
              return false;
            }
          });

          // Balance and combine recommendations
          const totalRecommendations = 4;
          const localCount = Math.min(Math.ceil(totalRecommendations / 2), validLocalAttachments.length);
          const apiCount = totalRecommendations - localCount;

          const combinedRecommendations = [
            ...validLocalAttachments.slice(0, localCount).map(att => ({
              ...att,
              isLocal: true
            })),
            ...validApiAttachments.slice(0, apiCount).map(att => ({
              company: att.employer_name,
              title: att.job_title,
              location: att.job_city || att.job_country,
              description: att.job_description,
              url: att.job_apply_link,
              isLocal: false
            }))
          ];

          setRecommendations(combinedRecommendations);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRecommendations();
  }, [userProfile, currentKeyIndex]);

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
            company={rec.company}
            title={rec.title}
            location={rec.location}
            description={rec.description}
            url={rec.url}
            isLocal={rec.isLocal}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommended;