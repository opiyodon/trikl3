import { Card, CardBody, CardFooter, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

const ApplicationCard = ({ application, updateStatus }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Card className="mb-4 flex flex-col">
            <CardBody className="flex-grow overflow-hidden">
                <h3 className="text-lg font-semibold mb-2">{application.studentName}</h3>
                <p className="text-sm text-gray-500 mb-2">{application.email}</p>
                <p className="text-sm line-clamp-2">{application.jobDetails.title}</p>
                <p className="text-sm font-semibold">Status: {application.status}</p>
            </CardBody>
            <CardFooter>
                <Button onClick={onOpen} className="mr-2">View Details</Button>
                <Button onClick={() => updateStatus(application._id, 'Accepted')} className="mr-2">Accept</Button>
                <Button onClick={() => updateStatus(application._id, 'Rejected')} color="error">Reject</Button>
            </CardFooter>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>{application.jobDetails.title}</ModalHeader>
                    <ModalBody>
                        <p><strong>Applicant:</strong> {application.studentName}</p>
                        <p><strong>Email:</strong> {application.email}</p>
                        <p><strong>Company:</strong> {application.jobDetails.company}</p>
                        <p><strong>Location:</strong> {application.jobDetails.location}</p>
                        <p><strong>Message:</strong> {application.message}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
};

export default ApplicationCard;