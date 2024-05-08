export class TaskModel {
  constructor(
    public id: number,
    public taskName: string,
    public description: string,
    public dueDate?: Date,
    public createdOn: Date = new Date(),
    public isComplete: boolean = false,
    public completedOn?: Date
  ) {}
}
