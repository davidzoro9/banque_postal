import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrieresService, FormationCatalogue, FormationSession } from '../services/carrieres.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss'],
  standalone: false
})
export class FormationsComponent implements OnInit {
  catalogue$!: Observable<FormationCatalogue[]>;
  sessions$!: Observable<FormationSession[]>;

  activeTab = 'plan'; // 'plan' | 'catalogue'

  showScheduleForm = false;
  showAddCourseForm = false;
  saving = false;

  // Session form model
  newSession = {
    courseId: '',
    date: null as Date | null,
    participants: 10
  };

  // Course form model
  newCourse = {
    titre: '',
    description: '',
    duree: 14 // default hours
  };

  constructor(
    private carrieresService: CarrieresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.catalogue$ = this.carrieresService.catalogue$;
    this.sessions$ = this.carrieresService.sessions$;

    if (this.router.url.includes('/formations/catalogue')) {
      this.activeTab = 'catalogue';
    } else {
      this.activeTab = 'plan';
    }
  }

  scheduleSession(courses: FormationCatalogue[]): void {
    const selectedCourse = courses.find(c => c.id === this.newSession.courseId);
    if (!selectedCourse || !this.newSession.date) return;

    this.saving = true;

    // Convert Date to YYYY-MM-DD
    const dt = this.newSession.date;
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    this.carrieresService.scheduleSession({
      titre: selectedCourse.titre,
      date: formattedDate,
      participants: this.newSession.participants,
      statut: 'Planifiée',
      description: selectedCourse.description,
      duree: selectedCourse.duree
    }).subscribe(() => {
      this.saving = false;
      this.newSession = { courseId: '', date: null, participants: 10 };
      this.showScheduleForm = false;
    });
  }

  addCourse(): void {
    if (!this.newCourse.titre.trim() || !this.newCourse.description.trim()) return;
    
    this.saving = true;
    this.carrieresService.addCourse({
      titre: this.newCourse.titre.trim(),
      description: this.newCourse.description.trim(),
      duree: this.newCourse.duree
    }).subscribe(() => {
      this.saving = false;
      this.newCourse = { titre: '', description: '', duree: 14 };
      this.showAddCourseForm = false;
    });
  }

  changeStatus(id: string, status: FormationSession['statut']): void {
    this.carrieresService.updateSessionStatus(id, status).subscribe();
  }

  goBack(): void {
    this.router.navigate(['/carrieres']);
  }
}
