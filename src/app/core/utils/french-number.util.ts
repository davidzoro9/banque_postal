export function numberToFrenchWords(n: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 
    'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 
    'quatre-vingt-dix'];

  if (n <= 0) return 'Zéro Francs CFA';

  function convertGroup(val: number): string {
    let res = '';
    const h = Math.floor(val / 100);
    const rem = val % 100;

    if (h > 0) {
      if (h === 1) res += 'cent ';
      else res += units[h] + ' cent' + (rem === 0 && h > 1 ? 's ' : ' ');
    }

    if (rem > 0) {
      if (rem < 20) {
        res += units[rem] + ' ';
      } else {
        const t = Math.floor(rem / 10);
        const u = rem % 10;
        if (t === 7) {
          res += 'soixante-' + (u === 1 ? 'et-onze ' : units[10 + u] + ' ');
        } else if (t === 9) {
          res += 'quatre-vingt-' + units[10 + u] + ' ';
        } else {
          if (u === 0) res += tens[t] + (t === 8 ? 's ' : ' ');
          else if (u === 1 && t !== 8) res += tens[t] + ' et un ';
          else res += tens[t] + '-' + units[u] + ' ';
        }
      }
    }
    return res.trim();
  }

  let num = Math.floor(n);
  let res = '';

  const millions = Math.floor(num / 1000000);
  num %= 1000000;
  const thousands = Math.floor(num / 1000);
  const remaining = num % 1000;

  if (millions > 0) {
    res += (millions === 1 ? 'un million ' : convertGroup(millions) + ' millions ');
  }
  if (thousands > 0) {
    res += (thousands === 1 ? 'mille ' : convertGroup(thousands) + ' mille ');
  }
  if (remaining > 0) {
    res += convertGroup(remaining) + ' ';
  }

  res = res.trim();
  if (res.length > 0) {
    res = res.charAt(0).toUpperCase() + res.slice(1) + ' Francs CFA';
  }
  return res;
}
