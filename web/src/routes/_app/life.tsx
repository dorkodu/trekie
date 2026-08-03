import { IconBrain, IconCalendar, IconCheckbox, IconChevronRight, IconHeart, IconPlus, IconTarget, IconTrendingUp, IconUsers } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@web/components/ui/alert'
import { Button } from '@web/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@web/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@web/components/ui/tabs'
import { db } from '@web/lib/db'
import { trekie } from '@web/lib/trekie'
import GoalCard from '@web/namespaces/goal/GoalCard'
import NoGoalsCard from '@web/namespaces/goal/NoGoalsCard'
import HabitCounter from '@web/namespaces/habit/HabitCounter'
import NoHabitsCard from '@web/namespaces/habit/NoHabitsCard'
import MomentumPanel from '@web/namespaces/momentum/components/momentum-panel'
import { useMomentum } from '@web/namespaces/momentum/useMomentum'

export const Route = createFileRoute('/_app/life')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = trekie.use($ => $.user?.id)

  const goalsQuery = useQuery({
    queryKey: ['goals', userId],
    queryFn: async () => userId ? db.goals.where('userId').equals(userId).toArray() : [],
    enabled: !!userId
  })

  const habitsQuery = useQuery({
    queryKey: ['habits', userId],
    queryFn: async () => userId ? db.habits.where({ userId }).filter(habit => !Object.hasOwn(habit, "isDeleted")).toArray() : [],
    enabled: !!userId
  })

  const { data: momentumData, isLoading: momentumLoading } = useMomentum({ windowDays: 10 })

  if (!userId) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Please log in to view your life dashboard.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Life Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Your gamified journey to personal growth</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-500">
              {momentumLoading ? '...' : (momentumData?.score ? Math.round(momentumData.score) : '--')}
            </div>
            <p className="text-sm text-muted-foreground">Momentum</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-500">
              {goalsQuery.isLoading ? '...' : (goalsQuery.data?.length || 0)}
            </div>
            <p className="text-sm text-muted-foreground">Active Goals</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">
              {habitsQuery.isLoading ? '...' : (habitsQuery.data?.length || 0)}
            </div>
            <p className="text-sm text-muted-foreground">Active Habits</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-500">
              {momentumData?.trend ? `${momentumData.trend > 0 ? '+' : ''}${(momentumData.trend * 100).toFixed(1)}%` : '--'}
            </div>
            <p className="text-sm text-muted-foreground">Trend</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="momentum" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="momentum">Momentum</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="momentum" className="space-y-6">
          <MomentumPanel />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Momentum Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTrendingUp className="h-5 w-5" />
                Momentum Overview
              </CardTitle>
              <CardDescription>Your current momentum status and key metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {momentumLoading ? (
                <div className="text-center py-4">Loading momentum data...</div>
              ) : momentumData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(momentumData.score || 0)}</div>
                    <p className="text-sm text-muted-foreground">Momentum Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{momentumData.bands?.current?.label || 'Unknown'}</div>
                    <p className="text-sm text-muted-foreground">Current Band</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {momentumData.trend ? `${momentumData.trend > 0 ? '+' : ''}${(momentumData.trend * 100).toFixed(1)}%` : '--'}
                    </div>
                    <p className="text-sm text-muted-foreground">7-Day Trend</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">No momentum data available</div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconTarget className="h-5 w-5 text-blue-500" />
                  Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {goalsQuery.data ? `${goalsQuery.data.length} active goals` : 'Set and track your life goals'}
                </p>
                <Button size="sm" className="w-full">
                  <IconPlus className="h-4 w-4 mr-1" />
                  Add Goal
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconHeart className="h-5 w-5 text-red-500" />
                  Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Track fitness and wellness</p>
                <Button size="sm" className="w-full">
                  <IconPlus className="h-4 w-4 mr-1" />
                  Log Activity
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconBrain className="h-5 w-5 text-purple-500" />
                  Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Continue your learning journey</p>
                <Button size="sm" className="w-full">
                  <IconPlus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconCheckbox className="h-5 w-5 text-green-500" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Manage your daily todos</p>
                <Button size="sm" className="w-full">
                  <IconPlus className="h-4 w-4 mr-1" />
                  New Task
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconCalendar className="h-5 w-5 text-orange-500" />
                  Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Track and optimize your time</p>
                <Button size="sm" className="w-full">
                  <IconPlus className="h-4 w-4 mr-1" />
                  Start Timer
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IconUsers className="h-5 w-5 text-indigo-500" />
                  Social
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Connect with your community</p>
                <Button size="sm" className="w-full">
                  <IconChevronRight className="h-4 w-4 mr-1" />
                  View Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {goalsQuery.isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">Loading goals...</div>
              </CardContent>
            </Card>
          ) : goalsQuery.data && goalsQuery.data.length > 0 ? (
            <div className="space-y-4">
              {goalsQuery.data.map(goal => (
                <GoalCard key={goal.id} id={goal.id} />
              ))}
            </div>
          ) : (
            <NoGoalsCard />
          )}
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          {habitsQuery.isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">Loading habits...</div>
              </CardContent>
            </Card>
          ) : habitsQuery.data && habitsQuery.data.length > 0 ? (
            <div className="space-y-4">
              {habitsQuery.data.map(habit => (
                <HabitCounter key={habit.id} habitId={habit.id} />
              ))}
            </div>
          ) : (
            <NoHabitsCard />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
