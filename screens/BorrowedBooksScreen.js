import { useFocusEffect } from '@react-navigation/native';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function BorrowedBooksScreen({ navigation }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // Refresh when navigating back
  useFocusEffect(
    React.useCallback(() => {
      fetchBorrowedBooks();
    }, [])
  );

  const fetchBorrowedBooks = async () => {
    try {
      const q = query(collection(db, 'books'), where('borrowed', '==', true)); // Fetch only borrowed books
      const querySnapshot = await getDocs(q);
      const booksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBorrowedBooks(booksList);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  const handleReturn = async (book) => {
    try {
      const bookRef = doc(db, `books/${book.id}`);
      await updateDoc(bookRef, { borrowed: false });

      Alert.alert('Success', `${book.bookName} has been returned.`);
      navigation.navigate('Books'); // Redirect to available books
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Borrowed Books</Text>
      {borrowedBooks.length === 0 ? (
        <Text style={styles.noBooks}>No borrowed books</Text>
      ) : (
        <FlatList
          data={borrowedBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.bookTitle}>{item.bookName}</Text>
              <Button title="Return" color="red" onPress={() => handleReturn(item)} />
            </View>
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
  bookItem: { 
    padding: 15, 
    backgroundColor: '#f8f8f8', 
    marginBottom: 5, 
    borderRadius: 5, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  bookTitle: { fontSize: 18, fontWeight: 'bold' },
});
