import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import type { GameState } from '../types'
import { createGame, publicGameState } from '../game/engine'

const storageKey = (id: string) => `5na5:game:${id}`
const activeKey = '5na5:active-game'
const channelName = '5na5:live'
const realtimeTopic = (code: string) => `game-live:${code}`

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
export const isCloudConfigured = Boolean(supabaseUrl && supabaseKey)

let supabase: SupabaseClient | null = null
if (isCloudConfigured) supabase = createClient(supabaseUrl, supabaseKey)

const controllerStates = new Map<string, GameState>()
const controllerChannels = new Map<string, RealtimeChannel>()

async function ensureCloudSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session
  const { data: signedIn, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return signedIn.session
}

function hydrateGame(value: GameState): GameState {
  if (value.final) return value
  const defaults = createGame(value.teams[0].name, value.teams[1].name, value.questionIds)
  return { ...defaults, ...value, final: defaults.final }
}

function broadcast(game: GameState) {
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(channelName)
    channel.postMessage(game)
    channel.close()
  }
  window.dispatchEvent(new CustomEvent('5na5-game', { detail: game }))
}

function sendRealtime(channel: RealtimeChannel, event: string, payload: object) {
  void channel.send({ type: 'broadcast', event, payload }).catch((error) => {
    console.warn('Realtime sync failed:', error)
  })
}

function publishPublicGame(game: GameState) {
  if (!supabase) return
  const code = game.shareCode
  controllerStates.set(code, publicGameState(game))

  const existing = controllerChannels.get(code)
  if (existing) {
    sendRealtime(existing, 'game_state', controllerStates.get(code)!)
    return
  }

  const channel = supabase
    .channel(realtimeTopic(code))
    .on('broadcast', { event: 'request_state' }, () => {
      const latest = controllerStates.get(code)
      if (latest) sendRealtime(channel, 'game_state', latest)
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        const latest = controllerStates.get(code)
        if (latest) sendRealtime(channel, 'game_state', latest)
      }
    })

  controllerChannels.set(code, channel)
}

export function getActiveGameId(): string | null {
  return localStorage.getItem(activeKey)
}

export async function saveGame(game: GameState): Promise<void> {
  localStorage.setItem(storageKey(game.id), JSON.stringify(game))
  localStorage.setItem(activeKey, game.id)
  broadcast(game)
  publishPublicGame(game)

  if (supabase) {
    try { await ensureCloudSession() } catch (error) { console.warn('Cloud sign-in failed:', error) }
    const { error } = await supabase.from('games').upsert({
      id: game.id,
      share_code: game.shareCode,
      private_state: game,
      public_state: publicGameState(game),
      updated_at: game.updatedAt,
    })
    if (error) console.warn('Cloud sync failed:', error.message)
  }
}

export async function loadGame(id: string): Promise<GameState | null> {
  const local = localStorage.getItem(storageKey(id))
  if (local) return hydrateGame(JSON.parse(local) as GameState)
  if (!supabase) return null
  const { data } = await supabase.from('games').select('private_state').eq('id', id).maybeSingle()
  return data?.private_state ? hydrateGame(data.private_state as GameState) : null
}

export async function loadPublicGame(idOrCode: string): Promise<GameState | null> {
  const local = localStorage.getItem(storageKey(idOrCode))
  if (local) return publicGameState(hydrateGame(JSON.parse(local) as GameState))

  const active = getActiveGameId()
  if (active) {
    const candidate = localStorage.getItem(storageKey(active))
    if (candidate) {
      const game = hydrateGame(JSON.parse(candidate) as GameState)
      if (game.id === idOrCode || game.shareCode === idOrCode) return publicGameState(game)
    }
  }

  if (!supabase) return null
  const { data } = await supabase
    .from('games_public')
    .select('public_state')
    .or(`id.eq.${idOrCode},share_code.eq.${idOrCode}`)
    .maybeSingle()
  return (data?.public_state as GameState | undefined) ?? null
}

export function subscribeToLocalGame(callback: (game: GameState) => void): () => void {
  const onCustom = (event: Event) => callback((event as CustomEvent<GameState>).detail)
  window.addEventListener('5na5-game', onCustom)
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(channelName) : null
  if (channel) channel.onmessage = (event) => callback(event.data as GameState)
  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith('5na5:game:') && event.newValue) callback(JSON.parse(event.newValue) as GameState)
  }
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener('5na5-game', onCustom)
    window.removeEventListener('storage', onStorage)
    channel?.close()
  }
}

export function subscribeToCloudGame(gameId: string, callback: (game: GameState) => void): () => void {
  if (!supabase) return () => undefined
  const liveChannel = supabase
    .channel(realtimeTopic(gameId))
    .on('broadcast', { event: 'game_state' }, ({ payload }) => {
      const state = payload as GameState | undefined
      if (state?.id && state.shareCode === gameId) callback(state)
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') sendRealtime(liveChannel, 'request_state', {})
    })

  const databaseChannel = supabase
    .channel(`game-database:${gameId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'games_public', filter: `share_code=eq.${gameId}` }, (payload) => {
      const publicState = (payload.new as { public_state?: GameState }).public_state
      if (publicState) callback(publicState)
    })
    .subscribe()
  return () => {
    void supabase?.removeChannel(liveChannel)
    void supabase?.removeChannel(databaseChannel)
  }
}

export async function getCloudDeviceIdentity(): Promise<string | null> {
  if (!supabase) return null
  try { return (await ensureCloudSession())?.user.id ?? null } catch { return null }
}

export async function createPairingCode(): Promise<string | null> {
  if (!supabase) return null
  await ensureCloudSession()
  const { data, error } = await supabase.rpc('create_pairing_code')
  if (error) throw error
  return data as string
}

export async function claimPairingCode(code: string): Promise<boolean> {
  if (!supabase) return false
  await ensureCloudSession()
  const { data, error } = await supabase.rpc('claim_pairing_code', { p_code: code.trim().toUpperCase() })
  if (error) throw error
  return Boolean(data)
}
