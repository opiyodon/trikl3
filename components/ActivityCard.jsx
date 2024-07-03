import { Button, Link } from "@nextui-org/react";

const ActivityCard = ({ title, description, buttonText, buttonLink }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-4">{description}</p>
        <Button as={Link} href={buttonLink} className="btnPri">
            {buttonText}
        </Button>
    </div>
);

export default ActivityCard