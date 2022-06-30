import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Signature} from "../model/signature";
import {CustomHttpResponse} from "../model/custom-http-response";
import {User} from "../model/user";
import {SignatureVersion} from "../model/signatureVersion";

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

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
  /**
   * Fetch a signature searched by id
   * @param signatureId string: signature's id to fetch
   */
  public getSignatureVersionByParentSignatureId(signatureId: string): Observable<SignatureVersion[]> {
    return this.http.get<SignatureVersion[]>(`${this.host}/signature-version/find/signature/${signatureId}`);
  }

  public getSignatureVersionById(versionId: string): Observable<SignatureVersion> {
    return this.http.get<SignatureVersion>(`${this.host}/signature-version/find/${versionId}`);
  }

  public addSignature(formData: FormData): Observable<Signature> {
    console.log('FormData in AddSign service')
    console.log(Array.from(formData))
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
    formData.append('applyToAgencies', JSON.stringify(signature.applyToAgencies));
    if (signature.active) {
      formData.append('status', 'active');
    } else {
      formData.append('status', 'inactive');
    }
    formData.append('agencyLabel', 'Nantes');
    return formData;
  }

  public createSignatureVersionFormData(userName: string, signatureVersion: SignatureVersion): FormData {
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('isActive', JSON.stringify(signatureVersion.active));
    formData.append('htmlSignature', signatureVersion.htmlSignature);
    if (signatureVersion.isValidatedByManager) {
      formData.append('isValidatedByManager', 'true');
    } else {
      formData.append('status', 'false');
    }
    formData.append('agencyLabel', 'Nantes');
    return formData;
  }
}
