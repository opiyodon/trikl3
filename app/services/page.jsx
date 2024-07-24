'use client';

import { Card, CardBody, CardHeader, Image, Button, Link } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';

const ServicesPage = () => {
  const services = [
    {
      title: "AI-Powered Job Matching",
      description: "Our advanced algorithm matches your skills and preferences with the perfect internship opportunities.",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Profile Optimization",
      description: "Get expert advice on how to make your profile stand out to potential employers.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Interview Preparation",
      description: "Access resources and tips to help you ace your internship interviews.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Career Guidance",
      description: "Get personalized advice from industry professionals to help shape your tech career.",
      image: "https://images.unsplash.com/photo-1487528278747-ba99ed528ebc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

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

      <section>
        <h2 className="text-3xl font-bold mb-8">Ready to Boost Your Tech Career?</h2>
        <div>
          <Button as={Link} href="/register" className="btnPri text-lg px-8 py-4">
            Get Started Now
          </Button>
        </div>
      </section>
    </Container>
  );
};

export default ServicesPage;