'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Image, Button, Link } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const Services = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);

  const fetchServiceImages = async () => {
    const serviceData = [
      {
        title: "AI-Powered Job Matching",
        description: "Our advanced algorithm matches your skills and preferences with the perfect internship opportunities.",
        query: "artificial intelligence technology"
      },
      {
        title: "Profile Optimization",
        description: "Get expert advice on how to make your profile stand out to potential employers.",
        query: "professional profile resume"
      },
      {
        title: "Interview Preparation",
        description: "Access resources and tips to help you ace your internship interviews.",
        query: "job interview preparation"
      },
      {
        title: "Career Guidance",
        description: "Get personalized advice from industry professionals to help shape your tech career.",
        query: "career counseling technology"
      }
    ];

    try {
      const servicesWithImages = await Promise.all(serviceData.map(async (service) => {
        const imageResponse = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(service.query)}&client_id=${UNSPLASH_ACCESS_KEY}`);
        const imageData = await imageResponse.json();
        return { ...service, image: imageData.urls.regular };
      }));

      setServices(servicesWithImages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching service images:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceImages();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <FuturisticLoader />
      </Container>
    );
  }

  return (
    <Container>
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-xl mb-8">
          Empowering Kenyan tech students with cutting-edge tools and resources
        </p>
      </header>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h3 className="font-bold text-large">{service.title}</h3>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt={service.title}
                  className="object-cover rounded-xl"
                  src={service.image}
                  width="100%"
                />
                <p className="text-default-500 mt-4">{service.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Why Choose Our Services?</h2>
        <Card>
          <CardBody>
            <ul className="list-disc pl-5 space-y-2">
              <li>Tailored to the Kenyan tech industry</li>
              <li>Cutting-edge AI technology for precise matching</li>
              <li>Comprehensive support throughout your internship journey</li>
              <li>Access to exclusive opportunities with top companies</li>
            </ul>
          </CardBody>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to Boost Your Tech Career?</h2>
        <Button as={Link} href="/register" className="btnPri text-lg px-8 py-4">
          Get Started Now
        </Button>
      </section>
    </Container>
  );
};

export default Services;