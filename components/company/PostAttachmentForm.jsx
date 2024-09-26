'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '../FuturisticLoader';

export default function PostAttachmentForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachment, setAttachment] = useState({
        companyName: '',
        position: '',
        location: '',
        description: '',
        duration: ''
    });
    const [errors, setErrors] = useState({});

    if (status === 'loading') return <FuturisticLoader />;
    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!attachment.companyName) newErrors.companyName = 'Company name is required';
        if (!attachment.position) newErrors.position = 'Position is required';
        if (!attachment.location) newErrors.location = 'Location is required';
        if (!attachment.description) newErrors.description = 'Description is required';
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
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to post attachment');
            }
        } catch (error) {
            console.error('Error posting attachment:', error);
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
                            label="Company Name"
                            value={attachment.companyName}
                            onChange={(e) => setAttachment({ ...attachment, companyName: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.companyName}
                            errorMessage={errors.companyName}
                        />
                        <Input
                            label="Position"
                            value={attachment.position}
                            onChange={(e) => setAttachment({ ...attachment, position: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.position}
                            errorMessage={errors.position}
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
                            isInvalid={errors.description}
                            errorMessage={errors.description}
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
                        <Button
                            className="btnPri"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                            ) : 'Post Attachment'}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </Container>
    );
}