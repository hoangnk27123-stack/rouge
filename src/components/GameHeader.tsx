import React from 'react';
import { PlayerStats, Pet, Companion } from '../types';
import { Shield, Sparkles, Flame, Coins, Trophy, Zap, Heart } from 'lucide-react';

interface GameHeaderProps {
  stats: PlayerStats;
  totalStats: PlayerStats;
  activePet: Pet | null;
  activeCompanion: Companion | null;
  onResetSave: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  stats,
  totalStats,
  activePet,
  activeCompanion,
  onResetSave
}) => {
  const expPercentage = Math.min(100, (stats.exp / stats.maxExp) * 100);

  return (
    <div id="game-header-panel" className="bg-slate-900 border-b-2 border-amber-500/30 p-4 rounded-t-xl text-slate-100 shadow-2xl relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title area */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-lg text-amber-400 animate-pulse">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider text-amber-300 font-sans uppercase flex items-center gap-2">
              VẠN CỔ MA THÁP <span className="text-xs font-normal text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-950/40 font-mono">Roguelike Auto-Battler</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>Đạo Hữu Cày Tháp</span> • <span className="text-amber-400">Thiên Mệnh Khí Vận</span>
            </p>
          </div>
        </div>

        {/* Level and Exp Bar */}
        <div className="flex-1 max-w-sm md:mx-6">
          <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Tu Vi: 
              <span className="text-amber-400 font-bold ml-1">Cảnh Giới Lvl {stats.level}</span>
            </span>
            <span className="font-mono text-slate-400">{stats.exp}/{stats.maxExp} EXP</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full border border-slate-800 p-[1px] overflow-hidden">
            <div 
              style={{ width: `${expPercentage}%` }}
              className="bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>

        {/* Currency & Statistics shortcuts */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-start md:justify-end text-xs">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-amber-500/20 px-3 py-2 rounded-lg">
            <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400/10" />
            <div>
              <div className="text-[10px] text-slate-500 leading-none">VÀNG GIANG HỒ</div>
              <div className="text-sm font-bold text-yellow-400 font-mono mt-0.5">{stats.gold}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-emerald-500/20 px-3 py-2 rounded-lg">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-500 leading-none">LINH THẠCH</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{stats.stones}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-rose-500/20 px-3 py-2 rounded-lg">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/10 animate-beat" />
            <div>
              <div className="text-[10px] text-slate-500 leading-none">SINH LỰC TOÀN ĐỘI</div>
              <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">{totalStats.hp}/{totalStats.maxHp}</div>
            </div>
          </div>

          <button 
            id="btn-re-cultivate"
            onClick={onResetSave}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700 hover:border-rose-900/50 rounded-md transition-all text-[10px] uppercase font-mono text-slate-400 cursor-pointer"
            title="Xóa dữ liệu để tẩy tủy tu luyện lại từ đầu"
          >
            Tẩy Tủy
          </button>
        </div>
      </div>

      {/* Equipped summary tag */}
      <div className="flex flex-wrap gap-2 mt-3.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 bg-slate-950/40 px-2 py-0.5 rounded border border-slate-800">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Tầng Tháp:</span>
          <span className="text-amber-400 font-mono font-bold">{stats.currentFloor} / ∞</span>
          <span className="text-[9px] text-slate-600">(Kỷ lục: T{stats.maxFloorReached})</span>
        </div>

        {activeCompanion ? (
          <div className="flex items-center gap-1 bg-amber-950/30 text-amber-300 px-2.5 py-0.5 rounded border border-amber-900/40">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Đồng Hành: <strong className="text-amber-200">{activeCompanion.name}</strong> ({activeCompanion.title})</span>
            <span className="text-[9px] px-1 bg-amber-500/20 rounded font-mono ml-1">{activeCompanion.role}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-slate-950/50 text-slate-500 px-2.5 py-0.5 rounded border border-dashed border-slate-800">
            <span>Chưa có Đồng Hành kề vai</span>
          </div>
        )}

        {activePet ? (
          <div className="flex items-center gap-1 bg-emerald-950/30 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-900/40">
            <Flame className="w-3 h-3 text-emerald-400" />
            <span>Linh Thú: <strong className="text-emerald-200">{activePet.name}</strong> - <span className="text-[9px] font-mono opacity-80">{activePet.elementName}</span></span>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-slate-950/50 text-slate-500 px-2.5 py-0.5 rounded border border-dashed border-slate-800">
            <span>Chưa thuần hóa Linh Thú bồi trò</span>
          </div>
        )}
      </div>
    </div>
  );
};
