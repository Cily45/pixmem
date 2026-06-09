export default interface MemoCard {
  id: number;
  img: string;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: (id: number) => void;
}