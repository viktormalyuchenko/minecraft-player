"use client";

import { useState, useRef, useEffect } from "react";
import { tracks, backgrounds } from "./data";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Info,
  Eye,
  EyeOff,
  Music,
  Search,
} from "lucide-react";

export default function Home() {
  // --- STATE ---
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Визуальные настройки
  const [bgIndex, setBgIndex] = useState(0);
  const [isDimmed, setIsDimmed] = useState(false); // Затемнение выключено

  // Модальные окна
  const [showInfo, setShowInfo] = useState(false);
  const [showBgMenu, setShowBgMenu] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  // --- LOGIC ---
  const playTrackByIndex = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    // Не закрываем окно, чтобы юзер мог выбрать другой трек, если ошибся
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) =>
      prev - 1 < 0 ? tracks.length - 1 : prev - 1,
    );
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Autoplay blocked", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const progressPercent = duration ? (progress / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden text-white font-minecraft select-none bg-black">
      {/* 1. ФОН (ВИДЕО) */}
      <div className="absolute inset-0 z-0">
        <video
          key={backgrounds[bgIndex].src}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-[filter] duration-700 ${isDimmed ? "brightness-[0.4]" : "brightness-100"}`}
        >
          <source src={backgrounds[bgIndex].src} type="video/mp4" />
        </video>
        <div
          className={`absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-700 ${isDimmed ? "opacity-100" : "opacity-0"}`}
        ></div>
      </div>

      {/* 2. ВЕРХНИЕ КНОПКИ */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-20 pointer-events-none">
        {/* Инфо */}
        <button
          onClick={() => setShowInfo(true)}
          className="pointer-events-auto bg-black/40 hover:bg-black/70 p-2 md:p-3 border-2 border-white/20 rounded backdrop-blur-md transition active:scale-95 group shadow-lg"
        >
          <Info className="text-gray-200 group-hover:text-yellow-400 w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Правая группа */}
        <div className="flex gap-3 pointer-events-auto">
          <button
            onClick={() => setIsDimmed(!isDimmed)}
            className="bg-black/40 hover:bg-black/70 p-2 md:p-3 border-2 border-white/20 rounded backdrop-blur-md transition active:scale-95 group shadow-lg"
          >
            {isDimmed ? (
              <EyeOff className="text-gray-200 group-hover:text-blue-300 w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Eye className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>

          <button
            onClick={() => setShowBgMenu(true)}
            className="bg-black/40 hover:bg-black/70 p-2 md:p-3 border-2 border-white/20 rounded backdrop-blur-md transition active:scale-95 group shadow-lg"
          >
            <ImageIcon className="text-gray-200 group-hover:text-green-400 w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* 3. ГЛАВНЫЙ ПЛЕЕР */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-[#1a1a1a]/90 backdrop-blur-xl border-4 border-[#3d3d3d] outline outline-4 outline-black p-5 md:p-8 w-full max-w-[420px] shadow-[0_0_60px_rgba(0,0,0,0.7)] flex flex-col gap-4 md:gap-6 rounded-sm">
          {/* Текст: Трек (Исправлено) */}
          <div className="text-center w-full">
            <h2 className="text-yellow-500 text-[10px] md:text-xs tracking-widest uppercase mb-2 drop-shadow-sm">
              Сейчас играет
            </h2>
            {/* 
                   min-h-[3rem] - резервирует место под 2 строки текста 
                   pb-1 - добавляет отступ снизу для букв типа 'g', 'j', 'y'
                   leading-relaxed - увеличивает высоту строки
                */}
            <div className="flex items-center justify-center min-h-[3.5rem]">
              <h1 className="text-xl md:text-3xl text-white drop-shadow-md leading-relaxed font-bold line-clamp-2 pb-1 px-1">
                {currentTrack.title}
              </h1>
            </div>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              {currentTrack.author}
            </p>
          </div>

          {/* Прогресс */}
          <div className="flex flex-col gap-1 w-full">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={onSeek}
              className="mc-range w-full"
              style={
                { "--value": `${progressPercent}%` } as React.CSSProperties
              }
            />
            <div className="flex justify-between text-[10px] md:text-xs text-gray-400 font-sans mt-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-center items-center gap-6 md:gap-8 py-2">
            <button
              onClick={prevTrack}
              className="hover:text-white text-gray-400 transition hover:scale-110 active:scale-95"
            >
              <SkipBack size={28} className="md:w-8 md:h-8" />
            </button>

            <button
              onClick={() => {
                if (isPlaying) audioRef.current?.pause();
                else audioRef.current?.play();
                setIsPlaying(!isPlaying);
              }}
              className="bg-[#2b2b2b] hover:bg-[#383838] border-2 border-gray-600 p-3 md:p-4 rounded-full shadow-lg transition active:scale-95 active:bg-[#222]"
            >
              {isPlaying ? (
                <Pause fill="white" className="w-8 h-8 md:w-9 md:h-9" />
              ) : (
                <Play fill="white" className="ml-1 w-8 h-8 md:w-9 md:h-9" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="hover:text-white text-gray-400 transition hover:scale-110 active:scale-95"
            >
              <SkipForward size={28} className="md:w-8 md:h-8" />
            </button>
          </div>

          {/* Громкость */}
          <div className="flex items-center gap-3 bg-black/40 p-2 md:p-3 rounded-lg border border-white/5">
            <button
              onClick={() => setVolume((v) => (v === 0 ? 0.5 : 0))}
              className="hover:text-white text-gray-400"
            >
              {volume === 0 ? (
                <VolumeX size={18} className="md:w-5 md:h-5" />
              ) : (
                <Volume2 size={18} className="md:w-5 md:h-5" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="mc-range w-full"
              style={{ "--value": `${volumePercent}%` } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      {/* 4. МОДАЛКА: ВЫБОР ФОНА */}
      {showBgMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowBgMenu(false)}
        >
          <div
            className="bg-[#242424] border-4 border-black p-4 md:p-6 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg md:text-xl mb-4 text-center border-b border-gray-600 pb-2 text-yellow-400 shrink-0">
              Выбор атмосферы
            </h3>
            <div className="overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 flex-grow">
              {backgrounds.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setBgIndex(index);
                    setShowBgMenu(false);
                  }}
                  className={`aspect-video w-full bg-gray-800 relative border-4 hover:border-green-500 transition-all ${bgIndex === index ? "border-green-500 grayscale-0" : "border-gray-600 grayscale brightness-75 hover:grayscale-0 hover:brightness-100"}`}
                >
                  <img
                    src={bg.poster}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                    #{index + 1}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowBgMenu(false)}
              className="mt-4 shrink-0 w-full py-3 bg-red-900/80 hover:bg-red-800 text-white border-2 border-red-950 font-bold active:scale-[0.99]"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* 5. МОДАЛКА: О ПРОЕКТЕ + SEO + ПЛЕЙЛИСТ */}
      {showInfo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-[#1a1a1a] border-4 border-gray-600 p-6 md:p-8 w-full max-w-2xl relative shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl text-yellow-400 mb-4 font-bold text-center border-b border-gray-700 pb-2 shrink-0">
              Музыка Minecraft Онлайн
            </h2>

            <div className="overflow-y-auto pr-2 flex-grow space-y-6">
              {/* SEO СТАТЬЯ */}
              <article className="text-gray-300 text-sm leading-relaxed font-sans space-y-4">
                <p>
                  Саундтрек к Minecraft — это не просто сопровождение к игре,
                  это целая эпоха в жанре эмбиент. На нашем сайте вы можете{" "}
                  <strong>слушать музыку из Майнкрафта онлайн</strong> в высоком
                  качестве. Мы создали этот плеер для тех, кому нужна{" "}
                  <em>расслабляющая атмосфера</em> для продуктивной работы,
                  глубокой концентрации над кодом или спокойного сна.
                </p>
                <p>
                  В плейлисте собраны все легендарные композиции от{" "}
                  <strong>C418</strong>, включая знаменитые треки
                  <em>Sweden, Mice on Venus</em> и <em>Wet Hands</em>, а также
                  новые мелодии от <strong>Lena Raine</strong>. Эта{" "}
                  <strong>успокаивающая музыка без слов</strong> идеально
                  подходит для создания уюта, где бы вы ни находились.
                </p>
                <p>
                  Используйте наш интерфейс как «живые обои»: меняйте локации из
                  игры, настраивайте освещение и наслаждайтесь{" "}
                  <strong>атмосферой Minecraft OST</strong> совершенно бесплатно
                  и без лишнего шума.
                </p>
              </article>

              {/* ПЛЕЙЛИСТ */}
              <div>
                <h3 className="text-lg text-white mb-3 flex items-center gap-2 sticky top-0 bg-[#1a1a1a] py-2 z-10 border-b border-white/10 text-green-400">
                  Список треков
                </h3>
                <ul className="space-y-1">
                  {tracks.map((track, index) => (
                    <li key={index}>
                      <button
                        onClick={() => playTrackByIndex(index)}
                        className={`w-full text-left px-3 py-3 md:py-2 text-sm rounded flex justify-between items-center transition ${currentTrackIndex === index ? "bg-green-900/40 text-green-300 border border-green-800" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"}`}
                      >
                        <span className="truncate mr-2 font-minecraft">
                          {index + 1}. {track.title}
                        </span>
                        <span className="text-[10px] opacity-40 whitespace-nowrap">
                          {track.author}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[10px] text-gray-600 text-center italic">
                Все аудиоматериалы принадлежат их законным владельцам (Mojang
                Studios / Microsoft). Сайт является фанатским проектом и не
                используется в коммерческих целях.
              </p>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="mt-4 shrink-0 w-full py-3 bg-gray-700 hover:bg-gray-600 border-b-4 border-gray-900 active:scale-[0.99] transition text-white font-bold"
            >
              Вернуться к прослушиванию
            </button>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={currentTrack?.src}
        onTimeUpdate={onTimeUpdate}
        onEnded={nextTrack}
        onError={(e) => console.error("Audio error", e)}
      />
    </main>
  );
}
