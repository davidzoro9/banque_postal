package com.bpbf.sirh_backend;

import com.bpbf.sirh_backend.entities.Utilisateur;
import com.bpbf.sirh_backend.repositories.*;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SirhBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SirhBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedDatabase(
			UtilisateurRepository repository,
			GenericRefDataRepository refDataRepo,
			GrilleSalarialeRepository grilleRepo,
			ParametrageIndemniteRepository indemniteRepo,
			DirectionRepository directionRepo,
			ServiceRepository serviceRepo,
			EmploiRepository emploiRepo,
			FonctionRepository fonctionRepo,
			EmployeeRepository employeeRepo,
			TypeIndemniteRepository typeIndemniteRepo,
			ParametrageGroupeRepository paramGroupeRepo,
			ParametrageRetraiteRepository paramRetraiteRepo,
			ParametragePriseEnChargeRepository paramPecRepo,
			TypeRetenueEmployeRepository typeRetenueEmployeRepo,
			TypeRetenueEmploiRepository typeRetenueEmploiRepo,
			EchelonRepository echelonRepo,
			CategorieRepository categorieRepo,
			GradeRepository gradeRepo) {
		return args -> {
			try {
				if (repository.findAll().stream().noneMatch(u -> "davidzorom9@gmail.com".equalsIgnoreCase(u.getEmail()))) {
					Utilisateur admin1 = new Utilisateur();
					admin1.setUsername("davidzorom");
					admin1.setNom("ZOROM");
					admin1.setPrenom("David");
					admin1.setEmail("davidzorom9@gmail.com");
					admin1.setPassword("5621");
					admin1.setRole("ADMIN");
					admin1.setActif(true);
					repository.save(admin1);
				}
				if (repository.findAll().stream().noneMatch(u -> "marie.dupont@societe.com".equalsIgnoreCase(u.getEmail()))) {
					Utilisateur admin2 = new Utilisateur();
					admin2.setUsername("marie.dupont");
					admin2.setNom("DUPONT");
					admin2.setPrenom("Marie");
					admin2.setEmail("marie.dupont@societe.com");
					admin2.setPassword("password123");
					admin2.setRole("USER");
					admin2.setActif(true);
					repository.save(admin2);
				}
			} catch (Exception e) {
				System.out.println("User marie.dupont already exists or skipped: " + e.getMessage());
			}

			// ── Seed Catégories (1..7, I..VIII) ──────────────────────────────
			try {
				String[][] cats = {
					{"1", "1ÈRE CATEGORIE", "Groupe I — Agent d'exécution (Base 95 945 FCFA)"},
					{"2", "2ÈME CATEGORIE", "Groupe I — Agent d'exécution (Base 104 474 FCFA)"},
					{"3", "3ÈME CATEGORIE", "Groupe I — Agent d'exécution (Base 107 135 FCFA)"},
					{"4", "4ÈME CATEGORIE", "Groupe I — Employé qualifié (Base 115 558 FCFA)"},
					{"5", "5ÈME CATEGORIE", "Groupe I — Employé qualifié (Base 128 831 FCFA)"},
					{"6", "6ÈME CATEGORIE", "Groupe I — Employé principal (Base 157 940 FCFA)"},
					{"7", "7ÈME CATEGORIE", "Groupe I — Agent de maîtrise (Base 176 441 FCFA)"},
					{"I", "CLASSE I", "Groupe II — Agent de maîtrise / Technicien (Base 173 090 FCFA)"},
					{"II", "CLASSE II", "Groupe II — Agent de maîtrise supérieur (Base 203 834 FCFA)"},
					{"III", "CLASSE III", "Groupe II — Cadre moyen (Base 278 697 FCFA)"},
					{"IV", "CLASSE IV", "Groupe II — Cadre supérieur (Base 405 758 FCFA)"},
					{"V", "CLASSE V", "Groupe III — Cadre de direction (Base 581 390 FCFA)"},
					{"VI", "CLASSE VI", "Groupe III — Chef de Département (Base 599 438 FCFA)"},
					{"VII", "CLASSE VII", "Groupe III — Directeur (Base 631 454 FCFA)"},
					{"VIII", "CLASSE VIII", "Groupe III — Directeur Général / Exécutif (Base 710 386 FCFA)"}
				};
				for (String[] c : cats) {
					if (refDataRepo.findByTypeAndCode("categorie", c[0]).isEmpty()) {
						com.bpbf.sirh_backend.entities.GenericRefData item = new com.bpbf.sirh_backend.entities.GenericRefData();
						item.setType("categorie");
						item.setCode(c[0]);
						item.setLibelle(c[1]);
						item.setDescription(c[2]);
						item.setActif(true);
						refDataRepo.save(item);
					}
					if (categorieRepo.findAll().stream().noneMatch(ct -> c[0].equalsIgnoreCase(ct.getCode()))) {
						com.bpbf.sirh_backend.entities.Categorie catEntity = new com.bpbf.sirh_backend.entities.Categorie();
						catEntity.setCode(c[0]);
						catEntity.setLibelle(c[1]);
						catEntity.setDescription(c[2]);
						catEntity.setActif(true);
						categorieRepo.save(catEntity);
					}
				}
			} catch (Exception e) {
				System.out.println("Catégories seeding error: " + e.getMessage());
			}

			// ── Seed Groupes (ex-Grades: GROUPE I, II, III) ─────────────────
			try {
				String[][] grades = {
					{"GROUPE I", "GROUPE I", "Agents et Employés (Catégories 1 à 7)"},
					{"GROUPE II", "GROUPE II", "Classes I à IV (Agents de Maîtrise et Cadres moyens)"},
					{"GROUPE III", "GROUPE III", "Classes V à VIII (Cadres et Cadres Supérieurs)"}
				};
				for (String[] g : grades) {
					if (refDataRepo.findByTypeAndCode("grade", g[0]).isEmpty()) {
						com.bpbf.sirh_backend.entities.GenericRefData item = new com.bpbf.sirh_backend.entities.GenericRefData();
						item.setType("grade");
						item.setCode(g[0]);
						item.setLibelle(g[1]);
						item.setDescription(g[2]);
						item.setActif(true);
						refDataRepo.save(item);
					}
					if (gradeRepo.findAll().stream().noneMatch(gr -> g[0].equalsIgnoreCase(gr.getCode()))) {
						com.bpbf.sirh_backend.entities.Grade grEntity = new com.bpbf.sirh_backend.entities.Grade();
						grEntity.setCode(g[0]);
						grEntity.setLibelle(g[1]);
						grEntity.setDescription(g[2]);
						grEntity.setActif(true);
						gradeRepo.save(grEntity);
					}
				}
			} catch (Exception e) {
				System.out.println("Groupes seeding error: " + e.getMessage());
			}

			// ── Seed Échelons (1 à 15) ──────────────────────────────────────
			try {
				for (int i = 1; i <= 15; i++) {
					String code = String.valueOf(i);
					if (refDataRepo.findByTypeAndCode("echelon", code).isEmpty()) {
						com.bpbf.sirh_backend.entities.GenericRefData item = new com.bpbf.sirh_backend.entities.GenericRefData();
						item.setType("echelon");
						item.setCode(code);
						item.setLibelle("Échelon " + i);
						item.setDescription("Niveau d'ancienneté " + i + " (Progression d'échelon)");
						item.setActif(true);
						refDataRepo.save(item);
					}
					if (echelonRepo.findAll().stream().noneMatch(ech -> code.equalsIgnoreCase(ech.getCode()))) {
						com.bpbf.sirh_backend.entities.Echelon echEntity = new com.bpbf.sirh_backend.entities.Echelon();
						echEntity.setCode(code);
						echEntity.setLibelle("Échelon " + i);
						echEntity.setDescription("Niveau d'ancienneté " + i + " (Progression d'échelon)");
						echEntity.setActif(true);
						echelonRepo.save(echEntity);
					}
				}
				System.out.println("Échelons (15 échelons) initialisés dans PostgreSQL. Total: " + echelonRepo.count());
			} catch (Exception e) {
				System.out.println("Échelons seeding error: " + e.getMessage());
			}

			// ── Seed Parametrage Groupe (param-groupe) ─────────────────────
			try {
				String[][] paramGroupes = {
					{"PG-GROUPE-I", "GROUPE I", "C1, C2, C3, C4, C5, C6, C7", "Catégories C1 à C7 rattachées au Groupe I"},
					{"PG-GROUPE-II", "GROUPE II", "CL1, CL2, CL3, CL4", "Classes CL1 à CL4 rattachées au Groupe II"},
					{"PG-GROUPE-III", "GROUPE III", "CL5, CL6, CL7, CL8", "Classes CL5 à CL8 rattachées au Groupe III"},
					{"PG-GROUPE-IV", "GROUPE IV", "CL9, CL10", "Classes CL9 à CL10 rattachées au Groupe IV"}
				};
				for (String[] pg : paramGroupes) {
					if (refDataRepo.findByTypeAndCode("param-groupe", pg[0]).isEmpty()) {
						com.bpbf.sirh_backend.entities.GenericRefData item = new com.bpbf.sirh_backend.entities.GenericRefData();
						item.setType("param-groupe");
						item.setCode(pg[0]);
						item.setGrade(pg[1]);
						item.setCategorie(pg[2]);
						item.setLibelle(pg[1]);
						item.setDescription(pg[3]);
						item.setActif(true);
						refDataRepo.save(item);
					}
					java.util.Optional<com.bpbf.sirh_backend.entities.ParametrageGroupe> optPg = paramGroupeRepo.findAll().stream().filter(p -> pg[0].equalsIgnoreCase(p.getCode())).findFirst();
					if (optPg.isEmpty()) {
						com.bpbf.sirh_backend.entities.ParametrageGroupe pgEntity = new com.bpbf.sirh_backend.entities.ParametrageGroupe();
						pgEntity.setCode(pg[0]);
						pgEntity.setGrade(pg[1]);
						pgEntity.setLibelle(pg[1]);
						pgEntity.setCategorie(pg[2]);
						pgEntity.setDescription(pg[3]);
						pgEntity.setActif(true);
						paramGroupeRepo.save(pgEntity);
					} else {
						com.bpbf.sirh_backend.entities.ParametrageGroupe pgEntity = optPg.get();
						if (pgEntity.getGrade() == null || pgEntity.getCategorie() == null) {
							pgEntity.setGrade(pg[1]);
							pgEntity.setCategorie(pg[2]);
							paramGroupeRepo.save(pgEntity);
						}
					}
				}
				System.out.println("Paramétrage Groupe initialisé dans PostgreSQL. Total: " + paramGroupeRepo.count());
			} catch (Exception e) {
				System.out.println("Parametrage Groupe seeding error: " + e.getMessage());
			}

			// ── Seed Paramétrage Retraite (param-retraite) ─────────────────
			try {
				Object[][] paramRetraites = {
					{"PG-RET-G1", "GROUPE I", "Âge légal de départ à la retraite pour les agents non-cadres (56 ans)", 56.0},
					{"PG-RET-G2", "GROUPE II", "GROUPE II : 58 ans", 58.0},
					{"PG-RET-G3", "GROUPE III", "GROUPE III : 60 ans", 60.0},
					{"PG-RET-G4", "GROUPE IV", "GROUPE IV : 63 ans", 63.0}
				};
				for (Object[] pr : paramRetraites) {
					String code = (String) pr[0];
					if (refDataRepo.findByTypeAndCode("param-retraite", code).isEmpty()) {
						com.bpbf.sirh_backend.entities.GenericRefData item = new com.bpbf.sirh_backend.entities.GenericRefData();
						item.setType("param-retraite");
						item.setCode(code);
						item.setGrade((String) pr[1]);
						item.setLibelle((String) pr[1]);
						item.setDescription((String) pr[2]);
						item.setTaux((Double) pr[3]);
						item.setActif(true);
						refDataRepo.save(item);
					}
					if (paramRetraiteRepo.findAll().stream().noneMatch(p -> code.equalsIgnoreCase(p.getCode()))) {
						com.bpbf.sirh_backend.entities.ParametrageRetraite prEntity = new com.bpbf.sirh_backend.entities.ParametrageRetraite();
						prEntity.setCode(code);
						prEntity.setGrade((String) pr[1]);
						prEntity.setLibelle((String) pr[1]);
						prEntity.setDescription((String) pr[2]);
						prEntity.setTaux((Double) pr[3]);
						prEntity.setActif(true);
						paramRetraiteRepo.save(prEntity);
					}
				}
			} catch (Exception e) {
				System.out.println("Parametrage Retraite seeding error: " + e.getMessage());
			}

			// ── Seed Prise en Charge Famille (param-prise-en-charge) ────────
			try {
				Object[][] pecs = {
					{"PEC-AGE-STD", "Âge Max Enfant Standard", "Âge limite légal pour enfant mineur à charge (strictement inférieur à 18 ans)", 18.0},
					{"PEC-AGE-ETUD", "Âge Max Enfant Étudiant / Scolarisé", "Âge limite pour enfant poursuivant des études (strictement inférieur à 20 ans)", 20.0},
					{"PEC-CONJOINT", "Prise en Charge Conjoint Non-Salarié", "Accorder +1 charge de famille si le conjoint est sans emploi / ne travaille pas", 1.0},
					{"PEC-MAX-CHRG", "Nombre de Charges Max Autorisées", "Plafond maximum de charges fiscales admises pour la réduction IUTS (Burkina Faso)", 4.0}
				};
				for (Object[] pec : pecs) {
					String code = (String) pec[0];
					if (refDataRepo.findByTypeAndCode("param-prise-en-charge", code).isEmpty()) {
						com.bpbf.sirh_backend.entities.GenericRefData item = new com.bpbf.sirh_backend.entities.GenericRefData();
						item.setType("param-prise-en-charge");
						item.setCode(code);
						item.setLibelle((String) pec[1]);
						item.setDescription((String) pec[2]);
						item.setTaux((Double) pec[3]);
						item.setActif(true);
						refDataRepo.save(item);
					}
					if (paramPecRepo.findAll().stream().noneMatch(p -> code.equalsIgnoreCase(p.getCode()))) {
						com.bpbf.sirh_backend.entities.ParametragePriseEnCharge pecEntity = new com.bpbf.sirh_backend.entities.ParametragePriseEnCharge();
						pecEntity.setCode(code);
						pecEntity.setLibelle((String) pec[1]);
						pecEntity.setDescription((String) pec[2]);
						pecEntity.setTaux((Double) pec[3]);
						pecEntity.setActif(true);
						paramPecRepo.save(pecEntity);
					}
				}
			} catch (Exception e) {
				System.out.println("Prise en charge famille seeding error: " + e.getMessage());
			}

			// ── Seed Type Retenue Employé (type-retenue-employe) ─────────────
			try {
				String[][] tres = {
					{"TR-PATRONALE", "Part Employeur", "Part de cotisation patronale prise en charge directement par l'employeur"},
					{"TR-SALARIALE", "Part Agent", "Part de cotisation salariale prélevée à la source sur la paie de l'agent"}
				};
				for (String[] tre : tres) {
					if (refDataRepo.findByTypeAndCode("type-retenue-employe", tre[0]).isEmpty()) {
						com.bpbf.sirh_backend.entities.GenericRefData item = new com.bpbf.sirh_backend.entities.GenericRefData();
						item.setType("type-retenue-employe");
						item.setCode(tre[0]);
						item.setLibelle(tre[1]);
						item.setDescription(tre[2]);
						item.setActif(true);
						refDataRepo.save(item);
					}
					if (typeRetenueEmployeRepo.findAll().stream().noneMatch(t -> tre[0].equalsIgnoreCase(t.getCode()))) {
						com.bpbf.sirh_backend.entities.TypeRetenueEmploye treEntity = new com.bpbf.sirh_backend.entities.TypeRetenueEmploye();
						treEntity.setCode(tre[0]);
						treEntity.setLibelle(tre[1]);
						treEntity.setDescription(tre[2]);
						treEntity.setActif(true);
						typeRetenueEmployeRepo.save(treEntity);
					}
				}
			} catch (Exception e) {
				System.out.println("Type retenue employé seeding error: " + e.getMessage());
			}

			// ── Seed Retenues par Emploi (type-retenue-emploi) ──────────────
			try {
				Object[][] tresEmploi = {
					{"RET-CNSS-SAL", "Cotisation Sociale CNSS (Part Agent)", "Part Agent", 5.5, "Cotisation sociale obligatoire à la charge de l'employé (5,5% du brut plafonné)"},
					{"RET-CNSS-PAT", "Cotisation Sociale CNSS (Part Employeur)", "Part Employeur", 16.0, "Cotisation patronale obligatoire sécurité sociale (16,0% sur masse salariale)"},
					{"RET-IUTS", "Impôt IUTS (Impôt sur Salaire)", "Retenue Fiscale (IUTS/TPA)", 0.0, "Impôt Unique sur Traitements et Salaires prélevé à la source (Barème progressif)"},
					{"RET-CRRAE-SAL", "Retraite Complémentaire CRRAE (Part Agent)", "Retraite Complémentaire (CRRAE)", 3.0, "Cotisation salariale fonds de pension complémentaire bancaire UMOA"},
					{"RET-CRRAE-PAT", "Retraite Complémentaire CRRAE (Part Pat.)", "Part Employeur", 5.0, "Contribution patronale retraite complémentaire bancaire UMOA"},
					{"RET-AM-SAL", "Assurance Maladie Groupe (Part Agent)", "Assurance Groupe & Santé", 2.5, "Part salariale couverture médicale maladie et hospitalisation (25%)"},
					{"RET-AM-PAT", "Assurance Maladie Groupe (Part Employeur)", "Part Employeur", 7.5, "Prise en charge patronale assurance maladie groupe (75%)"}
				};
				for (Object[] tre : tresEmploi) {
					String code = (String) tre[0];
					if (refDataRepo.findByTypeAndCode("type-retenue-emploi", code).isEmpty()) {
						com.bpbf.sirh_backend.entities.GenericRefData item = new com.bpbf.sirh_backend.entities.GenericRefData();
						item.setType("type-retenue-emploi");
						item.setCode(code);
						item.setLibelle((String) tre[1]);
						item.setTypeRetenue((String) tre[2]);
						item.setTaux((Double) tre[3]);
						item.setDescription((String) tre[4]);
						item.setActif(true);
						refDataRepo.save(item);
					}
					if (typeRetenueEmploiRepo.findAll().stream().noneMatch(t -> code.equalsIgnoreCase(t.getCode()))) {
						com.bpbf.sirh_backend.entities.TypeRetenueEmploi treEmploiEntity = new com.bpbf.sirh_backend.entities.TypeRetenueEmploi();
						treEmploiEntity.setCode(code);
						treEmploiEntity.setLibelle((String) tre[1]);
						treEmploiEntity.setTypeRetenue((String) tre[2]);
						treEmploiEntity.setTaux((Double) tre[3]);
						treEmploiEntity.setDescription((String) tre[4]);
						treEmploiEntity.setActif(true);
						typeRetenueEmploiRepo.save(treEmploiEntity);
					}
				}
			} catch (Exception e) {
				System.out.println("Retenues par emploi seeding error: " + e.getMessage());
			}

			// ── Seed Grille Salariale (données officielles BPBF) ──────────────
			try {
				// Nettoyage des anciennes données obsolètes ou corrompues (null, 0 FCFA ou fausses catégories)
				List<com.bpbf.sirh_backend.entities.GrilleSalariale> toDelete = grilleRepo.findAll().stream()
					.filter(g -> g.getBasicSalary() == null 
							  || g.getBasicSalary().doubleValue() <= 0 
							  || g.getCategory() == null 
							  || !g.getCategory().matches("^(C[1-7]|CL[1-8])$")
							  || g.getEchellon() == null 
							  || !g.getEchellon().matches("^E\\d{2}$"))
					.collect(java.util.stream.Collectors.toList());
				if (!toDelete.isEmpty()) {
					grilleRepo.deleteAll(toDelete);
					System.out.println("Nettoyage grille salariale: " + toDelete.size() + " entrée(s) obsolète(s) supprimée(s).");
				}

				if (grilleRepo.count() < 225) {
				// Grille officielle BPBF:
				// GROUPE I  : Catégories C1-C7 (Agents, Employés, Techniciens Opérationnels)
				// GROUPE II : Classes CL1-CL4 (Agents de Maîtrise et Cadres Moyens)
				// GROUPE III: Classes CL5-CL8 (Cadres et Cadres Supérieurs)
				// Progression: +2.94% par échelon (15 échelons par catégorie)
				Object[][] grilleBPBF = {
					// {category, classe, echelle_groupe, salaire_base_E01}
					// GROUPE I - Agents/Employés/Techniciens
					{"C1", "GROUPE I", "Catégorie 1", 95945.0},
					{"C2", "GROUPE I", "Catégorie 2", 104474.0},
					{"C3", "GROUPE I", "Catégorie 3", 107135.0},
					{"C4", "GROUPE I", "Catégorie 4", 115558.0},
					{"C5", "GROUPE I", "Catégorie 5", 128831.0},
					{"C6", "GROUPE I", "Catégorie 6", 157940.0},
					{"C7", "GROUPE I", "Catégorie 7", 176441.0},
					// GROUPE II - Agents de Maîtrise
					{"CL1", "GROUPE II", "Classe I",   173090.0},
					{"CL2", "GROUPE II", "Classe II",  203834.0},
					{"CL3", "GROUPE II", "Classe III", 278697.0},
					{"CL4", "GROUPE II", "Classe IV",  405758.0},
					// GROUPE III - Cadres
					{"CL5", "GROUPE III", "Classe V",   581390.0},
					{"CL6", "GROUPE III", "Classe VI",  599438.0},
					{"CL7", "GROUPE III", "Classe VII", 631454.0},
					{"CL8", "GROUPE III", "Classe VIII",710386.0},
				};

				List<com.bpbf.sirh_backend.entities.Categorie> allCategories = categorieRepo.findAll();
				List<com.bpbf.sirh_backend.entities.Echelon> allEchelons = echelonRepo.findAll();
				List<com.bpbf.sirh_backend.entities.Grade> allGrades = gradeRepo.findAll();
				List<com.bpbf.sirh_backend.entities.GrilleSalariale> currentGrilles = grilleRepo.findAll();

				for (Object[] cat : grilleBPBF) {
					String catName   = (String) cat[0];
					String classe    = (String) cat[1];
					String echelle   = (String) cat[2];
					double base      = (Double) cat[3];

					com.bpbf.sirh_backend.entities.Categorie catObj = allCategories.stream()
						.filter(c -> {
							String cCode = c.getCode();
							if (catName.equalsIgnoreCase(cCode) || catName.equalsIgnoreCase(c.getLibelle())) return true;
							if (catName.startsWith("C") && !catName.startsWith("CL") && catName.substring(1).equalsIgnoreCase(cCode)) return true;
							if (catName.startsWith("CL")) {
								try {
									int num = Integer.parseInt(catName.substring(2));
									String[] roman = {"", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"};
									if (num >= 1 && num < roman.length && roman[num].equalsIgnoreCase(cCode)) return true;
								} catch (Exception ignored) {}
							}
							return false;
						})
						.findFirst().orElse(null);
					com.bpbf.sirh_backend.entities.Grade gradeObj = allGrades.stream()
						.filter(g -> classe.equalsIgnoreCase(g.getCode()) || classe.equalsIgnoreCase(g.getLibelle()))
						.findFirst().orElse(null);

					for (int ech = 1; ech <= 15; ech++) {
						String echName = String.format("E%02d", ech);
						String echNumStr = String.valueOf(ech);
						com.bpbf.sirh_backend.entities.Echelon echObj = allEchelons.stream()
							.filter(e -> echName.equalsIgnoreCase(e.getCode()) || echNumStr.equalsIgnoreCase(e.getCode()))
							.findFirst().orElse(null);

						com.bpbf.sirh_backend.entities.GrilleSalariale g = currentGrilles.stream()
							.filter(existing -> catName.equalsIgnoreCase(existing.getCategory())
										&& echName.equalsIgnoreCase(existing.getEchellon()))
							.findFirst().orElse(null);

						boolean newRecord = false;
						if (g == null) {
							g = new com.bpbf.sirh_backend.entities.GrilleSalariale();
							g.setCategory(catName);
							g.setClasse(classe);
							g.setEchelle(echelle);
							g.setEchellon(echName);
							double salaire = Math.round(base * Math.pow(1.03, ech - 1));
							g.setBasicSalary(java.math.BigDecimal.valueOf(salaire));
							newRecord = true;
						}

						if (g.getCategorieObj() == null || g.getEchelonObj() == null || g.getGradeObj() == null || newRecord) {
							if (g.getCategorieObj() == null) g.setCategorieObj(catObj);
							if (g.getEchelonObj() == null) g.setEchelonObj(echObj);
							if (g.getGradeObj() == null) g.setGradeObj(gradeObj);
							grilleRepo.save(g);
						}
					}
				}
				System.out.println("Grille salariale BPBF (225 éléments avec relations ManyToOne) initialisée/mise à jour. Total: " + grilleRepo.count());
				}
			} catch (Exception e) {
				System.out.println("Grille salariale seeding error: " + e.getMessage());
			}


			// ── Seed Directions (table direction) ───────────────────────────
			try {
				if (directionRepo.count() < 5) {
					String[][] dirs = {
						{"DIR-001", "Direction Générale (DG)", "Pilotage stratégique et gouvernance BPBF"},
						{"DIR-002", "Direction des Opérations Bancaires (DOB)", "Exploitation bancaire et gestion du réseau d'agences"},
						{"DIR-003", "Direction Monétique & SI (DMSI)", "Systèmes d'information, réseaux bancaires & Cash Point"},
						{"DIR-004", "Direction des Ressources Humaines (DRH)", "Gestion du personnel, paie et développement des compétences"},
						{"DIR-005", "Direction Financière & Trésorerie (DFT)", "Gestion financière, comptabilité et trésorerie bancaire"}
					};
					for (String[] d : dirs) {
						boolean exists = directionRepo.findAll().stream().anyMatch(dir -> d[0].equalsIgnoreCase(dir.getCode()) || d[1].equalsIgnoreCase(dir.getName()));
						if (!exists) {
							com.bpbf.sirh_backend.entities.Direction dir = new com.bpbf.sirh_backend.entities.Direction();
							dir.setCode(d[0]);
							dir.setName(d[1]);
							dir.setDescription(d[2]);
							directionRepo.save(dir);
						}
					}
					System.out.println("Directions initialisées. Total: " + directionRepo.count());
				}
			} catch (Exception e) {
				System.out.println("Directions seeding error: " + e.getMessage());
			}

			// ── Seed Services (table service) ───────────────────────────────
			try {
				if (serviceRepo.count() < 5) {
					String[][] srvs = {
						{"SRV-001", "Service Monétique & Cash Point", "Gestion des cartes, GAB, TPE et services Cash Point"},
						{"SRV-002", "Service Gestion du Personnel & Paie", "Administration du personnel et calcul de la paie"},
						{"SRV-003", "Service Comptabilité & Trésorerie", "Comptabilité générale bancaire et gestion de la caisse"},
						{"SRV-004", "Service Opérations de Guichet", "Gestion des opérations de caisse et transferts"},
						{"SRV-005", "Service Crédit & Engagements", "Analyse et octroi des prêts aux particuliers et pro"}
					};
					for (String[] s : srvs) {
						boolean exists = serviceRepo.findAll().stream().anyMatch(srv -> s[0].equalsIgnoreCase(srv.getCode()) || s[1].equalsIgnoreCase(srv.getName()));
						if (!exists) {
							com.bpbf.sirh_backend.entities.Service srv = new com.bpbf.sirh_backend.entities.Service();
							srv.setCode(s[0]);
							srv.setName(s[1]);
							srv.setDescription(s[2]);
							serviceRepo.save(srv);
						}
					}
					System.out.println("Services initialisés. Total: " + serviceRepo.count());
				}
			} catch (Exception e) {
				System.out.println("Services seeding error: " + e.getMessage());
			}

			// ── Seed Emplois (table emploi) ─────────────────────────────────
			try {
				if (emploiRepo.count() < 9) {
					String[][] emps = {
						{"EMP-001", "Directeur Général"},
						{"EMP-002", "Directeur de Département"},
						{"EMP-003", "Chef de Service"},
						{"EMP-004", "Analyste Financier / Comptable"},
						{"EMP-005", "Ingénieur Monétique / SI"},
						{"EMP-006", "Caissier Principal"},
						{"EMP-007", "Gestionnaire Cash Point"},
						{"EMP-008", "Chargé de Clientèle Entreprises & PME"},
						{"EMP-009", "Auditeur Interne & Contrôleur de Gestion"}
					};
					for (String[] e : emps) {
						boolean exists = emploiRepo.findAll().stream().anyMatch(emp -> e[0].equalsIgnoreCase(emp.getCode()) || e[1].equalsIgnoreCase(emp.getName()));
						if (!exists) {
							com.bpbf.sirh_backend.entities.Emploi emp = new com.bpbf.sirh_backend.entities.Emploi();
							emp.setCode(e[0]);
							emp.setName(e[1]);
							emploiRepo.save(emp);
						}
					}
					System.out.println("Emplois initialisés. Total: " + emploiRepo.count());
				}
			} catch (Exception e) {
				System.out.println("Emplois seeding error: " + e.getMessage());
			}

			// ── Seed Fonctions (table fonction) ─────────────────────────────
			try {
				if (fonctionRepo.count() < 15) {
					String[][] fcts = {
						{"FCT-001", "Directeur Général (DG)"},
						{"FCT-002", "Directeur de Département"},
						{"FCT-003", "Responsable de Département"},
						{"FCT-004", "Chef de Service"},
						{"FCT-005", "Responsable d'Unité"},
						{"FCT-006", "Chef d'Agence Bancaire"},
						{"FCT-007", "Auditeur Interne Senior"},
						{"FCT-008", "Comptable Principal"},
						{"FCT-009", "Ingénieur Réseau & SI"},
						{"FCT-010", "Analyste Financier Senior"},
						{"FCT-011", "Gestionnaire de Portefeuille Clientèle"},
						{"FCT-012", "Superviseur Cash Point & Guichet"},
						{"FCT-013", "Chargé de Clientèle Particuliers"},
						{"FCT-014", "Caissier Principal"},
						{"FCT-015", "Agent d'Accueil & Secrétariat"}
					};
					for (String[] f : fcts) {
						boolean exists = fonctionRepo.findAll().stream().anyMatch(fct -> f[0].equalsIgnoreCase(fct.getCode()) || f[1].equalsIgnoreCase(fct.getName()));
						if (!exists) {
							com.bpbf.sirh_backend.entities.Fonction fct = new com.bpbf.sirh_backend.entities.Fonction();
							fct.setCode(f[0]);
							fct.setName(f[1]);
							fonctionRepo.save(fct);
						}
					}
					System.out.println("Fonctions initialisées. Total: " + fonctionRepo.count());
				}
			} catch (Exception e) {
				System.out.println("Fonctions seeding error: " + e.getMessage());
			}

			// ── Seed Employés (14 agents BPBF dans PostgreSQL) ───────────────
			try {
				String[][] initialEmps = {
					{"EMP-001", "SAWADOGO", "Abdoulaye", "a.sawadogo@bpbf.bf", "+226 70 11 22 33", "{\"categorie\":\"CL8\",\"echelon\":\"E05\",\"grade\":\"CL8E05\",\"salaireBase\":710386,\"primeLogement\":150000,\"primeTransport\":100000,\"primeResponsabilite\":80000}"},
					{"EMP-002", "ZOROM", "David Pascal", "d.zorom@bpbf.bf", "+226 76 55 44 33", "{\"categorie\":\"CL7\",\"echelon\":\"E04\",\"grade\":\"CL7E04\",\"salaireBase\":631454,\"primeLogement\":200000,\"primeTransport\":100000,\"primeResponsabilite\":150000}"},
					{"EMP-003", "OUEDRAOGO", "Mariam", "m.ouedraogo@bpbf.bf", "+226 78 99 88 77", "{\"categorie\":\"CL6\",\"echelon\":\"E03\",\"grade\":\"CL6E03\",\"salaireBase\":599438,\"primeLogement\":150000,\"primeTransport\":75000,\"primeResponsabilite\":100000}"},
					{"EMP-004", "KABORE", "Yacouba", "y.kabore@bpbf.bf", "+226 71 22 33 44", "{\"categorie\":\"CL4\",\"echelon\":\"E04\",\"grade\":\"CL4E04\",\"salaireBase\":405758,\"primeLogement\":100000,\"primeTransport\":75000,\"primeResponsabilite\":75000}"},
					{"EMP-005", "TRAORE", "Aminata", "a.traore@bpbf.bf", "+226 75 44 33 22", "{\"categorie\":\"CL5\",\"echelon\":\"E02\",\"grade\":\"CL5E02\",\"salaireBase\":581390,\"primeLogement\":120000,\"primeTransport\":75000,\"primeResponsabilite\":80000}"},
					{"EMP-006", "COMPAORE", "Boukari", "b.compaore@bpbf.bf", "+226 60 12 34 56", "{\"categorie\":\"C7\",\"echelon\":\"E06\",\"grade\":\"C7E06\",\"salaireBase\":176441,\"primeLogement\":35000,\"primeTransport\":30000,\"primeResponsabilite\":40000}"},
					{"EMP-007", "SANOGO", "Fatoumata", "f.sanogo@bpbf.bf", "+226 72 34 56 78", "{\"categorie\":\"C6\",\"echelon\":\"E01\",\"grade\":\"C6E01\",\"salaireBase\":157940,\"primeLogement\":35000,\"primeTransport\":30000,\"primeResponsabilite\":30000}"},
					{"EMP-008", "YERBANGA", "Blaise", "b.yerbanga@bpbf.bf", "+226 70 99 88 11", "{\"categorie\":\"C4\",\"echelon\":\"E01\",\"grade\":\"C4E01\",\"salaireBase\":150000,\"primeLogement\":100000,\"primeTransport\":75000,\"primeResponsabilite\":75000,\"enfants\":[{\"prenom\":\"Junior\",\"nom\":\"Yerbanga\",\"dateNaissance\":\"2016-05-12\",\"scolarise\":true}]}"},
					{"EMP-009", "ZOROM", "David", "david.zorom@bpbf.bf", "+226 70 00 11 22", "{\"categorie\":\"C4\",\"echelon\":\"E01\",\"grade\":\"C4E01\",\"salaireBase\":115558,\"primeLogement\":25000,\"primeTransport\":25000,\"primeResponsabilite\":20000}"},
					{"EMP-010", "ZOROFFFF", "Davidff", "davidff@bpbf.bf", "+226 70 11 22 44", "{\"categorie\":\"C1\",\"echelon\":\"E01\",\"grade\":\"C1E01\",\"salaireBase\":95945,\"primeLogement\":25000,\"primeTransport\":25000,\"primeResponsabilite\":0}"},
					{"EMP-011", "444", "4", "444@bpbf.bf", "+226 70 11 22 55", "{\"categorie\":\"C1\",\"echelon\":\"E01\",\"grade\":\"C1E01\",\"salaireBase\":95945,\"primeLogement\":25000,\"primeTransport\":25000,\"primeResponsabilite\":0}"},
					{"EMP-012", "F", "F", "ff@bpbf.bf", "+226 70 11 22 66", "{\"categorie\":\"C1\",\"echelon\":\"E01\",\"grade\":\"C1E01\",\"salaireBase\":95945,\"primeLogement\":25000,\"primeTransport\":25000,\"primeResponsabilite\":0}"},
					{"EMP-013", "SANOU", "Ali", "ali.sanou@bpbf.bf", "+226 70 11 22 77", "{\"categorie\":\"C1\",\"echelon\":\"E01\",\"grade\":\"C1E01\",\"salaireBase\":95945,\"primeLogement\":25000,\"primeTransport\":25000,\"primeResponsabilite\":0}"},
					{"EMP-014", "H", "H", "hh@bpbf.bf", "+226 70 11 22 88", "{\"categorie\":\"C1\",\"echelon\":\"E01\",\"grade\":\"C1E01\",\"salaireBase\":95945,\"primeLogement\":25000,\"primeTransport\":25000,\"primeResponsabilite\":0}"}
				};

				for (String[] empData : initialEmps) {
					java.util.Optional<com.bpbf.sirh_backend.entities.Employee> opt = employeeRepo.findAll().stream().filter(e -> empData[0].equalsIgnoreCase(e.getMatricule())).findFirst();
					if (opt.isEmpty()) {
						com.bpbf.sirh_backend.entities.Employee emp = new com.bpbf.sirh_backend.entities.Employee();
						emp.setMatricule(empData[0]);
						emp.setNom(empData[1]);
						emp.setPrenom(empData[2]);
						emp.setName(empData[2] + " " + empData[1]);
						emp.setEmail(empData[3]);
						emp.setPhone(empData[4]);
						emp.setTelephone(empData[4]);
						emp.setState(com.bpbf.sirh_backend.entities.EmployeeStatus.ACTIF);
						emp.setExtraData(empData[5]);
						employeeRepo.save(emp);
					} else {
						com.bpbf.sirh_backend.entities.Employee emp = opt.get();
						if (emp.getExtraData() == null || emp.getExtraData().contains("350000") || emp.getExtraData().contains("GRADE I") || !emp.getExtraData().contains("primeTransport")) {
							emp.setExtraData(empData[5]);
							employeeRepo.save(emp);
						}
					}
				}

				// Synchroniser les objets ManyToOne (Categorie, Echelon, Grade, GrilleSalariale) pour tous les employés
				for (com.bpbf.sirh_backend.entities.Employee emp : employeeRepo.findAll()) {
					if (emp.getExtraData() != null && !emp.getExtraData().isEmpty()) {
						try {
							com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
							java.util.Map<String, Object> map = mapper.readValue(emp.getExtraData(), new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {});
							String cat = (String) map.get("categorie");
							if (cat == null) cat = (String) map.get("categoriePro");
							String ech = (String) map.get("echelon");
							String grade = (String) map.get("grade");

							if (cat != null) {
								String finalCat = cat.trim();
								categorieRepo.findAll().stream().filter(c -> finalCat.equalsIgnoreCase(c.getCode()) || finalCat.equalsIgnoreCase(c.getLibelle())).findFirst().ifPresent(emp::setCategorieObj);
							}
							if (ech != null) {
								String finalEch = ech.trim();
								echelonRepo.findAll().stream().filter(e -> finalEch.equalsIgnoreCase(e.getCode()) || finalEch.equalsIgnoreCase(e.getLibelle())).findFirst().ifPresent(emp::setEchelonObj);
							}
							if (grade != null) {
								String finalGrade = grade.trim();
								gradeRepo.findAll().stream().filter(g -> finalGrade.equalsIgnoreCase(g.getCode()) || finalGrade.equalsIgnoreCase(g.getLibelle())).findFirst().ifPresent(emp::setGradeObj);
								grilleRepo.findAll().stream().filter(gs -> finalGrade.equalsIgnoreCase(gs.getCode()) || finalGrade.equalsIgnoreCase(gs.getGrade())).findFirst().ifPresent(emp::setGrilleSalariale);
							}
							employeeRepo.save(emp);
						} catch (Exception ex) {}
					}
				}
				System.out.println("Employés (14 agents) initialisés et reliés à la grille salariale. Total: " + employeeRepo.count());
			} catch (Exception e) {
				System.out.println("Employees seeding error: " + e.getMessage());
			}

			// ── Seed TypeIndemnite (table type_indemnite) ───────────────────
			try {
				if (typeIndemniteRepo.count() < 5) {
					Object[][] types = {
						{"IND-LOG", "Indemnité de Logement", "Indemnité liée au logement du personnel", 0.0, 0.0},
						{"IND-TRP", "Indemnité de Transport", "Indemnité forfaitaire de déplacement", 100.0, 30000.0},
						{"IND-RSP", "Indemnité de Responsabilité", "Prime de responsabilité de fonction", 0.0, 0.0},
						{"IND-SUT", "Indemnité de Sujétion & Caisse", "Indemnité pour risque de caisse et manipulation de fonds", 100.0, 50000.0},
						{"IND-RIS", "Indemnité de Risque Bancaire", "Indemnité spécifique risques métier banque", 0.0, 0.0}
					};

					for (Object[] t : types) {
						String code = (String) t[0];
						boolean exists = typeIndemniteRepo.findAll().stream().anyMatch(ti -> code.equalsIgnoreCase(ti.getCode()));
						if (!exists) {
							com.bpbf.sirh_backend.entities.TypeIndemnite ti = new com.bpbf.sirh_backend.entities.TypeIndemnite();
							ti.setCode((String) t[0]);
							ti.setName((String) t[1]);
							ti.setDescription((String) t[2]);
							ti.setTauxExoneration((Double) t[3]);
							ti.setPlafondExoneration((Double) t[4]);
							typeIndemniteRepo.save(ti);
						}
					}
					System.out.println("Types d'indemnité (5 types) initialisés dans PostgreSQL. Total: " + typeIndemniteRepo.count());
				}
			} catch (Exception e) {
				System.out.println("TypeIndemnite seeding error: " + e.getMessage());
			}

			// ── Seed ParametrageIndemnite (table parametrage_indemnite) ────
			try {
				// Effacer les anciens paramétrages corrompus pour repartir sur une base 100% propre
				indemniteRepo.deleteAll();
				refDataRepo.findAll().stream()
					.filter(r -> "param-indemnite".equalsIgnoreCase(r.getType()))
					.forEach(refDataRepo::delete);

				Object[][] params = {
					// ─── 1. BARÈME GÉNÉRAL / ORDINAIRE (Groupes & Catégories) ─────────────
					{"PI-G1-LOG", "Indemnité de Logement", "", "GROUPE I", "C1, C2, C3, C4, C5, C6, C7", 35000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G1-TRP", "Indemnité de Transport", "", "GROUPE I", "C1, C2, C3, C4, C5, C6, C7", 30000.0, 100.0, 30000.0, "ORDINAIRE", "NON_NOMMEE", true},

					{"PI-G2-CL1-LOG", "Indemnité de Logement", "", "GROUPE II", "CL1", 45000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G2-CL1-TRP", "Indemnité de Transport", "", "GROUPE II", "CL1", 45000.0, 100.0, 45000.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G2-CL1-SUJ", "Indemnité de Sujétion", "", "GROUPE II", "CL1", 20000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},

					{"PI-G2-CL2-LOG", "Indemnité de Logement", "", "GROUPE II", "CL2", 45000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G2-CL2-TRP", "Indemnité de Transport", "", "GROUPE II", "CL2", 45000.0, 100.0, 45000.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G2-CL2-SUJ", "Indemnité de Sujétion", "", "GROUPE II", "CL2", 30000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},

					{"PI-G2-CL3-LOG", "Indemnité de Logement", "", "GROUPE II", "CL3", 50000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G2-CL3-TRP", "Indemnité de Transport", "", "GROUPE II", "CL3", 50000.0, 100.0, 50000.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G2-CL3-SUJ", "Indemnité de Sujétion", "", "GROUPE II", "CL3", 40000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},

					{"PI-G2-CL4-LOG", "Indemnité de Logement", "", "GROUPE II", "CL4", 60000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G2-CL4-TRP", "Indemnité de Transport", "", "GROUPE II", "CL4", 50000.0, 100.0, 50000.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G2-CL4-SUJ", "Indemnité de Sujétion", "", "GROUPE II", "CL4", 50000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},

					{"PI-G3-CL5-LOG", "Indemnité de Logement", "", "GROUPE III", "CL5", 90000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G3-CL5-TRP", "Indemnité de Transport", "", "GROUPE III", "CL5", 60000.0, 100.0, 60000.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G3-CL5-SUJ", "Indemnité de Sujétion", "", "GROUPE III", "CL5", 60000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},

					{"PI-G3-CL6-LOG", "Indemnité de Logement", "", "GROUPE III", "CL6", 100000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G3-CL6-TRP", "Indemnité de Transport", "", "GROUPE III", "CL6", 75000.0, 100.0, 75000.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G3-CL6-SUJ", "Indemnité de Sujétion", "", "GROUPE III", "CL6", 60000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},

					{"PI-G3-CL7-LOG", "Indemnité de Logement", "", "GROUPE III", "CL7", 110000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G3-CL7-TRP", "Indemnité de Transport", "", "GROUPE III", "CL7", 80000.0, 100.0, 80000.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G3-CL7-SUJ", "Indemnité de Sujétion", "", "GROUPE III", "CL7", 70000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},

					{"PI-G3-CL8-LOG", "Indemnité de Logement", "", "GROUPE III", "CL8", 150000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G3-CL8-TRP", "Indemnité de Transport", "", "GROUPE III", "CL8", 100000.0, 100.0, 100000.0, "ORDINAIRE", "NON_NOMMEE", true},
					{"PI-G3-CL8-SUJ", "Indemnité de Sujétion", "", "GROUPE III", "CL8", 80000.0, 0.0, 0.0, "ORDINAIRE", "NON_NOMMEE", true},

					// ─── 2. INDEMNITÉS DE NOMINATION ──────────────────────────────────────────
					{"PI-NOM-DIR-FCT", "Indemnité de fonction", "DIRECTEUR DE DÉPARTEMENT", "", "", 150000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-DIR-TRP", "Indemnité de Transport", "DIRECTEUR DE DÉPARTEMENT", "", "", 100000.0, 100.0, 100000.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-DIR-LOG", "Indemnité de Logement", "DIRECTEUR DE DÉPARTEMENT", "", "", 200000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-DIR-CMP", "Indemnité compensatrice", "DIRECTEUR DE DÉPARTEMENT", "", "", 100000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},

					{"PI-NOM-RESP-FCT", "Indemnité de fonction", "RESPONSABLE DE DÉPARTEMENT", "", "", 100000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-RESP-TRP", "Indemnité de Transport", "RESPONSABLE DE DÉPARTEMENT", "", "", 75000.0, 100.0, 75000.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-RESP-LOG", "Indemnité de Logement", "RESPONSABLE DE DÉPARTEMENT", "", "", 150000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-RESP-CMP", "Indemnité compensatrice", "RESPONSABLE DE DÉPARTEMENT", "", "", 75000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},

					{"PI-NOM-CS-FCT", "Indemnité de fonction", "CHEF DE SERVICE", "", "", 80000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-CS-TRP", "Indemnité de Transport", "CHEF DE SERVICE", "", "", 75000.0, 100.0, 75000.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-CS-LOG", "Indemnité de Logement", "CHEF DE SERVICE", "", "", 120000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-CS-CMP", "Indemnité compensatrice", "CHEF DE SERVICE", "", "", 75000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},

					{"PI-NOM-CA-FCT", "Indemnité de fonction", "CHEF D'AGENCE", "", "", 75000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-CA-TRP", "Indemnité de Transport", "CHEF D'AGENCE", "", "", 75000.0, 100.0, 75000.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-CA-LOG", "Indemnité de Logement", "CHEF D'AGENCE", "", "", 100000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},
					{"PI-NOM-CA-CMP", "Indemnité compensatrice", "CHEF D'AGENCE", "", "", 75000.0, 0.0, 0.0, "NOMINATION", "NOMMEE", true},

					// ─── 3. INDEMNITÉS SPÉCIFIQUES & CAISSE ───────────────────────────────────
					{"PI-SPEC-CP-CS", "INDEMNITE DE CAISSE", "CAISSIER PRINCIPAL", "", "", 40000.0, 0.0, 0.0, "SPECIFIQUE", "NOMMEE", true},
					{"PI-SPEC-GCP-CP", "INDEMNITE CASH POINT", "GESTIONNAIRE CASH POINT", "", "", 50000.0, 0.0, 0.0, "SPECIFIQUE", "NOMMEE", true},
					{"PI-SPEC-GCP-CS", "PRIME D'ASTREINTE", "GESTIONNAIRE CASH POINT", "", "", 25000.0, 0.0, 0.0, "SPECIFIQUE", "NOMMEE", true},
					{"PI-SPEC-CA-CS", "INDEMNITE CASH POINT", "CAISSIER AUXILIAIRE", "", "", 25000.0, 0.0, 0.0, "SPECIFIQUE", "NOMMEE", true},
					{"PI-SPEC-CHF-AST", "PRIME D'ASTREINTE", "CHAUFFEUR", "", "", 15000.0, 0.0, 0.0, "SPECIFIQUE", "NOMMEE", true},
					{"PI-SPEC-AD-AST", "PRIME D'ASTREINTE", "ASSISTANTE DE DIRECTION", "", "", 30000.0, 0.0, 0.0, "SPECIFIQUE", "NOMMEE", true},
					{"PI-SPEC-AL-AST", "PRIME D'ASTREINTE", "AGENT DE LIAISON", "", "", 15000.0, 0.0, 0.0, "SPECIFIQUE", "NOMMEE", true}
				};

				for (Object[] p : params) {
					String code = (String) p[0];
					String typeIndName = (String) p[1];
					String fctName     = (String) p[2];
					String gradeName   = (String) p[3];
					String catName     = (String) p[4];

					com.bpbf.sirh_backend.entities.ParametrageIndemnite pi = new com.bpbf.sirh_backend.entities.ParametrageIndemnite();
					pi.setCode(code);
					pi.setTypeIndemnite(typeIndName);
					pi.setFonction(fctName);
					pi.setGrade(gradeName);
					pi.setCategorie(catName);
					pi.setTaux((Double) p[5]);
					pi.setTauxExoneration((Double) p[6]);
					pi.setPlafondExoneration((Double) p[7]);
					pi.setRegleType((String) p[8]);
					pi.setTypeNomination((String) p[9]);
					pi.setActif((Boolean) p[10]);

					if (typeIndName != null && !typeIndName.trim().isEmpty()) {
						String tUpper = typeIndName.toUpperCase();
						typeIndemniteRepo.findAll().stream()
							.filter(ti -> {
								String name = (ti.getName() != null ? ti.getName() : "").toUpperCase();
								String tiCode = (ti.getCode() != null ? ti.getCode() : "").toUpperCase();
								return tUpper.equals(name) || tUpper.equals(tiCode) ||
									(tUpper.contains("LOGEMENT") && name.contains("LOGEMENT")) ||
									(tUpper.contains("TRANSPORT") && name.contains("TRANSPORT")) ||
									((tUpper.contains("FONCTION") || tUpper.contains("COMPENSATRICE") || tUpper.contains("RESPONSABILITE")) && name.contains("RESPONSABILITE")) ||
									((tUpper.contains("SUJÉTION") || tUpper.contains("SUJETION") || tUpper.contains("CAISSE") || tUpper.contains("CASH POINT") || tUpper.contains("ASTREINTE")) && (name.contains("SUJÉTION") || name.contains("SUJETION") || name.contains("RISQUE")));
							})
							.findFirst().ifPresent(pi::setTypeIndemniteObj);
					}
					if (fctName != null && !fctName.trim().isEmpty()) {
						String fUpper = fctName.toUpperCase();
						fonctionRepo.findAll().stream()
							.filter(f -> {
								String name = (f.getName() != null ? f.getName() : "").toUpperCase();
								String fCode = (f.getCode() != null ? f.getCode() : "").toUpperCase();
								return fUpper.equals(name) || fUpper.equals(fCode) ||
									(fUpper.contains("DIRECTEUR") && name.contains("DIRECTEUR")) ||
									(fUpper.contains("RESPONSABLE DE DÉPARTEMENT") && name.contains("RESPONSABLE")) ||
									(fUpper.contains("CHEF DE SERVICE") && name.contains("CHEF DE SERVICE")) ||
									(fUpper.contains("AGENCE") && name.contains("AGENCE")) ||
									(fUpper.contains("CAISSIER") && name.contains("CAISSIER")) ||
									(fUpper.contains("CASH POINT") && name.contains("CASH POINT"));
							})
							.findFirst().ifPresent(pi::setFonctionObj);
					}
					if (gradeName != null && !gradeName.trim().isEmpty()) {
						gradeRepo.findAll().stream()
							.filter(g -> gradeName.equalsIgnoreCase(g.getCode()) || gradeName.equalsIgnoreCase(g.getLibelle()))
							.findFirst().ifPresent(pi::setGradeObj);
					}
					if (catName != null && !catName.trim().isEmpty() && !catName.contains(",")) {
						categorieRepo.findAll().stream()
							.filter(c -> catName.equalsIgnoreCase(c.getCode()) || catName.equalsIgnoreCase(c.getLibelle()))
							.findFirst().ifPresent(pi::setCategorieObj);
					}

					indemniteRepo.save(pi);
				}
				System.out.println("Paramétrages d'indemnité BPBF3 (49 indemnités) initialisés dans PostgreSQL. Total: " + indemniteRepo.count());
			} catch (Exception e) {
				System.out.println("ParametrageIndemnite seeding error: " + e.getMessage());
			}

			System.out.println("Default reference data check complete!");
		};
	}
}
