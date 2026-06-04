import React, { useState } from 'react';
import { PlayerStats, Companion, Pet } from '../types';
import { PRESET_COMPANIONS, PRESET_PETS } from '../data';
import { Shield, Users, Award, HelpCircle, Heart, Zap, Sparkles, Feather, Flame, Droplet, ArrowUpCircle } from 'lucide-react';

interface RecruitmentViewProps {
  stats: PlayerStats;
  companions: Companion[];
  ownedPets: Pet[];
  activeCompanion: Companion | null;
  activePet: Pet | null;
  onRecruitCompanion: (companion: Companion) => void;
  onUpgradeCompanion: (companionId: string) => void;
  onTamePet: (pet: Pet) => void;
  onUpgradePet: (petId: string) => void;
  onSelectCompanion: (companionId: string | null) => void;
  onSelectPet: (petId: string | null) => void;
}

export const RecruitmentView: React.FC<RecruitmentViewProps> = ({
  stats,
  companions,
  ownedPets,
  activeCompanion,
  activePet,
  onRecruitCompanion,
  onUpgradeCompanion,
  onTamePet,
  onUpgradePet,
  onSelectCompanion,
  onSelectPet
}) => {
  const [activeTab, setActiveTab] = useState<'COMPANION' | 'PET'>('COMPANION');
  const [tamingAttemptMsg, setTamingAttemptMsg] = useState<string | null>(null);

  // Chi phí chiêu mộ đồng hành (đã cài sẵn cố định)
  const getCompanionHireCost = (c: Companion) => {
    // Giá trị linh thạch chiêu mộ dựa theo khí khái anh hùng
    switch (c.id) {
      case 'c1': return { stones: 2, gold: 50 }; // Quách Tĩnh
      case 'c2': return { stones: 4, gold: 120 }; // Tiêu Phong
      case 'c3': return { stones: 2, gold: 80 }; // Đoàn Dự
      case 'c4': return { stones: 3, gold: 70 }; // Vương Ngữ Yên
      case 'c5': return { stones: 3, gold: 100 }; // Tiểu Long Nữ
      default: return { stones: 1, gold: 40 };
    }
  };

  // Nâng cấp đồng hành
  const getUpgradeCompanionCost = (level: number) => {
    return Math.floor(2 + (level * 1.5)); // Linh thạch tăng tiến theo tầng võ học
  };

  // Nâng cấp linh thú
  const getUpgradePetCost = (level: number) => {
    return Math.floor(1 + (level * 1.2)); // Linh thạch tăng tiến
  };

  // Roll linh thú hoang dã xuất hiện để người chơi thuần phục
  const [wildPetEncounter, setWildPetEncounter] = useState<Pet | null>(null);
  const getSummonWildPetCost = () => 100; // Tiêu tốn 100 vàng dâng mồi

  const handleSummonEncounter = () => {
    if (stats.gold < getSummonWildPetCost()) return;
    stats.gold -= getSummonWildPetCost(); // Sẽ thực hiện qua hàm gọi của cha nếu muốn, tuy nhiên ta trừ tạm thời ở đây hoặc bọc gói chung
    const randPet = PRESET_PETS[Math.floor(Math.random() * PRESET_PETS.length)];
    // Nhân bản pet để tạo id riêng biệt
    const newWildPet = {
      ...randPet,
      id: `pet_wild_${Date.now()}_${Math.floor(Math.random() * 100)}`
    };
    setWildPetEncounter(newWildPet);
    setTamingAttemptMsg(null);
  };

  const handleTamingSkillAttempt = (pet: Pet) => {
    // Tỉ lệ thuần thục tăng dựa trên may mắn của người chơi
    const luckFactor = stats.luck * 0.5; 
    const finalChance = Math.min(95, pet.captureChance + luckFactor);
    const roll = Math.random() * 100;

    if (roll <= finalChance) {
      onTamePet(pet);
      setTamingAttemptMsg(`🎉 Thành công! Nhờ khí vận cao ngút, ngươi đã thuần hóa được ${pet.name}!`);
      setWildPetEncounter(null);
    } else {
      setTamingAttemptMsg(`❌ Thất bại! ${pet.name} hung hãn xé rách mồi dụ gầm thét, nó đã đào thoát vào rừng sâu.`);
      setWildPetEncounter(null);
    }
  };

  // Trực tiếp dùng linh thạch câu kéo tâm can taming 100%
  const handleTamingDirectByStones = (pet: Pet) => {
    if (stats.stones < 3) return;
    stats.stones -= 3; // Chạy hàm
    onTamePet({ ...pet, captureChance: 100 });
    setTamingAttemptMsg(`💎 Thành công mĩ mãn! Ngươi đã quy phục ${pet.name} bằng 3 viên Linh Thạch tinh khiết!`);
    setWildPetEncounter(null);
  };

  return (
    <div id="recruitment-panel" className="bg-slate-900 border-2 border-slate-800 p-6 rounded-xl text-slate-100 shadow-2xl">
      {/* TABS SELECTOR */}
      <div className="flex border-b border-slate-800 mb-6 font-bold text-sm">
        <button
          id="btn-tab-companion"
          onClick={() => setActiveTab('COMPANION')}
          className={`pb-3 px-6 text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === 'COMPANION' ? 'border-b-2 border-amber-400 text-amber-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> TRỮ QUÁN ĐỒNG HÀNH
        </button>

        <button
          id="btn-tab-pet"
          onClick={() => setActiveTab('PET')}
          className={`pb-3 px-6 text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === 'PET' ? 'border-b-2 border-amber-400 text-amber-300' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Flame className="w-4 h-4" /> LINH THÚ THẦN VIÊN
        </button>
      </div>

      {/* 1. TAB ĐỒNG HÀNH */}
      {activeTab === 'COMPANION' && (
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-200 mb-1">CHIÊU BỆNH ANH HÙNG GIANG HỒ</h3>
            <p className="text-xs text-slate-400">
              Chiêu mộ thêm các cao thủ võ lâm để cùng kề vai chiến đấu vượt tháp. 
              Mỗi đồng hành sở hữu vai trò và vị trí đặc biệt trên sa trường:
              <br />
              🛡️ <span className="text-amber-400 font-bold">Role Đỡ Đòn (Tank)</span> đứng TRƯỚC mặt người chơi để chắn sát thương.
              <br />
              🧬 <span className="text-emerald-400 font-bold">Role Hỗ Trợ (Support) / Tấn Công (DPS)</span> đứng SAU lưng truyền kình khí gia tăng sát lực hoặc hồi phục trị liệu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_COMPANIONS.map((preset) => {
              const recruited = companions.find(c => c.id === preset.id);
              const isActive = activeCompanion?.id === preset.id;
              const hireCost = getCompanionHireCost(preset);

              const canHire = stats.gold >= hireCost.gold && stats.stones >= hireCost.stones;
              const currentLevel = recruited ? recruited.level : 1;
              const upgradeCost = getUpgradeCompanionCost(currentLevel);
              const canUpgrade = recruited && stats.stones >= upgradeCost;

              return (
                <div
                  key={preset.id}
                  id={`companion-card-${preset.id}`}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between ${
                    isActive
                      ? 'border-amber-400 bg-amber-950/10'
                      : recruited
                      ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      : 'border-slate-800 bg-slate-950/80 grayscale opacity-80 hover:grayscale-0 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{preset.avatar.split(' ')[0]}</span>
                          <h4 className="font-bold text-sm text-slate-200">{preset.name}</h4>
                          <span className="text-[10px] bg-slate-950 border border-slate-800 text-amber-400 px-1.5 py-0.5 rounded">
                            {preset.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                            preset.role === 'TANK' ? 'bg-amber-950/60 text-amber-400 border border-amber-900' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-900'
                          }`}>
                            VỊ TRÍ: {preset.role === 'TANK' ? 'ĐỠ ĐÒN (ĐỨNG TRƯỚC)' : 'HẬU CẦN (ĐỨNG SAU)'}
                          </span>
                          {recruited && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              Cấp {recruited.level}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2 italic">
                      "{preset.description}"
                    </p>

                    <div className="bg-slate-950/50 p-2 border border-slate-800/80 rounded mb-3 text-xs">
                      <div className="text-amber-400 font-semibold text-[10px] uppercase tracking-wide">Tuyệt kỹ liên hoàn: {preset.skillName}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{preset.skillDesc}</div>
                      <div className="mt-1 flex items-center gap-4 text-[10px] font-mono text-slate-500">
                        <span>💪 Công: {recruited ? recruited.dmg : preset.dmg} | ❤️ Máu: {recruited ? recruited.hp : preset.hp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-3 border-t border-slate-800/40 flex items-center justify-between">
                    {!recruited ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="text-xs">
                          <span className="text-slate-500 block uppercase text-[8px] font-mono">Giá chiêu mộ</span>
                          <span className="font-mono text-amber-300 font-bold">{hireCost.gold} Vàng</span>
                          <span className="text-slate-400"> & </span>
                          <span className="font-mono text-emerald-400 font-bold">{hireCost.stones} Đá</span>
                        </div>
                        
                        <button
                          id={`btn-hire-${preset.id}`}
                          disabled={!canHire}
                          onClick={() => onRecruitCompanion(preset)}
                          className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                            canHire
                              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                          }`}
                        >
                          Kết Giao
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-between w-full">
                        <div className="flex gap-2">
                          {isActive ? (
                            <button
                              id={`btn-select-none-${preset.id}`}
                              onClick={() => onSelectCompanion(null)}
                              className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-900/40 rounded text-xs font-bold cursor-pointer"
                            >
                              Nghỉ ngơi
                            </button>
                          ) : (
                            <button
                              id={`btn-select-${preset.id}`}
                              onClick={() => onSelectCompanion(recruited.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded text-xs font-bold cursor-pointer"
                            >
                              Xuất Trận
                            </button>
                          )}
                        </div>

                        {/* Nâng cấp tư chất đồng hành */}
                        <div className="text-right">
                          <span className="text-[8px] text-slate-500 block uppercase font-mono">Đốt phá cấp {recruited.level}</span>
                          <button
                            id={`btn-upgrade-comp-${preset.id}`}
                            disabled={!canUpgrade}
                            onClick={() => onUpgradeCompanion(recruited.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer ${
                              canUpgrade
                                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/20'
                                : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                            }`}
                            title={`Tăng 15% chỉ số, cần ${upgradeCost} Linh thạch`}
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            Tu Luyện ({upgradeCost} Đá)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TAB LINH THÚ */}
      {activeTab === 'PET' && (
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-200 mb-1">LINH THÚ THUẦN HÓA VIÊN</h3>
            <p className="text-xs text-slate-400">
              Thu thập linh vật thiên giới để bổ trợ mạnh mẽ cho trận đánh. Linh thú có định vị chiến thuật cụ thể trên sa trường theo thuộc tính ngũ hành:
              <br />
              🦅⚡ <span className="text-yellow-400 font-bold">Hệ Phong / Linh thú Bay lượn bay lơ lửng trên đầu</span> ngắm nhìn và buff bạo sát dồi dào.
              <br />
              🦁🔥 <span className="text-rose-400 font-bold">Hệ Hỏa đứng đằng trước bảo vệ chủ nhân</span> cắn xé giảm lực áp chế địch.
              <br />
              🐸❄️ <span className="text-sky-400 font-bold">Hệ Thủy đứng phía sau hậu thuẫn</span> dâng nước hồi phục sinh lực an thần.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* TRAI NUÔI ROLL PET HOANG DÃ */}
            <div className="w-full lg:w-2/5 p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase text-amber-400 mb-3 flex items-center gap-1">
                  🐾 Tìm kiếm Linh Thú Hoang Dã
                </h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Dâng mồi dụ Linh thú quý hiếm để dẫn dụ chúng từ thượng giới ma vực đáp xuống. Sau đó dùng nội lực hoặc bảo ngọc phục tùng chúng!
                </p>

                {wildPetEncounter ? (
                  <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-lg text-center animate-pulse">
                    <span className="text-5xl block mb-2">{wildPetEncounter.avatar}</span>
                    <h5 className="font-bold text-sm text-amber-300">{wildPetEncounter.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono bg-slate-950 py-0.5 inline-block px-2 rounded border border-slate-800">
                      Thuộc tính: {wildPetEncounter.elementName}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed italic">
                      "{wildPetEncounter.skillName}: {wildPetEncounter.skillDesc}"
                    </p>
                    <div className="mt-3 text-xs bg-slate-950 p-2 rounded">
                      <span className="text-slate-400 block text-[9px] font-mono">TỶ LỆ THUẦN PHỤC TỰ NHIÊN</span>
                      <strong className="text-emerald-400">{wildPetEncounter.captureChance}%</strong> 
                      <span className="text-slate-500"> (+Khí vận của đạo hữu sẽ tăng hiệu suất này)</span>
                    </div>

                    <div className="mt-4 gap-2 grid grid-cols-2">
                      <button
                        id="btn-tame-attempt"
                        onClick={() => handleTamingSkillAttempt(wildPetEncounter)}
                        className="py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold cursor-pointer"
                      >
                        ⚡ Dùng khí vận thu phục
                      </button>
                      <button
                        id="btn-tame-stones"
                        disabled={stats.stones < 3}
                        onClick={() => handleTamingDirectByStones(wildPetEncounter)}
                        className={`py-1.5 rounded text-xs font-bold cursor-pointer ${
                          stats.stones >= 3 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                            : 'bg-slate-850 text-slate-500 cursor-not-allowed'
                        }`}
                        title="Dùng 3 linh thạch thu phục 100% không bay màu"
                      >
                        💎 Quy phục (3 Đá)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center rounded border border-dashed border-slate-800 bg-slate-900/30 text-slate-500">
                    <span className="text-4xl block mb-2">🏔️</span>
                    <p className="text-xs">Đang yên ắng chưa có linh thú đáp bãi bồi.</p>
                  </div>
                )}

                {tamingAttemptMsg && (
                  <div className="mt-3 p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-200">
                    {tamingAttemptMsg}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <button
                  id="btn-summon-wild-pet"
                  disabled={stats.gold < getSummonWildPetCost()}
                  onClick={handleSummonEncounter}
                  className={`w-full py-2 rounded font-bold text-xs uppercase cursor-pointer ${
                    stats.gold >= getSummonWildPetCost()
                      ? 'bg-purple-600 hover:bg-purple-500 text-slate-100 shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  🍖 Summon mồi nhử Linh thú ({getSummonWildPetCost()} Vàng)
                </button>
              </div>
            </div>

            {/* DANH SÁCH LINH THÚ ĐÃ SỞ HỮU VÀ TRANG BỊ */}
            <div className="flex-1">
              <h4 className="text-xs font-bold uppercase text-emerald-400 mb-3 block">
                🐉 Danh Sách Linh Thú Đã Quy Phục
              </h4>

              {ownedPets.length === 0 ? (
                <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-500">
                  <span className="text-2xl block mb-2">🥚</span>
                  <p className="text-xs">Chưa thu phục được linh thú nào. Dâng mồi dụ hoặc hoàn thành tầng boss để nhặt trứng taming.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[360px] overflow-y-auto">
                  {ownedPets.map((p) => {
                    const isActive = activePet?.id === p.id;
                    const upgradeCost = getUpgradePetCost(p.level);
                    const canUpgrade = stats.stones >= upgradeCost;

                    return (
                      <div
                        key={p.id}
                        id={`pet-card-${p.id}`}
                        className={`p-3.5 rounded-lg border-2 flex items-center justify-between gap-3 ${
                          isActive
                            ? 'border-emerald-500 bg-emerald-950/20 shadow-emerald-900/10'
                            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{p.avatar}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-slate-200">{p.name}</h5>
                              <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 rounded font-mono">
                                LV {p.level}
                              </span>
                              <span className="text-[9px] px-1 bg-slate-900 text-amber-500 rounded font-bold font-mono">
                                {p.elementName}
                              </span>
                            </div>
                            
                            <div className="text-[10px] text-slate-400 mt-1">
                              <strong>Thụ động cộng:</strong> +{p.dmgBonus} DMG | +{p.critBonus}% Crit | +{p.hpBonus} HP | +{p.luckBonus} Luck
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              <strong>Skill:</strong> "{p.skillName}" - {p.skillDesc}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2.5 min-w-[110px]">
                          {isActive ? (
                            <button
                              id={`btn-select-none-pet-${p.id}`}
                              onClick={() => onSelectPet(null)}
                              className="px-2.5 py-1 text-[10px] bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-900/45 rounded font-bold cursor-pointer w-full text-center"
                            >
                              Ẩn Đi
                            </button>
                          ) : (
                            <button
                              id={`btn-select-pet-${p.id}`}
                              onClick={() => onSelectPet(p.id)}
                              className="px-2.5 py-1 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded font-bold cursor-pointer w-full text-center"
                            >
                              Xuất Trận
                            </button>
                          )}

                          {/* Cho pet ăn linh thạch để up chỉ số */}
                          <button
                            id={`btn-upgrade-pet-${p.id}`}
                            disabled={!canUpgrade}
                            onClick={() => onUpgradePet(p.id)}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded cursor-pointer w-full text-center ${
                              canUpgrade
                                ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-705'
                                : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                            }`}
                            title={`Tăng 15% tất cả chỉ số cộng dồn của Pet. Cần ${upgradeCost} Linh thạch`}
                          >
                            ⭐ Cúc Dục (+{upgradeCost} Đá)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
