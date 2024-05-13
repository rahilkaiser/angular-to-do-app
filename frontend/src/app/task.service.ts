import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskModel, TaskResponse } from "../models/task.model";
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {
  }

  getTasks(isComplete?: boolean, page?: number, pageSize?: number): Observable<{data: TaskModel[], total: number}> {
    let params = new HttpParams();
    if (isComplete !== undefined) {
      params = params.set('isComplete', String(isComplete));
    }
    if (page !== undefined) params = params.append('page', String(page));
    if (pageSize !== undefined) params = params.append('pageSize', String(pageSize));


    return this.http.get<TaskResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        data: response.data.map(task => new TaskModel(
          task.id,
          task.taskName,
          task.description,
          new Date(task.dueDate),
          new Date(task.createdOn),
          task.isComplete,
          task.completedOn ? new Date(task.completedOn) : undefined
        )),
        total: response.total
      }))
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
