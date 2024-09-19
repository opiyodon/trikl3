import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import Image from 'next/image';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const ApplicationCard = ({ application, onDelete, onViewDetails }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            const imageQuery = encodeURIComponent(`${application.jobDetails.title.split(' ')[0]} office`);
            try {
                const response = await fetch(`https://api.unsplash.com/photos/random?query=${imageQuery}&client_id=${UNSPLASH_ACCESS_KEY}`);
                const data = await response.json();
                setImageUrl(data.urls.regular);
            } catch (error) {
                console.error('Error fetching image:', error);
                setImageUrl('/default.png');
            }
        };

        fetchImage();
    }, [application.jobDetails.title]);

    return (
        <Card className="mb-4 h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardBody className="p-0">
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={application.jobDetails.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                    />
                )}
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{application.jobDetails.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{application.jobDetails.company} - {application.jobDetails.location}</p>
                    <p className="text-sm mb-2">Status: <span className="font-semibold">{application.status}</span></p>
                    <p className="text-sm mb-2">Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
            </CardBody>
            <CardFooter className="justify-between">
                <Button color="primary" onClick={() => onViewDetails(application)} className="w-1/2 mr-2">View Details</Button>
                <Button color="danger" onClick={() => onDelete(application._id)} className="w-1/2">Delete</Button>
            </CardFooter>
        </Card>
    );
};

export default ApplicationCard;