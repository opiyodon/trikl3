'use client'

import { useState, useEffect, useCallback } from 'react';
import { Input, Button, Card, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const EventCard = ({ title, company, location, description, onClick }) => (
  <Card className="mb-4 h-[300px] flex flex-col hover:shadow-lg transition-shadow duration-300">
    <CardBody className="flex-grow overflow-hidden">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">{company} - {location}</p>
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

const fetchEventsFromAPI = async (page, search = '') => {
  const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;
  const url = `https://api.rapidapi.com/events?page=${page}&search=${encodeURIComponent(search)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'api.rapidapi.com',
      'x-rapidapi-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const data = await response.json();
  return {
    events: data.results,
    totalPages: data.total_pages,
  };
};

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = useCallback(async (page, search = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const { events, totalPages } = await fetchEventsFromAPI(page, search);
      setEvents(prevEvents => page === 1 ? events : [...prevEvents, ...events]);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      setError('Failed to fetch events. Please try again.');
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEvents(1, searchTerm).finally(() => {
        setIsInitialLoading(false);
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchEvents, searchTerm]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchEvents(currentPage + 1, searchTerm);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const retryFetch = () => {
    setEvents([]);
    setCurrentPage(1);
    fetchEvents(1, searchTerm);
  };

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    onOpen();
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
      <h1 className="text-3xl font-bold mb-8">Available Events</h1>
      <Input
        placeholder="Search for events..."
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
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              company={event.company}
              location={event.location}
              description={event.description}
              onClick={() => handleCardClick(event)}
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
                <h2 className="text-2xl font-bold">{selectedEvent?.title}</h2>
              </ModalHeader>
              <ModalBody>
                <p><strong>Company:</strong> {selectedEvent?.company}</p>
                <p><strong>Location:</strong> {selectedEvent?.location}</p>
                <p><strong>Description:</strong> {selectedEvent?.description}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary">
                  Apply Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}
