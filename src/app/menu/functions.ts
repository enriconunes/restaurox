// funcao que recebe um exadecimal e o retorna mais 'escurecido'
// amount simboliza o nivel de 'ecurecimento'
export function darkenColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const rgb = parseInt(hex, 16);
  const r = Math.max(0, (rgb >> 16) - amount);
  const g = Math.max(0, ((rgb >> 8) & 0x00FF) - amount);
  const b = Math.max(0, (rgb & 0x0000FF) - amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}