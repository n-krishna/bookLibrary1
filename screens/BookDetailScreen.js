import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;

  const handleBorrow = async () => {
    try {
      const bookRef = doc(db, `books/${book.id}`);
      const bookSnap = await getDoc(bookRef);

      if (bookSnap.exists()) {
        if (!bookSnap.data().borrowed) {
          await updateDoc(bookRef, { borrowed: true });
          Alert.alert('Success', `${book.bookName} has been borrowed.`);
          navigation.navigate('Books'); // Move back to available books
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
      <Text style={styles.title}>{book.bookName}</Text>
      <Button title="Borrow" onPress={handleBorrow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
});
