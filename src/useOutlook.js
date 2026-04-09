import { useState, useEffect } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './authConfig'

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    // ↓ NOUVEAU : balises de bloc → saut de ligne AVANT d'enlever les balises
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    // ↓ Reste pareil
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    // ↓ NOUVEAU : nettoyer les espaces en trop sur chaque ligne
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .trim()
}

const msalInstance = new PublicClientApplication(msalConfig)
let initialized = false

export function useOutlook() {
  const [account, setAccount] = useState(null)
  const [courriels, setCourriels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function init() {
    if (!initialized) {
      await msalInstance.initialize()
      initialized = true
      const result = await msalInstance.handleRedirectPromise()
      if (result && result.account) {
        setAccount(result.account)
        await chargerCourriels(result.account)
      } else {
        const accounts = msalInstance.getAllAccounts()
        if (accounts.length > 0) {
          setAccount(accounts[0])
          await chargerCourriels(accounts[0])
        }
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  async function connecter() {
    try {
      setLoading(true)
      setError(null)
      await msalInstance.loginRedirect({
        scopes: ['openid', 'profile', 'email', 'Mail.Read', 'User.Read'],
        prompt: 'select_account',
      })
    } catch (e) {
      console.error('Erreur connexion:', e)
      setError('Erreur: ' + e.message)
      setLoading(false)
    }
  }

  async function chargerCourriels(acc) {
    try {
      setLoading(true)
      const tokenResult = await msalInstance.acquireTokenSilent({
        scopes: ['Mail.Read'],
        account: acc,
      })

      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/messages?$top=50&$orderby=receivedDateTime desc&$select=id,subject,from,receivedDateTime,bodyPreview,body',
        {
          headers: {
            Authorization: 'Bearer ' + tokenResult.accessToken,
          },
        }
      )

      const data = await response.json()

      if (data.error) {
        setError('Erreur API: ' + data.error.message)
        return
      }

    const filtered = (data.value || []).filter(function(m) {
  const bodyTexte = stripHtml(m.body ? m.body.content : '')
  const estFormulaire = bodyTexte.includes('Monsieur Electro Services Inc. a reçu un nouveau message')
  const estReply = m.subject && (
    m.subject.toLowerCase().startsWith('re:') ||
    m.subject.toLowerCase().startsWith('rép:') ||
    m.subject.toLowerCase().startsWith('réponse:')
  )
  return estFormulaire && !estReply
})

      const enriched = filtered.map(function(m) {
        return {
          ...m,
          bodyTexte: stripHtml(m.body ? m.body.content : ''),
        }
      })

      setCourriels(enriched)

    } catch (e) {
      console.error('Erreur courriels:', e)
      setError('Erreur chargement: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function deconnecter() {
    await msalInstance.logoutRedirect()
    setAccount(null)
    setCourriels([])
  }

  return {
    account, courriels, loading, error,
    connecter, deconnecter,
    chargerCourriels: () => chargerCourriels(account)
  }
}