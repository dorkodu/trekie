import * as Trekie from '#/Trekie';
export * from "./Trekie"


const trekie = Trekie.Game()
const trekie = Trekie.Component()

trekie.store($ => $.coins)

trekie.habit.get("habit:12345")
trekie.goal.events['goal:create']
trekie.goal.cell.status("goal:create", { title: "hello" })