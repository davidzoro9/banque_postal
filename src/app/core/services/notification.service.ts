import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: Date | string;
  icon: string;
  route?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;
  private readonly storageKey = 'bpbf_read_notifications_v1';

  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$: Observable<AppNotification[]> = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refresh();
    // Rafraîchir périodiquement toutes les 60 secondes pour maintenir les alertes à jour
    setInterval(() => this.refresh(), 60000);
  }

  get unreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  refresh(): void {
    this.http.get<AppNotification[]>(this.apiUrl).subscribe({
      next: (items) => {
        const readIds = this.getReadIds();
        const enriched = (items || []).map(item => ({
          ...item,
          read: item.read || readIds.has(item.id)
        }));
        this.notificationsSubject.next(enriched);
      },
      error: (err) => {
        console.warn('[NotificationService] Impossible de récupérer les notifications backend:', err);
      }
    });
  }

  markAllAsRead(): void {
    const current = this.notificationsSubject.value;
    const readIds = this.getReadIds();
    current.forEach(n => readIds.add(n.id));
    this.saveReadIds(readIds);

    const updated = current.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
  }

  markAsRead(id: string): void {
    const readIds = this.getReadIds();
    readIds.add(id);
    this.saveReadIds(readIds);

    const updated = this.notificationsSubject.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updated);
  }

  private getReadIds(): Set<string> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? new Set(JSON.parse(raw)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  }

  private saveReadIds(ids: Set<string>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(ids)));
    } catch {}
  }
}
