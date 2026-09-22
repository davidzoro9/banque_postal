import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: Date;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([
    {
      id: '1',
      title: '5 demandes de congés en attente',
      message: 'Vous avez 5 demandes de congés à valider',
      type: 'warning',
      read: false,
      date: new Date(),
      icon: 'event_available'
    },
    {
      id: '2',
      title: 'Bulletins du mois générés',
      message: '127 bulletins de juin générés avec succès',
      type: 'success',
      read: false,
      date: new Date(),
      icon: 'receipt_long'
    },
    {
      id: '3',
      title: 'Contrats arrivant à échéance',
      message: "3 contrats expirent dans 30 jours",
      type: 'warning',
      read: true,
      date: new Date(),
      icon: 'article'
    },
    {
      id: '4',
      title: 'Nouvelle candidature reçue',
      message: 'Poste : Développeur Full Stack',
      type: 'info',
      read: true,
      date: new Date(),
      icon: 'person_add'
    }
  ]);

  notifications$ = this.notificationsSubject.asObservable();

  get unreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  markAllAsRead(): void {
    const updated = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
  }

  markAsRead(id: string): void {
    const updated = this.notificationsSubject.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updated);
  }
}
