import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateStream, saveHistory } from '../lib/api';
import {
  Sparkles, Save, Copy, Check, Loader2,
  FileText, Mail, Share2, AlignLeft, Wand2, CheckCircle2, Pen
} from 'lucide-react';

const TOOLS = [
  { id: 'blog', label: 'Blog Post', icon: FileText, desc: 'Write full blog articles' },
  { id: 'email', label: 'Email', icon: Mail, desc: 'Craft professional emails' },
  { id: 'social', label: 'Social Media', icon: Share2, desc: 'Engaging social posts' },
  { id: 'summarize', label: 'Summarize', icon: AlignLeft, desc: 'Summarize any text' },
  { id: 'rewrite', label: 'Rewrite', icon: Wand2, desc: 'Rewrite & improve content' },
  { id: 'grammar', label: 'Grammar Fix', icon: CheckCircle2, desc: 'Fix grammar & spelling' },
  { id: 'creative', label: 'Creative', icon: Pen, desc: 'Stories, poems & more' },
];

const TONES = ['Professional', 'Casual', 'Friendly', 'Formal', 'Humorous', 'Persuasive'];
const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Arabic'];

const Dashboard = () => {
  const { user, token } = useAuth();
  const [selectedTool, setSelectedTool] = useState(TOOLS[0]);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const buildPrompt = () => {
    const tId = selectedTool.id;
    switch (tId) {
      case 'grammar':
        return `Act as a grammar and spelling corrector. Correct all spelling, grammar, punctuation, and phrasing errors in the following text. Provide the corrected version and key improvements in ${language} with a ${tone} tone:\n\n${prompt}`;
      case 'social':
        return `Act as a social media expert. Create an engaging, high-converting social media post with appropriate emojis, line breaks, and relevant hashtags about the following topic in ${language} with a ${tone} tone:\n\n${prompt}`;
      case 'summarize':
        return `Act as an executive editor. Provide a clear, concise summary with bulleted key takeaways for the following text in ${language} with a ${tone} tone:\n\n${prompt}`;
      case 'rewrite':
        return `Act as a professional copywriter. Rewrite, polish, and improve the clarity, impact, and flow of the following text in ${language} with a ${tone} tone:\n\n${prompt}`;
      case 'email':
        return `Act as a professional communication specialist. Write a complete, well-formatted email including Subject Line, Salutation, Body Paragraphs, and Sign-off about the following topic in ${language} with a ${tone} tone:\n\n${prompt}`;
      case 'creative':
        return `Act as a creative writer. Write an imaginative and captivating story or creative piece about the following topic in ${language} with a ${tone} tone:\n\n${prompt}`;
      case 'blog':
      default:
        return `Act as a professional blogger. Write a comprehensive, well-structured blog post with an engaging title, introduction, subheadings, key takeaways, and conclusion about the following topic in ${language} with a ${tone} tone:\n\n${prompt}`;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError('');
    setOutput('');
    setSavedId(null);
    setIsGenerating(true);

    try {
      await generateStream(
        {
          tool: selectedTool.id,
          prompt,
          language,
          tone,
          finalPrompt: buildPrompt(),
        },
        token!,
        (chunk) => setOutput(prev => prev + chunk),
        () => setIsGenerating(false)
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to generate content. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!output) return;
    setIsSaving(true);
    try {
      const res = await saveHistory({ prompt, response: output, toolUsed: selectedTool.id, language, tone });
      setSavedId(res.data._id);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1" style={{ color: 'rgb(100 116 139)' }}>What would you like to create today?</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Panel: Controls */}
        <div className="space-y-5">
          {/* Tool selector */}
          <div className="rounded-2xl p-5 border" style={{ background: 'rgb(22 27 45)', borderColor: 'rgb(30 41 59)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: 'rgb(148 163 184)' }}>Select Tool</p>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS.map(tool => {
                const Icon = tool.icon;
                const isActive = selectedTool.id === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool)}
                    className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200"
                    style={{
                      background: isActive ? 'rgb(99 102 241 / 0.15)' : 'rgb(15 17 26)',
                      border: `1px solid ${isActive ? 'rgb(99 102 241 / 0.5)' : 'rgb(30 41 59)'}`,
                      color: isActive ? 'rgb(165 180 252)' : 'rgb(100 116 139)',
                    }}
                  >
                    <Icon size={16} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: isActive ? 'rgb(165 180 252)' : 'rgb(226 232 240)' }}>{tool.label}</p>
                      <p className="text-xs" style={{ color: 'rgb(71 85 105)' }}>{tool.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt */}
          <div className="rounded-2xl p-5 border" style={{ background: 'rgb(22 27 45)', borderColor: 'rgb(30 41 59)' }}>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(148 163 184)' }}>
              {selectedTool.id === 'grammar' ? 'Text to Correct' :
               selectedTool.id === 'summarize' ? 'Text to Summarize' :
               selectedTool.id === 'rewrite' ? 'Text to Rewrite' :
               selectedTool.id === 'social' ? 'Social Post Topic / Message' :
               selectedTool.id === 'email' ? 'Email Purpose & Key Details' :
               selectedTool.id === 'creative' ? 'Story Concept / Prompt' : 'Blog Topic & Main Points'}
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={
                selectedTool.id === 'grammar' ? 'Paste or type the text you want to check for spelling and grammar errors...' :
                selectedTool.id === 'summarize' ? 'Paste the article or text you want to summarize...' :
                selectedTool.id === 'rewrite' ? 'Paste the text you want to rewrite and polish...' :
                selectedTool.id === 'social' ? 'Enter the topic or message for your social media post...' :
                selectedTool.id === 'email' ? 'Describe the purpose of your email, key details, and recipient...' :
                selectedTool.id === 'creative' ? 'Enter your story prompt, poem idea, or creative concept...' :
                'Describe the topic and key points for your blog article...'
              }
              rows={4}
              className="w-full rounded-xl p-3 text-sm outline-none resize-none transition-all"
              style={{
                background: 'rgb(15 17 26)',
                border: '1px solid rgb(30 41 59)',
                color: 'rgb(226 232 240)',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgb(99 102 241)')}
              onBlur={e => (e.target.style.borderColor = 'rgb(30 41 59)')}
            />
          </div>

          {/* Tone + Language */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border" style={{ background: 'rgb(22 27 45)', borderColor: 'rgb(30 41 59)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(148 163 184)' }}>Tone</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: 'rgb(15 17 26)', border: '1px solid rgb(30 41 59)', color: 'rgb(226 232 240)' }}
              >
                {TONES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="rounded-2xl p-5 border" style={{ background: 'rgb(22 27 45)', borderColor: 'rgb(30 41 59)' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'rgb(148 163 184)' }}>Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: 'rgb(15 17 26)', border: '1px solid rgb(30 41 59)', color: 'rgb(226 232 240)' }}
              >
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246))' }}
          >
            {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : <><Sparkles size={18} /> Generate Content</>}
          </button>

          {error && (
            <div className="p-3 rounded-xl text-sm" style={{ background: 'rgb(239 68 68 / 0.1)', color: 'rgb(252 165 165)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
              {error}
            </div>
          )}
        </div>

        {/* Right Panel: Output */}
        <div className="rounded-2xl border flex flex-col" style={{ background: 'rgb(22 27 45)', borderColor: 'rgb(30 41 59)', minHeight: '500px' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgb(30 41 59)' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: 'rgb(99 102 241)' }} />
              <span className="text-sm font-semibold text-white">Generated Content</span>
              {isGenerating && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgb(99 102 241 / 0.2)', color: 'rgb(165 180 252)' }}>Streaming...</span>}
            </div>
            {output && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: 'rgb(15 17 26)', color: copied ? 'rgb(34 197 94)' : 'rgb(148 163 184)', border: '1px solid rgb(30 41 59)' }}
                >
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !!savedId}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-60"
                  style={{ background: savedId ? 'rgb(34 197 94 / 0.15)' : 'rgb(99 102 241 / 0.15)', color: savedId ? 'rgb(34 197 94)' : 'rgb(165 180 252)', border: `1px solid ${savedId ? 'rgb(34 197 94 / 0.3)' : 'rgb(99 102 241 / 0.3)'}` }}
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {savedId ? 'Saved!' : isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {!output && !isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'rgb(51 65 85)' }}>
                <Sparkles size={48} />
                <p className="text-sm text-center">Your generated content will appear here.<br />Select a tool and enter your prompt to get started.</p>
              </div>
            ) : (
              <pre className="text-sm whitespace-pre-wrap leading-relaxed font-sans" style={{ color: 'rgb(203 213 225)' }}>
                {output}
                {isGenerating && <span className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: 'rgb(99 102 241)' }} />}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
