import Emoji from '@web/components/misc/Emoji'
import StatusCard from '@web/components/ui/status-card'

function NoHabitsCard() {
  return (
    <StatusCard icon={<Emoji emoji="🌱" size={24} />} title="No habits" color="default">
      Time for new habits!
    </StatusCard>
  )
}

export default NoHabitsCard
