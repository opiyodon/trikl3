'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Image, Button, Link } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const teamData = [
      { name: 'Don Artkins', role: 'CEO & Founder', image: '/assets/team/artkins.png' },
      { name: 'Oketch Emmanuel', role: 'CTO', image: '/assets/team/manu.png' },
      { name: 'Tito Kilonzo', role: 'Lead Developer', image: '/assets/team/tito.png' },
      { name: 'Godwin Kipngetich', role: 'AI Specialist', image: '/assets/team/godwin.png' },
    ];

    setTeamMembers(teamData);
    setIsLoading(false);
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
        <h1 className="text-5xl font-bold mb-4">About Trikl3</h1>
        <p className="text-xl mb-8">
          Connecting Kenyan tech students with AI-driven internship opportunities
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
        <Card>
          <CardBody>
            <p className="text-lg">
              At Trikl3, our mission is to bridge the gap between talented tech students and exciting internship opportunities in Kenya. We leverage cutting-edge AI technology to match students with positions that align with their skills, interests, and career aspirations.
            </p>
          </CardBody>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">AI-Driven Matching</h3>
            </CardHeader>
            <CardBody>
              <p className="mb-4">
                Our AI algorithms analyze your profile and internship requirements to provide personalized matches that maximize your chances of success.
              </p>
              <Image
                src="https://source.unsplash.com/random/800x600?ai,technology"
                alt="AI Matching"
                className="w-full rounded-lg"
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Exclusive Opportunities</h3>
            </CardHeader>
            <CardBody>
              <p className="mb-4">
                We partner with top tech companies across Kenya to offer internships that you won&apos;t find on any other platform.
              </p>
              <Image
                src="https://source.unsplash.com/random/800x600?opportunity,career"
                alt="Exclusive Opportunities"
                className="w-full rounded-lg"
              />
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardBody>
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p>{member.role}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
        <Card>
          <CardBody>
            <p className="text-lg mb-8">
              Have questions or need assistance? Reach out to us at{' '}
              <Link href="mailto:support@trikl3.com" className="text-primary">
                support@trikl3.com
              </Link>
              .
            </p>
          </CardBody>
        </Card>
      </section>

      <section className="text-center">
        <Button as={Link} href="/register" className="btnPri text-lg px-8 py-4">
          Get Started Now
        </Button>
      </section>
    </Container>
  );
};

export default About;