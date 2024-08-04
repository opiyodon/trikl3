import { useState } from 'react';
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const RecommendedCard = ({ company, position, location, jobUrl }) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (imageError) {
      // Fallback to a generic image or company initial
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=random&color=fff`;
    }
    return `https://logo.clearbit.com/${company.toLowerCase().replace(/\s/g, '')}.com`;
  };

  return (
    <Card
      isPressable
      isHoverable
      onPress={() => window.open(jobUrl, '_blank', 'noopener,noreferrer')}
      className="cursor-pointer h-[300px] flex flex-col"
    >
      <CardBody className="p-0 flex-grow">
        <div className="relative w-full h-full">
          <Image
            src={getImageUrl()}
            alt={`${company} logo`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      </CardBody>
      <CardFooter className="flex-col items-start bg-white bg-opacity-90 absolute bottom-0 left-0 right-0 p-3">
        <h4 className="font-semibold text-lg truncate w-full">{position}</h4>
        <p className="text-sm text-default-500 truncate w-full">{company}</p>
        <p className="text-xs text-default-400 truncate w-full">{location}</p>
      </CardFooter>
    </Card>
  );
};

export default RecommendedCard;