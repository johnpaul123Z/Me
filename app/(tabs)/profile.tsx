import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  FlatList,
  Dimensions,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, RouteProp } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = width / 3;

// Mock user data
const USER = {
  username: '@videocreator',
  fullName: 'Alex Creator',
  bio: 'Creating awesome videos daily | Sharing my creative journey | 10% platform fee is worth it for the exposure',
  followers: '245K',
  following: '420',
  totalEarned: '$15,420.75',
  platformTake: '$1,713.42',
  profileImage: 'https://i.pravatar.cc/300?img=12',
  videos: [
    { id: '1', thumbnail: null, views: '1.2M', earnings: '$342.50' },
    { id: '2', thumbnail: null, views: '890K', earnings: '$211.20' },
    { id: '3', thumbnail: null, views: '2.4M', earnings: '$645.30' },
    { id: '4', thumbnail: null, views: '1.5M', earnings: '$387.65' },
    { id: '5', thumbnail: null, views: '720K', earnings: '$156.45' },
    { id: '6', thumbnail: null, views: '3.1M', earnings: '$734.20' },
  ]
};

export default function ProfileScreen() {
  const route = useRoute();
  // Define the type for route parameters
  type ProfileRouteParams = {
    params: {
      username: string;
    };
  };
  
  const { username } = (route as RouteProp<ProfileRouteParams>).params || {}; // Get the username from navigation params
  const insets = useSafeAreaInsets();
  const [bioText, setBioText] = useState(USER.bio);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoCaption, setVideoCaption] = useState('');

  // Mock user data can be updated to fetch based on username
  const userData = username === USER.username ? USER : USER; // Replace with actual user fetching logic

  // Handle video upload
  const handleVideoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });
      
      if (!result.canceled) {
        setSelectedVideo(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking video:', error);
    }
  };
  
  // Handle publishing a video
  const handlePublishVideo = () => {
    // In a real app, you would upload the video to a server here
    console.log('Publishing video:', { videoUri: selectedVideo, caption: videoCaption });
    
    // Reset and close modal
    setSelectedVideo(null);
    setVideoCaption('');
    setShowUploadModal(false);
  };
  
  // Render video thumbnail
  const renderVideoItem = ({ item, index }: { item: { id: string; thumbnail: string | null; views: string; earnings: string }; index: number }) => {
    // Generate a grayscale video thumbnail based on index
    const grayValue = 100 + (index * 20) % 155;
    
    return (
      <TouchableOpacity style={styles.videoThumbnail}>
        <View 
          style={[
            styles.thumbnailPlaceholder, 
            { backgroundColor: `rgb(${grayValue}, ${grayValue}, ${grayValue})` }
          ]}
        >
          <IconSymbol name="paperplane.fill" size={24} color="#FFFFFF50" />
        </View>
        <View style={styles.videoInfoOverlay}>
          <ThemedText style={styles.videoViews}>{item.views}</ThemedText>
          <ThemedText style={styles.videoEarnings}>{item.earnings}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton}>
            <IconSymbol 
              name="chevron.right" 
              size={24} 
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{username || 'Profile'}</ThemedText>
          <TouchableOpacity style={styles.settingsButton}>
            <IconSymbol 
              name="house.fill" 
              size={24} 
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: userData.profileImage }} 
            style={styles.profileImage} 
          />
          
          <View style={styles.profileInfo}>
            <ThemedText style={styles.username}>{userData.username}</ThemedText>
            <ThemedText style={styles.fullName}>{userData.fullName}</ThemedText>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{userData.videos.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Videos</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{userData.followers}</ThemedText>
                <ThemedText style={styles.statLabel}>Followers</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{userData.following}</ThemedText>
                <ThemedText style={styles.statLabel}>Following</ThemedText>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.bioSection}>
          {isEditingBio ? (
            <View style={styles.bioEditContainer}>
              <TextInput
                style={styles.bioEditInput}
                value={bioText}
                onChangeText={setBioText}
                multiline
                placeholderTextColor="#666"
                maxLength={150}
              />
              <View style={styles.bioEditButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setBioText(userData.bio);
                    setIsEditingBio(false);
                  }}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => setIsEditingBio(false)}
                >
                  <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.bioTextContainer}>
                <ThemedText style={styles.bioText}>{bioText}</ThemedText>
                <TouchableOpacity 
                  style={styles.editBioButton}
                  onPress={() => setIsEditingBio(true)}
                >
                  <ThemedText style={styles.editBioText}>Edit</ThemedText>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        
        <View style={styles.earningsSection}>
          <ThemedText style={styles.sectionTitle}>Creator Earnings</ThemedText>
          <View style={styles.earningsCard}>
            <View style={styles.earningsRow}>
              <ThemedText style={styles.earningsLabel}>Total Earned:</ThemedText>
              <ThemedText style={styles.earningsValue}>{userData.totalEarned}</ThemedText>
            </View>
            <View style={styles.earningsRow}>
              <ThemedText style={styles.platformTakeLabel}>Platform Fee (10%):</ThemedText>
              <ThemedText style={styles.platformTakeValue}>{userData.platformTake}</ThemedText>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsRow}>
              <ThemedText style={styles.netEarningsLabel}>Your Take (90%):</ThemedText>
              <ThemedText style={styles.netEarningsValue}>
                ${(parseFloat(userData.totalEarned.replace('$', '')) - parseFloat(userData.platformTake.replace('$', ''))).toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.uploadSection}>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => setShowUploadModal(true)}
          >
            <IconSymbol 
              name="paperplane.fill" 
              size={20} 
              color="#000000"
            />
            <ThemedText style={styles.uploadButtonText}>UPLOAD NEW VIDEO</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.videosSection}>
          <ThemedText style={styles.sectionTitle}>Your Videos</ThemedText>
          <FlatList
            data={userData.videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      
      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Upload New Video</ThemedText>
              <TouchableOpacity 
                onPress={() => {
                  setShowUploadModal(false);
                  setSelectedVideo(null);
                  setVideoCaption('');
                }}
              >
                <IconSymbol 
                  name="house.fill" 
                  size={24} 
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.videoSelectButton}
              onPress={handleVideoUpload}
            >
              {selectedVideo ? (
                <View style={styles.selectedVideoContainer}>
                  <Image 
                    source={{ uri: selectedVideo }} 
                    style={styles.selectedVideoThumbnail}
                  />
                  <ThemedText style={styles.changeVideoText}>Tap to change</ThemedText>
                </View>
              ) : (
                <View style={styles.videoSelectPlaceholder}>
                  <IconSymbol 
                    name="paperplane.fill" 
                    size={40} 
                    color="#FFFFFF50"
                  />
                  <ThemedText style={styles.selectVideoText}>Select Video</ThemedText>
                </View>
              )}
            </TouchableOpacity>
            
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor="#777"
              value={videoCaption}
              onChangeText={setVideoCaption}
              multiline
              maxLength={150}
            />
            
            <TouchableOpacity 
              style={[
                styles.publishButton,
                (!selectedVideo || !videoCaption) && styles.publishButtonDisabled
              ]}
              onPress={handlePublishVideo}
              disabled={!selectedVideo || !videoCaption}
            >
              <ThemedText style={styles.publishButtonText}>PUBLISH</ThemedText>
            </TouchableOpacity>
            
            <View style={styles.feeNotice}>
              <ThemedText style={styles.feeNoticeText}>
                Remember: We take 10% of all revenue generated by your content
              </ThemedText>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 5,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fullName: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bioTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bioText: {
    fontSize: 14,
    color: '#DDDDDD',
    lineHeight: 20,
    flex: 1,
  },
  editBioButton: {
    marginLeft: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  editBioText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  bioEditContainer: {
    marginBottom: 10,
  },
  bioEditInput: {
    backgroundColor: '#111111',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 100,
    borderWidth: 1,
    borderColor: '#333',
  },
  bioEditButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  cancelButtonText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  earningsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  earningsCard: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333333',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  earningsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  platformTakeLabel: {
    fontSize: 14,
    color: '#FF4040',
  },
  platformTakeValue: {
    fontSize: 16,
    color: '#FF4040',
  },
  earningsDivider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 8,
  },
  netEarningsLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  netEarningsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  uploadSection: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  videosSection: {
    padding: 20,
    paddingTop: 0,
  },
  videoThumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    position: 'relative',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  videoInfoOverlay: {
    position: 'absolute',
    bottom: 5, // Replace 5 with the desired value for the bottom position
    left: 5,
    right: 5,
  },
  videoViews: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  videoEarnings: {
    fontSize: 10,
    color: '#AAAAAA',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderWidth: 1,
    borderColor: '#333333',
    borderBottomWidth: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  videoSelectButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#111111',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  videoSelectPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#444444',
    borderRadius: 12,
  },
  selectVideoText: {
    color: '#AAAAAA',
    marginTop: 10,
    fontSize: 16,
  },
  selectedVideoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedVideoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeVideoText: {
    position: 'absolute',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  captionInput: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  publishButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  publishButtonDisabled: {
    backgroundColor: '#333333',
  },
  publishButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feeNotice: {
    alignItems: 'center',
  },
  feeNoticeText: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
  }
});