import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";

const ApplicationCard = ({ application, onDelete, onViewDetails, isCompanyView }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex-col items-start">
        <h4 className="text-lg font-bold">{application.jobDetails.title}</h4>
        <p className="text-small text-default-500">
          {isCompanyView ? application.studentName : application.jobDetails.company}
        </p>
      </CardHeader>
      <CardBody>
        <p><strong>Location:</strong> {application.jobDetails.location}</p>
        <p><strong>Status:</strong> {application.status}</p>
        <p><strong>Applied on:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button color="primary" onPress={() => onViewDetails(application)}>
          View Details
        </Button>
        {!isCompanyView && (
          <Button color="danger" onPress={() => onDelete(application._id)}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;