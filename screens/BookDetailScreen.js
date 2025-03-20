import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);

  useEffect(() => {
    checkBorrowedCount();
  }, []);

  // Fetch the count of currently borrowed books
  const checkBorrowedCount = async () => {
    try {
      const q = query(collection(db, 'books'), where('borrowed', '==', true));
      const querySnapshot = await getDocs(q);
      setBorrowedBooksCount(querySnapshot.size); // Count the number of borrowed books
    } catch (error) {
      console.error('Error fetching borrowed books count:', error);
    }
  };

  const handleBorrow = async () => {
    if (borrowedBooksCount >= 3) {
      Alert.alert('Limit Reached', 'You cannot borrow more than three books.');
      return;
    }

    try {
      const bookRef = doc(db, `books/${book.id}`);
      const bookSnap = await getDoc(bookRef);

      if (bookSnap.exists()) {
        if (!bookSnap.data().borrowed) {
          await updateDoc(bookRef, { borrowed: true });

          Alert.alert(
            'Success',
            `${book.bookName} has been borrowed.`,
            [{ text: "OK", onPress: () => navigation.goBack() }] // Navigate back after alert
          );
        } else {
          Alert.alert('Book Already Borrowed', 'This book is not available.');
        }
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      Alert.alert('Error', 'Could not borrow the book.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* ✅ Display Book Cover Image */}
        {book.coverImage && (
          <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
        )}

        <Text style={styles.title}>{book.bookName}</Text>
        <Text style={styles.author}>Author: {book.author}</Text>
        <Text style={styles.genre}>Genre: {book.genre}</Text>
        <Text style={styles.publishedYear}>Published: {book.publishedYear}</Text>
        <Text style={styles.description}>{book.description}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Borrow" onPress={handleBorrow} color="#007BFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 5 
  },
  coverImage: {
    width: "100%",
    height: 250, 
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 15
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  author: { fontSize: 18, color: 'gray', marginBottom: 5 },
  genre: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  publishedYear: { fontSize: 16, color: 'darkgreen', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
  buttonContainer: { marginTop: 10, alignItems: 'center' }
});
