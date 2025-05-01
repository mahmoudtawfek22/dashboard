import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDash(duration: number = 0) {
    let params = new HttpParams().append('duration', duration);

    return this.http.get(
      'http://196.219.184.42/Abdullatif_Backend/api/Machines/GetFillers',
      { params }
    );
  }
}
