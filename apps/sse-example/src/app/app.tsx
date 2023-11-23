import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react';

const mapContainerStyle = {
  width: '100%',
  height: '75vh',
};

const App = () => {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [event, setEvent] = useState<EventSource | null>();
  const [isMounted, setIsMounted] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    setIsMounted(true);
    return () => {
      event?.close();
    };
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const createOrder = () => {
    event?.close();
    const eventSource = new EventSource('http://localhost:3000/car-route-sse');
    setEvent(eventSource);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCoordinates(data);
    };

    // Add an error event listener
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      // Handle the error as needed
    };
  };

  const cancelOrder = () => {
    event?.close();
  };

  return (
    <ChakraProvider>
      <Box textAlign="center" p={4}>
        <Heading as="h1" mb={4}>
          Order Tracker
        </Heading>
        <Text mb={2}>Latitude: {coordinates.latitude}</Text>
        <Text mb={4}>Longitude: {coordinates.longitude}</Text>

        <VStack>
          <HStack>
            <Button
              borderRadius={'full'}
              colorScheme="blue"
              onClick={() => createOrder()}
              mb={4}
            >
              Place Order
            </Button>
            <Button
              borderRadius={'full'}
              colorScheme="red"
              onClick={() => cancelOrder()}
              mb={4}
            >
              Cancel Order
            </Button>
          </HStack>
        </VStack>

        <Box borderRadius={24}>
          <GoogleMap
            center={{
              lat: -20.3518, // default latitude
              lng: -40.308, // default longitude
            }}
            mapContainerStyle={mapContainerStyle}
            zoom={15}
          >
            {isMounted && (
              <Marker
                position={{
                  lat: coordinates.latitude,
                  lng: coordinates.longitude,
                }}
              />
            )}
          </GoogleMap>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;
