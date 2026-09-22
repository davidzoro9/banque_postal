import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ActionPermission {
  id?: number | string;
  moduleName: string;
  actionName: string;
  actionCode: string;
  rolesAccess: Record<string, boolean>;
  ordre?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HabilitationService {
  private readonly apiUrl = `${environment.apiUrl}/habilitations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ActionPermission[]> {
    return this.http.get<ActionPermission[]>(this.apiUrl);
  }

  saveMatrix(matrix: ActionPermission[]): Observable<ActionPermission[]> {
    return this.http.post<ActionPermission[]>(`${this.apiUrl}/save-matrix`, matrix);
  }

  create(item: Partial<ActionPermission>): Observable<ActionPermission> {
    return this.http.post<ActionPermission>(`${this.apiUrl}/create`, item);
  }

  update(id: number | string, item: Partial<ActionPermission>): Observable<ActionPermission> {
    return this.http.put<ActionPermission>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
