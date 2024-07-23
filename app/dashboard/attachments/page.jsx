'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input, Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import Link from 'next/link';
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const AttachmentCard = ({ company, title, location, description, url }) => (
  <Card className="mb-4 h-[300px] flex flex-col">
    <CardBody className="flex-grow overflow-hidden">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">{company} - {location}</p>
      <p className="text-sm line-clamp-4">{description}</p>
    </CardBody>
    <CardFooter>
      <Link href={url} passHref target="_blank" rel="noopener noreferrer" className="w-full">
        <Button className="btnPri w-full">Apply Now</Button>
      </Link>
    </CardFooter>
  </Card>
);

const SearchIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;

// Simple cache implementation
const cache = new Map();

export default function AttachmentOpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const lastRequestTime = useRef(0);

  const fetchOpportunities = useCallback(async (page, search = '') => {
    setIsLoading(true);
    setError(null);

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    if (timeSinceLastRequest < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
    }

    const cacheKey = `${search}-${page}`;
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      setOpportunities(prevOpportunities => page === 1 ? cachedData.data : [...prevOpportunities, ...cachedData.data]);
      setTotalPages(cachedData.num_pages || 1);
      setCurrentPage(page);
      setIsLoading(false);
      return;
    }

    try {
      const query = `${search} (internship OR attachment) in Kenya`.trim();
      const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
          }
        }
      );

      lastRequestTime.current = Date.now();

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        cache.set(cacheKey, { data: data.data, num_pages: data.num_pages });
        setOpportunities(prevOpportunities => page === 1 ? data.data : [...prevOpportunities, ...data.data]);
        setTotalPages(data.num_pages || 1);
        setCurrentPage(page);
      } else {
        setError('No opportunities found. Try a different search term.');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch opportunities. Please try again.');
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOpportunities(1, searchTerm).finally(() => {
        setIsInitialLoading(false);
      });
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [fetchOpportunities, searchTerm]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchOpportunities(currentPage + 1, searchTerm);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const retryFetch = () => {
    setOpportunities([]);
    setCurrentPage(1);
    fetchOpportunities(1, searchTerm);
  };

  if (isInitialLoading) {
    return (
      <Container>
        <FuturisticLoader />
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Student Attachment Opportunities in Kenya</h1>
      <Input
        placeholder="Search by job title, course, location, or company..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-8"
        startContent={<SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
      />
      {error && (
        <div className="mb-4 text-red-500">
          {error}
          <Button onClick={retryFetch} className="ml-4">Retry</Button>
        </div>
      )}
      {isLoading ? (
        <FuturisticLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opportunity) => (
            <AttachmentCard
              key={opportunity.job_id}
              company={opportunity.employer_name}
              title={opportunity.job_title}
              location={opportunity.job_city}
              description={opportunity.job_description}
              url={opportunity.job_apply_link}
            />
          ))}
        </div>
      )}
      {currentPage < totalPages && (
        <Button onClick={loadMore} disabled={isLoading} className="mt-4 mx-auto block">
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </Container>
  );
}