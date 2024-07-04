'use client'

import { useState, useEffect, useCallback } from 'react';
import { Input, Button, Card, CardBody, CardFooter, Spinner } from "@nextui-org/react";
import Link from 'next/link';

const InternshipCard = ({ company, title, location, description, url }) => (
  <Card className="mb-4 h-[300px] flex flex-col">
    <CardBody className="flex-grow overflow-hidden">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">{company} - {location}</p>
      <p className="text-sm line-clamp-4">{description}</p>
    </CardBody>
    <CardFooter>
      <Link href={url} passHref className="w-full">
        <Button className="btnPri w-full">Apply Now</Button>
      </Link>
    </CardFooter>
  </Card>
);

const FuturisticLoader = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-4 border-t-primary border-opacity-20 rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-t-secondary border-opacity-40 rounded-full animate-spin-slow"></div>
      <div className="absolute inset-4 border-4 border-t-accent border-opacity-60 rounded-full animate-spin-slower"></div>
    </div>
    <p className="mt-4 text-lg font-semibold text-primary">Loading opportunities...</p>
  </div>
);

const API_KEY = '14d8e33b9dmsh01dbfce3e2623c5p1c2ba9jsn0291984e3d71'; // Replace with your RapidAPI key

export default function AttachmentOpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOpportunities = useCallback(async (page, search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const query = search
        ? `${search} internship OR attachment in Kenya`
        : 'internship OR attachment in Kenya';
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

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      setOpportunities(prevOpportunities => page === 1 ? data.data : [...prevOpportunities, ...data.data]);
      setTotalPages(data.num_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      setError('Failed to fetch opportunities. Please try again.');
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities(1, searchTerm);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Attachment Opportunities in Kenya</h1>
      <Input
        placeholder="Search opportunities..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-8"
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
            <InternshipCard
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
    </div>
  );
}