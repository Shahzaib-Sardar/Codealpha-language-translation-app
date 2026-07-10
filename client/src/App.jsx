import React, {useState} from 'react'
import './App.css'

const LANGS = [
  { code: 'en', name: 'English' },
  { code: 'ur', name: 'Urdu' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' }
]

export default function App(){
  const [source, setSource] = useState('auto')
  const [target, setTarget] = useState('en')
  const [text, setText] = useState('')
  const [translated, setTranslated] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  async function handleTranslate(){
    setError(null)
    if(!text.trim()){
      setError('Enter text to translate')
      return
    }
    if(target === source){
      setError('Source and target languages must differ')
      return
    }
    setLoading(true)
    try{
      const res = await fetch(`${apiBase}/translate`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ text, sourceLang: source, targetLang: target })
      })
      const data = await res.json()
      if(!res.ok){
        setError(data.error || 'Translation failed')
        setTranslated('')
      }else{
        setTranslated(data.translatedText || '')
      }
    }catch(err){
      setError('Network or server error')
      setTranslated('')
    }finally{
      setLoading(false)
    }
  }

  function swap(){
    const s = source === 'auto' ? 'en' : source
    setSource(target)
    setTarget(s)
    setTranslated('')
  }

  function copy(){
    if(!translated) return
    navigator.clipboard.writeText(translated)
  }

  function speak(){
    const txt = translated || text
    if(!txt) return
    const u = new SpeechSynthesisUtterance(txt)
    u.lang = target || 'en'
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
  }

  return (
    <div className="app">
      <h1>Language Translation Tool</h1>

      <div className="row">
        <label>Source</label>
        <select value={source} onChange={e=>setSource(e.target.value)}>
          <option value="auto">Detect language (auto)</option>
          {LANGS.map(l=> <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <label>Target</label>
        <select value={target} onChange={e=>setTarget(e.target.value)}>
          {LANGS.map(l=> <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>

      <label>Text to translate</label>
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} />

      <div className="controls">
        <button onClick={handleTranslate} disabled={loading}>{loading? 'Translating...':'Translate'}</button>
        <button onClick={swap}>Swap languages</button>
      </div>

      {error && <div className="error">{error}</div>}

      <label>Translated text</label>
      <div className="outputRow">
        <textarea readOnly value={translated} rows={6} />
        <div className="outputButtons">
          <button onClick={copy} title="Copy">Copy</button>
          <button onClick={speak} title="Speak">Speak</button>
        </div>
      </div>
    </div>
  )
}
