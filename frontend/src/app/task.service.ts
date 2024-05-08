import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskModel} from "../models/task.model";
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {
  }

  getTasks(): Observable<TaskModel[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(tasks => tasks.map(task => new TaskModel(
        task.id,
        task.taskName,
        task.description,
        new Date(task.dueDate),
        new Date(task.createdOn),
        task.isCompleted,
        task.completedOn ? new Date(task.completedOn) : undefined

      ))),
    );

  }

  createTask(taskData: any): Observable<any> {
    // let params = new HttpParams().set('taskName', taskData.taskName);
    // params.append('description', taskData.description);
    // params.append('dueDate', taskData.dueDate);
    return this.http.post(this.apiUrl, taskData);
  }
}
