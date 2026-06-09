import * as React from 'react'
import { Button, Dialog, Portal, Text, Switch } from 'react-native-paper'
import { useSettings } from '@/contexts/settingContext'
import Slider from '@react-native-community/slider'
import { View } from 'react-native'

interface SettingsDialogProps {
  isVisible: boolean
  onClose: () => void
}

export default function SettingsDialog ({ isVisible, onClose }: SettingsDialogProps) {
  const { settings, setVibration, setMusic, setSound } = useSettings()
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onClose}>
        <Dialog.Title>Paramètres</Dialog.Title>
        <Dialog.Content className={"px-10 flex gap-4 justify-between items-center"}>
            <Text variant="bodyMedium">Sons</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={settings.sound}
              onValueChange={(value) => setSound(value)}

              minimumTrackTintColor="#7c3aed"
              maximumTrackTintColor="#cbd5e1"
              thumbTintColor="#6d28d9"
            />
            <Text variant="bodyMedium">Musique</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={settings.music}
              onValueChange={(value) => setMusic(value)}

              minimumTrackTintColor="#7c3aed"
              maximumTrackTintColor="#cbd5e1"
              thumbTintColor="#6d28d9"
            />
          <View className={'flex flex-row items-center justify-center'}>
            <Text variant="bodyMedium">Vibration</Text>
            <Switch value={settings.isVibration} onValueChange={() => setVibration(!settings.isVibration)}/>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Fermer</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}