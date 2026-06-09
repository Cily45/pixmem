import { ScrollView, Text, Vibration, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import MemoCard from '@/interfaces/memoCard'
import { usePhotos } from '@/contexts/imageContext'
import MemoryCard from '@/components/MemoryCard'
import { Button } from 'react-native-paper'
import HeaderPic from '@/components/header'
import { useSettings } from '@/contexts/settingContext'
import { useAudioPlayer } from 'expo-audio'
import { Accelerometer } from 'expo-sensors'

export default function GameScreen () {
  const { size, isEmoji } = useLocalSearchParams()
  const { settings } = useSettings()
  const [cards, setCards] = useState<MemoCard[]>([])
  const { photos } = usePhotos()
  const sizeNumber = parseInt(typeof size === 'string' ? size : size.toString())
  const router = useRouter()
  const page = useAudioPlayer(require('../../assets/sound/page-flip.mp3'))
  const winSound = useAudioPlayer(require('../../assets/sound/win.mp3'))
  const noMatchSound = useAudioPlayer(require('../../assets/sound/no-match.mp3'))
  const [isWin, setIsWin] = useState(false)
  const emojis = ['😅', '😭', '💜', '🐳', '🥶', '🤣', '😜', '🫠', '😬', '🫣', '💀', '🤯', '😱', '🥺', '🔮', '👾', '🫧', '🌊', '🐙', '🥵', '🧊', '❄️', '🤪', '😎', '🤡', '🚀', '🐛', '✨']
  const lastX = useRef<number>(0)
  const lastY = useRef<number>(0)
  const lastZ = useRef<number>(0)
  const lastUpdate = useRef<number>(0)

  const handleCardPress = (id: number) => {
    const clickedCard = cards.find(c => c.id === id)
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return

    const currentFlipped = cards.filter(c => c.isFlipped && !c.isMatched)

    if (currentFlipped.length >= 2) return

    page.volume = settings.sound / 10
    page.seekTo(0)
    page.play()

    setCards(prev => {
      let updatedCards = prev.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card)

      const nextFlipped = updatedCards.filter(c => c.isFlipped && !c.isMatched)

      if (nextFlipped.length === 2) {
        const [first, second] = nextFlipped
        if (first.img === second.img) {
          if (settings.isVibration) Vibration.vibrate(200)
          updatedCards = updatedCards.map(card =>
            card.id === first.id || card.id === second.id
              ? { ...card, isMatched: true }
              : card
          )
          if (updatedCards.every(card => card.isMatched)) {
            win()
          }
          return updatedCards
        } else {
          setTimeout(() => {

            setCards(currentCards =>
              currentCards.map(card =>
                card.id === first.id || card.id === second.id
                  ? { ...card, isFlipped: false }
                  : card
              )
            )
            noMatchSound.volume = settings.sound / 10
            noMatchSound.seekTo(0)
            noMatchSound.play()
          }, 1000)
        }

      }

      return updatedCards
    })
  }

  function win () {
    setIsWin(true)
    if (settings.isVibration) Vibration.vibrate([0, 100, 100, 400])
    winSound.volume = settings.sound / 10
    winSound.play()
  }

  function initCards () {
    let cardsInit: MemoCard[] = []
    let id = 0

    const gridSize = sizeNumber * sizeNumber / 2

    const items = (isEmoji === '0' ? emojis : photos).sort(() => Math.random() - 0.5)
    items.slice(-gridSize).forEach((photo: string) => {
      cardsInit.push({
        id: id, isFlipped: false, isMatched: false, onPress (id: number): void {
        }, img: photo
      })
      id++
      cardsInit.push({
        id: id, isFlipped: false, isMatched: false, onPress (id: number): void {
        }, img: photo
      })
      id++
    })

    setCards(cardsInit.sort(() => Math.random() - 0.5))
  }

  useEffect(() => {
    Accelerometer.setUpdateInterval(100)

    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData
      const currentTime = Date.now()
      const diffTime = currentTime - lastUpdate.current

      if (lastUpdate.current !== 0 && diffTime >= 100) {
        const deltaX = x - lastX.current
        const deltaY = y - lastY.current
        const deltaZ = z - lastZ.current
        const force = (Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ) / diffTime) * 10000

        if (force > 250) {
          initCards()
        }
      }

      lastUpdate.current = currentTime
      lastX.current = x
      lastY.current = y
      lastZ.current = z
    })
    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    initCards()
    return () => {
      setCards([])
      Vibration.cancel()
      setIsWin(false)
    }
  }, [])

  return (<ScrollView>
    <HeaderPic label={'Jeux'} isGame={true}/>
    {isWin && (
      <View
        className={'absolute z-30 flex justify-center h-screen w-full items-center bg-white/30 backdrop-blur-3xl transition-opacity duration-1000 ease-in-out'}>
        <View
          className={'absolute z-30 p-10 flex justify-center gap-8 items-center rounded-2xl bg-violet-600/90 backdrop-blur-3xl'}>
          <Text className={'text-4xl text-white font-extrabold'}>Gagné 🏆</Text>
          <Button icon={'restart'}
                  mode="contained-tonal"
                  buttonColor="#f3e8ff"
                  textColor="#6b21a8"
                  contentStyle={{ height: 56 }}
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  className="rounded-2xl"
                  onPress={initCards}>Rejouer?</Button>

          <Button icon={'arrow-left-bold'}
                  mode="contained-tonal"
                  buttonColor="#f3e8ff"
                  textColor="#6b21a8"
                  contentStyle={{ height: 56 }}
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  className="rounded-2xl"
                  onPress={() => router.push({
                    pathname: '/view/home',
                    params: { size: size }
                  })}>Retour à l&#39;accueil</Button>
        </View>
      </View>
    )}
    <View className={`flex-row flex-wrap justify-center`}>
      {cards.map((card: MemoCard) => (
        <MemoryCard key={card.id} isWin={isWin} memoCard={card} size={sizeNumber}
                    onPress={handleCardPress} isEmoji={isEmoji === '0'}></MemoryCard>
      ))}
    </View>
  </ScrollView>)
}