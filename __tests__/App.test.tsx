import React from 'react';
import { render } from '@testing-library/react-native';
import axios from 'axios';
import App from '../App';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mocking axios
jest.mock('axios');



describe('App', () => {

  test('renders correctly', () => {
    render(<App/>);
  });

  test('renders search input and button', () => {
    const { getByTestId } = render(<App />);
    const searchInput = getByTestId('search-input');
    const searchButton = getByTestId('search-button');
    expect(searchInput).toBeDefined();
    expect(searchButton).toBeDefined();
  });

  test('renders Books section title,loading-indicator and loading-more-indicator', () => {
    const { getByTestId,queryByTestId } = render(<App />);
    const booksSectionTitle = getByTestId('books-section-title');
    const loadingIndicator = queryByTestId('loading-indicator');
    const loadingMoreIndicator = queryByTestId('loading-more-indicator');
    expect(booksSectionTitle).toBeDefined();
    expect(booksSectionTitle.props.children).toBe('Books');
    expect(loadingIndicator).toBeNull();
    expect(loadingMoreIndicator).toBeNull();
  });

  test('displays No item Found text in Books list when no search results are available', () => {
    const { getByTestId } = render(<App />);
    const noItemText = getByTestId('no-item-text');
    expect(noItemText).toBeDefined();
    expect(noItemText.props.children).toBe('No item Found');
  });

  test('renders Favorites section title and empty text', () => {
    const { getByTestId } = render(<App />);
    const favoritesSectionTitle = getByTestId('favorites-section-title');
    const favoritesEmptyText = getByTestId('favorites-empty-text');
    expect(favoritesSectionTitle).toBeDefined();
    expect(favoritesSectionTitle.props.children).toBe('Favorites');
    expect(favoritesEmptyText).toBeDefined();
    expect(favoritesEmptyText.props.children).toBe('Add Books to Favorite');
  });


  test('render search bard and search button', () => {
    const { getByTestId } = render(<App />);
    const searchInput = getByTestId('search-input');
    const searchButton = getByTestId('search-button');
    expect(searchInput).toBeDefined();
    expect(searchButton).toBeDefined();
})

});
