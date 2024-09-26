'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input, Button, Card, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Image } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResourceCard = ({ title, description, type, companyName, logoUrl, onClick }) => (
  <Card className="mb-4 h-[300px] flex flex-col hover:shadow-lg transition-shadow duration-300">
    <CardBody className="flex-grow overflow-hidden">
      {logoUrl && <Image src={logoUrl} alt={`${companyName} logo`} className="w-16 h-16 object-contain mb-2" />}
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

const API_KEYS = [
  process.env.NEXT_PUBLIC_RAPID_API_KEY_1,
  process.env.NEXT_PUBLIC_RAPID_API_KEY_2,
  process.env.NEXT_PUBLIC_RAPID_API_KEY_3
];
const JSEARCH_HOST = 'jsearch.p.rapidapi.com';
const LINKEDIN_SCRAPER_HOST = 'linkedin-profile-data-scraper.p.rapidapi.com';

// Simple cache implementation
const cache = new Map();

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState([]);
  const [localResources, setLocalResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const lastRequestTime = useRef(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const router = useRouter();
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);

  const fetchLocalResources = useCallback(async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setLocalResources(data);
    } catch (error) {
      console.error('Failed to fetch local resources:', error);
      toast.error('Failed to fetch local resources. Please try again.');
    }
  }, []);

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
            'X-RapidAPI-Key': API_KEYS[currentKeyIndex],
            'X-RapidAPI-Host': JSEARCH_HOST
          }
        }
      );

      lastRequestTime.current = Date.now();

      if (jobsResponse.status === 429) {
        // Rate limit exceeded, switch to next API key
        setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % API_KEYS.length);
        throw new Error('Rate limit exceeded. Switching to next API key. Please try again.');
      }

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
  }, [currentKeyIndex]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchResources(1, searchTerm).finally(() => {
        setIsInitialLoading(false);
      });
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [fetchResources, searchTerm]);

  useEffect(() => {
    fetchLocalResources();
  }, [fetchLocalResources]);

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
            'X-RapidAPI-Key': API_KEYS[currentKeyIndex],
            'X-RapidAPI-Host': LINKEDIN_SCRAPER_HOST
          }
        }
      );
      if (companyResponse.status === 429) {
        // Rate limit exceeded, switch to next API key
        setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % API_KEYS.length);
        throw new Error('Rate limit exceeded. Switching to next API key. Please try again.');
      }
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
    const paragraphs = description.split('\n\n');
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  const handleApply = (jobDetails) => {
    const encodedJobDetails = encodeURIComponent(JSON.stringify(jobDetails));
    router.push(`/student-dashboard/apply?jobDetails=${encodedJobDetails}`);
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
      <ToastContainer position="top-right" autoClose={5000} />
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
          {localResources.map((resource) => (
            <ResourceCard
              key={resource._id}
              title={resource.title}
              description={resource.description}
              type={resource.type}
              companyName={resource.companyName}
              logoUrl={resource.logoUrl}
              onClick={() => handleCardClick(resource)}
            />
          ))}
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
        className="h-[90vh] max-w-4xl mx-4 my-10 md:mx-auto md:mt-[5vh]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{selectedResource?.job_title || selectedResource?.title}</h2>
                <p className="text-lg">{selectedResource?.employer_name || selectedResource?.companyName}</p>
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                {isModalLoading ? (
                  <FuturisticLoader />
                ) : (
                  <article className="prose max-w-none">
                    <section>
                      <h3 className="text-xl font-semibold mb-2">Job Details</h3>
                      <p><strong>Location:</strong> {selectedResource?.job_city || selectedResource?.location}, {selectedResource?.job_country}</p>
                      <p><strong>Job Type:</strong> {selectedResource?.job_employment_type || selectedResource?.type}</p>
                    </section>

                    <section className="mt-6">
                      <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                      {formatJobDescription(selectedResource?.job_description || selectedResource?.description)}
                    </section>

                    {selectedResource?.companyDetails && (
                      <section className="mt-6">
                        <h3 className="text-xl font-semibold mb-2">About {selectedResource.employer_name || selectedResource.companyName}</h3>
                        <p>{selectedResource.companyDetails.description}</p>
                        <p><strong>Industry:</strong> {selectedResource.companyDetails.industry}</p>
                        <p><strong>Company Size:</strong> {selectedResource.companyDetails.companySize}</p>
                        {selectedResource.companyDetails.website && (
                          <p><strong>Website:</strong> <a href={selectedResource.companyDetails.website} target="_blank" rel="noopener noreferrer">{selectedResource.companyDetails.website}</a></p>
                        )}
                      </section>
                    )}

                    {(selectedResource?.employer_logo || selectedResource?.logoUrl) && (
                      <Image src={selectedResource.employer_logo || selectedResource.logoUrl} alt={`${selectedResource.employer_name || selectedResource.companyName} logo`} className="mt-6 max-w-xs mx-auto" />
                    )}
                  </article>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  className="btnPri w-full"
                  onClick={() => {
                    onClose();
                    handleApply({
                      company: selectedResource.employer_name || selectedResource.companyName,
                      title: selectedResource.job_title || selectedResource.title,
                      location: selectedResource.job_city || selectedResource.location,
                      description: selectedResource.job_description || selectedResource.description,
                      url: selectedResource.job_apply_link || selectedResource._id,
                      isLocal: !selectedResource.job_id
                    });
                  }}
                >
                  Apply Now
                </Button>
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