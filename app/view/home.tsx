import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { usePhotos } from '@/contexts/imageContext'
import SettingsDialog from '@/components/SettingsDialog'
import React, { useState } from 'react'

export default function HomeScreen () {
  const router = useRouter()
  const { photos } = usePhotos()
  const [isDialogVisible, setDialogVisible] = useState(false)

  function handlePressGame (size: number) {
    const missingPhotos = (size * size / 2) - photos.length

    if (missingPhotos < 1) {
      router.push({
        pathname: '/view/game',
        params: { size: size }
      })
    } else {
      alert(`Il manque ${missingPhotos} ${missingPhotos > 1 ? 'photos' : 'photo'}!`)
    }
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900 justify-around py-16 px-6">

      <View className="items-center mt-8">
        <Text
          className="text-6xl font-black text-purple-700 dark:text-purple-400 tracking-wider uppercase drop-shadow-md">
          PixelMem
        </Text>
        <Text className="text-slate-400 dark:text-slate-500 text-sm mt-2 font-medium tracking-widest uppercase">
          Capture & Play
        </Text>
      </View>

      <Text
        className={'p-4 rounded-xl z-30 text-2xl font-extrabold top-4 text-center bg-white dark:bg-slate-800   dark:text-white text-slate-800'}>{photos?.length} {'photos dispo'}</Text>

      <View className="w-full gap-4 px-4">
        <Button
          icon="camera"
          mode="contained"
          buttonColor="#7c3aed" // Violet-600
          textColor="#fff"
          contentStyle={{ height: 56 }}
          labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          className="rounded-2xl elevation-3"
          onPress={() => router.push('/view/camera')}
        >
          Prendre des photos
        </Button>
        <Button
          icon="image"
          mode="contained"
          buttonColor="#7c3aed" // Violet-600
          textColor="#fff"
          contentStyle={{ height: 56 }}
          labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          className="rounded-2xl elevation-3"
          onPress={() => router.push('/view/gallery')}
        >
          Voir les photos
        </Button>
        <Button
          icon="cog"
          mode="contained"
          buttonColor="#7c3aed" // Violet-600
          textColor="#fff"
          contentStyle={{ height: 56 }}
          labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          className="rounded-2xl elevation-3"
          onPress={() => setDialogVisible(true)}
        >
          Paramètres
        </Button>
      </View>

      <View
        className="bg-white dark:bg-slate-800 p-5 rounded-3xl mx-4 elevation-1 border border-slate-100 dark:border-slate-700">
        <Text
          className="text-center text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-4">
          Taille de la grille
        </Text>

        <View className="flex-row justify-between gap-2">
          {[2, 4, 8].map((item) => (
            <Button
              key={item}
              mode="contained-tonal"
              buttonColor="#f3e8ff"
              textColor="#6b21a8"
              onPress={() => handlePressGame(item)}>
              {item} x {item}
            </Button>
          ))}


        </View>
      </View>
      <SettingsDialog isVisible={isDialogVisible} onClose={() => setDialogVisible(false)}></SettingsDialog>
    </View>
  )
}