'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Image, Button, Link } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=tech internship in Kenya&page=1&num_pages=2`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
          }
        }
      );

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const items = await Promise.all(data.data.slice(0, 5).map(async (job) => {
          const imageQuery = encodeURIComponent(`${job.job_title} office`);
          const imageResponse = await fetch(`https://api.unsplash.com/photos/random?query=${imageQuery}&client_id=${UNSPLASH_ACCESS_KEY}`);
          const imageData = await imageResponse.json();
          return {
            image: imageData.urls.regular,
            title: job.job_title || 'Unknown Position',
            location: job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : 'Location Unknown',
            company: job.employer_name || 'Unknown Company'
          };
        }));
        setCarouselItems(items.filter(item => item.title !== 'Unknown Position' && item.location !== 'Location Unknown'));
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (carouselItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselItems]);

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
        <h2 className="text-3xl font-bold mb-8 text-center">How Trikl3 Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h3 className="font-bold text-large">Create Your Profile</h3>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Create Profile"
                className="object-cover rounded-xl"
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                width="100%"
              />
              <p className="text-default-500 mt-4">Sign up and tell us about your skills, interests, and goals.</p>
            </CardBody>
          </Card>

          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h3 className="font-bold text-large">AI-Powered Matching</h3>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="AI Matching"
                className="object-cover rounded-xl"
                src="https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                width="100%"
              />
              <p className="text-default-500 mt-4">Our AI algorithm finds internships that best fit your profile.</p>
            </CardBody>
          </Card>

          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h3 className="font-bold text-large">Apply with Ease</h3>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Apply"
                className="object-cover rounded-xl"
                src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                width="100%"
              />
              <p className="text-default-500 mt-4">Apply to internships directly through our platform.</p>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Featured Internships</h2>
        <div className="relative h-96">
          {carouselItems.map((item, index) => (
            <Card
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              isPressable
            >
              <CardBody className="p-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="z-0 w-full h-full object-cover"
                  removeWrapper
                />
              </CardBody>
              <CardFooter className="absolute bg-black/50 backdrop-blur-3xl bottom-0 z-10 w-full">
                <div className="flex flex-col w-full">
                  <p className="text-tiny text-white/60">{item.location}</p>
                  <p className="text-small text-white">{item.title}</p>
                  <p className="text-tiny text-white/80">{item.company}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Why Choose Trikl3?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">AI-Driven Matching</h3>
            </CardHeader>
            <CardBody>
              <p className="mb-4">Our advanced AI algorithm ensures you find internships that align with your skills and career goals.</p>
              <Image
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
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
              <p className="mb-4">Access internships from top tech companies in Kenya that you won't find anywhere else.</p>
              <Image
                src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                alt="Exclusive Opportunities"
                className="w-full rounded-lg"
              />
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Success Stories</h2>
        <Card>
          <CardBody>
            <blockquote className="italic mb-4">
              "Trikl3 helped me land my dream internship at a leading tech company in Nairobi. The AI-driven recommendations were spot on!"
            </blockquote>
            <p className="font-semibold">- Oketch M., IT Student</p>
          </CardBody>
          <CardFooter>
            <Button as={Link} href="/about" className="btnPri text-lg px-8 py-4">
              Read More Stories
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Ready to Start Your Tech Journey?</h2>
        <div>
          <Button as={Link} href="/register" className="btnPri text-lg px-8 py-4">
            Get Started Now
          </Button>
        </div>
      </section>
    </Container>
  );
};

export default LandingPage;