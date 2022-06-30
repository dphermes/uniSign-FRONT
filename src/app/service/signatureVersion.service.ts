import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Signature} from "../model/signature";
import {CustomHttpResponse} from "../model/custom-http-response";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class SignatureVersionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Fetch all signatures service (http call)
   * @return Signature[]: list of all signatures or HttpErrorResponse
   */
  public getSignatures(): Observable<Signature[]> {
    return this.http.get<Signature[]>(`${this.host}/signature/all`);
  }

  /**
   * Fetch a signature searched by id
   * @param signatureId string: signature's id to fetch
   */
  public getSignatureById(signatureId: string): Observable<Signature> {
    return this.http.get<Signature>(`${this.host}/signature/find/${signatureId}`);
  }

  public addSignature(formData: FormData): Observable<Signature> {
    return this.http.post<Signature>(`${this.host}/signature/add`, formData);
  }

  public updateSignature(formData: FormData): Observable<Signature> {
    return this.http.post<Signature>(`${this.host}/signature/update`, formData);
  }

  deleteSignature(signatureId: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/signature/delete/${signatureId}`);
  }

  public createSignatureFormData(currentLabel: string, userName: string, signature: Signature): FormData {
    const formData = new FormData();
    formData.append('currentLabel', currentLabel);
    formData.append('userName', userName);
    formData.append('label', signature.label);
    formData.append('isActive', JSON.stringify(signature.active));
    formData.append('htmlSignature', signature.htmlSignature);
    if (signature.active) {
      formData.append('status', 'active');
    } else {
      formData.append('status', 'inactive');
    }
    formData.append('agencyLabel', 'Nantes');
    return formData;
  }
}
