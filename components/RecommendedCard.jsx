import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const RecommendedCard = ({ company, title, location, description, url, isLocal }) => {
  const [imageUrl, setImageUrl] = useState('/default.png');
  const [loadingImage, setLoadingImage] = useState(true); // For image loading state
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async () => {
      const imageQuery = encodeURIComponent(`${title.split(' ')[0]} office`);
      try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=${imageQuery}&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        setImageUrl(data.urls.regular);
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl('/default.png');
      } finally {
        setLoadingImage(false); // Stop loading spinner once image is loaded or failed
      }
    };

    fetchImage();
  }, [title]);

  const handleApply = () => {
    const jobDetails = { company, title, location, description, url, isLocal };
    const encodedJobDetails = encodeURIComponent(JSON.stringify(jobDetails));
    router.push(`/student-dashboard/apply?jobDetails=${encodedJobDetails}`);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardBody className="p-0 flex-grow">
        <div className="relative w-full h-48">
          {loadingImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="loader"></div> {/* Add a spinner or loading animation */}
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={`Job image for ${title} at ${company}`}
              layout="fill"
              objectFit="cover"
              onError={() => setImageUrl('/default.png')}
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
          <p className="text-sm text-gray-500 mb-1 truncate">{company} - {location}</p>
          <p className="text-sm line-clamp-3">{description}</p>
        </div>
      </CardBody>
      <CardFooter>
        <Button onClick={handleApply} className="w-full btnPri">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecommendedCard;
