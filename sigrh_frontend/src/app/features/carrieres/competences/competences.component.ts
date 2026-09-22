import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrieresService, Competence } from '../services/carrieres.service';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss'],
  standalone: false
})
export class CompetencesComponent implements OnInit {
  competences$!: Observable<Competence[]>;
  filteredCompetences$!: Observable<Competence[]>;
  
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  
  showAddForm = false;
  saving = false;
  
  newComp = {
    libelle: '',
    categorie: 'Technique' as Competence['categorie'],
    description: '',
    niveauxRaw: 'Débutant, Intermédiaire, Confirmé, Expert'
  };

  readonly categories: Competence['categorie'][] = ['Technique', 'Soft Skills', 'Management', 'Organisationnelle'];

  constructor(
    private carrieresService: CarrieresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.competences$ = this.carrieresService.competences$;

    this.filteredCompetences$ = combineLatest([
      this.competences$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([comps, search, cat]) => {
        const query = (search || '').toLowerCase().trim();
        return comps.filter(c => {
          const matchQuery = !query || 
            c.libelle.toLowerCase().includes(query) || 
            c.description.toLowerCase().includes(query);
          const matchCat = !cat || c.categorie === cat;
          return matchQuery && matchCat;
        });
      })
    );
  }

  addComp(): void {
    if (!this.newComp.libelle.trim()) return;
    this.saving = true;
    
    const levels = this.newComp.niveauxRaw
      .split(',')
      .map(lvl => lvl.trim())
      .filter(lvl => !!lvl);

    this.carrieresService.addCompetence({
      libelle: this.newComp.libelle.trim(),
      categorie: this.newComp.categorie,
      description: this.newComp.description.trim(),
      niveaux: levels
    }).subscribe(() => {
      this.saving = false;
      this.newComp = {
        libelle: '',
        categorie: 'Technique',
        description: '',
        niveauxRaw: 'Débutant, Intermédiaire, Confirmé, Expert'
      };
      this.showAddForm = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/carrieres']);
  }
}
