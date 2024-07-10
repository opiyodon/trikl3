'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input, Button, Card, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Link } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const ResourceCard = ({ title, description, type, companyName, logoUrl, onClick }) => (
  <Card className="mb-4 h-[300px] flex flex-col hover:shadow-lg transition-shadow duration-300">
    <CardBody className="flex-grow overflow-hidden">
      {logoUrl && <img src={logoUrl} alt={`${companyName} logo`} className="w-16 h-16 object-contain mb-2" />}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">{type} {companyName && `- ${companyName}`}</p>
      <p className="text-sm line-clamp-3">{description}</p>
    </CardBody>
    <CardFooter>
      <Button className="btnPri w-full" onClick={onClick}>Learn More</Button>
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
const JSEARCH_HOST = 'jsearch.p.rapidapi.com';
const LINKEDIN_SCRAPER_HOST = 'linkedin-profile-data-scraper.p.rapidapi.com';

// Simple cache implementation
const cache = new Map();

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const lastRequestTime = useRef(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchResources = useCallback(async (page, search = '') => {
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
      setResources(prevResources => page === 1 ? cachedData.data : [...prevResources, ...cachedData.data]);
      setTotalPages(cachedData.num_pages || 1);
      setCurrentPage(page);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch jobs and internships
      const jobsResponse = await fetch(
        `https://${JSEARCH_HOST}/search?query=${encodeURIComponent(search + ' entry level OR internship')}&page=${page}&num_pages=1`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': JSEARCH_HOST
          }
        }
      );

      lastRequestTime.current = Date.now();

      if (!jobsResponse.ok) {
        throw new Error('API request failed');
      }

      const jobsData = await jobsResponse.json();

      // Format the results
      const formattedData = jobsData.data.map(job => ({
        ...job,
        type: 'Job/Internship',
        description: job.job_description
      }));

      if (formattedData.length > 0) {
        cache.set(cacheKey, { data: formattedData, num_pages: jobsData.num_pages });
        setResources(prevResources => page === 1 ? formattedData : [...prevResources, ...formattedData]);
        setTotalPages(jobsData.num_pages || 1);
        setCurrentPage(page);
      } else {
        setError('No resources found. Try a different search term.');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch resources. Please try again.');
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchResources(1, searchTerm).finally(() => {
        setIsInitialLoading(false);
      });
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [fetchResources, searchTerm]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchResources(currentPage + 1, searchTerm);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const retryFetch = () => {
    setResources([]);
    setCurrentPage(1);
    fetchResources(1, searchTerm);
  };

  const handleCardClick = async (resource) => {
    setSelectedResource(resource);
    setIsModalLoading(true);
    onOpen();
    try {
      const companyResponse = await fetch(
        `https://${LINKEDIN_SCRAPER_HOST}/company?url=${encodeURIComponent(resource.employer_website)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': LINKEDIN_SCRAPER_HOST
          }
        }
      );
      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        setSelectedResource(prev => ({ ...prev, companyDetails: companyData }));
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const formatJobDescription = (description) => {
    // This is a simple formatting function. You may need to adjust it based on the actual structure of your job descriptions.
    const paragraphs = description.split('\n\n');
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
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
      <h1 className="text-3xl font-bold mb-8">Job and Internship Resources for Students</h1>
      <Input
        placeholder="Search for internships or entry-level jobs..."
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
          {resources.map((resource) => (
            <ResourceCard
              key={resource.job_id}
              title={resource.job_title}
              description={resource.job_description}
              type={resource.type}
              companyName={resource.employer_name}
              logoUrl={resource.employer_logo}
              onClick={() => handleCardClick(resource)}
            />
          ))}
        </div>
      )}
      {currentPage < totalPages && (
        <Button onClick={loadMore} disabled={isLoading} className="mt-4 mx-auto block">
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        className="h-[90vh] max-w-4xl mx-auto mt-[5vh]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{selectedResource?.job_title}</h2>
                <p className="text-lg">{selectedResource?.employer_name}</p>
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                {isModalLoading ? (
                  <FuturisticLoader />
                ) : (
                  <article className="prose max-w-none">
                    <section>
                      <h3 className="text-xl font-semibold mb-2">Job Details</h3>
                      <p><strong>Location:</strong> {selectedResource?.job_city}, {selectedResource?.job_country}</p>
                      <p><strong>Job Type:</strong> {selectedResource?.job_employment_type}</p>
                      {selectedResource?.job_apply_link && (
                        <p><strong>Apply:</strong> <a href={selectedResource.job_apply_link} target="_blank" rel="noopener noreferrer">Application Link</a></p>
                      )}
                    </section>

                    <section className="mt-6">
                      <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                      {formatJobDescription(selectedResource?.job_description)}
                    </section>

                    {selectedResource?.companyDetails && (
                      <section className="mt-6">
                        <h3 className="text-xl font-semibold mb-2">About {selectedResource.employer_name}</h3>
                        <p>{selectedResource.companyDetails.description}</p>
                        <p><strong>Industry:</strong> {selectedResource.companyDetails.industry}</p>
                        <p><strong>Company Size:</strong> {selectedResource.companyDetails.companySize}</p>
                        {selectedResource.companyDetails.website && (
                          <p><strong>Website:</strong> <a href={selectedResource.companyDetails.website} target="_blank" rel="noopener noreferrer">{selectedResource.companyDetails.website}</a></p>
                        )}
                      </section>
                    )}

                    {selectedResource?.employer_logo && (
                      <img src={selectedResource.employer_logo} alt={`${selectedResource.employer_name} logo`} className="mt-6 max-w-xs mx-auto" />
                    )}
                  </article>
                )}
              </ModalBody>
              <ModalFooter>
                <Link href={selectedResource?.job_apply_link} passHref target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="btnPri w-full">Apply Now</Button>
                </Link>
                <Button className="w-full" color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}