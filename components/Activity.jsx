import ActivityCard from "./ActivityCard"
import Container from "./pageLayout/Container"

const Activity = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Your activity</h2>
      <ActivityCard
        title="Complete your profile"
        description="Add more information to get better matches"
        buttonText="Complete profile"
        buttonLink="/account"
      />
      <ActivityCard
        title="Apply to internships"
        description="Start applying to internships"
        buttonText="View internships"
        buttonLink="/internships"
      />
    </div>
  )
}

export default Activity
