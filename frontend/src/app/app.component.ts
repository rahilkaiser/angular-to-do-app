import {Component, model, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgbInputDatepicker, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from "./task.service";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {TaskModel} from "../models/task.model";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbInputDatepicker, FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule, NgbPagination],
  providers: [TaskService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  status: boolean = false;
  isEditMode: boolean = false;
  editTask: TaskModel | undefined = undefined;

  taskForm = this.fb.group({
    taskName: [''],
    description: [''],
    dueDateObj: [new Date()],
  });

  tasks: TaskModel[] = [];

  currentPage = 1;
  pageSize = 2;
  total = 0;


  constructor(private taskService: TaskService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.loadTasks();
  }

  /** Sets the Status of a Task to Completed or Uncompleted
   *
   * @param isCompleted
   */
  setStatus(isCompleted: boolean) {
    this.status = isCompleted;
    this.loadTasks();
  }

  /** Submits the Form and Creates a new Task
   *
   */
  submitTask() {
    this.taskService.createTask(this.taskForm.value).subscribe(
      response => {
        console.log("Task has been added", response);
        this.taskForm.reset();
        this.loadTasks();
      },
      error => console.error('Error adding task!', error)
    )
  }

  /** Deletes A Task
   *
   * @param id
   */
  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        this.loadTasks();
        this.isEditMode = false;
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }


  /** Fills the Form with the Info of the Task to be edited
   *
   * @param id
   */
  editTaskMode(id: number) {
    this.isEditMode = true;
    this.editTask = this.tasks.find((task) => task.id === id);

    if (this.editTask) {
      this.taskForm.controls.taskName.setValue(this.editTask.taskName);
      this.taskForm.controls.description.setValue(this.editTask.description);

      if (this.editTask.dueDateObj) {
        this.taskForm.controls['dueDateObj'].setValue(this.toDateObject(new Date(this.editTask.dueDateObj)));
      }
    }
  }

  /** Formats the Date such that its readable for the Datepicker
   *
   * @param date
   * @private
   */
  private toDateObject(date: Date): any {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  /** Submits the Form for the edited Task
   *
   */
  submitEditTask() {
    if (this.editTask) {
      this.editTask.taskName = this.taskForm.value.taskName as string;
      this.editTask.description = this.taskForm.value.description as string;
      this.editTask.dueDateObj = this.taskForm.value.dueDateObj as Date;
    }

    if (this.editTask) {
      this.taskService.updateTask(this.editTask).subscribe(
        response => {
          console.log("Task has been edited", response);
          this.taskForm.reset();
          this.loadTasks();
          this.editTask = undefined;
          this.isEditMode = false;

        },
        error => console.error('Error adding task!', error)
      )
    }
  }

  protected readonly Date = Date;

  /** toggle the Completion Status of a task
   *
   * @param task
   */
  toggleCompletion(task: any) {
    task.isComplete = !task.isComplete;
    this.taskService.updateTaskCompletion(task.id, task.isComplete).subscribe({
      next: (response) => {
        console.log('Task completion status updated:', response);
      },
      error: (err) => {
        console.error('Failed to update task', err);
        task.isComplete = !task.isComplete;
      }
    });
  }

  /** Loads all Tasks
   *
   */
  loadTasks() {
    this.taskService.getTasks(this.status, this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.tasks = result.data;
        this.total = result.total;
      },
      error: (error) => console.error('Error fetching tasks', error)
    });
  }
}
