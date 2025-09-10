import { Link } from "@tanstack/react-router"
import Emoji from "@web/components/misc/Emoji"
import { Button } from "@web/components/ui/button"
import StatusCard from "@web/components/ui/status-card"

function NoGoalsCard() {
  return (
    <StatusCard icon={<Emoji emoji="🎯" size={24} />} title="No goals" color="default">
      <div className="flex items-center justify-between gap-2">
        <span>Set up some targets!</span>

        <Button asChild size="sm">
          <Link to="/goals/new">Create Goal</Link>
        </Button>
      </div>
    </StatusCard>
  )
}

export default NoGoalsCard
