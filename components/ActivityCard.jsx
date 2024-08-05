import { Card, CardBody, Button, Link } from "@nextui-org/react";

const ActivityCard = ({ title, description, buttonText, buttonLink }) => (
  <Card className="mb-4">
    <CardBody className="flex flex-row justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-0">{description}</p>
      </div>
      <Button
        as={Link}
        href={buttonLink}
        className="btnPri"
      >
        {buttonText}
      </Button>
    </CardBody>
  </Card>
);

export default ActivityCard;