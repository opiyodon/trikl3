const RecommendedCard = ({ company, position, logo, jobUrl, techField }) => (
    <a 
        href={jobUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out cursor-pointer border-2 border-gray-400 hover:border-gray-600"
    >
        <div className="relative">
            <img src={logo} alt={`${company} logo`} className="w-full h-40 object-cover rounded-md mb-4" />
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md"></div>
        </div>
        <h4 className="font-semibold mb-2">{position}</h4>
        <p className="text-sm text-blue-600 mb-1">{company}</p>
        <p className="text-xs text-gray-500">{techField}</p>
    </a>
);

export default RecommendedCard;