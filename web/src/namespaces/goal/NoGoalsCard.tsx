import Emoji from "@web/components/misc/Emoji"
import StatusCard from "@web/components/ui/status-card"

function NoGoalsCard() {
  return (
    <StatusCard icon={<Emoji emoji="🎯" size={24} />} title="No goals" color="default">
      Set up some targets!
    </StatusCard>
  )
}

export default NoGoalsCard
