import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getSignatures(): Observable<any> {
    return this.http.get<any[]>(`${this.host}/signature/all`);
  }
}
