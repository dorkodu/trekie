export * from './hooks'
export * from './consts'

export * from './account'

export * as Goal from './commons/goal'
export * as Habit from './commons/habit'
export * as Social from './commons/social'
export * as Life from './commons/life'

export * from './Trekie'

export function log(status: Supercell.IStatus<unknown>) {
  console.log(`[trekie] <${status.kind}> @ "${(new Date(status.timestamp)).toISOString()}"`)
}