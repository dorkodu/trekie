import StatusCard from "@/shared/components/cards/StatusCard"
import Emoji from "@/shared/components/misc/Emoji"

function NoGoalsCard() {
  return (
    <StatusCard icon={<Emoji emoji="🎯" size={24} />} title="No goals">
      Set up some targets!
    </StatusCard>
  )
}

export default NoGoalsCard
