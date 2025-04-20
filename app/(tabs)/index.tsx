import React, { useState, useRef } from 'react';
import { StyleSheet, FlatList, Dimensions, View, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Adjust the path as needed
  
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

// Mock data for videos
type Video = {
  id: string;
  username: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  isFollowing: boolean;
  earnedToday: string;
};

const VIDEOS: Video[] = [
  {
    id: '1',
    username: '@dancerqueen',
    description: 'Check out this new dance move! #dance #viral',
    likes: '345K',
    comments: '2.1K',
    shares: '18.2K',
    isFollowing: true,
    earnedToday: '$134.50',
  },
  {
    id: '2',
    username: '@musicproducer',
    description: 'Created this beat in 10 minutes #music #producer',
    likes: '122K',
    comments: '845',
    shares: '3.4K',
    isFollowing: false,
    earnedToday: '$78.20',
  },
  {
    id: '3',
    username: '@comedyking',
    description: 'When your code finally works after 5 hours #programming #comedy',
    likes: '987K',
    comments: '10.5K',
    shares: '45K',
    isFollowing: true,
    earnedToday: '$552.70',
  },
  {
    id: '4',
    username: '@travelblogger',
    description: 'Hidden gem in Bali you need to visit #travel #bali',
    likes: '732K',
    comments: '4.2K',
    shares: '21K',
    isFollowing: false,
    earnedToday: '$221.90',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const renderItem = ({ item, index }: { item: Video; index: number }) => {
    return (
      <VideoItem 
        item={item} 
        index={index} 
        currentIndex={currentIndex} 
        colorScheme={colorScheme}
      />
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <FlatList
        ref={flatListRef}
        data={VIDEOS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        pagingEnabled
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
      />
      
      {/* App Logo */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <ThemedText 
          type="title" 
          style={styles.appLogo}
          lightColor="#FFFFFF"
          darkColor="#000000"
        >
          Creator90
        </ThemedText>
      </View>
      
{/* Navigation tabs */}
<View style={[styles.tabsContainer, { top: insets.top + 20 }]}>
  <TouchableOpacity style={styles.tabButton}>
    <ThemedText style={[styles.tabText, styles.tabActive]}>For You</ThemedText>
  </TouchableOpacity>
  <TouchableOpacity style={styles.tabButton}>
    <ThemedText style={styles.tabText}>Following</ThemedText>
  </TouchableOpacity>
</View>
    </ThemedView>
  );
}

function VideoItem({ item, index, currentIndex, colorScheme }: { item: Video; index: number; currentIndex: number; colorScheme: string }) {
  const isActive = index === currentIndex;
  const [liked, setLiked] = useState(false);
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const likeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(liked ? 1.2 : 1, { damping: 10 }) }
      ]
    };
  });
  
  return (
    <ThemedView style={styles.videoContainer}>
      {/* Video placeholder */}
      <View style={[
        styles.videoPlaceholder, 
        { backgroundColor: index % 2 === 0 ? '#000000' : '#FFFFFF' }
      ]}>
        <IconSymbol 
          name="paperplane.fill"
          size={50}
          color="#FFFFFF50"
        />
      </View>
      
      {/* Creator info and description */}
      <View style={styles.creatorContainer}>
        <ThemedText type="defaultSemiBold" style={styles.username}>
          {item.username}
        </ThemedText>
        <ThemedText style={styles.description}>{item.description}</ThemedText>
      </View>
      
      {/* Right side icons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('ProfileScreen', { username: item.username })}
        >
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=' + (index + 10) }}
            style={styles.profileImage}
          />
          <View style={styles.followButton}>
            <IconSymbol 
              name={item.isFollowing ? 'chevron.right' : 'paperplane.fill'} 
              size={16} 
              color="#FFFFFF" 
            />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => setLiked(prev => !prev)}
        >
          <Animated.View style={likeAnimatedStyle}>
            <IconSymbol 
              name="house.fill" 
              size={28} 
              color={liked ? '#FFFFFF' : '#000000'} 
            />
          </Animated.View>
          <ThemedText style={styles.actionText}>{item.likes}</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol 
            name="paperplane.fill" 
            size={28} 
            color="#000000" 
          />
          <ThemedText style={styles.actionText}>{item.comments}</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol 
            name="paperplane.fill" 
            size={28} 
            color="#000000" 
          />
          <ThemedText style={styles.actionText}>{item.shares}</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  appLogo: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  tabsContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  tabButton: {
    marginHorizontal: 15,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
    color: '#FFFFFF',
  },
  tabActive: {
    opacity: 1,
    fontWeight: 'bold',
  },
  videoContainer: {
    width,
    height,
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    width: width - 120,
  },
  username: {
    fontSize: 17,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  description: {
    fontSize: 15,
    marginBottom: 15,
    color: '#FFFFFF',
  },
  actionsContainer: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionText: {
    marginTop: 5,
    fontSize: 13,
    color: '#FFFFFF',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  followButton: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});