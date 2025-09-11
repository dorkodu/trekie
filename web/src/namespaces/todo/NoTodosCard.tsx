import Emoji from '@web/components/misc/Emoji'
import StatusCard from '@web/components/ui/status-card'

function NoTodosCard() {
  return (
    <StatusCard icon={<Emoji emoji="📝" size={24} />} title="No todos" color="default">
      Ready to get things done!
    </StatusCard>
  )
}

export default NoTodosCard
