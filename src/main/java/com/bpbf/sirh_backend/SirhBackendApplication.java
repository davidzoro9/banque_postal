package com.bpbf.sirh_backend;

import com.bpbf.sirh_backend.entities.Utilisateur;
import com.bpbf.sirh_backend.repositories.*;
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
			TypeIndemniteRepository typeIndemniteRepo) {
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
			} catch (Exception e) {
				System.out.println("User davidzorom already exists or skipped: " + e.getMessage());
			}

			try {
				if (repository.findAll().stream().noneMatch(u -> "marie.dupont@entreprise.com".equalsIgnoreCase(u.getEmail()))) {
					Utilisateur admin2 = new Utilisateur();
					admin2.setUsername("marie.dupont");
					admin2.setNom("Dupont");
					admin2.setPrenom("Marie");
					admin2.setEmail("marie.dupont@entreprise.com");
					admin2.setPassword("password123");
					admin2.setRole("ADMIN");
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
				}
			} catch (Exception e) {
				System.out.println("Groupes seeding error: " + e.getMessage());
			}

			// ── Seed Grille Salariale (données officielles BPBF) ──────────────
			try {
				if (grilleRepo.count() < 10) {
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

					for (Object[] cat : grilleBPBF) {
						String catName   = (String) cat[0];
						String classe    = (String) cat[1];
						String echelle   = (String) cat[2];
						double base      = (Double) cat[3];

						for (int ech = 1; ech <= 15; ech++) {
							String echName = String.format("E%02d", ech);
							boolean exists = grilleRepo.findAll().stream()
								.anyMatch(g -> catName.equalsIgnoreCase(g.getCategory())
											&& echName.equalsIgnoreCase(g.getEchellon()));
							if (!exists) {
								com.bpbf.sirh_backend.entities.GrilleSalariale g =
									new com.bpbf.sirh_backend.entities.GrilleSalariale();
								g.setCategory(catName);
								g.setClasse(classe);
								g.setEchelle(echelle);
								g.setEchellon(echName);
								// Progression de 3% par échelon
								double salaire = Math.round(base * Math.pow(1.03, ech - 1));
								g.setBasicSalary(java.math.BigDecimal.valueOf(salaire));
								grilleRepo.save(g);
							}
						}
					}
					System.out.println("Grille salariale BPBF (225 éléments) initialisée. Total: " + grilleRepo.count());
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
				if (indemniteRepo.count() < 5) {
					Object[][] params = {
						{"PAR-LOG", "Indemnité de Logement", "TOUTES", "TOUS", "TOUTES", 20.0, 0.0, 0.0, true},
						{"PAR-TRP", "Indemnité de Transport", "TOUTES", "TOUS", "TOUTES", 10.0, 100.0, 30000.0, true},
						{"PAR-RSP", "Indemnité de Responsabilité", "TOUTES", "TOUS", "TOUTES", 15.0, 0.0, 0.0, true},
						{"PAR-SUT", "Indemnité de Sujétion & Caisse", "Caissier Principal", "TOUS", "TOUTES", 10.0, 100.0, 50000.0, true},
						{"PAR-RIS", "Indemnité de Risque Bancaire", "Analyste Financier / Comptable", "TOUS", "TOUTES", 5.0, 0.0, 0.0, true}
					};

					for (Object[] p : params) {
						String code = (String) p[0];
						boolean exists = indemniteRepo.findAll().stream().anyMatch(pi -> code.equalsIgnoreCase(pi.getCode()));
						if (!exists) {
							com.bpbf.sirh_backend.entities.ParametrageIndemnite pi = new com.bpbf.sirh_backend.entities.ParametrageIndemnite();
							pi.setCode((String) p[0]);
							pi.setTypeIndemnite((String) p[1]);
							pi.setFonction((String) p[2]);
							pi.setGrade((String) p[3]);
							pi.setCategorie((String) p[4]);
							pi.setTaux((Double) p[5]);
							pi.setTauxExoneration((Double) p[6]);
							pi.setPlafondExoneration((Double) p[7]);
							pi.setActif((Boolean) p[8]);
							indemniteRepo.save(pi);
						}
					}
					System.out.println("Paramétrages d'indemnité initialisés dans PostgreSQL. Total: " + indemniteRepo.count());
				}
			} catch (Exception e) {
				System.out.println("ParametrageIndemnite seeding error: " + e.getMessage());
			}

			System.out.println("Default reference data check complete!");
		};
	}
}
