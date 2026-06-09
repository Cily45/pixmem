import { View, Text } from 'react-native'
import { usePhotos } from '@/contexts/imageContext'
import { IconButton } from 'react-native-paper'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import SettingsDialog from '@/components/SettingsDialog'

export default function HeaderPic (props: { label: string, isGame: boolean }) {
  const router = useRouter()
  const { photos } = usePhotos()
  const [isDialogVisible, setDialogVisible] = useState(false)
  return (<View
    className="px-4 mt-5 pt-4 pb-2 flex-row justify-between items-center border-b border-slate-100 dark:border-slate-900">
    <IconButton
      icon="arrow-left-bold"
      iconColor="#7c3aed"
      size={28}
      onPress={() => props.isGame ? router.push('/view/home') : router.back()}
    />
    <Text className="text-sm font-bold text-slate-400 uppercase">
      {props.label}
    </Text>
    {!props.isGame && (
      <View className="bg-purple-100 dark:bg-purple-950/50 px-3 py-1 rounded-full">
        <Text className="text-xs font-bold text-purple-700 dark:text-purple-400">
          {photos.length} Éléments
        </Text>
      </View>
    )}
    {props.isGame && (
      <IconButton
        icon="cog"
        iconColor="#7c3aed"
        size={28}
        onPress={() => setDialogVisible(true)}
      />
    )}
    <SettingsDialog isVisible={isDialogVisible} onClose={() => setDialogVisible(false)}></SettingsDialog>
  </View>)
}

