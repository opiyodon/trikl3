import { Button, Link } from "@nextui-org/react";

const ActivityCard = ({ title, description, buttonText, buttonLink }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4 flex justify-between items-center border-2 border-gray-300">
        <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="mb-0">{description}</p>
        </div>
        <Button 
            as={Link} 
            href={buttonLink} 
            className="btnPri ml-4 bg-purple-600 hover:bg-purple-700 text-white"
        >
            {buttonText}
        </Button>
    </div>
);

export default ActivityCard