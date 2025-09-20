import { IconBrain, IconCalendar, IconCheck, IconCheckbox, IconChevronRight, IconHeart, IconPlus, IconTarget, IconTrendingUp, IconUsers } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { Alert, AlertDescription } from '@web/components/ui/alert'
import { Badge } from '@web/components/ui/badge'
import { Button } from '@web/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@web/components/ui/card'
import { Progress } from '@web/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@web/components/ui/tabs'

export const Route = createFileRoute('/_app/life')({
  component: RouteComponent,
})

function RouteComponent() {
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
            <div className="text-2xl font-bold text-orange-500">🔥 7</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-500">💠 1,250</div>
            <p className="text-sm text-muted-foreground">XP Points</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">✓ 12/15</div>
            <p className="text-sm text-muted-foreground">Tasks Done</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-500">🏆 3</div>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Daily Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTrendingUp className="h-5 w-5" />
                Today's Progress
              </CardTitle>
              <CardDescription>Track your daily achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Tasks</span>
                  <span>12/15 completed</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weekly Goals</span>
                  <span>3/5 completed</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
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
                <p className="text-sm text-muted-foreground mb-3">Set and track your life goals</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Active Goals</CardTitle>
              <CardDescription>Your current objectives and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Run a Marathon</span>
                  <Badge variant="secondary">75%</Badge>
                </div>
                <Progress value={75} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Learn Spanish</span>
                  <Badge variant="secondary">45%</Badge>
                </div>
                <Progress value={45} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Save $10,000</span>
                  <Badge variant="secondary">30%</Badge>
                </div>
                <Progress value={30} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Habit Streaks</CardTitle>
              <CardDescription>Build consistency with daily habits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🏃</div>
                  <div>
                    <p className="font-medium">Morning Run</p>
                    <p className="text-sm text-muted-foreground">7 day streak</p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-800">🔥 7</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📚</div>
                  <div>
                    <p className="font-medium">Read 30 minutes</p>
                    <p className="text-sm text-muted-foreground">12 day streak</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">🔥 12</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Alert>
            <IconTrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>AI Insight:</strong> You're most productive between 9-11 AM. Consider scheduling important tasks during this time.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tasks Completed</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Goals Progress</span>
                    <span className="font-medium">+15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Day</span>
                    <span className="font-medium">Tuesday</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Try the "2-minute rule" for starting new habits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Schedule your most important task for 9 AM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Consider joining a running group for motivation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
