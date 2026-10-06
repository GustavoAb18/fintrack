// Traduz mensagens comuns do Supabase e da rede para português.
export function friendlyError(error: unknown): string {
  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error);
  if (message.includes('Invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (message.includes('User already registered')) {
    return 'Este e-mail já está cadastrado.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }
  if (/network request failed|failed to fetch/i.test(message)) {
    return 'Sem conexão com a internet.';
  }
  if (/rate limit/i.test(message)) {
    return 'Muitas tentativas. Aguarde um instante e tente de novo.';
  }
  return message;
}

// "2026-09-19T14:30:00Z" -> "19/09 às 11:30" (horário local do aparelho).
export function formatDateTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return '';
  const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
  return `${day} às ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}