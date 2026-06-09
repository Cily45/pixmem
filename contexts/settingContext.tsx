import React, { createContext, useState, useContext, useRef, useEffect } from 'react'
import { useAudioPlayer } from 'expo-audio'

const SettingsContext = createContext<any>(null)

interface Settings {
  isVibration: boolean
  sound: number
  music: number
}

export function SettingsProvider ({ children }: any) {
  const [settings, setSettings] = useState<Settings>({ isVibration: true, sound: 5, music: 5 } as Settings)
  const backgroundPlayer = useAudioPlayer(require('../assets/sound/background.mp3'))

  useEffect(() => {
    if (backgroundPlayer) {
      backgroundPlayer.volume = settings.music / 10
      backgroundPlayer.loop = true

      if (!backgroundPlayer.playing) {
        backgroundPlayer.play()
      }
    }
  }, [settings.music, backgroundPlayer])

  const setVibration = (vibration: boolean) => {
    setSettings((prev) => ({
      ...prev,
      isVibration: vibration
    }))
  }

  const setMusic = (volume: number) => {
    setSettings((prev) => ({
      ...prev,
      music: volume
    }))
  }

  const setSound = (volume: number) => {
    setSettings((prev) => ({
      ...prev,
      sound: volume
    }))
  }

  return (
    <SettingsContext.Provider value={{ settings, setVibration, setMusic, setSound }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)