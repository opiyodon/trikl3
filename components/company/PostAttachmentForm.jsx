'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostAttachmentForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachment, setAttachment] = useState({
        title: '',
        location: '',
        description: '',
        requirements: '',
        duration: '',
        startDate: '',
        stipend: ''
    });
    const [errors, setErrors] = useState({});

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'unauthenticated') {
        router.push('/login'); // Redirect to login page if not authenticated
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        const newErrors = {};
        if (!attachment.title) newErrors.title = 'Title is required';
        if (!attachment.location) newErrors.location = 'Location is required';
        if (!attachment.duration) newErrors.duration = 'Duration is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please correct the errors before submitting');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/attachments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...attachment,
                    companyEmail: session?.user?.email
                })
            });

            if (response.ok) {
                toast.success('Attachment posted successfully');
                router.push('/company-dashboard/attachments');
            } else {
                toast.error('Failed to post attachment');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={5000} />
            <h1 className="text-3xl font-bold mb-8">Post New Attachment</h1>
            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Title"
                            value={attachment.title}
                            onChange={(e) => setAttachment({ ...attachment, title: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.title}
                            errorMessage={errors.title}
                        />
                        <Input
                            label="Location"
                            value={attachment.location}
                            onChange={(e) => setAttachment({ ...attachment, location: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.location}
                            errorMessage={errors.location}
                        />
                        <Textarea
                            label="Description"
                            value={attachment.description}
                            onChange={(e) => setAttachment({ ...attachment, description: e.target.value })}
                            className="mb-4"
                        />
                        <Textarea
                            label="Requirements"
                            value={attachment.requirements}
                            onChange={(e) => setAttachment({ ...attachment, requirements: e.target.value })}
                            className="mb-4"
                        />
                        <Input
                            label="Duration (in weeks)"
                            type="number"
                            value={attachment.duration}
                            onChange={(e) => setAttachment({ ...attachment, duration: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.duration}
                            errorMessage={errors.duration}
                        />
                        <Input
                            label="Start Date"
                            type="date"
                            value={attachment.startDate}
                            onChange={(e) => setAttachment({ ...attachment, startDate: e.target.value })}
                            className="mb-4"
                        />
                        <Input
                            label="Stipend (optional)"
                            type="number"
                            value={attachment.stipend}
                            onChange={(e) => setAttachment({ ...attachment, stipend: e.target.value })}
                            className="mb-4"
                        />
                        <Button
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Attachment'}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </Container>
    );
}