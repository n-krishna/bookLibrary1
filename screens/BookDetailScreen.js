import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);
  const [isBorrowed, setIsBorrowed] = useState(false); 

  useEffect(() => {
    checkBorrowedCount();
    fetchBookStatus(); 
  }, []);

 
  const fetchBookStatus = () => {
    const bookRef = doc(db, `books/${book.id}`);

    return onSnapshot(bookRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsBorrowed(docSnap.data().borrowed);
        console.log("Real-time book status:", docSnap.data().borrowed ? "Borrowed" : "Available");
      }
    });
  };

 
  const checkBorrowedCount = async () => {
    try {
      const q = query(collection(db, 'books'), where('borrowed', '==', true));
      const querySnapshot = await getDocs(q);
      setBorrowedBooksCount(querySnapshot.size);
      console.log("Borrowed books count:", querySnapshot.size);
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
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );

          console.log("Book borrowed successfully:", book.bookName);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        {book.coverImage && (
          <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
        )}

        <Text style={styles.title}>{book.bookName}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Author: <Text style={styles.info}>{book.author}</Text></Text>
          <Text style={styles.label}>Genre: <Text style={styles.info}>{book.genre}</Text></Text>
          <Text style={styles.label}>Published: <Text style={styles.info}>{book.publishedYear}</Text></Text>
        </View>

        <Text style={styles.description}>{book.description}</Text>

        <View style={styles.buttonContainer}>
          {isBorrowed ? (
            <Text style={styles.borrowedText}>❌ This book is currently borrowed</Text>
          ) : (
            <Button title="📚 Borrow" onPress={handleBorrow} color="#007BFF" />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollViewContainer: { padding: 20, flexGrow: 1 },
  card: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    elevation: 6 
  },
  coverImage: {
    width: "100%",  
    height: 320, 
    resizeMode: "contain", 
    borderRadius: 10,
    alignSelf: "center", 
    marginBottom: 20
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center', 
    color: "#333" 
  },
  infoContainer: { 
    marginBottom: 15, 
    paddingHorizontal: 10 
  },
  label: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#555", 
    marginBottom: 5 
  },
  info: { 
    fontWeight: "400", 
    color: "#222" 
  },
  description: { 
    fontSize: 16, 
    lineHeight: 22, 
    marginBottom: 25, 
    textAlign: "justify", 
    color: "#444" 
  },
  buttonContainer: { 
    marginTop: 10, 
    alignItems: 'center' 
  },
  borrowedText: { 
    fontSize: 16, 
    color: "red", 
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10
  }
});
