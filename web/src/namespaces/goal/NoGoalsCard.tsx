import Emoji from "@web/components/misc/Emoji"
import StatusCard from "@web/components/ui/status-card"
import { Button } from "@web/components/ui/button"

function NoGoalsCard() {
  return (
    <StatusCard icon={<Emoji emoji="🎯" size={24} />} title="No goals" color="default">
      <div className="flex items-center justify-between gap-2">
        <span>Set up some targets!</span>
        <Button size="sm" onClick={() => (window.location.href = "/goals/new")}>Create Goal</Button>
      </div>
    </StatusCard>
  )
}

export default NoGoalsCard
