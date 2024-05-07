import {Component, model} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TaskService} from "./task.service";
import {HttpClientModule} from "@angular/common/http";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbInputDatepicker, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [TaskService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  status: boolean = false;

  taskForm = new FormGroup({
    taskName: new FormControl(''),
    description: new FormControl(''),
    dueDate: new FormControl(''),
  });


  constructor(private taskService: TaskService) {}

  setStatus(isCompleted: boolean) {
    this.status = isCompleted;
    console.log('Status:', this.status);
  }

  submitTask() {
    console.log(this.taskForm.value);
    this.taskService.createTask(this.taskForm.value).subscribe(
      response => {
        console.log("Task has been added" ,response);
        this.taskForm.reset();
      },
    error => console.error('Error adding task!', error)
    )


  }
}
