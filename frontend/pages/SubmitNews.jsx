import { useState } from 'react';
import { Newspaper, Link as LinkIcon, Sparkles } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function SubmitNews() {
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [isFocused, setIsFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await axios.post('http://localhost:300/api/news/classify', {text, link});
      navigate('/result',{
        state:{
          text,
          link,
          data
        }
      })

      console.log('Submitted:', { text, link });
    } catch (error) {
      console.log("error in submitNews, handlesbumite", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl mb-6 shadow-2xl shadow-orange-500/20 transform hover:scale-110 transition-transform duration-300">
            <Newspaper className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-3 tracking-tight">
            News Submission Portal
          </h1>
          <p className="text-lg text-slate-600 font-medium">Submit breaking news, articles, and exclusive reports</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100/50 to-rose-100/50 rounded-full blur-3xl -z-0"></div>

          <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
            <div className="group">
              <label htmlFor="text" className="flex items-center text-sm font-bold text-slate-800 mb-3 gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Article Content
              </label>
              <div className={`relative transition-all duration-300 ${isFocused === 'text' ? 'scale-[1.01]' : ''}`}>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setIsFocused('text')}
                  onBlur={() => setIsFocused(null)}
                  placeholder="Paste your article, news story, or report content here..."
                  rows={8}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none text-slate-900 placeholder-slate-400 bg-white shadow-sm hover:border-slate-300 font-medium leading-relaxed overflow-hidden"
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                  {text.length} characters
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="link" className="flex items-center text-sm font-bold text-slate-800 mb-3 gap-2">
                <LinkIcon className="w-4 h-4 text-orange-500" />
                Source URL
              </label>
              <div className={`relative transition-all duration-300 ${isFocused === 'link' ? 'scale-[1.01]' : ''}`}>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-orange-100 to-rose-100 rounded-xl flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-orange-600" />
                </div>
                <input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  onFocus={() => setIsFocused('link')}
                  onBlur={() => setIsFocused(null)}
                  placeholder="https://example.com/breaking-news"
                  className="w-full pl-16 pr-5 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder-slate-400 bg-white shadow-sm hover:border-slate-300 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-2xl hover:shadow-orange-500/30 active:scale-[0.98] transition-all duration-300 text-lg relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Newspaper className="w-5 h-5" />
                Submit Article
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200/50 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Secure submission
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              Real-time processing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitNews;
