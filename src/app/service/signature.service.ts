import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Signature} from "../model/signature";

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getSignatures(): Observable<Signature[]> {
    return this.http.get<Signature[]>(`${this.host}/signature/all`);
  }
}
