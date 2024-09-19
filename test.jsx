'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody, Input, Textarea, Button, Checkbox, Dropdown, FileInput } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FuturisticLoader from '@/components/FuturisticLoader';

export default function Apply() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    course: '',
    yearOfStudy: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    country: 'Kenya',
    resume: null,
    coverLetter: null,
    linkedinProfile: '',
    portfolioWebsite: '',
    preferredAttachmentPeriod: '',
    skills: '',
    relevantCoursework: '',
    additionalInformation: '',
    agreeToTerms: false,
  });

  useEffect(() => {
    const jobDetailsParam = searchParams.get('jobDetails');
    if (jobDetailsParam) {
      setJobDetails(JSON.parse(decodeURIComponent(jobDetailsParam)));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDetails) return;
    setIsSubmitting(true);

    // Create a FormData object to handle file uploads
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          jobDetails: {
            title: jobDetails.title,
            company: jobDetails.company || jobDetails.companyName,
            location: jobDetails.location,
            description: jobDetails.description,
            isLocal: jobDetails.isLocal || false,
            url: jobDetails.url || '',
            logoUrl: jobDetails.logoUrl || '',
          },
          studentEmail: session?.user?.email,
        }),
      });      

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setTimeout(() => router.push('/applications'), 2000);
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!jobDetails) {
    return <FuturisticLoader />;
  }

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-3xl font-bold mb-8">Apply for {jobDetails.title}</h1>
      <Card className="mb-8">
        <CardBody>
          <h2 className="text-2xl font-semibold mb-4">{jobDetails.company || jobDetails.companyName}</h2>
          <h3 className="text-xl font-medium mb-2">Location: {jobDetails.location}</h3>
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2">Job Description:</h4>
            <p className="whitespace-pre-wrap">{jobDetails.description}</p>
          </div>
        </CardBody>
      </Card>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4"
          required
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="mb-4"
          required
        />
        <Input
          label="Student ID"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          className="mb-4"
          required
        />
        <Input
          label="Course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className="mb-4"
          required
        />
        <Input
          label="Year of Study"
          name="yearOfStudy"
          type="number"
          min="1"
          max="6"
          value={formData.yearOfStudy}
          onChange={handleChange}
          className="mb-4"
          required
        />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
          <Input
            label="Address Line 2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <Input
            label="County"
            name="county"
            value={formData.county}
            onChange={handleChange}
            required
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <FileInput
          label="Resume/CV"
          name="resume"
          onChange={handleChange}
          accept=".pdf,.doc,.docx"
          className="mb-4"
          required
        />
        <FileInput
          label="Cover Letter"
          name="coverLetter"
          onChange={handleChange}
          accept=".pdf,.doc,.docx"
          className="mb-4"
        />
        <Input
          label="LinkedIn Profile"
          name="linkedinProfile"
          value={formData.linkedinProfile}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Portfolio Website"
          name="portfolioWebsite"
          value={formData.portfolioWebsite}
          onChange={handleChange}
          className="mb-4"
        />
        <Dropdown
          label="Preferred Attachment Period"
          name="preferredAttachmentPeriod"
          value={formData.preferredAttachmentPeriod}
          onChange={handleChange}
          className="mb-4"
          required
        >
          <option value="">Select a period</option>
          <option value="May-August">May-August</option>
          <option value="September-December">September-December</option>
          <option value="January-April">January-April</option>
        </Dropdown>
        <Textarea
          label="Skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="mb-4"
          placeholder="List your relevant skills"
        />
        <Textarea
          label="Relevant Coursework"
          name="relevantCoursework"
          value={formData.relevantCoursework}
          onChange={handleChange}
          className="mb-4"
          placeholder="List any relevant courses you've taken"
        />
        <Textarea
          label="Additional Information"
          name="additionalInformation"
          value={formData.additionalInformation}
          onChange={handleChange}
          className="mb-4"
          placeholder="Any other information you'd like to share"
        />
        <Checkbox
          name="agreeToTerms"
          isSelected={formData.agreeToTerms}
          onChange={handleChange}
          className="mb-4"
        >
          I agree to the terms and conditions
        </Checkbox>
        <Button
          type="submit"
          className="btnPri w-full"
          disabled={isSubmitting || !formData.agreeToTerms}
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          ) : 'Submit Application'}
        </Button>
      </form>
    </Container>
  );
}