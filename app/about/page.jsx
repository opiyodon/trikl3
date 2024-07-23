'use client';

import { useState, useEffect } from 'react';
import { Button, Link } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const AboutPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating content loading
    setTimeout(() => setIsLoading(false), 1500);
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
        <p className="text-lg mb-8">
          At Trikl3, our mission is to bridge the gap between talented tech students and exciting internship opportunities in Kenya. We leverage cutting-edge AI technology to match students with positions that align with their skills, interests, and career aspirations.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">AI-Driven Matching</h3>
            <p className="mb-4">
              Our AI algorithms analyze your profile and internship requirements to provide personalized matches that maximize your chances of success.
            </p>
            <img src="/images/ai-illustration.svg" alt="AI Matching" className="w-full rounded-lg" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Exclusive Opportunities</h3>
            <p className="mb-4">
              We partner with top tech companies across Kenya to offer internships that you won’t find on any other platform.
            </p>
            <img src="/images/opportunities-illustration.svg" alt="Exclusive Opportunities" className="w-full rounded-lg" />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Team</h2>
        <p className="text-lg mb-8">
          Our team comprises passionate individuals with diverse backgrounds in technology, education, and career development. We are committed to supporting students in their journey to becoming successful tech professionals.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
        <p className="text-lg mb-8">
          Have questions or need assistance? Reach out to us at <Link href="mailto:support@trikl3.com" className="text-primary">support@trikl3.com</Link>.
        </p>
      </section>

      <section className="text-center">
        <Button as={Link} href="/register" className="btnPri text-lg px-8 py-4">
          Get Started Now
        </Button>
      </section>
    </Container>
  );
};

export default AboutPage;
