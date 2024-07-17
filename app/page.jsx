'use client';

import { useState, useEffect } from 'react';
import { Button, Link } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      image: "/images/internship1.jpg",
      title: "Software Engineering at Tech Corp",
      location: "Nairobi, Kenya"
    },
    {
      image: "/images/internship2.jpg",
      title: "Data Science at AI Labs",
      location: "Mombasa, Kenya"
    },
    {
      image: "/images/internship3.jpg",
      title: "UX Design at Creative Tech",
      location: "Kisumu, Kenya"
    }
  ];

  useEffect(() => {
    // Simulating content loading
    setTimeout(() => setIsLoading(false), 1500);

    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
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
        <h1 className="text-5xl font-bold mb-4">Welcome to Trikl3</h1>
        <p className="text-xl mb-8">
          Connecting Kenyan tech students with AI-driven internship opportunities
        </p>
        <div className="flex justify-center gap-4">
          <Button as={Link} href="/register" className="btnPri">
            Get Started
          </Button>
        </div>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">How Trikl3 Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img src="/images/profile.svg" alt="Create Profile" className="w-24 h-24 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
            <p>Sign up and tell us about your skills, interests, and goals.</p>
          </div>
          <div className="text-center">
            <img src="/images/ai-match.svg" alt="AI Matching" className="w-24 h-24 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
            <p>Our AI algorithm finds internships that best fit your profile.</p>
          </div>
          <div className="text-center">
            <img src="/images/apply.svg" alt="Apply" className="w-24 h-24 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Apply with Ease</h3>
            <p>Apply to internships directly through our platform.</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Featured Internships</h2>
        <div className="relative rounded-lg overflow-hidden h-64">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p>{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Why Choose Trikl3?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">AI-Driven Matching</h3>
            <p className="mb-4">Our advanced AI algorithm ensures you find internships that align with your skills and career goals.</p>
            <img src="/images/ai-illustration.svg" alt="AI Matching" className="w-full rounded-lg" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Exclusive Opportunities</h3>
            <p className="mb-4">Access internships from top tech companies in Kenya that you won't find anywhere else.</p>
            <img src="/images/opportunities-illustration.svg" alt="Exclusive Opportunities" className="w-full rounded-lg" />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Success Stories</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <blockquote className="italic mb-4">
            "Trikl3 helped me land my dream internship at a leading tech company in Nairobi. The AI-driven recommendations were spot on!"
          </blockquote>
          <p className="font-semibold">- Sarah M., Computer Science Student</p>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Ready to Start Your Tech Journey?</h2>
        <div className="text-center">
          <Button as={Link} href="/register" className="btnPri text-lg px-8 py-4">
            Get Started Now
          </Button>
        </div>
      </section>
    </Container>
  );
};

export default LandingPage;