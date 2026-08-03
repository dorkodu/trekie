import { useNavigate } from "@tanstack/react-router"
import Emoji from "@web/components/misc/Emoji"
import { Button } from "@web/components/ui/button"
import StatusCard from "@web/components/ui/status-card"

function NoGoalsCard() {
  const navigate = useNavigate()
  return (
    <StatusCard icon={<Emoji emoji="🎯" size={24} />} title="No goals" color="default">
      <div className="flex items-center justify-between gap-2">
        <span>Set up some targets!</span>

        <Button asChild size="sm" onClick={() => navigate({ to: "/goal/new" })}>
          Create Goal
        </Button>
      </div>
    </StatusCard>
  )
}

export default NoGoalsCard
