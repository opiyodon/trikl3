'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '../FuturisticLoader';

export default function PostResourceForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resource, setResource] = useState({
        companyName: '',
        position: '',
        location: '',
        description: '',
        requirements: '',
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
        if (!resource.companyName) newErrors.companyName = 'Company name is required';
        if (!resource.position) newErrors.position = 'Position is required';
        if (!resource.location) newErrors.location = 'Location is required';
        if (!resource.description) newErrors.description = 'Description is required';
        if (!resource.requirements) newErrors.requirements = 'Requirements are required';
        if (!resource.duration) newErrors.duration = 'Duration is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please correct the errors before submitting');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...resource,
                    companyEmail: session?.user?.email
                })
            });

            if (response.ok) {
                toast.success('Resource posted successfully');
                router.push('/company-dashboard/resources');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to post resource');
            }
        } catch (error) {
            console.error('Error posting resource:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={5000} />
            <h1 className="text-3xl font-bold mb-8">Post New Resource</h1>
            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Company Name"
                            value={resource.companyName}
                            onChange={(e) => setResource({ ...resource, companyName: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.companyName}
                            errorMessage={errors.companyName}
                        />
                        <Input
                            label="Position"
                            value={resource.position}
                            onChange={(e) => setResource({ ...resource, position: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.position}
                            errorMessage={errors.position}
                        />
                        <Input
                            label="Location"
                            value={resource.location}
                            onChange={(e) => setResource({ ...resource, location: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.location}
                            errorMessage={errors.location}
                        />
                        <Textarea
                            label="Description"
                            value={resource.description}
                            onChange={(e) => setResource({ ...resource, description: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.description}
                            errorMessage={errors.description}
                        />
                        <Textarea
                            label="Requirements"
                            value={resource.requirements}
                            onChange={(e) => setResource({ ...resource, requirements: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.requirements}
                            errorMessage={errors.requirements}
                        />
                        <Input
                            label="Duration (in weeks)"
                            type="number"
                            value={resource.duration}
                            onChange={(e) => setResource({ ...resource, duration: e.target.value })}
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
                            ) : 'Post Resource'}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </Container>
    );
}