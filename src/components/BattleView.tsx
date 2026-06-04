import React, { useEffect, useRef } from 'react';
import { PlayerStats, Enemy, Companion, Pet, BattleLog, Item } from '../types';
import { MARTIAL_ARTS_POOL } from '../data';
import { Play, Pause, Swords, Heart, Shield, HelpCircle, Flame, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DamagePopup {
  id: string;
  text: string;
  isCrit: boolean;
  type: 'PLAYER' | 'ENEMY' | 'COMPANION' | 'PET' | 'HEAL';
  x: number; // offset percent
  y: number;
}

interface BattleViewProps {
  floor: number;
  playerStats: PlayerStats;
  totalStats: PlayerStats;
  enemy: Enemy | null;
  activeCompanion: Companion | null;
  activePet: Pet | null;
  battleLogs: BattleLog[];
  isAutoPlaying: boolean;
  combatPlayerHp: number;
  combatCompanionHp: number;
  combatEnemyHp: number;
  damagePopups: DamagePopup[];
  onToggleAutoPlay: () => void;
  onAdvanceFloor: () => void;
  onTriggerDirectCombatTick: () => void;
  onResetToCemetery: () => void;
  items?: Item[];
}

export const BattleView: React.FC<BattleViewProps> = ({
  floor,
  playerStats,
  totalStats,
  enemy,
  activeCompanion,
  activePet,
  battleLogs,
  isAutoPlaying,
  combatPlayerHp,
  combatCompanionHp,
  combatEnemyHp,
  damagePopups,
  onToggleAutoPlay,
  onAdvanceFloor,
  onTriggerDirectCombatTick,
  onResetToCemetery,
  items = []
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn lầu sổ văn chương công pháp võ đạo xuống đáy một cách an toàn mà không ảnh hưởng tới cuộn trang chính
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [battleLogs]);

  if (!enemy) {
    return (
      <div className="bg-slate-900 border-2 border-slate-800 p-8 rounded-xl text-center text-slate-400">
        <span className="text-4xl block mb-2">🐉</span>
        <p className="text-sm">Đang thấu dẫn trận pháp phục hồi sinh lực...</p>
        <button
          onClick={onAdvanceFloor}
          className="mt-4 px-6 py-2.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold uppercase transition-all tracking-wider"
        >
          Kích Hoạt Ma Tháp Tầng {floor}
        </button>
      </div>
    );
  }

  // Phân bổ toạ độ chiến sự dựa trên yêu cầu đặc biệt từ người dùng:
  // Companion: role === TANK -> Đứng TRƯỚC, SUPPORT/DPS đứng SAU
  // Pet: element === WIND/THUNDER -> Bay LÊN TRÊN ĐẦU, FIRE đứng TRƯỚC, WATER đứng SAU
  const isCompanionInFront = activeCompanion?.role === 'TANK';
  const isCompanionInBack = activeCompanion && activeCompanion.role !== 'TANK';

  const isPetOverhead = activePet?.element === 'WIND' || activePet?.element === 'THUNDER';
  const isPetInFront = activePet?.element === 'FIRE';
  const isPetInBack = activePet?.element === 'WATER';

  // Tính phần trăm HP các mục tiễu trừ
  const playerHpPercent = Math.max(0, Math.min(100, (combatPlayerHp / totalStats.maxHp) * 100));
  const companionHpPercent = activeCompanion ? Math.max(0, Math.min(100, (combatCompanionHp / activeCompanion.hp) * 100)) : 0;
  const enemyHpPercent = Math.max(0, Math.min(100, (combatEnemyHp / enemy.maxHp) * 100));

  const isBossFight = enemy.type === 'MEGA_BOSS';
  const isMiniBossFight = enemy.type === 'MINI_BOSS';

  return (
    <div id="battleview-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* KHU VỰC 1: ĐẤU TRƯỜNG TRANH ĐẤU HOÀNH TRÁNG (Cột 1 và 2) */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className={`p-6 rounded-xl border-2 relative overflow-hidden bg-slate-950 shadow-2xl transition-all duration-300 ${
          isBossFight 
            ? 'border-rose-500/40 shadow-rose-950/20' 
            : isMiniBossFight 
            ? 'border-purple-500/30 shadow-purple-950/15' 
            : 'border-slate-800'
        }`}>
          {/* Header chiến địa tháp */}
          <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-6">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-amber-500" />
              CHIẾN TRƯỜNG AUTO: TẦNG T{floor}
            </span>

            {isBossFight ? (
              <span className="text-xs uppercase font-extrabold tracking-wider text-rose-400 bg-rose-950/50 border border-rose-500/30 px-3 py-1 rounded-full animate-bounce">
                👹 ĐẠI MA BOSS THÁP TRƯỞNG
              </span>
            ) : isMiniBossFight ? (
              <span className="text-xs uppercase font-extrabold tracking-wider text-purple-400 bg-purple-950/50 border border-purple-500/30 px-3 py-1 rounded-full">
                👾 KIẾM KHÍ BOSS NHỎ
              </span>
            ) : (
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                💀 Tiêu Diệt Quái Tầng Thường
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                id="btn-trigger-manual-tick"
                onClick={onTriggerDirectCombatTick}
                disabled={combatEnemyHp <= 0 || combatPlayerHp <= 0}
                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded text-[10px] font-mono leading-none cursor-pointer"
                title="Bấm để thúc đẩy tấn công trực tiếp 1 lượt"
              >
                Tấn Công Ngay
              </button>
            </div>
          </div>

          {/* SÂN ĐẤU QUÂN BỊ (VISUAL PARCHMENT MATRIX) */}
          <div className="relative h-[250px] bg-gradient-to-b from-slate-950 to-neutral-900 rounded-lg p-4 flex justify-between items-center border border-slate-900 overflow-hidden select-none">
            
            {/* Hào quang lôi phong thiên giới nếu có Boss chiến */}
            {isBossFight && (
              <div className="absolute inset-0 bg-rose-500/3 opacity-[0.03] pointer-events-none animate-pulse" />
            )}

            {/* FLOATING DAMAGE POPUPS POPUPS */}
            <AnimatePresence>
              {damagePopups.map((popup) => (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 0, y: popup.y, scale: 0.7 }}
                  animate={{ opacity: 1, y: popup.y - 45, scale: popup.isCrit ? 1.4 : 1.1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ left: `${popup.x}%` }}
                  className={`absolute font-black font-mono tracking-tighter text-sm select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-50 ${
                    popup.type === 'HEAL'
                      ? 'text-emerald-400'
                      : popup.isCrit
                      ? 'text-yellow-400 text-lg underline ring-amber-500'
                      : popup.type === 'PLAYER'
                      ? 'text-slate-100'
                      : popup.type === 'ENEMY'
                      ? 'text-rose-500'
                      : 'text-cyan-400'
                  }`}
                >
                  {popup.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* BÊN TRÁI: LIÊN MINH NGƯỜI CHƠI (Player + Pet + Companion) */}
            <div className="flex items-center justify-center gap-5 w-1/2 relative h-full">
              
              {/* Vị trí 1: PET BAY TRÊN ĐẦU (WIND/THUNDER element) */}
              {activePet && isPetOverhead && (
                <div 
                  id="active-pet-overhead"
                  className="absolute top-1 left-24 text-center z-20 flex flex-col items-center animate-bounce duration-1000"
                >
                  <span className="text-[22px] filter drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]">{activePet.avatar}</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-slate-900/80 px-1 border border-emerald-500/20 rounded font-mono">
                    {activePet.name}
                  </span>
                </div>
              )}

              {/* Vị trí 2: ĐỒNG HÀNH SÁT SAU (SUPPORT / DPS) */}
              {activeCompanion && isCompanionInBack && (
                <div 
                  id="active-comp-back"
                  className="flex flex-col items-center justify-center relative translate-y-2 opacity-90 scale-95"
                >
                  <div className="w-12 h-12 rounded-full border border-double border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950/80 text-xl flex items-center justify-center relative shadow-lg">
                    {activeCompanion.avatar.split(' ')[0]}
                    <span className="absolute -bottom-1 -right-1 text-[8px] px-1 bg-emerald-950 text-emerald-300 border border-emerald-900 rounded font-bold uppercase font-mono">
                      SUP
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 mt-1 font-semibold truncate max-w-[70px] text-center">
                    {activeCompanion.name}
                  </span>
                  
                  {/* Thanh máu mini */}
                  {combatCompanionHp > 0 && (
                    <div className="w-12 bg-slate-900 h-1 rounded overflow-hidden mt-1 border border-slate-800">
                      <div style={{ width: `${companionHpPercent}%` }} className="bg-emerald-500 h-full" />
                    </div>
                  )}
                </div>
              )}

              {/* Vị trí 3: PET ĐỨNG SAU (WATER element) */}
              {activePet && isPetInBack && (
                <div 
                  id="active-pet-back"
                  className="flex flex-col items-center justify-center relative opacity-85 scale-90 translate-x-[-10px]"
                >
                  <span className="text-[20px]">{activePet.avatar}</span>
                  <span className="text-[8px] text-sky-400 font-mono">
                    {activePet.name}
                  </span>
                </div>
              )}

              {/* Vị trí TRỌNG TÂM: NGƯỜI CHƠI (PLAYER AVATAR) */}
              <div id="player-battle-avatar" className="flex flex-col items-center justify-center z-10 relative">
                <div className="absolute -inset-1 rounded-full bg-amber-500/10 blur-md pointer-events-none" />
                <div className="w-16 h-16 rounded-full border-4 border-amber-500/40 bg-slate-900 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(245,158,11,0.25)] relative">
                  🥋
                  <span className="absolute -top-1 -right-1 text-[9px] w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black font-mono">
                    {playerStats.level}
                  </span>
                </div>
                <span className="text-xs text-amber-300 font-extrabold mt-1.5 flex items-center gap-1">
                  Đại Hiệp (Ta)
                </span>
                
                {/* Thanh máu Player chính */}
                <div className="w-20 bg-slate-900 h-2 rounded-full overflow-hidden mt-1.5 border border-slate-800">
                  <div 
                    style={{ width: `${playerHpPercent}%` }} 
                    className="bg-gradient-to-r from-red-500 to-rose-600 h-full transition-all duration-300" 
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  HP: {combatPlayerHp}/{totalStats.maxHp}
                </span>
              </div>

              {/* Vị trí 4: ĐỒNG HÀNH TIÊN PHONG (TANK - Đứng trước) */}
              {activeCompanion && isCompanionInFront && (
                <div 
                  id="active-comp-front"
                  className="flex flex-col items-center justify-center relative translate-y-1 z-20 scale-105"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-amber-500 border-dashed bg-gradient-to-b from-slate-900 to-slate-950 text-2xl flex items-center justify-center relative shadow-xl">
                    {activeCompanion.avatar.split(' ')[0]}
                    <span className="absolute -bottom-1 -right-1 text-[8px] px-1 bg-amber-500 text-slate-950 rounded font-black uppercase font-mono">
                      TANK
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-200 mt-1 font-bold truncate max-w-[80px] text-center">
                    {activeCompanion.name}
                  </span>

                  {/* Thanh máu TANK companion */}
                  {combatCompanionHp > 0 && (
                    <div className="w-12 bg-slate-900 h-1.5 rounded overflow-hidden mt-1 border border-slate-800">
                      <div style={{ width: `${companionHpPercent}%` }} className="bg-amber-400 h-full" />
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-slate-400">
                    HP: {combatCompanionHp}
                  </span>
                </div>
              )}

              {/* Vị trí 5: PET TIÊN PHONG (FIRE element - Đập quái) */}
              {activePet && isPetInFront && (
                <div 
                  id="active-pet-front"
                  className="flex flex-col items-center justify-center relative z-20 scale-95 translate-x-[15px]"
                >
                  <span className="text-[26px] drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">{activePet.avatar}</span>
                  <span className="text-[9px] text-rose-400 font-bold font-mono">
                    {activePet.name}
                  </span>
                </div>
              )}

            </div>

            {/* SẤM SÉT CHIA ĐÔI KIẾM THỨC TRẬN ĐỊA */}
            <div className="text-slate-700 font-black tracking-widest pointer-events-none select-none text-md font-mono">
              VS
            </div>

            {/* BÊN PHẢI: CHIẾN ĐỘI QUÁI VẬT THÁP (ENEMY BOSS) */}
            <div id="enemy-battle-side" className="w-1/2 flex flex-col items-center justify-center relative">
              <div className="absolute -inset-2 rounded-full bg-red-500/5 blur-xl pointer-events-none" />

              {combatEnemyHp > 0 ? (
                <div className="flex flex-col items-center">
                  <span className={`text-6xl p-2 select-none filter transition-all ${
                    isBossFight 
                      ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse' 
                      : isMiniBossFight 
                      ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]' 
                      : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
                  }`}>
                    {enemy.avatar}
                  </span>

                  <h4 className={`text-xs font-black tracking-wide mt-2 text-center flex items-center gap-1 ${
                    isBossFight 
                      ? 'text-rose-500 text-sm' 
                      : isMiniBossFight 
                      ? 'text-purple-400' 
                      : 'text-slate-200'
                  }`}>
                    {enemy.name}
                  </h4>

                  {/* Thanh máu Ma Thần/Quái */}
                  <div className="w-24 bg-slate-900 h-2 rounded-full overflow-hidden mt-1.5 border border-slate-800">
                    <div 
                      style={{ width: `${enemyHpPercent}%` }} 
                      className={`h-full transition-all duration-300 ${
                        isBossFight 
                          ? 'bg-rose-600' 
                          : isMiniBossFight 
                          ? 'bg-purple-500' 
                          : 'bg-emerald-500'
                      }`} 
                    />
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 mt-1">
                    HP: {combatEnemyHp}/{enemy.maxHp}
                  </span>

                  {enemy.skillName && (
                    <span className="text-[8px] bg-slate-900 border border-slate-800 text-rose-400 px-1.5 py-0.5 rounded uppercase mt-1 font-semibold leading-none">
                      Tuyệt học cd: {enemy.currentCd || 0}/{enemy.skillCd}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <span className="text-5xl block animate-bounce">📦</span>
                  <p className="text-emerald-400 text-xs font-bold uppercase mt-2">Ải Chủ Bị Hạ Gục!</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Vật phẩm bảo khí đã nằm gọn mâm lễ.</p>
                </div>
              )}
            </div>

          </div>

          {/* KIỂM TRA TỰƠNG THÍCH VŨ KHÍ TRƯỚC CHIẾN ĐẤU */}
          {(() => {
            const equippedArtsIds = playerStats.equippedMartialArts || [];
            const activeArt = MARTIAL_ARTS_POOL.find(art => art.type === 'ACTIVE' && equippedArtsIds.includes(art.id));
            const equippedWeapon = items?.find(item => item.equipped && item.type === 'WEAPON');
            const playerWeaponType = equippedWeapon?.weaponType || 'CHƯỞNG';
            const isWeaponMismatch = activeArt && 
              activeArt.artCategory !== 'NỘI CÔNG' && 
              activeArt.artCategory !== 'THÂN PHÁP' && 
              activeArt.artCategory !== playerWeaponType;

            if (isWeaponMismatch && activeArt) {
              return (
                <div className="mt-4 p-3 bg-red-950/70 border border-red-500/30 rounded-lg text-xs flex items-start gap-2 text-rose-200 shadow-md">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                  <div className="leading-relaxed">
                    <strong className="text-red-400 block font-bold mb-0.5">⚠️ VŨ KHÍ KHÔNG TƯƠNG THÍCH TRƯỚC TRẬN ĐẤU!</strong>
                    <span>
                      Công pháp chủ động <strong className="text-amber-400 font-bold">[{activeArt.name}]</strong> cần trang bị vũ khí hệ <strong className="text-amber-400 underline">{activeArt.artCategory}</strong>. Hiện tại ngươi đang rỗng tay hoặc dùng <strong className="text-rose-400">{equippedWeapon ? `[${equippedWeapon.name}] (${equippedWeapon.weaponType})` : '[Tay không/Chưởng]'}</strong>. Bạn sẽ không thể tung chiêu chủ động này trong combat! Hãy đổi vũ khí phù hợp ở Thần Trang Hành Trang.
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* BẢNG ĐIỀU KHIỂN CHIẾN TRẬN CHI TIẾT */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center bg-slate-900 p-3.5 rounded-lg border border-slate-800 gap-3">
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-300">
                🚀 Chế Độ Chiến Đấu: <span className="text-amber-400 font-bold">{isAutoPlaying ? 'TỰ ĐỘNG CÀY THÁP' : 'TẠM NGỪNG'}</span>
              </p>
              <p className="text-[10px] text-slate-500">Mỗi 1.5 giây hệ thống tự tung chiêu quyết đấu dâng hiến.</p>
            </div>

            <div className="flex gap-2">
              <button
                id="btn-toggle-auto-play"
                onClick={onToggleAutoPlay}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-all text-slate-950 cursor-pointer ${
                  isAutoPlaying 
                    ? 'bg-amber-500 hover:bg-amber-400 shadow-md active:scale-95' 
                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-md active:scale-95'
                }`}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950" />
                    Tạm Dừng Cày
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 animate-pulse" />
                    Kích Hoạt Auto
                  </>
                )}
              </button>

              {combatEnemyHp <= 0 ? (
                <button
                  id="btn-next-floor"
                  onClick={onAdvanceFloor}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs uppercase rounded-lg shadow-md transition-all animate-bounce cursor-pointer"
                >
                  Đột Phá Tầng Kế 🔥
                </button>
              ) : combatPlayerHp <= 0 ? (
                <button
                  id="btn-reset-to-cemetery"
                  onClick={onResetToCemetery}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Nhập Niết Bàn (Cát bụi) 💀
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC 2: NHẬT KÝ CHIÊU THỨC (CỘT 3) */}
      <div className="flex flex-col gap-4">
        <div id="combat-logs-card" className="bg-slate-900 border-2 border-slate-800 p-4 rounded-xl flex flex-col h-full min-h-[380px] justify-between shadow-2xl relative overflow-hidden">
          {/* Cover decorative paper text */}
          <div className="absolute top-1 right-2 text-[10px] text-slate-700/30 uppercase font-mono select-none font-black">Scroll Scroll</div>

          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3 flex items-center gap-1">
              📜 Võ Thư Thác Ký Chiêu Thức
            </h3>

            {/* Scrolling log container */}
            <div ref={logContainerRef} className="space-y-2 h-[340px] overflow-y-auto pr-1 text-[11px] leading-relaxed font-serif">
              {battleLogs.length === 0 ? (
                <p className="text-slate-600 italic text-center text-xs mt-12">Chưa khởi kích chiến trận. Hãy nhấn Kích hoạt Auto để sấm truyền chiêu thức võ công!</p>
              ) : (
                battleLogs.slice(-60).map((log) => {
                  let logColor = 'text-slate-300';
                  if (log.type === 'PLAYER_ATTACK') logColor = 'text-slate-100 hover:text-amber-100';
                  if (log.type === 'ENEMY_ATTACK') logColor = 'text-rose-400 font-medium';
                  if (log.type === 'CRIT') logColor = 'text-yellow-400 font-extrabold shadow-[2px_2px_0_rgba(0,0,0,1)]';
                  if (log.type === 'COMPANION_SKILL') logColor = 'text-cyan-400 font-bold';
                  if (log.type === 'PET_SKILL') logColor = 'text-emerald-400 font-bold';
                  if (log.type === 'HP_RESTORE') logColor = 'text-emerald-500 font-bold';
                  if (log.type === 'VICTORY') logColor = 'text-emerald-400 font-black text-xs border border-emerald-900/30 p-1.5 rounded bg-emerald-950/20';
                  if (log.type === 'DEFEAT') logColor = 'text-rose-500 font-black text-xs border border-rose-900/30 p-1.5 rounded bg-rose-955/20';
                  if (log.type === 'SYSTEM') logColor = 'text-orange-400 font-bold';

                  return (
                    <div 
                      key={log.id} 
                      className={`p-1.5 rounded hover:bg-slate-950/40 border-b border-slate-850/30 transition-colors ${logColor}`}
                    >
                      {log.text}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-3 bg-slate-950 p-2.5 rounded border border-slate-850 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>⚔️ Sát thương Công cơ bản: <b className="text-rose-400">{totalStats.dmg}</b></span>
            <span>🔥 Tỷ lệ bạo kích: <b className="text-yellow-400">{totalStats.crit}%</b></span>
            <span>🍀 Khí vận: <b className="text-purple-400">{totalStats.luck}</b></span>
          </div>
        </div>
      </div>

    </div>
  );
};
