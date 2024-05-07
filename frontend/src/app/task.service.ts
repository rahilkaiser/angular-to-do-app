import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:3000/api/tasks';
  constructor(private http:HttpClient) {
  }

  createTask(taskData: any): Observable<any> {
    // let params = new HttpParams().set('taskName', taskData.taskName);
    // params.append('description', taskData.description);
    // params.append('dueDate', taskData.dueDate);
    return this.http.post(this.apiUrl, taskData);
  }
}
