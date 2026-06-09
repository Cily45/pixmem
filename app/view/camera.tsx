import { View, Text, StyleSheet, Image } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import React, { useRef, useState } from 'react'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { usePhotos } from '@/contexts/imageContext'
import { useRouter } from 'expo-router'
import HeaderPic from '@/components/header'

export default function CameraScreen () {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const ref = useRef<CameraView>(null)
  const [uri, setUri] = useState<string | null>(null)
  const { addPhoto } = usePhotos()
  const router = useRouter()

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync({ shutterSound: false })
    if (photo?.uri) {
      setUri(photo.uri)
    }
  }

  const savePhoto = async () => {
    if (uri) {
      addPhoto(uri)
      setUri(null)
    }
  }

  if (!permission) {
    return <View/>
  }

  if (!permission.granted) {
    return (
      <View className={'h-screen flex items-center justify-center'}>
        <Text style={styles.message}>Vous devez autoriser l&#39;accès à votre appareil photos pour jouer avec vos
          propres
          images !</Text>
        <Button onPress={requestPermission}>{'Permission requise'}</Button>
      </View>
    )
  }

  function toggleCameraFacing () {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  return (
    <View style={styles.container}>
      <HeaderPic label={'Appareil photo'} isGame={false}/>

      {uri === null && (
        <View style={styles.container}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={ref}
            mode={'picture'}
          />
          <View
            className="absolute bottom-10 left-0 right-0 flex-row justify-between items-center px-8 bg-black/30 py-4 rounded-full mx-6">
            <View className="w-14 h-14 items-center justify-center rounded-full bg-white/10">
              <IconButton
                icon="image-multiple"
                iconColor="white"
                size={28}
                onPress={() => router.push('/view/gallery')}
              />
            </View>

            <View
              className="w-20 h-20 items-center justify-center rounded-full border-4 border-white bg-white/20 scale-105 active:scale-95 transition-all">
              <IconButton
                icon="circle"
                iconColor="white"
                size={50}
                onPress={takePicture}
              />
            </View>

            <View className="w-14 h-14 items-center justify-center rounded-full bg-white/10">
              <IconButton
                icon="camera-flip"
                iconColor="white"
                size={28}
                onPress={toggleCameraFacing}
              />
            </View>
          </View>
        </View>
      )}
      {uri !== null && (
        <View style={styles.container}>
          <Image
            source={{ uri }}
            className={'w-full h-full'}
          />
          <View
            className="absolute bottom-10 left-0 right-0 flex-row justify-around items-center px-6 bg-black/40 py-4 rounded-full mx-10">
            <View
              className="w-14 h-14 items-center justify-center rounded-full bg-red-500/20 active:bg-red-500/40 transition-colors">
              <IconButton
                icon="delete"
                iconColor="#ef4444"
                size={28}
                onPress={() => setUri(null)}
              />
            </View>

            <View
              className="w-20 h-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 active:scale-95 transition-all">
              <IconButton
                icon="content-save-check"
                iconColor="white"
                size={40}
                onPress={savePhoto}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999
  },
  secondaryButtonWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainButtonWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  }
})