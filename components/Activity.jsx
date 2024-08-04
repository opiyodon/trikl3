import { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import ActivityCard from "./ActivityCard";
import FuturisticLoader from "./FuturisticLoader";

const Activity = ({ userEmail }) => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (userEmail) {
        try {
          const response = await fetch(`/api/applications?email=${userEmail}`);
          const data = await response.json();
          setRecentActivity(data.slice(0, 5)); // Get the 5 most recent activities
        } catch (error) {
          console.error('Failed to fetch activity:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchActivity();
  }, [userEmail]);

  if (isLoading) {
    return <FuturisticLoader />;
  }

  return (
    <Card className="mb-12">
      <CardBody>
        <h2 className="text-2xl font-bold mb-4">Your Recent Activity</h2>
        {recentActivity.map((activity, index) => (
          <ActivityCard
            key={index}
            title={`Applied to ${activity.attachment.companyName}`}
            description={`On ${new Date(activity.createdAt).toLocaleDateString()}`}
            buttonText="View Application"
            buttonLink={`/student-dashboard/applications/${activity._id}`}
          />
        ))}
      </CardBody>
    </Card>
  );
};

export default Activity;