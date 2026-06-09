import { FlatList, Image, View, Dimensions, Alert } from 'react-native'
import { usePhotos } from '@/contexts/imageContext'
import * as ImagePicker from 'expo-image-picker'
import { Button } from 'react-native-paper'
import React from 'react'
import HeaderPic from '@/components/header'

export default function GalleryScreen () {
  const { photos, addPhoto } = usePhotos()
  const numColumns = 3
  const screenWidth = Dimensions.get('window').width
  const tileSize = screenWidth / numColumns

  const pickImagesFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission requise',
        'Vous devez autoriser l\'accès à vos photos pour jouer avec vos propres images !'
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.2
    })

    if (!result.canceled) {
      result.assets.map(asset => addPhoto(asset.uri))
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <HeaderPic label={'Mes Captures'} isGame={false} />

      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        contentContainerStyle={{ paddingHorizontal: 2, paddingTop: 4 }}
        renderItem={({ item }) => (
          <View
            style={{ width: tileSize, height: tileSize }}
            className="p-[2px]"
          >
            <Image
              source={{ uri: item }}
              className="w-full h-full rounded-lg bg-slate-100 dark:bg-slate-900"
              resizeMode="cover"
            />
          </View>
        )}
      />
      <Button
        mode="contained"
        icon="image-multiple"
        onPress={pickImagesFromGallery}
        className="bg-violet-600 rounded-full py-2 mt-10 mb-20 mx-20"
      >
        Choisir des photos
      </Button>
    </View>
  )
}