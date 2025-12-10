export function formatCLP(n: number) {
  return `$${Math.round(n).toLocaleString('es-CL')} CLP`;
}

export function roundCLP(n: number) {
  return Math.round(n);
}

export default { formatCLP, roundCLP };
