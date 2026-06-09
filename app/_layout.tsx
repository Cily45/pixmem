import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar, Platform } from 'react-native'
import 'react-native-reanimated'
import '../global.css'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { PhotoProvider } from '@/contexts/imageContext'
import { useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar'
import { SettingsProvider } from '@/contexts/settingContext'
import { PaperProvider } from 'react-native-paper'

export default function RootLayout () {
  const colorScheme = useColorScheme()

  useEffect(() => {
    const hideSystemBars = async () => {
      StatusBar.setHidden(true, 'none')

      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync('hidden')
      }
    }

    hideSystemBars()
  }, [])
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <PhotoProvider>
          <SettingsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="view/home" options={{ title: 'Accueil' }}/>
              <Stack.Screen name="view/game" options={{ title: 'Jeu' }}/>
              <Stack.Screen name="view/camera" options={{ title: 'Photo' }}/>
              <Stack.Screen name="view/gallery" options={{ title: 'Galerie' }}/>
            </Stack>
          </SettingsProvider>
        </PhotoProvider>
      </PaperProvider>
    </ThemeProvider>
  )
}
