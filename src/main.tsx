import { StrictMode, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CalendarDays, ChevronLeft, ChevronRight, ImagePlus, MapPin, Menu, Paperclip, Search, Sparkles, Sun, Tag, X } from 'lucide-react'
import './styles.css'

const today = new Date(2026, 8, 16)
const months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
const moods = ['平静', '开心', '充实', '疲惫', '灵感']
const weather = ['晴朗', '多云', '小雨', '阴天']

type Entry = { date: string; title: string; body: string; mood: string; weather: string; location: string; tags: string[]; images: string[] }
const seed: Entry = { date: '2026-09-16', title: '把今天收藏起来', body: '今天的阳光很好，适合慢慢走路。\n\n在街角发现了一家新开的咖啡馆，窗边的位置刚好能看到树影。记住这种轻盈的感觉。', mood: '平静', weather: '晴朗', location: '杭州 · 西湖边', tags: ['日常', '小确幸'], images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80'] }

function App() {
  const [entry, setEntry] = useState(seed)
  const [saved, setSaved] = useState(false)
  const [menu, setMenu] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const dateLabel = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`
  const update = (key: keyof Entry, value: string) => setEntry({ ...entry, [key]: value })
  const addImages = (files: FileList | null) => { if (!files) return; const urls = Array.from(files).map(file => URL.createObjectURL(file)); setEntry({ ...entry, images: [...entry.images, ...urls] }) }
  return <main className="app-shell">
    <header className="topbar"><button className="icon-btn" onClick={() => setMenu(!menu)} aria-label="打开菜单"><Menu size={21}/></button><div className="brand"><span className="brand-mark">✳</span><span>Memento</span></div><button className="avatar">J</button></header>
    {menu && <div className="menu-pop"><strong>Memento</strong><span>我的手账</span><span>月历回顾</span><span>设置</span></div>}
    <section className="hero"><div><p className="eyebrow">WEDNESDAY · 16 SEP</p><h1>今天，<em>值得被记住。</em></h1><p className="lede">留一点时间，给此刻的自己。</p></div><div className="sun-stamp"><Sun size={27}/><span>晴朗<br/><b>24°</b></span></div></section>
    <div className="date-strip"><button className="round-btn"><ChevronLeft size={18}/></button><div><span>正在记录</span><strong>{dateLabel}</strong></div><button className="round-btn"><ChevronRight size={18}/></button></div>
    <section className="paper-card"><div className="tape tape-left"/><div className="card-head"><span className="date-number">16</span><div><p>SEPTEMBER</p><small>星期三 · 农历八月初五</small></div><button className="pin"><MapPin size={16}/></button></div>
      <input className="title-input" value={entry.title} onChange={e => update('title', e.target.value)} placeholder="给今天起个标题..." />
      <textarea className="body-input" value={entry.body} onChange={e => update('body', e.target.value)} placeholder="写下今天发生的事、想到的话..." />
      <div className="rule"/>
      <div className="meta-row"><label><span className="meta-icon">☼</span><b>心情</b><select value={entry.mood} onChange={e => update('mood', e.target.value)}>{moods.map(x => <option key={x}>{x}</option>)}</select></label><label><span className="meta-icon">☁</span><b>天气</b><select value={entry.weather} onChange={e => update('weather', e.target.value)}>{weather.map(x => <option key={x}>{x}</option>)}</select></label></div>
      <label className="location-input"><MapPin size={16}/><input value={entry.location} onChange={e => update('location', e.target.value)} placeholder="添加地点" /></label>
      <div className="photo-grid">{entry.images.map((image, i) => <div className="photo" key={image}><img src={image} alt={`手账照片 ${i + 1}`}/><button onClick={() => setEntry({...entry, images: entry.images.filter((_, n) => n !== i)})} aria-label="删除图片"><X size={14}/></button></div>)}<button className="add-photo" onClick={() => fileRef.current?.click()}><ImagePlus size={23}/><span>添加照片</span></button><input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => addImages(e.target.files)}/></div>
      <div className="tag-row"><Tag size={15}/>{entry.tags.map(tag => <span className="tag" key={tag}># {tag}</span>)}<button className="add-tag">+ 标签</button></div>
      <div className="card-footer"><span><Paperclip size={15}/> {entry.images.length} 张照片</span><button className={saved ? 'save-btn saved' : 'save-btn'} onClick={() => setSaved(true)}>{saved ? '已保存 ✓' : '保存这一天'}</button></div>
    </section>
    <section className="memory-row"><div><p className="eyebrow">YOUR MEMORIES</p><h2>最近的记忆</h2></div><button className="text-btn">查看全部 <ChevronRight size={16}/></button></section>
    <div className="memory-card"><img src={seed.images[1]} alt="咖啡馆记忆"/><div><span>15 SEP · 昨天</span><h3>一些让人开心的小事</h3><p>一杯咖啡，一阵风，还有...</p></div><Sparkles size={18}/></div>
    <nav className="bottom-nav"><button className="active"><CalendarDays size={20}/><span>今日</span></button><button><Search size={20}/><span>搜索</span></button><button><ImagePlus size={20}/><span>图库</span></button></nav>
  </main>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
