export interface IGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  tasksTodo: number;
  tasksDone: number;
}


const kinds = {}

export const Goal = {}

export default Goal