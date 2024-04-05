import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookCard from './src/components/BookCard';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    description?: string;
    publishedDate?: string;
    publisher?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

const API_BASE_URL = 'https://www.googleapis.com/books/v1/';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load favorites from local storage on component mount
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites !== null) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      // console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (updatedFavorites: Book[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      // console.error('Error saving favorites:', error);
    }
  };

  const handleSearch = (searchQuery: string, page: number) => {
    // console.log('handleSearch===', searchQuery);
    if (loadingMore) return; // Prevent fetching while loading more data
    setLoading(true);

    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    fetchSearchResults(searchQuery, page);
  };

  const fetchSearchResults = async (searchQuery: string, page: number) => {
    // setLoadingMore(true);
    try {
      const response = await axios.get(`${API_BASE_URL}volumes?q=${searchQuery}&startIndex=${(page - 1) * 10}`);
      if (page == 1) {
        if (response?.data?.items && response?.data?.items?.length > 0) {
          setSearchResults([...response?.data?.items]);
        } else {
          setSearchResults([]);
        }
      } else {
        if (response?.data?.items && response?.data?.items?.length > 0) {
          setSearchResults(prevResults => [...prevResults, ...response?.data?.items]);
        } else {
          setPage(prevPage => prevPage - 1);
        }
      }
    } catch (error) {
      // console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const debounce = (func: Function, delay: number) => {
    return function (this: any, ...args: any[]) {
      const context = this;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const debouncedSearch = debounce(handleSearch, 1000);

  const handleInputChange = (text: string) => {
    setPage(1);
    setQuery(text);
    debouncedSearch(text, 1);
  };

  const addToFavorites = (book: Book) => {
    const isBookInFavorites = favorites.some(item => item.id === book.id);

    if (!isBookInFavorites) {
      const updatedFavorites = [...favorites, book];
      saveFavorites(updatedFavorites);
      Alert.alert('Added to Favorites', 'Book has been added to favorites.');
    } else {
      Alert.alert('Already in Favorites', 'This book is already in favorites.');
    }
  };

  const removeFromFavorites = (bookId: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== bookId);
    saveFavorites(updatedFavorites);
    Alert.alert('Removed from Favorites', 'Book has been removed from favorites.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for books..."
          onChangeText={text => handleInputChange(text)}
          value={query}
          testID="search-input"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setPage(1);
            handleSearch(query, 1);
          }}
          testID="search-button"
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listsWrapper}>
        <View style={styles.listsWrapper}>
          <FlatList
            ListHeaderComponent={
              <>
                <Text style={styles.sectionTitle} testID="books-section-title">Books</Text>
                {loading && <ActivityIndicator size="small" color="#0000ff" testID="loading-indicator" />}
              </>
            }
            data={searchResults}
            keyExtractor={(item, index) => item.id + index.toString()}
            renderItem={({ item, index }) => (
              <BookCard key={item.id + index.toString()} item={item} addToFavorites={addToFavorites} />
            )}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (!loadingMore && searchResults.length > 0) {
                setLoadingMore(true);
                setPage(prevPage => prevPage + 1);
                handleSearch(query, page + 1);
              }
            }}
            ListEmptyComponent={
              <View style={styles.noItemTextWrapper}>
                <Text testID='no-item-text' style={styles.noItemText}>No item Found</Text>
              </View>
            }
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#0000ff" testID='loading-more-indicator' /> : null}
            scrollEnabled={!loading || !loadingMore} // Disable scrolling while data is being fetched
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.listsWrapper}>
          <FlatList
            ListHeaderComponent={<Text style={styles.sectionTitle} testID="favorites-section-title">Favorites</Text>}
            data={favorites}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <BookCard item={item} cardType="favorite" removeFromFavorites={removeFromFavorites} />
            )}
            ListEmptyComponent={
              <View style={styles.noItemTextWrapper}>
                <Text style={styles.noItemText} testID="favorites-empty-text">Add Books to Favorite</Text>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
  listsWrapper: {
    flex: 1,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  noItemTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  noItemText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
});

export default App;

