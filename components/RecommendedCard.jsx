const RecommendedCard = ({ company, position, logo }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <img src={logo} alt={`${company} logo`} className="w-full h-40 object-cover rounded-md mb-4" />
        <h4 className="font-semibold">{position}</h4>
        <p className="text-sm text-gray-500">{company}</p>
    </div>
);

export default RecommendedCard