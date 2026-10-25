/**
 * Cache memoire simple (TTL) pour les reponses publiques.
 * Evite de relancer des requetes DB lentes (base distante) a chaque appel.
 */

const cache = new Map()

export async function cached(key, ttlSeconds, loader) {
    const now = Date.now()
    const existing = cache.get(key)

    // Requete deja en cours : on partage la promesse (anti "thundering herd")
    if (existing?.promise) return existing.promise
    if (existing && existing.expires > now) return existing.value

    const promise = loader().then((value) => {
        cache.set(key, { value, expires: Date.now() + ttlSeconds * 1000, promise: null })
        return value
    })

    cache.set(key, { promise, expires: 0, value: null })

    try {
        return await promise
    } catch (error) {
        cache.delete(key)
        throw error
    }
}

export function invalidateCache(prefix) {
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) cache.delete(key)
    }
}

// Nettoyage periodique : evite une Map qui grossit sans fin
const cleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of cache.entries()) {
        if (!entry.promise && entry.expires && entry.expires <= now) cache.delete(key)
    }
}, 60_000)

// Ne bloque pas l'arret du process (build, tests)
cleanup.unref?.()