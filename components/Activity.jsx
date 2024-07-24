import ActivityCard from "./ActivityCard";

const Activity = ({ recentActivity }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Your Recent Activity</h2>
      {recentActivity.map((activity, index) => (
        <ActivityCard
          key={index}
          title={activity.type === "application" ? `Applied to ${activity.company}` : `Updated ${activity.field}`}
          description={`On ${new Date(activity.date).toLocaleDateString()}`}
          buttonText={activity.type === "application" ? "View Application" : "Update Profile"}
          buttonLink={activity.type === "application" ? "/dashboard/applications" : "/dashboard/account"}
        />
      ))}
    </div>
  );
};

export default Activity;