import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskModel} from "../models/task.model";
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {
  }

  getTasks(): Observable<TaskModel[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(tasks => tasks.map((task) =>
        new TaskModel(
          task.id,
          task.taskName,
          task.description,
          new Date(task.dueDate),
          new Date(task.createdOn),
          task.isComplete,
          task.completedOn ? new Date(task.completedOn) : undefined
        )
      )),
    );

  }

  createTask(taskData: any): Observable<any> {
    console.log("kfldslfnlk", taskData);
    return this.http.post(this.apiUrl, taskData);
  }

  deleteTask(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  updateTask(task: TaskModel): Observable<any> {
    const url = `${this.apiUrl}/${task.id}`;
    console.log("LKMLKLLM", task);
    return this.http.put<TaskModel>(url, task);
  }


  updateTaskCompletion(taskId: number, isComplete: boolean): Observable<any> {
    const url = `${this.apiUrl}/${taskId}/toggle-complete`;
    return this.http.put(url, {isComplete});
  }
}
