import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  // Refresh when navigating back
  useFocusEffect(
    React.useCallback(() => {
      fetchAvailableBooks();
    }, [])
  );

  const fetchAvailableBooks = async () => {
    try {
      const q = query(collection(db, 'books'), where('borrowed', '==', false)); // Only fetch books that are not borrowed
      const querySnapshot = await getDocs(q);
      const bookList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('Fetched Available Books:', bookList); // Debugging line
      setBooks(bookList);
    } catch (error) {
      console.error("Error fetching available books:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Books</Text>
      {books.length === 0 ? (
        <Text style={styles.noBooks}>No books available</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bookItem} onPress={() => navigation.navigate('BookDetail', { book: item })}>
              <Text style={styles.bookTitle}>{item.bookName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  noBooks: { fontSize: 18, textAlign: 'center', marginTop: 20, color: 'gray' },
  bookItem: { padding: 15, backgroundColor: '#f8f8f8', marginBottom: 5, borderRadius: 5 },
  bookTitle: { fontSize: 18, fontWeight: 'bold' },
});
