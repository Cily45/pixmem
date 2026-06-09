import React, { useEffect } from 'react'
import { Dimensions, Image, Pressable, Text } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate
} from 'react-native-reanimated'
import MemoCard from '@/interfaces/memoCard'

interface MemoryCardProps {
  memoCard: MemoCard
  size: number
  isWin: boolean
  onPress: (id: number) => void
  isEmoji: boolean
}

export default function MemoryCard (props: MemoryCardProps) {
  const rotation = useSharedValue(0)
  const numColumns = props.size
  const screenWidth = Dimensions.get('window').width
  const tileSize = (screenWidth - numColumns * 8) / numColumns

  useEffect(() => {
    rotation.value = withTiming(props.memoCard.isFlipped || props.memoCard.isMatched ? 180 : 0, { duration: 300 })
  }, [props.memoCard.isFlipped, props.memoCard.isMatched, rotation, props.isWin])

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotation.value, [0, 180], [0, 180])
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      backfaceVisibility: 'hidden'
    }
  })

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotation.value, [0, 180], [180, 360])
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      backfaceVisibility: 'hidden'
    }
  })

  return (
    <Pressable
      onPress={() => !props.memoCard.isFlipped && !props.memoCard.isMatched && props.onPress(props.memoCard.id)}
      className="m-1 relative"
      style={{ width: tileSize, height: tileSize }}
    >
      <Animated.View
        style={[frontAnimatedStyle]}
        className={`absolute inset-0 rounded-2xl items-center justify-center border-2 border-white shadow-md
          ${props.memoCard.isMatched ? 'bg-emerald-100 border-emerald-400 opacity-60' : 'bg-white'}`}
      >
        {props.isEmoji && (
          <Text className={'text-5xl text-center w-full h-full align-middle '}>{props.memoCard.img}</Text>
        )}
        {!props.isEmoji && (
          <Image
            source={{ uri: props.memoCard.img }}
            className={'w-full h-full rounded-2xl'}
          />
        )}
      </Animated.View>

      <Animated.View
        style={[backAnimatedStyle]}
        className="absolute inset-0 bg-violet-600 rounded-2xl items-center justify-center border-2 border-violet-400 shadow-md"
      >
      </Animated.View>
    </Pressable>
  )
}