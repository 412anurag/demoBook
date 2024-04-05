import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BookCard from '../src/components/BookCard';

describe('BookCard', () => {
  const book = {
    id: '1',
    volumeInfo: {
      title: 'Sample Book',
      description: 'Sample Description',
      publishedDate: '2022-04-01',
      publisher: 'Sample Publisher',
      imageLinks: {
        thumbnail: 'https://example.com/image.jpg',
      },
    },
  };

  test('renders title initially', () => {
    const { getByText } = render(<BookCard item={book} />);
    expect(getByText('Sample Book')).toBeDefined();
  });

  test('toggles expansion on title press', () => {
    const { getByText, queryByText } = render(<BookCard item={book} />);
    fireEvent.press(getByText('Sample Book'));
    expect(queryByText('Sample Description')).toBeDefined();
    expect(queryByText('2022-04-01')).toBeDefined();
    expect(queryByText('Sample Publisher')).toBeDefined();
    fireEvent.press(getByText('Sample Book'));
    expect(queryByText('Sample Description')).toBeNull();
    expect(queryByText('2022-04-01')).toBeNull();
    expect(queryByText('Sample Publisher')).toBeNull();
  });

  test('renders add to favorites button when addToFavorites is provided', () => {
    const { getByTestId } = render(<BookCard item={book} addToFavorites={() => {}} />);
    expect(getByTestId('add-favorite-button')).toBeDefined();
  });

  test('renders remove from favorites button when removeFromFavorites is provided', () => {
    const { getByTestId } = render(<BookCard item={book} removeFromFavorites={() => {}} />);
    expect(getByTestId('remove-favorite-button')).toBeDefined();
  });
});
