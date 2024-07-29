'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Image, Button, Input, Textarea } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [officeImage, setOfficeImage] = useState('');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
    fetchUnsplashImage();
  }, []);

  const fetchUnsplashImage = async () => {
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=modern+office&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`);
      const data = await response.json();
      setOfficeImage(data.urls.regular);
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Here you would typically send the email using a backend service
        // For this example, we'll just simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("Sending email to opiyodon9@gmail.com with data:", formData);
        toast.success("Thank you for your message. We'll get back to you soon!");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please correct the errors in the form');
    }
  };

  if (isLoading) {
    return (
      <Container>
        <FuturisticLoader />
      </Container>
    );
  }

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} />
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl mb-8">
          Get in touch with the Trikl3 team
        </p>
      </header>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader>
              <h2 className="text-2xl font-bold">Send Us a Message</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mb-4"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mb-4"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="mb-4"
                  isInvalid={!!errors.subject}
                  errorMessage={errors.subject}
                />
                <Textarea
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mb-4"
                  isInvalid={!!errors.message}
                  errorMessage={errors.message}
                />
                <Button 
                  type="submit" 
                  className="btnPri w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  ) : 'Send Message'}
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <h2 className="text-2xl font-bold">Contact Information</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Address:</h3>
                  <p>928 Tech Street, Nakuru, Kenya</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email:</h3>
                  <p>support@trikl3.com</p>
                </div>
                <div>
                  <h3 className="font-semibold">Phone:</h3>
                  <p>+254794016800</p>
                </div>
              </div>
              <div className="mt-6 h-48 rounded-lg overflow-hidden">
                {officeImage ? (
                  <Image
                    src={officeImage}
                    alt="Modern Office"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-600">Loading office image...</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* FAQ section remains unchanged */}
    </Container>
  );
};

export default Contact;