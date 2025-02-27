import StatusCard from "@web/shared/components/cards/StatusCard"
import Emoji from "@web/shared/components/misc/Emoji"

function NoGoalsCard() {
  return (
    <StatusCard icon={<Emoji emoji="🎯" size={24} />} title="No goals">
      Set up some targets!
    </StatusCard>
  )
}

export default NoGoalsCard
