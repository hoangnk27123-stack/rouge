import React, { useState } from 'react';
import { PlayerStats, MartialArt } from '../types';
import { MARTIAL_ARTS_POOL } from '../data';
import { BookOpen, Star, Sparkles, Lock, Shield, Zap, Flame, Compass, HelpCircle } from 'lucide-react';

interface MartialArtsViewProps {
  stats: PlayerStats;
  savvy: number; // Ngộ Tính
  maProgress: Record<string, {
    id: string;
    level: number;
    exp: number;
    stars: number;
    shards: number;
    realm: number;
  }>;
  onEquipMartialArt: (artId: string) => void;
  onUnequipMartialArt: (artId: string) => void;
  onUnlockMartialArt: (artId: string) => void;
  onStarUpMartialArt: (artId: string) => void;
  onBreakthroughRealm: (artId: string) => void;
}

export const REALM_NAMES = ['Nhập Môn', 'Tiểu Thành', 'Đại Thành', 'Viên Mãn'];

export const REALM_COLORS = [
  'text-slate-400', 
  'text-cyan-400 font-semibold', 
  'text-purple-400 font-bold', 
  'text-amber-400 font-black tracking-wide bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-500/20'
];

export const MartialArtsView: React.FC<MartialArtsViewProps> = ({
  stats,
  savvy,
  maProgress,
  onEquipMartialArt,
  onUnequipMartialArt,
  onUnlockMartialArt,
  onStarUpMartialArt,
  onBreakthroughRealm,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'EQUIPPED' | 'ACTIVE' | 'NỘI CÔNG' | 'THÂN PHÁP'>('ALL');
  const [selectedArtId, setSelectedArtId] = useState<string>('ma1');

  // Chi phí nâng mảnh vĩnh hằng (Stars)
  const getStarUpCost = (currentStars: number) => {
    if (currentStars === 0) return 10; // Chi phí Mở khoá ban đầu
    if (currentStars === 1) return 15;
    if (currentStars === 2) return 30;
    if (currentStars === 3) return 50;
    if (currentStars === 4) return 100;
    return 99999; // Max sao
  };

  // Chi phí Ngộ Tính đột phá Cảnh giới (Realm)
  const getRealmCost = (currentRealm: number) => {
    if (currentRealm === 0) return 15; // Nhập Môn -> Tiểu Thành
    if (currentRealm === 1) return 30; // Tiểu Thành -> Đại Thành
    if (currentRealm === 2) return 60; // Đại Thành -> Viên Mãn
    return 99999; // Max cảnh giới
  };

  const selectedProgress = maProgress[selectedArtId] || {
    id: selectedArtId,
    level: 1,
    exp: 0,
    stars: 0,
    shards: 0,
    realm: 0,
  };

  const selectedArtDetail = MARTIAL_ARTS_POOL.find(art => art.id === selectedArtId)!;

  // Lấy ra danh sách các công pháp dựa trên bộ lọc
  const initialFilteredArts = MARTIAL_ARTS_POOL.filter(art => {
    const progress = maProgress[art.id] || { stars: 0 };
    const isEquipped = (stats.equippedMartialArts || []).includes(art.id);

    if (filterCategory === 'EQUIPPED') return isEquipped;
    if (filterCategory === 'ACTIVE') return art.type === 'ACTIVE';
    if (filterCategory === 'NỘI CÔNG') return art.artCategory === 'NỘI CÔNG';
    if (filterCategory === 'THÂN PHÁP') return art.artCategory === 'THÂN PHÁP';
    return true;
  });

  // Sắp xếp các công pháp đang mang (EQUIPPED) lên hàng đầu
  const filteredArts = [...initialFilteredArts].sort((a, b) => {
    const isEquippedA = (stats.equippedMartialArts || []).includes(a.id) ? 1 : 0;
    const isEquippedB = (stats.equippedMartialArts || []).includes(b.id) ? 1 : 0;
    return isEquippedB - isEquippedA;
  });

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'bg-slate-900 border-slate-700 text-slate-300';
      case 'RARE': return 'bg-blue-950/40 border-blue-500/35 text-blue-300';
      case 'EPIC': return 'bg-purple-950/40 border-purple-500/35 text-purple-300';
      case 'LEGENDARY': return 'bg-amber-950/40 border-amber-500/35 text-amber-300';
      case 'MYTHIC': return 'bg-rose-950/40 border-rose-500/35 text-rose-300 animate-pulse';
      default: return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <div id="martial-arts-panel" className="bg-slate-950 border-2 border-slate-800 p-4 md:p-6 rounded-2xl text-slate-100 shadow-2xl relative flex flex-col gap-6">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 via-amber-500 to-indigo-500 opacity-80" />
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950/50 border border-cyan-500/30 rounded-xl text-cyan-400">
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-widest text-cyan-300 uppercase">TÔNG VƯƠNG CÔNG PHÁP</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Nơi bồi dưỡng võ đạo chí thượng gồm 03 lớp phát triển: <strong className="text-amber-400">Sao</strong> (Mảnh bảo tháp), <strong className="text-purple-400">Cảnh Giới</strong> (Ngộ tính tinh tủy) vĩnh hằng và <strong className="text-cyan-400">Cấp Độ</strong> (Chân khí mạt vận lâm thời).
            </p>
          </div>
        </div>

        {/* Ngộ Tính Stats Pocket */}
        <div className="flex items-center gap-6 bg-slate-900/60 px-4 py-2 border border-slate-850 rounded-xl self-start md:self-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">💎</span>
            <div>
              <span className="block text-[8px] uppercase tracking-wide text-slate-400 font-mono">Đá Khí Hải (Hồi Tháp)</span>
              <span className="text-xs font-bold text-slate-200 font-mono">{stats.stones} Thạch</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-950/40 border border-purple-500/30 rounded text-purple-400">
              <Sparkles className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wide text-slate-400 font-mono">Ngộ Tính Tinh Anh</span>
              <span className="text-xs font-bold text-purple-300 font-mono">{savvy} Linh Khí</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE LAYERS INSTRUCTIONS INFOBAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-850">
        <div className="text-xs flex items-start gap-2">
          <div className="p-1.5 bg-cyan-950/20 text-cyan-400 rounded font-bold font-mono">1</div>
          <div>
            <strong className="text-cyan-300 block">Level (Chân Khí Hầu)</strong>
            <span className="text-slate-400 text-[11px] leading-relaxed">Tăng khi quái chết trong run. Sức mạnh bộc phát cực hạn, mất đi khi Đại Hiệp tử trận.</span>
          </div>
        </div>

        <div className="text-xs flex items-start gap-2 border-t sm:border-t-0 sm:border-x border-slate-900 pt-2 sm:pt-0 sm:px-3">
          <div className="p-1.5 bg-amber-950/20 text-amber-400 rounded font-bold font-mono">2</div>
          <div>
            <strong className="text-amber-300 block">Tiên Cốt Sao (Mảnh)</strong>
            <span className="text-slate-400 text-[11px] leading-relaxed">Thu từ Mini/Mega Boss. Đạt đủ mảnh để Mở khóa & Nâng sao vĩnh hằng (Tăng % thực kình mạnh mẽ).</span>
          </div>
        </div>

        <div className="text-xs flex items-start gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
          <div className="p-1.5 bg-purple-950/20 text-purple-400 rounded font-bold font-mono">3</div>
          <div>
            <strong className="text-purple-300 block">Đột Phá Cảnh Giới</strong>
            <span className="text-slate-400 text-[11px] leading-relaxed">Tiêu hao Ngộ Tính (tổ sư kì ngộ, di ngôn tử trận) đột phá vĩnh viễn, mở khóa thêm cơ chế tuyệt kỹ tối cao!</span>
          </div>
        </div>
      </div>

      {/* 3. CORE INTERFACE: SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LIST & CATEGORY FILTERS (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* CATEGORY SWIPER BAR */}
          <div className="flex flex-wrap gap-1 bg-slate-900/60 p-1.5 border border-slate-850 rounded-xl text-xs font-bold">
            {(['ALL', 'EQUIPPED', 'ACTIVE', 'NỘI CÔNG', 'THÂN PHÁP'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFilterCategory(cat);
                  // Find all arts matching the selected category filter
                  const categoryArts = MARTIAL_ARTS_POOL.filter(art => {
                    const isEquipped = (stats.equippedMartialArts || []).includes(art.id);
                    if (cat === 'EQUIPPED') return isEquipped;
                    if (cat === 'ACTIVE') return art.type === 'ACTIVE';
                    if (cat === 'NỘI CÔNG') return art.artCategory === 'NỘI CÔNG';
                    if (cat === 'THÂN PHÁP') return art.artCategory === 'THÂN PHÁP';
                    return true;
                  });

                  // Prioritize selecting an equipped martial art in this category
                  const equippedMatch = categoryArts.find(art => 
                    (stats.equippedMartialArts || []).includes(art.id)
                  );

                  if (equippedMatch) {
                    setSelectedArtId(equippedMatch.id);
                  } else if (categoryArts.length > 0) {
                    setSelectedArtId(categoryArts[0].id);
                  }
                }}
                className={`flex-1 py-1.5 px-2.5 rounded transition-all cursor-pointer truncate ${
                  filterCategory === cat
                    ? 'bg-gradient-to-br from-cyan-600 to-indigo-700 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {cat === 'ALL' ? 'Tất cả' : cat === 'EQUIPPED' ? 'Đã Mang' : cat === 'ACTIVE' ? 'Chủ Động' : cat === 'NỘI CÔNG' ? 'Nội Công' : 'Thân Pháp'}
              </button>
            ))}
          </div>

          {/* LIST CARD HOLDER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredArts.map(art => {
              const progress = maProgress[art.id] || { stars: 0, level: 1, realm: 0 };
              const isLocked = progress.stars === 0;
              const isRunOwned = (stats.martialArts || []).includes(art.id);
              const isEquipped = (stats.equippedMartialArts || []).includes(art.id);
              const isSelected = selectedArtId === art.id;

              return (
                <button
                  key={art.id}
                  id={`ma-item-${art.id}`}
                  onClick={() => setSelectedArtId(art.id)}
                  className={`p-3 relative rounded-xl border text-left transition-all hover:scale-[1.01] flex flex-col justify-between gap-2.5 h-28 cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : isLocked
                        ? 'border-slate-900 bg-slate-900/20 text-slate-500 opacity-60'
                        : 'border-slate-850 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  {/* Status Badges */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {isEquipped && (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                        Đang Mang
                      </span>
                    )}
                    {!isLocked && !isRunOwned && (
                      <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[8px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                        Chưa Kích Hoạt
                      </span>
                    )}
                    {isLocked ? (
                      <span className="text-slate-600 text-xs">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs flex items-center">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        {progress.stars}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className={`text-xs font-black truncate block pr-16 ${isLocked ? 'text-slate-500' : isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {art.name}
                    </h4>
                    <span className="text-[9px] font-mono opacity-80 uppercase block tracking-wider mt-0.5 text-slate-400">
                      Cổ học: {art.artCategory} • {art.type === 'ACTIVE' ? 'Chủ động' : 'Thành tố'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {isLocked ? (
                      <div className="text-[9px] text-slate-500">
                        Chưa ngộ • Mảnh: <span className="text-slate-400 font-bold">{progress.shards}/10</span>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-between text-[9px]">
                        <span className="text-cyan-400 font-mono font-bold">Lvl {progress.level}</span>
                        <span className="text-purple-400 font-bold">{REALM_NAMES[progress.realm]}</span>
                      </div>
                    )}
                    <span className={`text-[8.5px] border font-bold uppercase py-0.5 px-1.5 rounded ${getRarityBadgeColor(art.rarity)}`}>
                      {art.rarity}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredArts.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs font-mono">
                Không tìm thấy võ công thuộc bộ lọc này.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRECISE UPGRADE & BREAKTHROUGH PANEL (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
          {/* Header Description */}
          <div className="border-b border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black border uppercase tracking-wider py-0.5 px-1.5 rounded ${getRarityBadgeColor(selectedArtDetail.rarity)}`}>
                {selectedArtDetail.rarity}
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest">{selectedArtDetail.artCategory}</span>
            </div>
            <h3 className="text-sm font-black text-amber-300 mt-1 uppercase tracking-wide">{selectedArtDetail.name}</h3>
            <p className="text-[11px] text-slate-300 font-sans mt-1.5 bg-slate-950/40 p-2 border border-slate-900 rounded font-serif italic text-justify leading-relaxed">
              "{selectedArtDetail.description}"
            </p>
            
            {/* TINH HOA CHI TIẾT CÔNG PHÁP */}
            <div className="mt-3 bg-slate-950/80 p-3 border border-cyan-950 rounded-xl space-y-2 text-[11px]">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">Phân Loại:</span>
                <span className="font-bold text-cyan-300 font-mono">{selectedArtDetail.type === 'ACTIVE' ? 'Chủ Động (Active)' : 'Thành Tố Thụ Động (Passive)'}</span>
              </div>
              {selectedArtDetail.type === 'ACTIVE' && (
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Sát Thương Cơ Bản:</span>
                  <span className="font-extrabold text-rose-400 font-mono">{Math.floor(selectedArtDetail.damageMultiplier * 100)}% DMG</span>
                </div>
              )}
              {selectedArtDetail.type === 'ACTIVE' && (
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Thời Gian Hồi Chiêu:</span>
                  <span className="font-bold text-slate-300 font-mono">{selectedArtDetail.cooldown} Hiệp</span>
                </div>
              )}
              <div className="space-y-2 pt-1">
                <span className="text-slate-400 block font-semibold">Hiệu Ứng Chiêu Thức:</span>
                <p className="bg-slate-900 p-2 rounded border border-slate-850 text-emerald-300 font-medium leading-snug">
                  ✨ {selectedArtDetail.effect}
                </p>

                {selectedArtDetail.type === 'PASSIVE' && (() => {
                  const progress = selectedProgress;
                  const isUnlocked = progress.stars > 0;
                  
                  // Evasion scale factors
                  let baseEvasion = 0;
                  if (selectedArtDetail.id === 'ma_than_1') {
                    baseEvasion = 0.25;
                  } else if (selectedArtDetail.id === 'ma_than_3') {
                    baseEvasion = 0.20;
                  } else if (selectedArtDetail.id === 'ma_than_2') {
                    baseEvasion = 0.15;
                  }

                  const isThanPhap = baseEvasion > 0;

                  // General passive scale calculation
                  const levelFactor = isUnlocked ? (1 + (progress.level - 1) * 0.05 + (progress.stars - 1) * 0.10) : 0;
                  let realmFactor = 1.0;
                  if (progress.realm === 1) realmFactor = 1.35;
                  else if (progress.realm === 2) realmFactor = 1.70;
                  else if (progress.realm === 3) realmFactor = 2.00;
                  const scale = levelFactor * realmFactor;

                  if (isThanPhap) {
                    const procChance = isUnlocked ? (60 + (progress.stars - 1) * 5) : 0;
                    const reduction = isUnlocked ? Math.min(0.95, baseEvasion * realmFactor + progress.level * 0.03) : 0;
                    return (
                      <div className="bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20 text-[10.5px] space-y-1.5 mt-2">
                        <div className="text-emerald-400 font-extrabold flex items-center justify-between">
                          <span>● HIỆU QUẢ CÔNG PHÁP THỰC TẾ:</span>
                          {isUnlocked ? (
                            <span className="text-cyan-300 font-mono">Proc: {procChance}% • Khấu giảm: {Math.round(reduction * 100)}%</span>
                          ) : (
                            <span className="text-slate-500 italic">Chưa Kích Hoạt</span>
                          )}
                        </div>
                        {isUnlocked && (
                          <div className="text-slate-200 mt-1">
                            Khi bị địch tấn công, Thân Pháp có <span className="text-cyan-300 font-bold">{procChance}% tỉ lệ kích hoạt</span> để triệt tiêu vĩnh viễn <span className="text-emerald-400 font-bold">{Math.round(reduction * 100)}% sát thương</span> nhận vào.
                          </div>
                        )}
                        <div className="text-slate-400 text-[10px] bg-slate-950/80 p-2 rounded font-mono mt-1 border border-slate-900 border-dashed space-y-1">
                          <span className="text-purple-300 block font-semibold select-none">📐 Giải thích công thức tính toán:</span>
                          <div className="text-slate-300 pl-1 leading-normal space-y-1">
                            <div>• <span className="text-amber-400">Tỉ lệ Kích hoạt (Proc Rate):</span></div>
                            <div className="pl-3.5 text-slate-400">
                              Formula: <code className="text-cyan-300">60% + (Sao - 1) * 5%</code>
                            </div>
                            <div className="pl-3.5 text-slate-400 font-bold">
                              ➔ Quy đổi: 60% + ({progress.stars} - 1) * 5% = <span className="text-amber-400">{procChance}%</span>
                            </div>

                            <div className="pt-1">• <span className="text-emerald-400">Khấu giảm sát thương (Damage Reduction):</span></div>
                            <div className="pl-3.5 text-slate-400">
                              Formula: <code className="text-cyan-300">Cơ bản * Cảnh giới + 3% * Cấp độ</code>
                            </div>
                            <div className="pl-3.5 text-slate-400 italic">
                              Hằng số: Cơ bản = {baseEvasion * 100}%, Cảnh giới = {REALM_NAMES[progress.realm]} ({realmFactor}x), Cấp độ = {progress.level}
                            </div>
                            <div className="pl-3.5 text-slate-400 font-bold">
                              ➔ Quy đổi: ({baseEvasion * 100}% * {realmFactor}) + (3% * {progress.level}) = <span className="text-emerald-400">{Math.round(reduction * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // Other passives
                    let activeEffectDesc = '';
                    let formulaDesc = '';
                    if (selectedArtDetail.id === 'ma3') { // Cửu Dương Thần Công
                      activeEffectDesc = `Cửu Dương chân khí gia tăng vĩnh hằng +${Math.round(25 * scale)}% Công cơ bản và cộng dồn thêm +${Math.round(300 * scale)} HP tối đa.`;
                      formulaDesc = `Công: +${Math.round(25 * scale)}% (25% * Scale ${scale.toFixed(2)}x) • HP: +${Math.round(300 * scale)} (300 * Scale ${scale.toFixed(2)}x)`;
                    } else if (selectedArtDetail.id === 'ma5') { // Dịch Cân Kinh
                      activeEffectDesc = `Một vòng tu tuần hoàn, tự động hồi phục phát khí +${Math.round(8 * scale)}% Máu tối đa vào cuối mỗi hiệp.`;
                      formulaDesc = `Hồi HP mỗi hiệp: +${Math.round(8 * scale)}% (8% * Scale ${scale.toFixed(2)}x)`;
                    } else if (selectedArtDetail.id === 'ma_noi_1') { // Cửu Âm Chân Kinh
                      activeEffectDesc = `Gia trì tinh túy vĩnh hằng +${Math.round(25 * scale)}% Sát thương tổng thể và +${Math.round(15 * scale)} Vận khí nhân phẩm.`;
                      formulaDesc = `Sát thương: +${Math.round(25 * scale)}% (25% * Scale ${scale.toFixed(2)}x) • Thêm khí vận: +${Math.round(15 * scale)} (15 * Scale ${scale.toFixed(2)}x)`;
                    } else if (selectedArtDetail.id === 'ma_noi_2') { // Quỳ Hoa Bảo Điển
                      activeEffectDesc = `Chiêu tốc bộc bốc đem lại +${Math.round(15 * scale)}% Khả năng Chí mạng và +${Math.round(15 * scale)}% Sát thương Chí mạng.`;
                      formulaDesc = `Chí mạng: +${Math.round(15 * scale)}% (15% * Scale ${scale.toFixed(2)}x) • Dame bạo kích: +${Math.round(15 * scale)}% (15% * Scale ${scale.toFixed(2)}x)`;
                    } else if (selectedArtDetail.id === 'ma_noi_3') { // Tiêu Dao Tiểu Vô Tướng Công
                      activeEffectDesc = `Khơi thông mạch đan điền linh động găm thêm +${Math.round(15 * scale)} Sát thương tăng tiến xuyên suốt sau mỗi lượt chiến trường.`;
                      formulaDesc = `Vân kình mỗi cước: +${Math.round(15 * scale)} (15 * Scale ${scale.toFixed(2)}x)`;
                    }

                    if (!activeEffectDesc) return null;

                    return (
                      <div className="bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-500/10 text-[10.5px] space-y-1.5 mt-2">
                        <div className="text-cyan-400 font-extrabold flex items-center justify-between">
                          <span>● HIỆU QUẢ CÔNG PHÁP THỰC TẾ:</span>
                          {isUnlocked ? (
                            <span className="text-emerald-400 font-mono">Hệ số Võ học (Scale): {scale.toFixed(2)}x</span>
                          ) : (
                            <span className="text-slate-500 italic">Chưa Kích Hoạt</span>
                          )}
                        </div>
                        {isUnlocked && (
                          <div className="text-slate-200 mt-1">
                            {activeEffectDesc}
                          </div>
                        )}
                        <div className="text-slate-400 text-[10px] bg-slate-950/80 p-2 rounded font-mono mt-1 border border-slate-900 border-dashed space-y-1">
                          <span className="text-purple-300 block font-semibold select-none">📐 Giải thích công thức tính toán:</span>
                          <div className="text-slate-300 pl-1 leading-normal space-y-1">
                            <div>• <span className="text-amber-400">Hiệu quả thụ động thực tế</span> = Chỉ số gốc * Hệ số Võ Lâm</div>
                            <div>• <span className="text-cyan-400">Hệ số Võ Lâm (Scale):</span></div>
                            <div className="pl-3.5 text-slate-400">
                              Formula: <code className="text-cyan-300">(1 + (Cấp - 1) * 5% + (Sao - 1) * 10%) * Cảnh giới</code>
                            </div>
                            <div className="pl-3.5 text-slate-400 italic">
                              Hằng số: Cấp dã = {progress.level}, Sao tiên = {progress.stars}, Đột phá {REALM_NAMES[progress.realm]} ({realmFactor}x)
                            </div>
                            <div className="pl-3.5 text-slate-400 font-bold">
                              ➔ Quy đổi: (1 + ({progress.level} - 1) * 0.05 + ({progress.stars} - 1) * 0.10) * {realmFactor} = <span className="text-emerald-400">{scale.toFixed(2)}x</span>
                            </div>
                            <div className="pl-3.5 text-amber-300 font-bold pt-1">
                              ➔ Thống kê: {formulaDesc}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>

          {/* THREE GROWTH LAYERS MANAGEMENT */}

          {/* LAYER 1: LEVEL (TEMPORARY RUN LEVEL) */}
          <div className="space-y-2.5 bg-slate-950/20 p-3 rounded-xl border border-slate-900">
            <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-cyan-400">⚡</span>
                <span className="text-slate-300">Level (Tăng trong run, mất khi chết)</span>
              </div>
              <span className="text-cyan-400 font-extrabold font-mono text-xs">Cấp {selectedProgress.level} / 10</span>
            </div>
            
            {/* Exp Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-mono text-slate-400">
                <span>Tu Luyện Chân Khí</span>
                <span>{selectedProgress.stars > 0 ? `${selectedProgress.exp} / ${selectedProgress.level * 80} EXP` : 'Khóa'}</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${selectedProgress.stars > 0 ? Math.min(100, (selectedProgress.exp / (selectedProgress.level * 80)) * 100) : 0}%` }}
                />
              </div>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-snug">
              Hạ sát dã thủ trong Tháp tích lũy Chân khí ngẫu nhiên tăng cấp võ học. Mỗi cấp đem lại <strong className="text-cyan-300">+8% Sát thương chiêu</strong> (Active) hoặc <strong className="text-cyan-300">+5% Chỉ số tinh tủy</strong> (Passive).
            </p>
          </div>

          {/* LAYER 2: SHARDS & STARS (PERMANENT) */}
          <div className="space-y-3 bg-slate-950/20 p-3 rounded-xl border border-slate-900">
            <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-amber-400">⭐</span>
                <span className="text-slate-300">Tiên Cốt Sao (Vĩnh cửu giữ lại)</span>
              </div>
              <span className="text-amber-400 font-extrabold font-mono text-xs">
                {selectedProgress.stars === 0 ? 'CHƯA MỞ KHÓA' : `${selectedProgress.stars} / 5 Sao`}
              </span>
            </div>

            {/* Shard Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-mono text-slate-400">
                <span>Mảnh Công Pháp hiện tại</span>
                <span>{selectedProgress.shards} / {getStarUpCost(selectedProgress.stars)} Mảnh</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900 flex">
                <div 
                  className="bg-gradient-to-r from-yellow-600 to-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (selectedProgress.shards / getStarUpCost(selectedProgress.stars)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 justify-between">
              <p className="text-[9.5px] text-slate-400 leading-snug">
                {selectedProgress.stars === 0 
                  ? 'Mở khóa võ học để mang vào bộ trang bị chiến tháp.' 
                  : `Nâng sao tăng vĩnh viễn +12% Sát thương chiêu (hoặc +10% chỉ số thu được).`}
              </p>

              {selectedProgress.stars < 5 ? (
                <button
                  id="btn-ma-starup"
                  onClick={() => {
                    if (selectedProgress.stars === 0) {
                      onUnlockMartialArt(selectedArtId);
                    } else {
                      onStarUpMartialArt(selectedArtId);
                    }
                  }}
                  disabled={selectedProgress.shards < getStarUpCost(selectedProgress.stars)}
                  className={`w-full sm:w-auto px-3 py-1.5 rounded font-bold text-[10px] uppercase tracking-wider transition-all shadow cursor-pointer text-center whitespace-nowrap ${
                    selectedProgress.shards >= getStarUpCost(selectedProgress.stars)
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 hover:scale-102'
                      : 'bg-slate-950 text-slate-500 border border-slate-900 cursor-not-allowed'
                  }`}
                >
                  {selectedProgress.stars === 0 
                    ? `Học Võ Công (${getStarUpCost(selectedProgress.stars)} mảnh)` 
                    : `Thăng Sao (-${getStarUpCost(selectedProgress.stars)} mảnh)`}
                </button>
              ) : (
                <span className="text-[9.5px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                  ⭐ Đã thăng đạt Thần Cốt!
                </span>
              )}
            </div>
          </div>

          {/* LAYER 3: REALM CẢNH GIỚI (PERMANENT) */}
          <div className="space-y-3 bg-slate-950/20 p-3 rounded-xl border border-slate-900 relative">
            <div className="flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-purple-400">🔮</span>
                <span className="text-slate-300">Đột Phá Cảnh Giới (Vĩnh cửu)</span>
              </div>
              <span className={REALM_COLORS[selectedProgress.realm]}>
                Cảnh giới: {REALM_NAMES[selectedProgress.realm]}
              </span>
            </div>

            {/* Realm breakout effects description */}
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 text-[10px] space-y-1 text-slate-300 leading-relaxed font-sans">
              <strong className="text-purple-400 block uppercase font-mono tracking-wider mb-1">Mạch Hiệu Ứng Theo Cảnh Giới:</strong>
              <div className="flex items-center gap-1 text-slate-500">
                <span className="w-1 h-1 bg-slate-500 rounded-full" />
                <span className="font-semibold text-slate-400">Nhập Môn (Cấp 0):</span> Sức mạnh võ học dã thảo ban đầu.
              </div>
              <div className={`flex items-start gap-1 ${selectedProgress.realm >= 1 ? 'text-cyan-300' : 'text-slate-600'}`}>
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold">Tiêu Thành (Cấp 1):</strong>{' '}
                  {selectedArtDetail.type === 'ACTIVE' 
                    ? 'Giảm hồi chiêu này đi 1 hiệp đấu trong trận chiến!' 
                    : 'Gia trì tăng hiệu lực chỉ số thụ động vĩnh viễn thêm 1.35 lần!'}
                </span>
              </div>
              <div className={`flex items-start gap-1 ${selectedProgress.realm >= 2 ? 'text-purple-300' : 'text-slate-600'}`}>
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold">Đại Thành (Cấp 2):</strong>{' '}
                  {selectedArtDetail.type === 'ACTIVE' 
                    ? 'Đòn tung chiêu tăng mạnh +15% Khả năng Chí mạng chí tử!' 
                    : 'Gia trì tăng hiệu lực chỉ số thụ động vĩnh viễn thêm 1.70 lần!'}
                </span>
              </div>
              <div className={`flex items-start gap-1 ${selectedProgress.realm >= 3 ? 'text-amber-300' : 'text-slate-600'}`}>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold">Viên Mãn (Cấp 3):</strong>{' '}
                  {selectedArtDetail.type === 'ACTIVE' 
                    ? 'Chưởng pháp gây chí mạng sẽ tự phục hồi 10% HP tối đa của bản thân!' 
                    : 'Lĩnh ngộ đại tông sư, tăng vĩnh hằng +20% Sát thương tổng thể của bản thân!'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 justify-between pt-1">
              <span className="text-[9.5px] text-slate-400 font-sans">
                Dùng <span className="text-purple-300 font-bold">Ngộ Tính</span> để khai thông tinh tủy võ học bầm tủy.
              </span>

              {selectedProgress.stars === 0 ? (
                <span className="text-[9.5px] text-rose-400 font-mono italic">
                  ⚠️ Cần mở khóa võ công trước!
                </span>
              ) : selectedProgress.realm < 3 ? (
                <button
                  id="btn-ma-breakthrough"
                  onClick={() => onBreakthroughRealm(selectedArtId)}
                  disabled={savvy < getRealmCost(selectedProgress.realm)}
                  className={`w-full sm:w-auto px-3 py-1.5 rounded font-bold text-[10px] uppercase tracking-wider transition-all shadow cursor-pointer text-center whitespace-nowrap ${
                    savvy >= getRealmCost(selectedProgress.realm)
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:scale-102 border border-purple-400/40'
                      : 'bg-slate-950 text-slate-500 border border-slate-900 cursor-not-allowed'
                  }`}
                >
                  Đột Phá (-{getRealmCost(selectedProgress.realm)} Ngộ Tính)
                </button>
              ) : (
                <span className="text-[9.5px] text-amber-400 font-mono font-bold uppercase tracking-wider animate-pulse">
                  🔮 Đã Đạt Viên Mãn Võ Học!
                </span>
              )}
            </div>
          </div>

          {/* EQUIP / UNEQUIP TOGGLE */}
          <div className="border-t border-slate-850 pt-4 mt-1 flex flex-col gap-2">
            {selectedProgress.stars > 0 ? (
              (() => {
                const isRunOwned = (stats.martialArts || []).includes(selectedArtId);
                const isEquipped = (stats.equippedMartialArts || []).includes(selectedArtId);
                
                if (isRunOwned) {
                  return (
                    <button
                      id="btn-ma-equip-toggle"
                      onClick={() => {
                        if (isEquipped) {
                          onUnequipMartialArt(selectedArtId);
                        } else {
                          onEquipMartialArt(selectedArtId);
                        }
                      }}
                      className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow cursor-pointer text-center ${
                        isEquipped
                          ? 'bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300'
                          : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black hover:scale-[1.01]'
                      }`}
                    >
                      {isEquipped ? '❌ Tháo Hạ Võ Công' : '⚡ Bố Trí Xuất Trận công pháp'}
                    </button>
                  );
                } else {
                  const activateCost = 10;
                  const hasEnoughShards = selectedProgress.shards >= activateCost;
                  return (
                    <div className="flex flex-col gap-2">
                      <div className="text-[10px] text-amber-400 font-bold bg-amber-950/20 py-1.5 px-3 rounded border border-amber-500/25 text-center leading-relaxed">
                        ✨ CÔNG PHÁP ĐÃ MỞ KHÓA VĨNH VIỄN
                        <span className="block text-slate-400 text-[9px] font-normal mt-0.5">
                          Nhưng chưa được lựa chọn kế thừa hay tầm tu đạt được trong lượt chơi này.
                        </span>
                      </div>
                      <button
                        id="btn-ma-run-activate"
                        onClick={() => onUnlockMartialArt(selectedArtId)}
                        disabled={!hasEnoughShards}
                        className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow cursor-pointer text-center ${
                          hasEnoughShards
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 hover:scale-[1.01]'
                            : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                        }`}
                      >
                        ⚡ Kích Hoạt Trong Lượt Này (-10 Mảnh)
                      </button>
                    </div>
                  );
                }
              })()
            ) : (
              <div className="w-full bg-slate-950 text-slate-600 border border-slate-900 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center select-none font-mono">
                🔒 Võ công này chưa được khai thông
              </div>
            )}
            
            {/* Equipping specs limits */}
            <div className="text-[9px] text-center text-slate-500 leading-normal font-mono">
              Hiệp ước võ lâm: Bố trí tối đa 3 chiêu Chủ động (Kiếm/Đao/Bổng/Chưởng), 1 chiêu Nội Công, và 1 chiêu Thân Pháp.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
