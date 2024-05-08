import {Component, model, OnChanges, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from "./task.service";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {TaskModel} from "../models/task.model";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbInputDatepicker, FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [TaskService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  status: boolean = false;

  taskForm = new FormGroup({
    taskName: new FormControl(''),
    description: new FormControl(''),
    dueDateObj: new FormControl(''),
  });

  tasks: TaskModel[] = [];

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.getAllTasks();
  }



  setStatus(isCompleted: boolean) {
    this.status = isCompleted;
    console.log('Status:', this.status);
  }

  submitTask() {
    console.log(this.taskForm.value);
    this.taskService.createTask(this.taskForm.value).subscribe(
      response => {
        console.log("Task has been added", response);
        this.taskForm.reset();
        this.getAllTasks();
      },
      error => console.error('Error adding task!', error)
    )
  }

  getAllTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (error) => console.error('Error fetching tasks', error)
    })
  }

  deleteTask(id:number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        this.getAllTasks();
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }
}
