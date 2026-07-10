const express = require('express')
const axios = require('axios')

const router = express.Router()

// Allowed languages (codes) - include requested set
const ALLOWED = {
  en: 'English', ur: 'Urdu', fr: 'French', es: 'Spanish', de: 'German', ar: 'Arabic', zh: 'Chinese'
}

// Use MyMemory Translation API (public, GET)
router.post('/', async (req, res) => {
  try{
    const { text, sourceLang, targetLang } = req.body || {}
    if(!text || typeof text !== 'string' || text.trim().length === 0){
      return res.status(400).json({error: 'Text is required'})
    }
    if(!targetLang || !ALLOWED[targetLang]){
      return res.status(400).json({error: 'Invalid target language'})
    }
    // MyMemory expects explicit source and target codes (no 'auto'). If source is 'auto', default to 'en'
    const src = (!sourceLang || sourceLang === 'auto') ? 'en' : sourceLang

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(src)}|${encodeURIComponent(targetLang)}`

    const response = await axios.get(url, { timeout: 10000 })
    // MyMemory places translated text at response.data.responseData.translatedText
    const translatedText = response.data && response.data.responseData && response.data.responseData.translatedText
    if(!translatedText){
      console.error('Provider returned unexpected body:', response.data)
      return res.status(500).json({ error: 'Translation provider returned unexpected response' })
    }
    return res.json({ translatedText })
  }catch(err){
    console.error('Translate error:', err.message || err)
    // Keep same error structure: return 500 for provider errors
    return res.status(500).json({ error: 'Translation failed' })
  }
})

module.exports = router
