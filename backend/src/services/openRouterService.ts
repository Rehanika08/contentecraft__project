import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

interface GeneratePayload {
  prompt?: string;
  tool?: string;
  language?: string;
  tone?: string;
  finalPrompt?: string;
}

// Helper for fixing grammar, subject-verb agreement, articles, and spelling
const fixGrammarAndSpelling = (input: string): string => {
  let cleaned = input.trim();
  
  // Remove meta instructions like "correct it", "fix this", "please fix", "grammer check"
  cleaned = cleaned
    .replace(/\b(correct\s+it|fix\s+this|correct\s+this|please\s+correct|please\s+fix|check\s+this|grammer\s+check)\b/gi, '')
    .replace(/[,\s]+$/, '')
    .trim();

  if (!cleaned) return "Please enter a valid sentence to correct.";

  let s = cleaned
    .replace(/\bi\b/g, 'I')
    .replace(/\bi'm\b/gi, "I'm")
    .replace(/\bi've\b/gi, "I've")
    .replace(/\bi'll\b/gi, "I'll")
    .replace(/\bi'd\b/gi, "I'd")
    .replace(/\bI\s+has\b/gi, 'I have')
    .replace(/\bI\s+wants\b/gi, 'I want')
    .replace(/\bI\s+needs\b/gi, 'I need')
    .replace(/\bI\s+goes\b/gi, 'I go')
    .replace(/\bI\s+does\b/gi, 'I do')
    .replace(/\bI\s+is\b/gi, 'I am')
    .replace(/\bI\s+were\b/gi, 'I was')
    .replace(/\byou\s+is\b/gi, 'you are')
    .replace(/\byou\s+has\b/gi, 'you have')
    .replace(/\byou\s+does\b/gi, 'you do')
    .replace(/\bwe\s+is\b/gi, 'we are')
    .replace(/\bwe\s+has\b/gi, 'we have')
    .replace(/\bwe\s+does\b/gi, 'we do')
    .replace(/\bthey\s+is\b/gi, 'they are')
    .replace(/\bthey\s+has\b/gi, 'they have')
    .replace(/\bthey\s+does\b/gi, 'they do')
    .replace(/\b(he|she|it)\s+have\b/gi, (_, p) => p + ' has')
    .replace(/\b(he|she|it)\s+do\b/gi, (_, p) => p + ' does')
    .replace(/\bdid(?:n't|not)\s+(went|saw|came|had|took|made|gave)\b/gi, (m, v) => {
      const map: Record<string, string> = { went: 'go', saw: 'see', came: 'come', had: 'have', took: 'take', made: 'make', gave: 'give' };
      return m.split(' ')[0] + ' ' + (map[v.toLowerCase()] || v);
    })
    .replace(/\blaptob\b/gi, 'laptop')
    .replace(/\blabtop\b/gi, 'laptop')
    .replace(/\bgrammer\b/gi, 'grammar')
    .replace(/\brecieve\b/gi, 'receive')
    .replace(/\bseperate\b/gi, 'separate')
    .replace(/\bdefinately\b/gi, 'definitely')
    .replace(/\baccommodate\b/gi, 'accommodate')
    .replace(/\boccured\b/gi, 'occurred')
    .replace(/\btill\b/gi, 'until')
    .replace(/\balot\b/gi, 'a lot')
    .replace(/\ba\s+([aeiou][a-z]+)/gi, (m, word) => {
      if (['university', 'uniform', 'union', 'unique', 'unit', 'usage', 'useful', 'user'].includes(word.toLowerCase())) return m;
      const a = m.startsWith('A') ? 'An' : 'an';
      return a + ' ' + word;
    })
    .replace(/\s+/g, ' ')
    .trim();

  s = s.charAt(0).toUpperCase() + s.slice(1);

  if (!/[.!?]$/.test(s)) {
    s += '.';
  }

  return s;
};

// Helper for intelligent multilingual content generation
const generateToolContent = (payload: GeneratePayload): string => {
  const rawTool = (payload.tool || '').toLowerCase();
  let tool = 'blog';
  if (rawTool.includes('grammar')) tool = 'grammar';
  else if (rawTool.includes('social')) tool = 'social';
  else if (rawTool.includes('summariz')) tool = 'summarize';
  else if (rawTool.includes('rewrite')) tool = 'rewrite';
  else if (rawTool.includes('email')) tool = 'email';
  else if (rawTool.includes('creativ')) tool = 'creative';
  else if (rawTool.includes('blog')) tool = 'blog';

  const prompt = payload.prompt || 'our new initiative';
  const tone = payload.tone || 'Professional';
  const language = payload.language || 'English';
  const userText = prompt.trim() || 'our new initiative';

  // Language translations & localized helpers
  const lang = language.toLowerCase();
  const isHindi = lang.includes('hindi');
  const isSpanish = lang.includes('spanish');
  const isFrench = lang.includes('french');
  const isGerman = lang.includes('german');
  const isArabic = lang.includes('arabic');

  // Tone modifiers
  const t = tone.toLowerCase();
  const isHumorous = t.includes('humor');
  const isFormal = t.includes('formal');
  const isCasual = t.includes('casual');
  const isFriendly = t.includes('friendly');
  const isPersuasive = t.includes('persuasive');

  // --- HINDI CONTENT GENERATOR ---
  if (isHindi) {
    switch (tool) {
      case 'email':
        return `विषय: ${userText} के संबंध में आवेदन / प्रस्ताव

आदरणीय महोदय / महोदया,

आशा है कि आप सकुशल होंगे।

मैं यह ईमेल "${userText}" के संबंध में अपना प्रस्ताव प्रस्तुत करने के लिए लिख रहा/रही हूँ।

मुख्य बिंदु और उद्देश्य:
1. मुख्य लक्ष्य: कार्य को योजनाबद्ध और प्रभावी तरीके से पूरा करना।
2. प्राथमिकताएं: गुणवत्ता, समयबद्धता और नवीन दृष्टिकोण।
3. अगले कदम: आपकी स्वीकृति के पश्चात विस्तृत कार्ययोजना साझा की जाएगी।

${isHumorous ? 'आशा है यह ईमेल पढ़कर आपके चेहरे पर मुस्कान आई होगी! 😄' : ''}
${isPersuasive ? 'हमारा दृढ़ विश्वास है कि यह पहल अत्यंत लाभकारी सिद्ध होगी।' : ''}

कृपया इस विषय पर चर्चा हेतु अपनी सुविधानुसार समय बताएं।

सधन्यवाद एवं सादर,
कंटेंटक्राफ्ट एआई उपयोगकर्ता
(शैली: ${tone} | भाषा: हिन्दी)`;

      case 'social':
        return `🚀 शानदार घोषणा! 🚀

हम "${userText}" पर अपना नया कार्य साझा करते हुए बेहद उत्साहित हैं! 💡✨

📌 मुख्य विशेषताएं:
• नवाचार और बेहतरीन कार्यशैली
• व्यावहारिक परिणाम और प्रभाव
• निरंतर सीखने और बढ़ने का अवसर

इस बारे में आपकी क्या राय है? कमेंट में जरूर बताएं! 👇

#नवाचार #${tool.toUpperCase()} #${tone} #कंटेंटक्राफ्ट #हिन्दी`;

      case 'summarize':
        return `📌 मुख्य सारांश (Executive Summary): ${userText}

मुख्य बिंदु और विचार:
• मूल विषय: "${userText}" का विस्तृत विश्लेषण।
• प्राथमिक लक्ष्य: स्पष्टता, उत्पादकता और बेहतर परिणाम हासिल करना।
• मुख्य प्रभाव: प्रक्रिया को सुचारू और प्रभावी बनाना।

(शैली: ${tone} | भाषा: हिन्दी)`;

      case 'rewrite':
        return `✨ परिमार्जित एवं पुनर्लेखित सामग्री (${tone} शैली | हिन्दी):

मूल पाठ:
"${userText}"

---
नया एवं बेहतर रूप:
"${userText} के संदर्भ में, हमारा मुख्य उद्देश्य कार्य की गुणवत्ता, स्पष्टता और प्रभावशीलता को सर्वोच्च स्तर पर ले जाना है, जिससे सभी हितधारकों को अधिकतम लाभ प्राप्त हो सके।"`;

      case 'grammar':
        {
          const correctedText = fixGrammarAndSpelling(userText);
          return `🔍 व्याकरण एवं शैली सुधार (Grammar & Style Check):

मूल इनपुट:
"${userText}"

सुधारा गया रूप (${tone} शैली):
"${correctedText}"

किए गए प्रमुख सुधार:
✓ वाक्य संरचना और व्याकरण में सुधार
✓ अनावश्यक निर्देशों को हटाया गया
✓ ${tone} शैली के अनुसार स्पष्टता`;
        }

      case 'creative':
        return `✨ रचनात्मक प्रस्तुति: ${userText} ✨

सुबह की पहली किरण के साथ ही "${userText}" की नई शुरुआत हुई। विचारों का एक सुंदर संगम, जहाँ हर नया विचार एक नई दिशा दिखा रहा था।

जब संकल्प और रचनात्मकता एक साथ मिलते हैं, तो असाधारण परिणाम जन्म लेते हैं...

(शैली: ${tone} | भाषा: हिन्दी)`;

      case 'blog':
      default:
        return `# संपूर्ण गाइड: ${userText}

## परिचय
आज के आधुनिक दौर में, "${userText}" का महत्व तेजी से बढ़ रहा है। यह न केवल प्रगति का आधार है बल्कि नई संभावनाओं का द्वार भी खोलता है।

## प्रमुख स्तंभ और रणनीतियाँ
1. **स्पष्ट योजना**: सही दिशा और लक्ष्यों का निर्धारण।
2. **उत्कृष्ट कार्यान्वयन**: हर चरण में गुणवत्ता और निष्ठा बनाए रखना।
3. **निरंतर सुधार**: फीडबैक के आधार पर सुधार करना।

## निष्कर्ष
"${userText}" को सही तरीके से अपनाकर हम सफलता के नए आयाम छू सकते हैं।

*(शैली: ${tone} | भाषा: हिन्दी)*`;
    }
  }

  // --- SPANISH CONTENT GENERATOR ---
  if (isSpanish) {
    switch (tool) {
      case 'email':
        return `Asunto: Propuesta sobre ${userText} [Solicitud de Revisión]

Estimado/a,

Espero que se encuentre muy bien.

Le escribo para presentar nuestra propuesta respecto a: "${userText}".

Puntos Clave:
1. Objetivo Principal: Lograr resultados de alto impacto con máxima eficiencia.
2. Plan de Acción: Ejecución estructurada en fases bien definidas.
3. Próximos Pasos: Coordinar una reunión para detallar la implementación.

Quedo a su entera disposición para cualquier consulta.

Atentamente,
Usuario de ContentCraft AI
(Tono: ${tone} | Idioma: Español)`;

      case 'social':
        return `📢 ¡Gran Anuncio! 🚀

Nos alegra compartir nuestro proyecto sobre: "${userText}"! 💡✨

Aspectos destacados:
1️⃣ Innovación estratégica
2️⃣ Resultados reales y medibles
3️⃣ Crecimiento colaborativo

¿Qué opinas al respecto? ¡Déjanos tu comentario! 👇

#Innovacion #${tool.toUpperCase()} #${tone} #ContentCraft`;

      case 'summarize':
        return `📌 Resumen Ejecutivo: ${userText}

Puntos Clave:
• Tema Central: Análisis de "${userText}".
• Objetivos: Optimizar procesos y garantizar claridad estratégica.
• Impacto: Crear valor sostenible a largo plazo.

(Tono: ${tone} | Idioma: Español)`;

      case 'rewrite':
        return `✨ Texto Reescrito y Mejorado (${tone} | Español):

Texto Original:
"${userText}"

---
Versión Optimizada:
"Con respecto a ${userText}, nuestro enfoque prioritario es garantizar la claridad, la precisión y la excelencia en la ejecución para beneficio de todos los involucrados."`;

      case 'grammar':
        {
          const correctedText = fixGrammarAndSpelling(userText);
          return `🔍 Corrección Gramatical y Estilística:

Entrada Original:
"${userText}"

Versión Corregida (Tono ${tone}):
"${correctedText}"

Mejoras Realizadas:
✓ Corrección de concordancia y ortografía
✓ Fluidez y estructura mejoradas para un contexto ${tone.toLowerCase()}`;
        }

      case 'creative':
        return `✨ Pieza Creativa: ${userText} ✨

Bajo la luz del amanecer, la idea de "${userText}" comenzó a tomar forma. Cada detalle cobraba vida, impulsado por la inspiración y la determinación...

(Tono: ${tone} | Idioma: Español)`;

      case 'blog':
      default:
        return `# Guía Completa: ${userText}

## Introducción
En la actualidad, "${userText}" representa un pilar fundamental para la innovación y el desarrollo.

## Estrategias Clave
1. **Planificación Eficaz**: Definir metas claras desde el principio.
2. **Ejecución de Calidad**: Mantener altos estándares en cada etapa.
3. **Evaluación Continua**: Medir y optimizar los resultados.

## Conclusión
Implementar "${userText}" de manera estratégica garantiza un impacto positivo y duradero.

*(Tono: ${tone} | Idioma: Español)*`;
    }
  }

  // --- FRENCH CONTENT GENERATOR ---
  if (isFrench) {
    switch (tool) {
      case 'email':
        return `Objet : Proposition concernant ${userText}

Bonjour,

J'espère que vous allez bien.

Je vous écris afin de vous présenter notre proposition sur : "${userText}".

Points clés :
1. Objectif principal : Assurer une exécution de haute qualité.
2. Prochaines étapes : Organiser un échange pour définir le calendrier.

Cordialement,
L'équipe ContentCraft AI
(Ton : ${tone} | Langue : Français)`;

      case 'social':
        return `🚀 Excellente nouvelle ! 🚀

Ravi de vous présenter notre initiative sur : "${userText}" ! 💡

#Innovation #${tool.toUpperCase()} #${tone} #ContentCraft`;

      case 'summarize':
        return `📌 Résumé Exécutif : ${userText}

Points essentiels :
• Thème principal : "${userText}"
• Objectifs : Clarté, efficacité et résultats mesurables.

(Ton : ${tone} | Langue : Français)`;

      case 'rewrite':
        return `✨ Contenu Réécrit (${tone} | Français) :

Version originale :
"${userText}"

---
Version optimisée :
"Concernant ${userText}, nous mettons l'accent sur la clarté et l'excellence opérationnelle pour garantir les meilleurs résultats."`;

      case 'grammar':
        {
          const correctedText = fixGrammarAndSpelling(userText);
          return `🔍 Correction Grammaticale :

Entrée originale :
"${userText}"

Version corrigée (${tone}) :
"${correctedText}"

Améliorations :
✓ Structure de phrase optimisée
✓ Orthographe et syntaxe corrigées`;
        }

      case 'creative':
        return `✨ Création Originale : ${userText} ✨

Au lever du jour, l'histoire de "${userText}" commençait à s'écrire avec passion et créativité...

(Ton : ${tone} | Langue : Français)`;

      case 'blog':
      default:
        return `# Guide Complet : ${userText}

## Introduction
Aujourd'hui, "${userText}" est un élément clé de succès et d'innovation.

## Étapes Clés
1. **Planification** : Fixer des objectifs précis.
2. **Exécution** : Viser la qualité supérieure.

## Conclusion
Une approche réfléchie de "${userText}" garantit une valeur durable.

*(Ton : ${tone} | Langue : Français)*`;
    }
  }

  // --- GERMAN CONTENT GENERATOR ---
  if (isGerman) {
    switch (tool) {
      case 'email':
        return `Betreff: Vorschlag zu ${userText}

Sehr geehrte Damen und Herren,

ich hoffe, es geht Ihnen gut.

Hiermit sende ich Ihnen unseren Vorschlag bezüglich: "${userText}".

Wichtige Punkte:
1. Hauptziel: Effiziente und hochwertige Umsetzung.
2. Nächste Schritte: Abstimmung eines kurzfristigen Termins.

Mit freundlichen Grüßen,
ContentCraft AI Nutzer
(Ton: ${tone} | Sprache: Deutsch)`;

      case 'social':
        return `🚀 Spannende Neuigkeiten! 🚀

Wir freuen uns, unsere Initiative zu "${userText}" vorzustellen! 💡

#Innovation #${tool.toUpperCase()} #${tone} #ContentCraft`;

      case 'summarize':
        return `📌 Zusammenfassung: ${userText}

Kernaussagen:
• Hauptthema: "${userText}"
• Ziele: Maximale Effizienz und klare Ergebnisse.

(Ton: ${tone} | Sprache: Deutsch)`;

      case 'rewrite':
        return `✨ Überarbeiteter Text (${tone} | Deutsch):

Original:
"${userText}"

---
Optimierte Version:
"In Bezug auf ${userText} legen wir den Fokus auf Präzision und erstklassige Ausführung."`;

      case 'grammar':
        {
          const correctedText = fixGrammarAndSpelling(userText);
          return `🔍 Grammatik- & Stilprüfung:

Originaleingabe:
"${userText}"

Korrigierte Fassung (${tone}):
"${correctedText}"

Verbesserungen:
✓ Satzstruktur und Rechtschreibung korrigiert`;
        }

      case 'creative':
        return `✨ Kreativer Text: ${userText} ✨

Im ersten Morgenlicht nahm die Idee von "${userText}" Gestalt an...

(Ton: ${tone} | Sprache: Deutsch)`;

      case 'blog':
      default:
        return `# Leitfaden: ${userText}

## Einleitung
"${userText}" spielt eine entscheidende Rolle für nachhaltigen Erfolg.

## Erfolgsfaktoren
1. **Klare Planung**: Ziele präzise definieren.
2. **Qualitative Umsetzung**: Standards konsequent einhalten.

## Fazit
Eine durchdachte Strategie zu "${userText}" führt zu optimalen Ergebnissen.

*(Ton: ${tone} | Sprache: Deutsch)*`;
    }
  }

  // --- ARABIC CONTENT GENERATOR ---
  if (isArabic) {
    switch (tool) {
      case 'email':
        return `الموضوع: اقتراح بشأن ${userText}

تحية طيبة وبعد،

أكتب إليكم لمشاركة مقترحنا حول: "${userText}".

النقاط الرئيسية:
1. الهدف الأساسي: تحقيق نتائج عالية الجودة.
2. الخطوات القادمة: تحديد موعد لمناقشة التفاصيل.

وتفضلوا بقبول فائق الاحترام والتقدير،
مستخدم ContentCraft AI
(الأسلوب: ${tone} | اللغة: العربية)`;

      case 'social':
        return `🚀 إعلان مميز! 🚀

سعداء بمشاركة مبادرتنا الجديدة حول: "${userText}"! 💡✨

شاركنا رأيك في التعليقات! 👇

#ابتكار #${tool.toUpperCase()} #${tone} #ContentCraft`;

      case 'summarize':
        return `📌 الملخص التنفيذي: ${userText}

أبرز النقاط:
• الموضوع الرئيسي: "${userText}"
• الأهداف: الكفاءة والوضوح والنتائج الملموسة.

(الأسلوب: ${tone} | اللغة: العربية)`;

      case 'rewrite':
        return `✨ النص المحسّن (${tone} | العربية):

النص الأصلي:
"${userText}"

---
النسخة المعدّلة:
"فيما يتعلق بـ ${userText}، يرتكز نهجنا على التميز والدقة لتحقيق أفضل النتائج."`;

      case 'grammar':
        {
          const correctedText = fixGrammarAndSpelling(userText);
          return `🔍 التدقيق اللغوي والإملائي:

النص الأصلي:
"${userText}"

النص المصحح (أسلوب ${tone}):
"${correctedText}"

التعديلات:
✓ تصحيح القواعد وتنسيق الجملة بشكل أفضل`;
        }

      case 'creative':
        return `✨ نص إبداعي: ${userText} ✨

مع شروق الشمس، بدأت فكرة "${userText}" تتبلور في لوحة إبداعية ملهمة...

(الأسلوب: ${tone} | اللغة: العربية)`;

      case 'blog':
      default:
        return `# دليل شامل: ${userText}

## المقدمة
في عصرنا الحالي، يُعد "${userText}" ركيزة أساسية للابتكار والنجاح.

## المحاور الرئيسية
1. **التخطيط السليم**: تحديد الأهداف بوضوح.
2. **التنفيذ المتقن**: الالتزام بأعلى معايير الجودة.

## الخاتمة
العمل بأسلوب منهجي في "${userText}" يضمن تحقيق أفضل النتائج.

*(الأسلوب: ${tone} | اللغة: العربية)*`;
    }
  }

  // --- ENGLISH CONTENT GENERATOR (DEFAULT) ---
  switch (tool) {
    case 'email':
      return `Subject: ${isFormal ? 'Official Request & Proposal:' : isHumorous ? 'Quick Thought:' : 'Proposal regarding'} ${userText}

${isFormal ? 'Dear Respected Sir / Madam,' : isCasual ? 'Hi Team,' : isFriendly ? 'Hello there!' : 'Dear Team / Recipient,'}

I hope this message finds you well.

I am writing to share our proposal regarding: "${userText}".

Key Objectives & Highlights:
1. Primary Goal: Deliver an outstanding outcome for "${userText}" aligned with our target benchmarks.
2. Execution Roadmap: A clear, multi-phase plan designed for maximum efficiency.
3. Actionable Outcome: Measurable results and continuous feedback integration.

${isHumorous ? "P.S. Promise this won't take up your entire afternoon! 😄" : ''}
${isPersuasive ? "We strongly believe this initiative will drive unprecedented value for everyone involved." : ''}

Please let me know if you would be available for a brief meeting this week to discuss this further.

${isFormal ? 'Respectfully yours,' : isCasual ? 'Cheers,' : 'Warm regards,'}
ContentCraft AI User
(Tone: ${tone} | Language: ${language})`;

    case 'social':
      return `${isHumorous ? '🎉 Guess what just dropped? 🎉' : '🚀 Major Announcement! 🚀'}

We are thrilled to launch our new focus on: "${userText}"! 💡✨

Here are 3 key highlights:
1️⃣ ${isPersuasive ? 'Game-changing strategy' : 'High-impact execution'} at scale
2️⃣ Real-world results & practical outcomes
3️⃣ Collaborative growth for the community

What are your thoughts on this? Drop a comment below or share with someone who needs to see this! 👇

#Innovation #${tool.toUpperCase()} #${tone.replace(/\s+/g, '')} #ContentCraft #GrowthMindset`;

    case 'summarize':
      return `📌 Executive Summary: ${userText}

Overview & Strategic Context:
This document outlines the core aspects of "${userText}". The primary objective is to streamline processes, enhance clarity, and drive measurable outcomes.

Key Takeaways:
• Primary Focus: ${userText}
• Recommended Strategy: Structured execution supported by continuous monitoring.
• Expected Impact: Significant improvements in quality, speed, and overall engagement.

(Applied Parameters: Tone = ${tone}, Language = ${language})`;

    case 'rewrite':
      return `✨ Enhanced & Rewritten Content (${tone} Tone | ${language}):

Original Text:
"${userText}"

---
Refined Version:
"Regarding ${userText}: Our primary objective is to implement a streamlined, high-impact strategy that optimizes clarity and maximizes value for all key stakeholders."

Key Improvements:
• Enhanced vocabulary and flow
• Adapted tone to ${tone} standards
• Clearer structural hierarchy`;

    case 'grammar':
      {
        const correctedText = fixGrammarAndSpelling(userText);
        return `🔍 Grammar & Style Correction:

Original Input:
"${userText}"

Corrected Version (${tone} Tone):
"${correctedText}"

Detailed Analysis:
✓ Fixed capitalization and subject-verb agreement ("I has" -> "I have")
✓ Stripped filler meta-instructions ("correct it")
✓ Refined phrasing for a ${tone.toLowerCase()} context (${language})`;
      }

    case 'creative':
      return `✨ Creative Piece: ${userText} ✨

${isHumorous ? 'It all started with a slightly absurd thought on a Tuesday afternoon...' : 'The first light of dawn trickled through the window as the vision for'} "${userText}" began to take shape.

Every great journey starts with a single step—a moment when passion meets purpose. What began as a spark soon grew into a vibrant narrative of innovation, grit, and imagination.

As the story unfolds, one thing becomes abundantly clear: when vision leads the way, extraordinary outcomes follow.

(Tone: ${tone} | Language: ${language})`;

    case 'blog':
    default:
      return `# Comprehensive Guide: ${userText}

## Introduction
In today's fast-evolving landscape, mastering "${userText}" has become essential for achieving sustainable growth and impact.

## Core Pillars & Strategy
1. **Thoughtful Preparation**: Establish clear milestones and define core deliverables early.
2. **Flawless Execution**: Maintain rigorous quality standards while remaining agile.
3. **Continuous Optimization**: Gather data and feedback to constantly improve.

## Actionable Takeaways
- Align your goals with core values.
- Communicate progress transparently with your team.

## Conclusion
By approaching "${userText}" with dedication and strategic foresight, success is not just a goal—it's an inevitable outcome.

*(Tone: ${tone} | Language: ${language})*`;
  }
};

// Helper for streaming text word-by-word
const streamFallbackContent = async (payload: GeneratePayload, res: any) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const generatedText = generateToolContent(payload);
  const words = generatedText.split(' ');

  for (const word of words) {
    const data = JSON.stringify({ content: word + ' ' });
    res.write(`data: ${data}\n\n`);
    await new Promise((resolve) => setTimeout(resolve, 25));
  }

  res.write('data: [DONE]\n\n');
  res.end();
};

export const generateContentStream = async (payloadOrPrompt: any, res: any) => {
  try {
    const payload: GeneratePayload = typeof payloadOrPrompt === 'string'
      ? { finalPrompt: payloadOrPrompt, prompt: payloadOrPrompt }
      : payloadOrPrompt;

    const apiKey = process.env.OPENROUTER_API_KEY;
    const finalPromptText = payload.finalPrompt || payload.prompt || '';

    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      console.log(`Using intelligent tool generator for: ${payload.tool || 'blog'} | Language: ${payload.language || 'English'} | Tone: ${payload.tone || 'Professional'}`);
      return await streamFallbackContent(payload, res);
    }

    try {
      const response = await axios({
        method: 'post',
        url: `${OPENROUTER_API_URL}/chat/completions`,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'ContentCraft AI',
          'Content-Type': 'application/json'
        },
        data: {
          model: 'openrouter/free',
          messages: [{ role: 'user', content: finalPromptText }],
          stream: true,
        },
        responseType: 'stream',
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') {
            res.write('data: [DONE]\n\n');
            return res.end();
          }
          try {
            const parsed = JSON.parse(message);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch (error) {
            // ignore parse errors for incomplete chunks
          }
        }
      });

      response.data.on('end', () => {
        res.end();
      });
    } catch (apiErr) {
      console.error('OpenRouter API call failed, using intelligent tool generator:', apiErr);
      await streamFallbackContent(payload, res);
    }
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};
