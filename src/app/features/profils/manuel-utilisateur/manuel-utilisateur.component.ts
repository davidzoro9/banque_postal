import { Component, OnInit } from '@angular/core';
import { GUIDE_CHAPTERS, GuideChapter } from './guide-data';

@Component({
  selector: 'app-manuel-utilisateur',
  templateUrl: './manuel-utilisateur.component.html',
  styleUrls: ['./manuel-utilisateur.component.scss'],
  standalone: false
})
export class ManuelUtilisateurComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'TOUS';
  
  categories: string[] = [
    'TOUS',
    'Vue d\'ensemble',
    'Architecture',
    'Interface & Prise en main',
    'Portail Employé',
    'Ressources Humaines',
    'Gestion des Talents',
    'Développement RH',
    'Protection Sociale',
    'Politique Rémunération',
    'Moteur de Paie',
    'Administration Système'
  ];

  chapters: GuideChapter[] = GUIDE_CHAPTERS;
  filteredChapters: GuideChapter[] = [];

  ngOnInit(): void {
    this.filteredChapters = [...this.chapters];
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.chapters];

    if (this.selectedCategory && this.selectedCategory !== 'TOUS') {
      result = result.filter(c => c.category === this.selectedCategory);
    }

    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(c =>
        c.number.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.tips && c.tips.toLowerCase().includes(q)) ||
        c.workflow.some(w => w.toLowerCase().includes(q)) ||
        c.subsections.some(sub =>
          sub.title.toLowerCase().includes(q) ||
          sub.points.some(p => p.toLowerCase().includes(q))
        )
      );
    }

    this.filteredChapters = result;
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = 'TOUS';
    this.filteredChapters = [...this.chapters];
  }

  scrollToChapter(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  downloadManual(fileName: string = 'Guide_Utilisateur_SIGRH_BPBF.pdf'): void {
    const link = document.createElement('a');
    link.href = 'docs/Guide_Utilisateur_SIGRH_BPBF.pdf';
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printChapter(chapter: GuideChapter): void {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Veuillez autoriser les fenêtres pop-up pour imprimer cette fiche.');
      return;
    }

    let subHtml = '';
    chapter.subsections.forEach(sub => {
      subHtml += `
        <div style="margin-bottom: 18px;">
          <h3 style="font-size: 15px; color: #004d80; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">${sub.title}</h3>
          <ul style="line-height: 1.6; font-size: 13.5px; color: #1e293b; padding-left: 20px;">
            ${sub.points.map(p => `<li style="margin-bottom: 5px;">${p}</li>`).join('')}
          </ul>
        </div>
      `;
    });

    let wfHtml = '';
    if (chapter.workflow && chapter.workflow.length > 0) {
      wfHtml = `
        <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
          <strong style="color: #0f172a; font-size: 13px;">Procédure recommandée :</strong>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #334155;">${chapter.workflow.join(' &rarr; ')}</p>
        </div>
      `;
    }

    let tipsHtml = '';
    if (chapter.tips) {
      tipsHtml = `
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 10px 14px; border-radius: 6px; margin-top: 14px; font-size: 12.5px; color: #065f46;">
          <strong>Bonne pratique / Règle :</strong> ${chapter.tips}
        </div>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${chapter.title} - SIGRH BPBF</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 30px; color: #0f172a; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #004d80; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 20px; font-weight: bold; color: #004d80; margin: 0; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .category { background: #004d80; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${chapter.title}</h1>
            <div class="subtitle">SIGRH Banque Postale du Burkina Faso (BPBF) • ${chapter.summary}</div>
          </div>
          <div>
            <span class="category">${chapter.category}</span>
          </div>
        </div>
        ${subHtml}
        ${wfHtml}
        ${tipsHtml}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
