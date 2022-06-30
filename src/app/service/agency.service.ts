import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {Agency} from "../model/agency";

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Fetch all agencies service (http call)
   * @return Agency[]: list of all agencies or HttpErrorResponse
   */
  public getAgencies(): Observable<Agency[]> {
    return this.http.get<Agency[]>(`${this.host}/agency/all`);
  }

  /**
   * Fetch an agency searched by id
   * @param agencyId string: agency's id to fetch
   */
  public getAgencyById(agencyId: string): Observable<Agency> {
    return this.http.get<Agency>(`${this.host}/agency/find/${agencyId}`);
  }

  public addAgency(formData: FormData): Observable<Agency> {
    return this.http.post<Agency>(`${this.host}/agency/add`, formData);
  }

  public updateAgency(formData: FormData): Observable<Agency> {
    return this.http.post<Agency>(`${this.host}/agency/update`, formData);
  }

  deleteAgency(agencyId: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/agency/delete/${agencyId}`);
  }

  public createAgencyFormData(currentLabel: string, userName: string, agency: Agency): FormData {
    const formData = new FormData();
    formData.append('currentLabel', currentLabel);
    formData.append('label', agency.label);
    formData.append('userName', userName);
    formData.append('address', agency.address);
    formData.append('addressComplement', agency.addressComplement);
    formData.append('zipCode', agency.zipCode);
    formData.append('city', agency.city);
    return formData;
  }

}
