import { useState, useEffect, useRef } from 'react'
import { ChakraProvider, Heading, Text, Box, Button, SimpleGrid } from '@chakra-ui/react'
import InputField from './components/input-field'
import { useDebounce } from './hooks/useDebounce'
import { getCharacter } from './utils/getCharacter'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [query, setQuery] = useState('');
  const [listing, setListing] = useState('');
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef();

  const searchQuery = useDebounce(query, 2000);
  const controller = new AbortController();
  controllerRef = controller;

  const searchCharacter = async () => {
    setListing('')
    setLoading('')
    const data = await getCharacter(searchQuery, controllerRef.current?.signal)
    controllerRef.current = null;
    setListing(data.results)
    setLoading(false)
  }

  useEffect(() => {
    if(searchQuery || query.trim().length < 0) searchCharacter()
    return cancelSearch()
  }, [searchQuery])

  const cancelSearch = () => {
    controllerRef.current.abort();
  }

  return (
    <div className="App">
      <ChakraProvider>
        <Heading mb={4}>Search Ricky and Morty Character</Heading>
        <Text fontSize='md' textAlign="left" mb={10}>
          With a debounce hook implemented
        </Text>

        <SimpleGrid columns={1} spacing={10}>
          <Box>
            <InputField mb={10} onChange={(event) => setQuery(event.target.value)} value={value} />
          </Box>
        </SimpleGrid>

        {loading && <Text mb={10} mt={10} textAlign="left">Loading...</Text>}
        {listing && <Box mt={10} display={'block'}>{listing.map(character => (
          <Box key={character.id} mb={10}>
            <img src={character.image} alt={character.name} />
            {character.name}
          </Box>
        ))}</Box>}
        {!listing && !listing && <Box mt={10} display={'block'} color={'#c8c8c8'}>You have started your search</Box>}
      </ChakraProvider>
    </div>
  )
}

export default App
