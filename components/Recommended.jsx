import RecommendedCard from "./RecommendedCard";
import Container from "./pageLayout/Container"

const Recommended = () => {

  const recommendations = [
    { company: "Facebook", position: "Software Engineer Intern", logo: "/images/facebook-logo.png" },
    { company: "Google", position: "Product Design Intern", logo: "/images/google-logo.png" },
    { company: "Netflix", position: "Data Analyst Intern", logo: "/images/netflix-logo.png" },
    { company: "Apple", position: "Software Engineer Intern", logo: "/images/apple-logo.png" },
    { company: "Amazon", position: "Product Design Intern", logo: "/images/amazon-logo.png" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recommendations.map((rec, index) => (
          <RecommendedCard key={index} {...rec} />
        ))}
      </div>
    </div>
  )
}

export default Recommended
