import { supabase } from '@/lib/supabase';
import type { BankConnection, SyncResult } from '@/types';
import { invokeFunction } from './functions';

export async function listConnections(): Promise<BankConnection[]> {
  const { data, error } = await supabase
    .from('bank_connections')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BankConnection[];
}

// Pede ao servidor um Connect Token (o segredo do Pluggy nunca fica no app).
export async function requestConnectToken(redirectUri: string): Promise<string> {
  const data = await invokeFunction<{ connect_token: string }>('bank-connect-token', {
    redirect_uri: redirectUri,
  });
  return data.connect_token;
}

export function syncConnection(itemId: string): Promise<SyncResult> {
  return invokeFunction<SyncResult>('bank-sync', { item_id: itemId });
}

export async function disconnectBank(connectionId: string): Promise<void> {
  await invokeFunction('bank-disconnect', { connection_id: connectionId });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  disconnectBank,
  listConnections,
  requestConnectToken,
  syncConnection,
} from '@/services/banks';
export function useBankConnections() {
  return useQuery({ queryKey: ['banks'], queryFn: listConnections });
}

// Cada abertura do widget precisa de um token novo (vale 30 min e é de uso único).
export function useConnectToken(redirectUri: string) {
  return useQuery({
    queryKey: ['bank-connect-token'],
    queryFn: () => requestConnectToken(redirectUri),
    gcTime: 0,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// Depois de importar, as conexões e TODAS as listas de lançamentos mudam.
function useRefreshAfter() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['banks'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };
}

export function useSyncBank() {
  const refresh = useRefreshAfter();
  return useMutation({
    mutationFn: (itemId: string) => syncConnection(itemId),
    onSettled: refresh,
  });
}

export function useDisconnectBank() {
  const refresh = useRefreshAfter();
  return useMutation({
    mutationFn: (connectionId: string) => disconnectBank(connectionId),
    onSuccess: refresh,
  });
}