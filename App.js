import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BookDetailScreen from './screens/BookDetailScreen';
import BookListScreen from './screens/BookListScreen';
import BorrowedBooksScreen from './screens/BorrowedBooksScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BookStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'Available Books' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Books" component={BookStackNavigator} />
        <Tab.Screen name="Borrowed" component={BorrowedBooksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
