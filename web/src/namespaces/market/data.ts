import { type Item } from './types'

export const items: Item[] = [
  {
    id: '1',
    name: 'Streak Freeze',
    description: 'Protects your streak if you miss a day',
    price: 100,
    image: '/icons/streak_freeze.png',
    effect: 'Maintains your streak for one missed day'
  },
  {
    id: '2',
    name: 'Double XP Bonus',
    description: 'Double experience points for 30 minutes',
    price: 75,
    image: '/icons/double_xp.png',
    effect: 'Earn 2x XP on all challenges',
    duration: '30 minutes'
  },
  {
    id: '3',
    name: 'Double Momentum Bonus',
    description: 'Double momentum points for 30 minutes',
    price: 75,
    image: '/icons/double_momentum.png',
    effect: 'Earn 2x momentum on all challenges',
    duration: '30 minutes'
  }
]
