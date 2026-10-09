package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.RibValidationDto;
import com.bpbf.sirh_backend.entities.Banque;
import com.bpbf.sirh_backend.repositories.BanqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RibValidationService {

    private final BanqueRepository banqueRepository;

    private static final Map<String, String> BANQUES_BURKINA = new HashMap<>();

    static {
        BANQUES_BURKINA.put("BF080", "Banque Postale du Burkina Faso (BPBF)");
        BANQUES_BURKINA.put("00080", "Banque Postale du Burkina Faso (BPBF)");
        BANQUES_BURKINA.put("BF083", "Coris Bank International (CBI)");
        BANQUES_BURKINA.put("00083", "Coris Bank International (CBI)");
        BANQUES_BURKINA.put("BF048", "Ecobank Burkina");
        BANQUES_BURKINA.put("00048", "Ecobank Burkina");
        BANQUES_BURKINA.put("BF053", "Bank of Africa Burkina (BOA)");
        BANQUES_BURKINA.put("00053", "Bank of Africa Burkina (BOA)");
        BANQUES_BURKINA.put("BF023", "BICIAB");
        BANQUES_BURKINA.put("00023", "BICIAB");
        BANQUES_BURKINA.put("BF061", "Société Générale Burkina Faso (SGBF)");
        BANQUES_BURKINA.put("00061", "Société Générale Burkina Faso (SGBF)");
        BANQUES_BURKINA.put("BF067", "UBA Burkina");
        BANQUES_BURKINA.put("00067", "UBA Burkina");
        BANQUES_BURKINA.put("BF084", "Wari / Wendkuni Bank International (WBI)");
        BANQUES_BURKINA.put("00084", "Wendkuni Bank International (WBI)");
        BANQUES_BURKINA.put("BF134", "IB Bank Burkina");
        BANQUES_BURKINA.put("00134", "IB Bank Burkina");
        BANQUES_BURKINA.put("BF149", "CBAO Groupe Attijariwafa Bank");
        BANQUES_BURKINA.put("00149", "CBAO Groupe Attijariwafa Bank");
    }

    /**
     * Valide un RIB complet ou extrait les composants pour validation.
     * Accepte le format 24 caractères (BBBBB GGGGG CCCCCCCCCCCC KK)
     * ou IBAN UEMOA 28 caractères (BFxx BBBBB GGGGG CCCCCCCCCCCC KK).
     */
    public RibValidationDto validerRib(String ribComplet) {
        if (ribComplet == null || ribComplet.trim().isEmpty()) {
            return RibValidationDto.builder()
                    .valide(false)
                    .message("Le numéro de RIB ou IBAN est obligatoire.")
                    .build();
        }

        String clean = ribComplet.replaceAll("[\\s\\-_]+", "").toUpperCase();

        // Si format IBAN (ex: BF76BF0800100101234567890123 ou BF7600080...)
        if (clean.startsWith("BF") && clean.length() == 28) {
            clean = clean.substring(4); // Retirer BFxx
        }

        if (clean.length() != 24) {
            return RibValidationDto.builder()
                    .valide(false)
                    .message("Format de RIB invalide. Longueur attendue : 24 caractères (ou 28 avec IBAN BFxx). Longueur reçue : " + clean.length())
                    .build();
        }

        String codeBanque = clean.substring(0, 5);
        String codeGuichet = clean.substring(5, 10);
        String numeroCompte = clean.substring(10, 22);
        String cleFournie = clean.substring(22, 24);

        return validerComposants(codeBanque, codeGuichet, numeroCompte, cleFournie);
    }

    /**
     * Valide les 4 composants du RIB UEMOA.
     */
    public RibValidationDto validerComposants(String codeBanque, String codeGuichet, String numeroCompte, String cleFournie) {
        if (codeBanque == null || codeGuichet == null || numeroCompte == null) {
            return RibValidationDto.builder()
                    .valide(false)
                    .message("Les informations de banque, guichet et compte sont obligatoires.")
                    .build();
        }

        String cleanBq = codeBanque.replaceAll("\\s+", "").toUpperCase();
        String cleanGuichet = codeGuichet.replaceAll("\\s+", "").toUpperCase();
        String cleanCpte = numeroCompte.replaceAll("\\s+", "").toUpperCase();
        String cleanCle = cleFournie != null ? cleFournie.replaceAll("\\s+", "").trim() : "";

        // Compléter le compte sur 12 caractères si nécessaire
        if (cleanCpte.length() < 12) {
            cleanCpte = String.format("%12s", cleanCpte).replace(' ', '0');
        }

        String cleCalculee = calculerCleRib(cleanBq, cleanGuichet, cleanCpte);
        boolean estValide = !cleanCle.isEmpty() && cleanCle.equals(cleCalculee);

        String ribFormate = String.format("%s-%s-%s-%s", cleanBq, cleanGuichet, cleanCpte, cleCalculee);
        String ibanUemoa = calculerIbanUemoa(cleanBq, cleanGuichet, cleanCpte, cleCalculee);

        String nomBanque = null;
        if (banqueRepository != null) {
            Optional<Banque> bOpt = banqueRepository.findByCodeIgnoreCase(cleanBq);
            if (bOpt.isPresent() && bOpt.get().getLibelle() != null) {
                nomBanque = bOpt.get().getLibelle();
            }
        }
        if (nomBanque == null || nomBanque.isBlank()) {
            nomBanque = BANQUES_BURKINA.getOrDefault(cleanBq, "Autre établissement bancaire");
        }

        return RibValidationDto.builder()
                .valide(estValide)
                .codeBanque(cleanBq)
                .codeGuichet(cleanGuichet)
                .numeroCompte(cleanCpte)
                .cleFournie(cleanCle)
                .cleCalculee(cleCalculee)
                .ribFormate(ribFormate)
                .ibanUemoa(ibanUemoa)
                .nomBanque(nomBanque)
                .message(estValide
                        ? "RIB UEMOA conforme et vérifié avec succès (" + nomBanque + ")."
                        : "Clé RIB invalide. Clé saisie: " + cleanCle + ", Clé attendue: " + cleCalculee)
                .build();
    }

    /**
     * Calcule la clé RIB officielle selon la norme bancaire UEMOA :
     * Clé = 97 - ((89 * Banque + 15 * Guichet + 3 * Compte) modulo 97)
     */
    public String calculerCleRib(String codeBanque, String codeGuichet, String numeroCompte) {
        String bqNum = convertirAlphanumeriqueEnChiffres(codeBanque);
        String gchNum = convertirAlphanumeriqueEnChiffres(codeGuichet);
        String cptNum = convertirAlphanumeriqueEnChiffres(numeroCompte);

        try {
            BigInteger b = new BigInteger(bqNum);
            BigInteger g = new BigInteger(gchNum);
            BigInteger c = new BigInteger(cptNum);
            BigInteger mod97 = BigInteger.valueOf(97);

            BigInteger partB = b.multiply(BigInteger.valueOf(89)).mod(mod97);
            BigInteger partG = g.multiply(BigInteger.valueOf(15)).mod(mod97);
            BigInteger partC = c.multiply(BigInteger.valueOf(3)).mod(mod97);

            BigInteger somme = partB.add(partG).add(partC).mod(mod97);
            int cleInt = 97 - somme.intValue();
            if (cleInt == 0) {
                cleInt = 97;
            }
            return String.format("%02d", cleInt);
        } catch (Exception e) {
            return "00";
        }
    }

    /**
     * Conversion standard des lettres en chiffres selon la norme interbancaire AFB / UEMOA.
     */
    public String convertirAlphanumeriqueEnChiffres(String input) {
        if (input == null) return "0";
        StringBuilder sb = new StringBuilder();
        for (char ch : input.toUpperCase().toCharArray()) {
            if (Character.isDigit(ch)) {
                sb.append(ch);
            } else if (Character.isLetter(ch)) {
                sb.append(convertirLettreEnChiffre(ch));
            }
        }
        return sb.length() > 0 ? sb.toString() : "0";
    }

    private char convertirLettreEnChiffre(char c) {
        return switch (c) {
            case 'A', 'J' -> '1';
            case 'B', 'K', 'S' -> '2';
            case 'C', 'L', 'T' -> '3';
            case 'D', 'M', 'U' -> '4';
            case 'E', 'N', 'V' -> '5';
            case 'F', 'O', 'W' -> '6';
            case 'G', 'P', 'X' -> '7';
            case 'H', 'Q', 'Y' -> '8';
            case 'I', 'R', 'Z' -> '9';
            default -> '0';
        };
    }

    /**
     * Génère l'IBAN UEMOA officiel (BF + 2 chiffres de contrôle IBAN + RIB 24 caractères).
     */
    public String calculerIbanUemoa(String banque, String guichet, String compte, String cleRib) {
        String rib24 = (banque + guichet + compte + cleRib).toUpperCase();
        // Calcul checksum IBAN mod 97 : RIB + BF00 (B=11, F=15, 00) => + "111500"
        String bbanConverti = convertirAlphanumeriqueIban(rib24) + "111500";
        BigInteger bi = new BigInteger(bbanConverti);
        int reste = bi.mod(BigInteger.valueOf(97)).intValue();
        int ibanCheck = 98 - reste;
        String ibanCheckStr = String.format("%02d", ibanCheck);
        return "BF" + ibanCheckStr + " " + banque + " " + guichet + " " + compte + " " + cleRib;
    }

    private String convertirAlphanumeriqueIban(String str) {
        StringBuilder sb = new StringBuilder();
        for (char c : str.toCharArray()) {
            if (Character.isDigit(c)) {
                sb.append(c);
            } else if (Character.isLetter(c)) {
                sb.append((int) c - 55); // A=10, B=11, etc.
            }
        }
        return sb.toString();
    }
}
