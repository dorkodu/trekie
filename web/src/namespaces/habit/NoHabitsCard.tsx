import Emoji from '../../shared/components/misc/Emoji'
import StatusCard from '../../shared/components/cards/StatusCard'

function NoHabitsCard() {
  return (
    <StatusCard icon={<Emoji emoji="🌱" size={24} />} title="No habits">
      Time for new habits!
    </StatusCard>
  )
}

export default NoHabitsCard
