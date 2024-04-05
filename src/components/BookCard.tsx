import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Icons from '../assets/icons';

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

interface Props {
  item: Book;
  addToFavorites?: (item: Book) => void;
  removeFromFavorites?: (id: string) => void;
  cardType?: string;
}

const BookCard: React.FC<Props> = ({
  item,
  addToFavorites,
  removeFromFavorites,
  cardType = 'search',
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={toggleExpansion}
      testID="book-card"
    >
      <View style={styles.thumbnailWrapper}>
        {item.volumeInfo.imageLinks?.thumbnail && (
          <Image
            style={styles.thumbnail}
            source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
          />
        )}
      </View>
      <View style={styles.cardContent}>
        <TouchableOpacity onPress={toggleExpansion}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.volumeInfo.title}</Text>
            <Image
              style={styles.arrowIcon}
              source={expanded ? Icons.common.upArrow : Icons.common.downArrow}
            />
          </View>
        </TouchableOpacity>
        {expanded && (
          <View>
            <Text style={styles.infoText}>
              Description: {item.volumeInfo.description}
            </Text>
            <Text style={styles.infoText}>
              Publication Date: {item.volumeInfo.publishedDate}
            </Text>
            <Text style={styles.infoText}>
              Publisher: {item.volumeInfo.publisher}
            </Text>
          </View>
        )}
        {removeFromFavorites && (
          <TouchableOpacity
            style={[styles.buttonFavorite, { backgroundColor: 'red' }]}
            onPress={() => removeFromFavorites(item.id)}
            testID="remove-favorite-button"
          >
            <Text style={styles.buttonText}>Remove from Favorites</Text>
          </TouchableOpacity>
        )}
        {addToFavorites && (
          <TouchableOpacity
            style={[styles.buttonFavorite, { backgroundColor: 'green' }]}
            onPress={() => addToFavorites(item)}
            testID="add-favorite-button"
          >
            <Text style={styles.buttonText}>Add to Favorites</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Adjusted to align items at the top
    marginBottom: 10,
  },
  thumbnailWrapper: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  thumbnail: {
    width: '100%', // Adjusted to take full width
    height: '100%', // Adjusted to take full height
    resizeMode: 'cover', // Ensures the image covers the entire space
  },
  cardContent: {
    flex: 1, // Adjusted to take remaining space
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  infoText: {
    marginBottom: 5,
  },
  buttonFavorite: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BookCard;

