'use client'

import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardFooter, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import Container from '@/components/pageLayout/Container';
import FuturisticLoader from '@/components/FuturisticLoader';

const EventCard = ({ title, date, location, description, onClick }) => (
  <Card className="mb-4 h-[300px] flex flex-col hover:shadow-lg transition-shadow duration-300">
    <CardBody className="flex-grow overflow-hidden">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">{date} - {location}</p>
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
const PREDICTHQ_HOST = 'predicthq-event-search.p.rapidapi.com';

const cache = new Map();

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

    const cacheKey = `${search}-${page}`;
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      setEvents(prevEvents => page === 1 ? cachedData.results : [...prevEvents, ...cachedData.results]);
      setTotalPages(Math.ceil(cachedData.count / 10));
      setCurrentPage(page);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${PREDICTHQ_HOST}/v1/events/?q=${encodeURIComponent(search + ' tech')}&limit=10&offset=${(page - 1) * 10}&sort=start`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': PREDICTHQ_HOST
          }
        }
      );

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        cache.set(cacheKey, data);
        setEvents(prevEvents => page === 1 ? data.results : [...prevEvents, ...data.results]);
        setTotalPages(Math.ceil(data.count / 10));
        setCurrentPage(page);
      } else {
        setError('No events found. Try a different search term.');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch events. Please try again.');
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
    }, 1000);

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
      <h1 className="text-3xl font-bold mb-8">Upcoming Tech Events</h1>
      <Input
        placeholder="Search for tech events..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-8"
        startContent={<SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
      />
      {error && (
        <div className="mb-4 text-red-500">
          {error}
          <Button onClick={() => fetchEvents(1, searchTerm)} className="ml-4">Retry</Button>
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
              date={new Date(event.start).toLocaleDateString()}
              location={event.location.join(', ')}
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
                <p><strong>Date:</strong> {new Date(selectedEvent?.start).toLocaleString()}</p>
                <p><strong>Location:</strong> {selectedEvent?.location.join(', ')}</p>
                <p><strong>Description:</strong> {selectedEvent?.description}</p>
                {selectedEvent?.entities && (
                  <div>
                    <h3 className="text-xl font-semibold mt-4 mb-2">Related Entities</h3>
                    <ul>
                      {selectedEvent.entities.map((entity, index) => (
                        <li key={index}>{entity.name} ({entity.type})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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