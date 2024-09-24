'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostResourceForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resource, setResource] = useState({
        title: '',
        description: '',
        type: '',
        link: '',
        tags: ''
    });
    const [errors, setErrors] = useState({});

    const resourceTypes = [
        { value: 'article', label: 'Article' },
        { value: 'video', label: 'Video' },
        { value: 'pdf', label: 'PDF Document' },
        { value: 'webinar', label: 'Webinar' },
        { value: 'course', label: 'Online Course' },
        { value: 'tool', label: 'Software Tool' },
    ];

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    const validateForm = () => {
        const newErrors = {};
        if (!resource.title) newErrors.title = 'Title is required';
        if (!resource.type) newErrors.type = 'Resource type is required';
        if (!resource.link) newErrors.link = 'Link is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
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
                    companyEmail: session?.user?.email,
                    companyName: session?.user?.name
                })
            });

            if (response.ok) {
                toast.success('Resource posted successfully');
                router.push('/company-dashboard');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to post resource');
            }
        } catch (error) {
            toast.error('Failed to post resource');
            console.error('Error posting resource:', error);
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
                            label="Title"
                            value={resource.title}
                            onChange={(e) => setResource({ ...resource, title: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.title}
                            errorMessage={errors.title}
                        />
                        <Textarea
                            label="Description"
                            value={resource.description}
                            onChange={(e) => setResource({ ...resource, description: e.target.value })}
                            className="mb-4"
                        />
                        <Select
                            label="Resource Type"
                            value={resource.type}
                            onChange={(e) => setResource({ ...resource, type: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.type}
                            errorMessage={errors.type}
                        >
                            {resourceTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Input
                            label="Link to Resource"
                            value={resource.link}
                            onChange={(e) => setResource({ ...resource, link: e.target.value })}
                            className="mb-4"
                            isInvalid={errors.link}
                            errorMessage={errors.link}
                        />
                        <Input
                            label="Tags (comma-separated)"
                            value={resource.tags}
                            onChange={(e) => setResource({ ...resource, tags: e.target.value })}
                            className="mb-4"
                            placeholder="e.g., programming, career advice, industry insights"
                        />
                        <Button color="primary" type="submit" disabled={isSubmitting}>
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