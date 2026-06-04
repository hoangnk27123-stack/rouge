import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, Item, Companion, Pet, BattleLog, Enemy, GameView } from './types';
import { calculateTotalStats, getRequiredExpForLevel, checkChance, getRandomCombatMsg, getPassiveScale } from './utils';
import { PRESET_COMPANIONS, generateRandomItem, generateWaveEnemies, MARTIAL_ARTS_POOL } from './data';
import { GameHeader } from './components/GameHeader';
import { BattleView } from './components/BattleView';
import { StatsUpgrade } from './components/StatsUpgrade';
import { InventoryView } from './components/InventoryView';
import { RecruitmentView } from './components/RecruitmentView';
import { AdventureEventView } from './components/AdventureEventView';
import { MartialArtsView } from './components/MartialArtsView';
import { Swords, Star, Coins, Sparkles, BookOpen, Skull, Trophy, Heart, Shield, RefreshCw } from 'lucide-react';

const LOCAL_STORAGE_KEY_STATS = 'vancomatha_stats_v2';
const LOCAL_STORAGE_KEY_COMPANIONS = 'vancomatha_companions_v2';
const LOCAL_STORAGE_KEY_PETS = 'vancomatha_owned_pets_v2';
const LOCAL_STORAGE_KEY_ITEMS = 'vancomatha_items_v2';
const LOCAL_STORAGE_KEY_ACTIVE_COMP = 'vancomatha_active_companion_v2';
const LOCAL_STORAGE_KEY_ACTIVE_PET = 'vancomatha_active_pet_v2';

const defaultStats: PlayerStats = {
  level: 1,
  exp: 0,
  maxExp: 100,
  hp: 120,
  maxHp: 120,
  dmg: 15,
  crit: 5,
  luck: 10,
  gold: 80,
  stones: 2,
  maxFloorReached: 1,
  currentFloor: 1,
  permHpBonus: 0,
  permDmgBonus: 0,
  permLuckBonus: 0,
  permCritBonus: 0,
  reincarnationHp: 0,
  reincarnationDmg: 0,
  reincarnationLuck: 0,
  reincarnationCrit: 0,
  upgradesDmg: 0,
  upgradesCrit: 0,
  upgradesHp: 0,
  upgradesLuck: 0,
  martialArts: [],
  equippedMartialArts: [],
};

// Tính toán điểm công năng/sức mạnh của vật phẩm hỗ trợ so sánh tự động đeo
const getItemPower = (item: Item): number => {
  return (
    (item.dmgBonus || 0) * 10 +
    (item.critBonus || 0) * 15 +
    (item.hpBonus || 0) * 1 +
    (item.luckBonus || 0) * 12
  );
};

// SYNTHESIZER TRONG GAME BẰNG CHÂN KHÔNG AUDIO OSCILLATOR (Try Catch an toàn)
function playRetroSound(type: 'hit' | 'heal' | 'crit' | 'levelup' | 'equip') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'hit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } else if (type === 'heal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.21);
    } else if (type === 'crit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } else if (type === 'levelup') {
      const scale = [523, 659, 784, 1046]; // Đô - Mi - Sol - Đô tầng mây cao
      scale.forEach((freq, i) => {
        const oscN = ctx.createOscillator();
        const gainN = ctx.createGain();
        oscN.connect(gainN);
        gainN.connect(ctx.destination);
        oscN.type = 'sine';
        oscN.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gainN.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.12);
        gainN.gain.linearRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.18);
        oscN.start(ctx.currentTime + i * 0.12);
        oscN.stop(ctx.currentTime + i * 0.12 + 0.2);
      });
    } else if (type === 'equip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    }
  } catch (err) {
    // Kính ẩn nếu trình duyệt khóa hoặc không tương tác ban đầu
  }
}

export default function App() {
  // --- 1. KHỞI TẠO STATE / LOAD LẠI TỪ BỘ NHỚ LOCAL STORAGE ---
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STATS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultStats;
  });

  const [companions, setCompanions] = useState<Companion[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COMPANIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [ownedPets, setOwnedPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PETS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ITEMS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Tặng tân đại hiệp một thanh mộc kiếm thô sơ ban đầu
    return [{
      id: 'init_w',
      name: 'Phác Thiết Kiếm Quèn',
      type: 'WEAPON',
      rarity: 'COMMON',
      dmgBonus: 5,
      description: 'Linh binh cơ bản dắt lưng cứu thân phòng trừ sói tuyết tháp tháp.',
      equipped: true,
      level: 1,
      flavorText: 'Tuy không bóng bẩy nhưng chí ít giúp chủ nhân vung chém địch nhân.'
    }];
  });

  const [activeCompanionId, setActiveCompanionId] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE_COMP);
  });

  const [activePetId, setActivePetId] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE_PET);
  });

  // --- 2. CÁC STATE CHIẾN LỆ VÀ VIEW MANAGER ---
  // Savvy (Ngộ Tính) - Permanent
  const [savvy, setSavvy] = useState<number>(() => {
    const saved = localStorage.getItem('vancomatha_savvy_v2');
    return saved ? Number(saved) : 55; // khởi đầu tặng 55 tinh hoa ngộ tính nâng tầm võ đạo
  });

  // Martial Arts Progress (Level, Exp, Stars, Shards, Realm)
  const [maProgress, setMaProgress] = useState<Record<string, {
    id: string;
    level: number;
    exp: number;
    stars: number;
    shards: number;
    realm: number;
  }>>(() => {
    const saved = localStorage.getItem('vancomatha_ma_progress_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Đảm bảo đủ tất cả võ học trong POOL
        MARTIAL_ARTS_POOL.forEach(art => {
          if (!parsed[art.id]) {
            parsed[art.id] = {
              id: art.id,
              level: 1,
              exp: 0,
              stars: 0,
              shards: 0,
              realm: 0,
            };
          }
        });
        return parsed;
      } catch (e) {}
    }
    
    const initialProgress: Record<string, any> = {};
    MARTIAL_ARTS_POOL.forEach(art => {
      initialProgress[art.id] = {
        id: art.id,
        level: 1,
        exp: 0,
        stars: 0,
        shards: 0,
        realm: 0,
      };
    });
    return initialProgress;
  });

  const [activeView, setActiveView] = useState<GameView>('STORY_INTRO');
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [damagePopups, setDamagePopups] = useState<any[]>([]);

  // Kẻ địch của Tầng hiện tại
  const [enemy, setEnemy] = useState<Enemy | null>(null);

  // Sinh mệnh lâm thời trong Trận chiến đấu (combat)
  const [combatPlayerHp, setCombatPlayerHp] = useState<number>(0);
  const [combatCompanionHp, setCombatCompanionHp] = useState<number>(0);
  const [combatEnemyHp, setCombatEnemyHp] = useState<number>(0);

  // Thống kê luỹ kế Niết Bàn tái thăng
  const [hasNewBonusChosen, setHasNewBonusChosen] = useState<string | null>(null);
  const [selectedInheritArtId, setSelectedInheritArtId] = useState<string | null>(null);
  const [starterChoices, setStarterChoices] = useState<any[]>([]);
  const [reincarnationOption, setReincarnationOption] = useState<1 | 2>(1);

  // Tự động gán võ công thừa kế ban đầu khi đạo thân vỡ nát vào Niết Bàn
  useEffect(() => {
    if (activeView === 'GAME_OVER' && stats.martialArts && stats.martialArts.length > 0) {
      setSelectedInheritArtId(stats.martialArts[0]);
    }
  }, [activeView, stats.martialArts]);

  // Theo dõi hồi chiêu võ học của người chơi trong lúc đánh
  const [combatSkillCds, setCombatSkillCds] = useState<Record<string, number>>({});

  // --- TÍNH TOÁN BẰNG CƠ CHẾ UTILS (Bao Gồm Cộng Thiết Bị) ---
  const activeCompanion = companions.find(c => c.id === activeCompanionId) || null;
  const activePet = ownedPets.find(p => p.id === activePetId) || null;
  const totalStats = calculateTotalStats(stats, items, activePet, activeCompanion, maProgress);

  // Đồng bộ hoàn toàn và sạc đầy HP đấu trường của đại hiệp bất kỳ khi nào HP tối đa thực tế có thay đổi (Nâng cấp, thay Linh thú, thay Trang bị)
  useEffect(() => {
    setCombatPlayerHp(totalStats.maxHp);
    setStats(prev => ({ ...prev, hp: totalStats.maxHp }));
  }, [totalStats.maxHp]);

  // --- 3. TIẾN TRÌNH LƯU TRỮ CHỦ ĐỘNG ---
  useEffect(() => {
    localStorage.setItem('vancomatha_savvy_v2', savvy.toString());
  }, [savvy]);

  useEffect(() => {
    localStorage.setItem('vancomatha_ma_progress_v2', JSON.stringify(maProgress));
  }, [maProgress]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_COMPANIONS, JSON.stringify(companions));
  }, [companions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PETS, JSON.stringify(ownedPets));
  }, [ownedPets]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (activeCompanionId) localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE_COMP, activeCompanionId);
    else localStorage.removeItem(LOCAL_STORAGE_KEY_ACTIVE_COMP);
  }, [activeCompanionId]);

  useEffect(() => {
    if (activePetId) localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE_PET, activePetId);
    else localStorage.removeItem(LOCAL_STORAGE_KEY_ACTIVE_PET);
  }, [activePetId]);

  // Sinh địch nhân mới bất kì khi nào bực tháp, hỗ trợ tham số ghi đè tránh bất đồng bộ (stale closures)
  const spawnEnemyForFloor = (
    fl: number,
    overrideStats?: PlayerStats,
    overrideItems?: Item[],
    overridePet?: Pet | null,
    overrideCompanion?: Companion | null
  ) => {
    const freshEnemy = generateWaveEnemies(fl);
    setEnemy(freshEnemy);
    setCombatEnemyHp(freshEnemy.hp);
    setCombatSkillCds({}); // Phục hồi hồi chiêu toàn bộ võ học của Đại Hiệp
    
    const currentStats = overrideStats || stats;
    const currentItems = overrideItems || items;
    const currentPet = overridePet !== undefined ? overridePet : activePet;
    const currentCompanion = overrideCompanion !== undefined ? overrideCompanion : activeCompanion;

    const resolvedTotalStats = calculateTotalStats(currentStats, currentItems, currentPet, currentCompanion, maProgress);
    setCombatPlayerHp(resolvedTotalStats.maxHp);
    
    if (currentCompanion) {
      setCombatCompanionHp(currentCompanion.hp);
    } else {
      setCombatCompanionHp(0);
    }

    setBattleLogs([
      {
        id: `start_${Date.now()}`,
        text: `⚔️ Đã thấu triệt Cổng Cổ Tháp! Ma đầu [${freshEnemy.name}] ngáng đường! Chuẩn bị ứng thí!`,
        type: 'SYSTEM'
      }
    ]);
  };

  // Khởi phát game lúc ban đầu
  useEffect(() => {
    if (!enemy) {
      spawnEnemyForFloor(stats.currentFloor);
    }
  }, []);

  // Đẩy popup bay nhảy trong Combat Arena
  const triggerDamagePopup = (text: string, isCrit: boolean, type: 'PLAYER' | 'ENEMY' | 'COMPANION' | 'PET' | 'HEAL', isForEnemySide: boolean) => {
    const id = `popup_${Date.now()}_${Math.random()}`;
    const x = isForEnemySide ? 70 + Math.random() * 12 : 25 + Math.random() * 15;
    const y = 45 + Math.random() * 10;
    
    setDamagePopups(prev => [...prev, { id, text, isCrit, type, x, y }]);
    
    // Tự xoá sau 0.8 giây
    setTimeout(() => {
      setDamagePopups(prev => prev.filter(p => p.id !== id));
    }, 800);
  };

  // --- 4. ENGINE: HÀM TÍNH TOÁN CORE CHO 1 LƯỢT CHIẾN ĐẤU AUTO ---
  const triggerOneCombatTick = () => {
    if (!enemy || combatPlayerHp <= 0 || combatEnemyHp <= 0) return;

    let nextEnemyHp = combatEnemyHp;
    let nextPlayerHp = combatPlayerHp;
    let nextCompanionHp = combatCompanionHp;

    const newLogs: BattleLog[] = [];

    // --- 1. NGƯỜI CHƠI RA CHIÊU & KHỞI PHÁT VÕ HỌC ---
    const equippedArtsIds = stats.equippedMartialArts || [];
    const equippedActiveArts = MARTIAL_ARTS_POOL.filter(art => art.type === 'ACTIVE' && equippedArtsIds.includes(art.id));
    const hasDichCanKinh = equippedArtsIds.includes('ma5'); // Thụ động: Dịch Cân Kinh

    // Áp dụng Hồi phục Thụ động của Dịch Cân Kinh đầu lượt
    if (hasDichCanKinh) {
      const healAmt = Math.floor(totalStats.maxHp * 0.08);
      nextPlayerHp = Math.min(totalStats.maxHp, nextPlayerHp + healAmt);
      newLogs.push({
        id: `pl_passive_heal_${Date.now()}`,
        text: `🌿 [Dịch Cân Kinh Thụ Động] Gân cốt thư thái khí huyết lưu thông, Đại Hiệp tự hồi +${healAmt} HP!`,
        type: 'HP_RESTORE'
      });
      triggerDamagePopup(`+${healAmt}`, false, 'HEAL', false);
    }

    // Kiểm tra chiêu thức thi triển
    let castedSkill = null;
    let skillMultiplier = 1.0;
    let extraCritChance = 0;
    let isEnemyStunnedNextTurn = false;

    // Giảm hồi chiêu lâm thời cho các chiêu võ học đang hồi
    const updatedCds = { ...combatSkillCds };
    
    // Tìm chiêu thức sẵn sàng ra trận và đúng loại vũ khí yêu cầu
    const equippedWeapon = items.find(item => item.equipped && item.type === 'WEAPON');
    const playerWeaponType = equippedWeapon?.weaponType || 'CHƯỞNG'; // Không có vũ khí coi như dùng Chưởng Pháp

    for (const art of equippedActiveArts) {
      // Nội công và thân pháp thì không cần, còn võ học chủ động khác cần đúng loại vũ khí vũ trang báng tháp
      const isWeaponTypeMatch = 
        art.artCategory === 'NỘI CÔNG' || 
        art.artCategory === 'THÂN PHÁP' || 
        art.artCategory === playerWeaponType;

      if (!isWeaponTypeMatch) {
        continue; // Khác loại vũ khí thì không kích hoạt
      }

      const cd = updatedCds[art.id] || 0;
      if (cd <= 0) {
        // Sẵn sàng xuất đòn!
        castedSkill = art;
        skillMultiplier = art.damageMultiplier;
        
        // Cảnh Giới 1 (Tiểu Thành): Giảm hồi chiêu này đi 1 hiệp đấu trong trận chiến!
        const castedProgress = maProgress[art.id];
        let baseCd = art.cooldown;
        if (castedProgress && castedProgress.realm >= 1) {
          baseCd = Math.max(1, baseCd - 1);
        }
        updatedCds[art.id] = baseCd; // Reset hồi chiêu lại
        break; // Chỉ xuất một chiêu tông sư mỗi hiệp
      }
    }

    // Giảm thời gian hồi chiêu của các chiêu khác của hiệp đấu hiện tại
    equippedActiveArts.forEach(art => {
      const cd = updatedCds[art.id] || 0;
      if (cd > 0 && art.id !== castedSkill?.id) {
        updatedCds[art.id] = cd - 1;
      }
    });

    setCombatSkillCds(updatedCds); // Cập nhật hồi chiêu cho các hiệp sau

    // Áp dụng các hiệu ứng đặc biệt của Tuyệt kỹ Active vừa thi triển
    if (castedSkill) {
      const castedProgress = maProgress[castedSkill.id];
      if (castedProgress && castedProgress.realm >= 2) {
        extraCritChance += 15; // Cảnh Giới 2 (Đại Thành): Đòn tung chiêu tăng mạnh +15% chí mạng chí tử!
      }

      if (castedSkill.id === 'ma1') { // Thái Cực Kiếm Pháp
        const healAmt = Math.floor(totalStats.maxHp * 0.05);
        nextPlayerHp = Math.min(totalStats.maxHp, nextPlayerHp + healAmt);
        newLogs.push({
          id: `pl_skill_effect_${Date.now()}`,
          text: `☯️ [Thái Cực Kiếm Pháp] Nhu khắc cương, đại hiệp hồi phục +${healAmt} HP khí tông!`,
          type: 'HP_RESTORE'
        });
        triggerDamagePopup(`+${healAmt}`, false, 'HEAL', false);
        playRetroSound('heal');
      } else if (castedSkill.id === 'ma2' || castedSkill.id === 'ma_bong_1') { // Hàng Long Chưởng Thức hoặc Đả Cẩu Bổng Pháp
        isEnemyStunnedNextTurn = true;
      } else if (castedSkill.id === 'ma4') { // Độc Cô Cửu Kiếm
        extraCritChance += 30; // Cộng dồn 30% chí mạng cho một đòn này
      } else if (castedSkill.id === 'ma_kiem_3') { // Tịch Tà Kiếm Phổ
        extraCritChance += 40;
      } else if (castedSkill.id === 'ma_dao_3') { // Ma Đao Thất Sát
        extraCritChance += 20;
      } else if (castedSkill.id === 'ma6') { // Ám Nhiên Tiêu Hồn Chưởng
        const hpRatio = combatPlayerHp / totalStats.maxHp;
        if (hpRatio < 0.35) {
          skillMultiplier = 3.2; // Sát thương tăng vọt khi máu thấp
          newLogs.push({
            id: `pl_skill_effect_${Date.now()}`,
            text: `💔 [Ám Nhiên Tiêu Hồn Chưởng] Đứt ruột tương tư dũng khởi cuồng nộ! Sát thương đại bộc phát tăng vọt!`,
            type: 'SYSTEM'
          });
        }
      } else if (castedSkill.id === 'ma_chuong_3') { // Như Lai Thần Chưởng
        const hpLost = totalStats.maxHp - nextPlayerHp;
        const healAmt = Math.floor(hpLost * 0.45); // Hồi 45% máu đã mất
        if (healAmt > 0) {
          nextPlayerHp = Math.min(totalStats.maxHp, nextPlayerHp + healAmt);
          newLogs.push({
            id: `pl_skill_effect_${Date.now()}`,
            text: `☸️ [Như Lai Thần Chưởng] Vạn Phật triều tông, tụ quang huyễn cảm hồi sinh +${healAmt} HP khí huyết!`,
            type: 'HP_RESTORE'
          });
          triggerDamagePopup(`+${healAmt}`, false, 'HEAL', false);
          playRetroSound('heal');
        }
      } else if (castedSkill.id === 'ma_bong_2') { // Phục Ma Thập Tam Côn
        newLogs.push({
          id: `pl_skill_effect_${Date.now()}`,
          text: `🛡️ [Phục Ma Thập Tam Côn] Côn quang bao phủ, thế trận oanh áp trấn nhiếp chí nhân!`,
          type: 'SYSTEM'
        });
      }
    }

    // Áp dụng Tiêu Dao Tiểu Vô Tướng Công dưỡng kình lâm thời
    let tieuVoTuongBonus = 0;
    if (equippedArtsIds.includes('ma_noi_3')) {
      const scale = getPassiveScale('ma_noi_3', maProgress);
      const currentTurnCount = battleLogs.filter(log => log.type === 'PLAYER_ATTACK' || log.type === 'CRIT' || log.text.includes('[TUYỆT KỸ]')).length + 1;
      tieuVoTuongBonus = Math.floor(currentTurnCount * 15 * scale);
    }

    if (tieuVoTuongBonus > 0) {
      newLogs.push({
        id: `pl_tieu_vo_${Date.now()}`,
        text: `☯️ [Tiểu Vô Tướng Công Thụ Động] Vận hành chu thiên vòng thứ ${Math.floor(tieuVoTuongBonus / (15 * getPassiveScale('ma_noi_3', maProgress)))}, nội kình tích lũy tăng thêm +${tieuVoTuongBonus} công kích lực!`,
        type: 'SYSTEM'
      });
    }

    // Sát thương nhân thêm với multiplier của Tuyệt kỹ võ lâm
    const baseDmg = totalStats.dmg + tieuVoTuongBonus;
    const currentCritChance = totalStats.crit + extraCritChance;
    const isCrit = Math.random() * 100 <= currentCritChance;

    // Tính toán hệ số nâng cấp của chiêu thức chủ động (Active): 
    // +8% Sát thương mỗi cấp võ học, +12% Sát thương mỗi tiên cốt sao
    let activeScale = 1.0;
    if (castedSkill) {
      const castedProgress = maProgress[castedSkill.id] || { level: 1, stars: 1, realm: 0 };
      activeScale = 1 + (castedProgress.level - 1) * 0.08 + (castedProgress.stars - 1) * 0.12;
    }

    const rawDmgPlayer = Math.floor(baseDmg * skillMultiplier * activeScale);
    const finalDmgPlayer = isCrit ? Math.floor(rawDmgPlayer * 1.8) : rawDmgPlayer;

    nextEnemyHp -= finalDmgPlayer;
    playRetroSound(isCrit ? 'crit' : 'hit');

    // Cảnh Giới 3 (Viên Mãn): Nếu đòn tuyệt kỹ gây chí mạng, tự hồi phục 10% HP tối đa của bản thân!
    if (isCrit && castedSkill) {
      const castedProgress = maProgress[castedSkill.id];
      if (castedProgress && castedProgress.realm >= 3) {
        const healAmt = Math.floor(totalStats.maxHp * 0.10);
        nextPlayerHp = Math.min(totalStats.maxHp, nextPlayerHp + healAmt);
        newLogs.push({
          id: `pl_realm3_heal_${Date.now()}`,
          text: `🔮 [Cảnh Giới Viên Mãn] Chiêu thức Chí Mạng quy tông, Đại Hiệp tự hồi phục +${healAmt} HP khí huyết!`,
          type: 'HP_RESTORE'
        });
        triggerDamagePopup(`+${healAmt}`, false, 'HEAL', false);
      }
    }

    // Hấp huyết của Huyết Đao Cuồng Lâu và Bắc Minh Thần Công
    if (castedSkill && (castedSkill.id === 'ma_dao_2' || castedSkill.id === 'ma_noi_act_1')) {
      const lifestealPct = castedSkill.id === 'ma_dao_2' ? 0.15 : 0.20;
      const stolenHp = Math.floor(finalDmgPlayer * lifestealPct);
      if (stolenHp > 0) {
        nextPlayerHp = Math.min(totalStats.maxHp, nextPlayerHp + stolenHp);
        newLogs.push({
          id: `pl_lifesteal_${Date.now()}`,
          text: castedSkill.id === 'ma_dao_2' 
            ? `🩸 [Huyết Đao Cuồng Lâu] Say máu cuồng sát hút +${stolenHp} HP sinh mệnh!`
            : `🌀 [Bắc Minh Thần Công] Thôn tính bách kịch kẻ thù hồi phục +${stolenHp} HP linh khí!`,
          type: 'HP_RESTORE'
        });
        triggerDamagePopup(`+${stolenHp}`, false, 'HEAL', false);
      }
    }

    // Biên dịch thông tin chưởng lực phát ra
    if (castedSkill) {
      newLogs.push({
        id: `pl_skill_cast_${Date.now()}`,
        text: `🔥 [TUYỆT KỸ] Đại Hiệp xuất chiêu [${castedSkill.name}] (${castedSkill.effect})! Gây sát lực -${finalDmgPlayer} HP lên đối phương!`,
        type: isCrit ? 'CRIT' : 'PLAYER_ATTACK'
      });
    } else {
      const customMsg = getRandomCombatMsg('Người chơi', enemy.name);
      newLogs.push({
        id: `pl_att_${Date.now()}_1`,
        text: isCrit 
          ? `🔥 [CHÍ MẠNG] ${customMsg} Gây khủng khiếp -${finalDmgPlayer} HP!` 
          : `⚔️ ${customMsg} Gây -${finalDmgPlayer} HP.`,
        type: isCrit ? 'CRIT' : 'PLAYER_ATTACK'
      });
    }

    triggerDamagePopup(`-${finalDmgPlayer}`, isCrit, 'PLAYER', true);

    // Điểm dồn bạo lực cứu vớt đồng hành, check nếu địch thăng thiên ngay
    if (nextEnemyHp <= 0) {
      resolveBattleVictory(newLogs, nextPlayerHp, nextCompanionHp);
      return;
    }

    // --- 2. ĐỒNG HÀNH RA ĐÒN (Nếu còn sống để chiến đấu) ---
    if (activeCompanion && nextCompanionHp > 0) {
      // Tung đòn dứt điểm
      const isCompCrit = Math.random() < 0.15;
      const compDmg = isCompCrit ? Math.floor(activeCompanion.dmg * 1.6) : activeCompanion.dmg;
      
      // Giảm ngẫu nhiên 20% khả năng dùng Skill
      const useSkill = Math.random() < 0.4;
      if (useSkill) {
        nextEnemyHp -= Math.floor(compDmg * 1.5);
        newLogs.push({
          id: `comp_skill_${Date.now()}`,
          text: `💫 [ĐỒNG HÀNH] ${activeCompanion.name} thi triển Tuyệt kỹ [${activeCompanion.skillName}]: ${activeCompanion.skillDesc} Gây -${Math.floor(compDmg * 1.5)} HP!`,
          type: 'COMPANION_SKILL'
        });
        triggerDamagePopup(`-${Math.floor(compDmg * 1.5)}`, true, 'COMPANION', true);
        
        // Thừa hưởng hiệu ứng đặc biệt từ Companion
        if (activeCompanion.role === 'SUPPORT') {
          // Trị liệu hồi sinh nhỏ
          const healAmount = Math.floor(totalStats.maxHp * 0.1);
          nextPlayerHp = Math.min(totalStats.maxHp, nextPlayerHp + healAmount);
          newLogs.push({
            id: `comp_heal_${Date.now()}`,
            text: `🌿 Trận pháp Chỉ Quy giúp Đại Hiệp hồi phục +${healAmount} HP.`,
            type: 'HP_RESTORE'
          });
          triggerDamagePopup(`+${healAmount}`, false, 'HEAL', false);
          playRetroSound('heal');
        }
      } else {
        nextEnemyHp -= compDmg;
        newLogs.push({
          id: `comp_att_${Date.now()}`,
          text: `🥋 Đồng hành [${activeCompanion.name}] vung kiếm tiếp chiến gây -${compDmg} sát lực lên ${enemy.name}.`,
          type: 'COMPANION_SKILL'
        });
        triggerDamagePopup(`-${compDmg}`, isCompCrit, 'COMPANION', true);
      }

      if (nextEnemyHp <= 0) {
        resolveBattleVictory(newLogs, nextPlayerHp, nextCompanionHp);
        return;
      }
    }

    // --- 3. LINH THÚ HỖ TRỢ XUẤT TRẬN HỘ MỆNH (PET) ---
    if (activePet) {
      const petTriggerChance = 0.55; // 55% kích hoạt bùa phát ngũ hành
      if (Math.random() <= petTriggerChance) {
        let petBonusDmg = Math.floor(activePet.dmgBonus * 1.1);
        
        // Hoạt động riêng của Pet theo ngũ hành
        if (activePet.element === 'FIRE') {
          nextEnemyHp -= petBonusDmg;
          newLogs.push({
            id: `pet_fire_${Date.now()}`,
            text: `🦁🔥 Linh Thú [${activePet.name}] lao lên phun lửa Thánh Hỏa thiêu rụi lông tóc kẻ dịch, gây thêm -${petBonusDmg} HP!`,
            type: 'PET_SKILL'
          });
          triggerDamagePopup(`-${petBonusDmg}`, true, 'PET', true);
        } else if (activePet.element === 'THUNDER') {
          nextEnemyHp -= Math.floor(petBonusDmg * 1.3);
          newLogs.push({
            id: `pet_thunder_${Date.now()}`,
            text: `🐉⚡ Linh Thú [${activePet.name}] bay lượn phóng sấm sét chín tầng mây cực đại oanh kích, gây -${Math.floor(petBonusDmg * 1.3)} HP!`,
            type: 'PET_SKILL'
          });
          triggerDamagePopup(`-${Math.floor(petBonusDmg * 1.2)}`, true, 'PET', true);
          playRetroSound('crit');
        } else if (activePet.element === 'WATER') {
          const healAmount = Math.floor(totalStats.maxHp * 0.08 + activePet.hpBonus * 0.1);
          nextPlayerHp = Math.min(totalStats.maxHp, nextPlayerHp + healAmount);
          newLogs.push({
            id: `pet_water_${Date.now()}`,
            text: `🐸💧 Linh Thú [${activePet.name}] điều động Cam Lộ Thần Thủy hồi phục khí huyết, tẩm bổ +${healAmount} HP cho Đại Hiệp!`,
            type: 'HP_RESTORE'
          });
          triggerDamagePopup(`+${healAmount}`, false, 'HEAL', false);
          playRetroSound('heal');
        } else if (activePet.element === 'WIND') {
          nextEnemyHp -= Math.floor(petBonusDmg * 1.1);
          newLogs.push({
            id: `pet_wind_${Date.now()}`,
            text: `🦉🌪️ Linh Thú [${activePet.name}] tung cánh tạo cuồng phong bão quét quật khởi, gây thêm -${Math.floor(petBonusDmg * 1.1)} HP!`,
            type: 'PET_SKILL'
          });
          triggerDamagePopup(`-${Math.floor(petBonusDmg * 1.1)}`, false, 'PET', true);
        }
      }
    }

    // --- 4. KÈ ĐỊCH PHẢN ĐÒN OANH KÍCH (Bị bỏ qua nếu bị vô hiệu hoá/choáng) ---
    if (isEnemyStunnedNextTurn) {
      newLogs.push({
        id: `enemy_stunned_${Date.now()}`,
        text: `💫 Linh lực chấn động! Kẻ địch [${enemy.name}] bị tuyệt kỹ của Đại Hiệp khống chế hoàn toàn, bất động đứng im bỏ lỡ hiệp đấu này!`,
        type: 'SYSTEM'
      });
    } else {
      const rawEnemyDmg = enemy.dmg;
      const isEnemyCrit = Math.random() * 100 <= enemy.crit;
      const finalEnemyDmg = isEnemyCrit ? Math.floor(rawEnemyDmg * 1.6) : rawEnemyDmg;

      // Phân bổ đối tượng chịu sát thương: Role TANK chặn trước tiên!
      const companionIsTankAndAlive = activeCompanion && activeCompanion.role === 'TANK' && nextCompanionHp > 0;
      
      if (companionIsTankAndAlive) {
        // Tiêu hao bớt sức chống đỡ của Tank Đỡ Đòn
        nextCompanionHp -= finalEnemyDmg;
        newLogs.push({
          id: `en_counter_comp_${Date.now()}`,
          text: `🤢 Kẻ địch ${enemy.name} gầm thét tung chiêu! Đồng hành đỡ đòn [${activeCompanion?.name}] hứng chịu hộ gây -${finalEnemyDmg} máu cho TANK!`,
          type: 'ENEMY_ATTACK'
        });
        triggerDamagePopup(`-${finalEnemyDmg}`, isEnemyCrit, 'ENEMY', false);
        
        if (nextCompanionHp <= 0) {
          nextCompanionHp = 0;
          newLogs.push({
            id: `comp_ko_${Date.now()}`,
            text: `💀 Thương thế quá nặng! Đồng hành [${activeCompanion?.name}] kiệt lực bất tỉnh, đã rút lui khỏi trận để bảo dưỡng kinh sách.`,
            type: 'DEFEAT'
          });
        }
      } else {
        // Người chơi hứng chịu trực diện thương sát - Có thể giảm sát thương từ Thân Pháp
        let actualTakenDmg = finalEnemyDmg;
        let evasionDmgReduction = 0;
        let thanPhapName = '';
        let evasionLogText = '';
        let procChance = 0;
        let evasionProcced = false;

        let thanPhapId = '';
        if (equippedArtsIds.includes('ma_than_1')) {
          thanPhapId = 'ma_than_1';
          thanPhapName = 'Lăng Ba Vi Bộ';
        } else if (equippedArtsIds.includes('ma_than_3')) {
          thanPhapId = 'ma_than_3';
          thanPhapName = 'Thần Hành Bách Biến';
        } else if (equippedArtsIds.includes('ma_than_2')) {
          thanPhapId = 'ma_than_2';
          thanPhapName = 'Vân Long Chiết Thân';
        }

        const randSeed = Math.random().toString(36).substring(2, 7);

        if (thanPhapId) {
          const progress = maProgress[thanPhapId] || { stars: 1, level: 1, realm: 0 };
          procChance = 60 + (progress.stars - 1) * 5; // proc 60% base, +5% per extra star
          
          if (Math.random() * 100 <= procChance) {
            evasionProcced = true;
            
            let baseReduction = 0.15;
            if (thanPhapId === 'ma_than_1') baseReduction = 0.25;
            else if (thanPhapId === 'ma_than_3') baseReduction = 0.20;

            let realmFactor = 1.00;
            if (progress.realm === 1) realmFactor = 1.35;
            else if (progress.realm === 2) realmFactor = 1.70;
            else if (progress.realm === 3) realmFactor = 2.00;

            const levelBonus = progress.level * 0.03; // +3% per level
            
            evasionDmgReduction = Math.min(0.95, baseReduction * realmFactor + levelBonus);
            
            const reduced = Math.floor(actualTakenDmg * evasionDmgReduction);
            actualTakenDmg = Math.max(1, actualTakenDmg - reduced);
            evasionLogText = ` (💨 Nhẹ lướt bộ pháp [${thanPhapName}] triệt tiêu ${Math.round(evasionDmgReduction * 100)}% [-${reduced} HP])`;
            
            newLogs.push({
              id: `pl_evade_reduction_${Date.now()}_${randSeed}`,
              text: `💨 [Thân Pháp - ${thanPhapName} (Khởi phát: ${procChance}%)] Thân thế biến ảo khôn lường triệt tiêu ${Math.round(evasionDmgReduction * 100)}% lực chưởng pháp (-${reduced} HP)!`,
              type: 'SYSTEM'
            });
          } else {
            newLogs.push({
              id: `pl_evade_fail_${Date.now()}_${randSeed}`,
              text: `💨 [Thân Pháp - ${thanPhapName}] Trở bộ không kịp (Tỉ lệ proc ${procChance}% không khởi động), nhận trọn lực chưởng!`,
              type: 'SYSTEM'
            });
          }
        }

        nextPlayerHp -= actualTakenDmg;
        newLogs.push({
          id: `en_counter_pl_${Date.now()}_${randSeed}`,
          text: evasionProcced
            ? `💥 Địch ${enemy.name} đánh ra -${finalEnemyDmg} HP chưởng cơ bản!${evasionLogText} 🩸 Thực tế tổn hại đan điền: -${actualTakenDmg} HP!`
            : `💥 Kẻ địch ${enemy.name} tung ác chiêu hiểm ác đục khoét đan điền ngươi, gây -${actualTakenDmg} HP thương sát trực diện!`,
          type: 'ENEMY_ATTACK'
        });
        triggerDamagePopup(`-${actualTakenDmg}`, isEnemyCrit, 'ENEMY', false);
        playRetroSound('hit');
      }
    }

    // Cập nhật máu lâm thời mới
    setCombatPlayerHp(Math.max(0, nextPlayerHp));
    setCombatCompanionHp(Math.max(0, nextCompanionHp));
    setCombatEnemyHp(Math.max(0, nextEnemyHp));

    // Thổi bùng bại trận
    if (nextPlayerHp <= 0) {
      setIsAutoPlaying(false);
      const gainedSavvyDefeat = Math.max(3, Math.floor(stats.currentFloor * 0.8));
      setSavvy(prev => prev + gainedSavvyDefeat);

      setMaProgress(currentProg => {
        const nextProg = { ...currentProg };
        Object.keys(nextProg).forEach(artId => {
          nextProg[artId] = {
            ...nextProg[artId],
            level: 1,
            exp: 0
          };
        });
        return nextProg;
      });

      newLogs.push({
        id: `pl_defeat_${Date.now()}`,
        text: `💀 Thất bại thảm hại! Chân khí của đại hiệp đã cạn kiệt, Ma đầu đã cướp đi sinh lực của ngươi. Đạo thân vỡ nát nhập cõi Niết Bàn! Đồng thời nhận bồi hoàn +${gainedSavvyDefeat} Ngộ Tính vĩnh viễn thăng dắt cốt!`,
        type: 'DEFEAT'
      });
      setBattleLogs(prev => [...prev, ...newLogs]);
      setActiveView('GAME_OVER');
      return;
    }

    setBattleLogs(prev => [...prev, ...newLogs]);
  };

  // --- 5. BỖNG CHỐC CHIẾN THẮNG: NHẬN THƯỞNG ---
  const resolveBattleVictory = (currentSessionLogs: BattleLog[], finalPlayerHp: number, finalCompanionHp: number) => {
    // Không tự động tắt auto khi đang chơi auto combat
    setCombatEnemyHp(0);
    setCombatPlayerHp(finalPlayerHp);
    setCombatCompanionHp(finalCompanionHp);

    if (!enemy) return;

    // Nhặt thưởng vàng & exp
    const goldDrop = enemy.rewards.gold;
    const expDrop = enemy.rewards.exp;
    const stoneDrop = enemy.rewards.stones;

    // Tỉ lệ rớt hên xui dựa trên May Mắn
    const finalDropChance = enemy.rewards.itemChance * (1 + totalStats.luck * 0.02);
    const dropItemSuccess = Math.random() * 100 <= finalDropChance;

    let droppedItem: Item | null = null;
    let autoEquipMsg = '';

    if (dropItemSuccess) {
      // Sinh đồ xịn
      const newItem = generateRandomItem(stats.currentFloor, totalStats.luck);
      droppedItem = newItem;
      
      const powerNew = getItemPower(newItem);
      const currentlyEquipped = items.find(i => i.equipped && i.type === newItem.type);

      if (!currentlyEquipped) {
        newItem.equipped = true;
        setItems(prev => [...prev, newItem]);
        autoEquipMsg = `🤖 [Tự Động Trang Bị] Do chưa có trang bị cùng loại, Đại Hiệp đã tự động mang [${newItem.name}] (Công năng: ${powerNew})!`;
      } else {
        const powerOld = getItemPower(currentlyEquipped);
        if (powerNew > powerOld) {
          newItem.equipped = true;
          setItems(prev => prev.map(item => {
            if (item.id === currentlyEquipped.id) {
              return { ...item, equipped: false };
            }
            return item;
          }).concat(newItem));
          autoEquipMsg = `🤖 [Tự Động Nâng Cấp] Phát hiện [${newItem.name}] xịn hơn [${currentlyEquipped.name}] (${powerOld} ➔ ${powerNew} công năng), đã tự động thay thế tương ứng!`;
        } else {
          newItem.equipped = false;
          setItems(prev => [...prev, newItem]);
        }
      }
    }

    // Cộng tiền, đá thần pháp
    let updatedGold = stats.gold + goldDrop;
    let updatedStones = stats.stones + stoneDrop;
    let updatedExp = stats.exp + expDrop;
    let updatedLvl = stats.level;
    let updatedMaxExp = stats.maxExp;

    let levelUpMsg = '';
    // Thăng cấp nhân vật
    if (updatedExp >= updatedMaxExp) {
      updatedLvl += 1;
      updatedExp = updatedExp - updatedMaxExp;
      updatedMaxExp = getRequiredExpForLevel(updatedLvl);
      levelUpMsg = `✨ Đại Hiệp đột phá Tu Vi! Đạt Cảnh Giới Cấp ${updatedLvl}! Nội kình gia tăng +2 Base DMG & +40 HP tự động!`;
      playRetroSound('levelup');
    }

    const updatedStats: PlayerStats = {
      ...stats,
      gold: updatedGold,
      stones: updatedStones,
      exp: updatedExp,
      level: updatedLvl,
      maxExp: updatedMaxExp,
      hp: totalStats.maxHp, // Phục hồi đầy máu khi thăng tháp hoặc đột phá
      maxFloorReached: Math.max(stats.maxFloorReached, stats.currentFloor),
    };

    const victoryLogs: BattleLog[] = [
      {
        id: `vic_log_${Date.now()}_1`,
        text: `🎉 LỜI SẤM ĐỊNH MỆNH: Ngươi đã triệt hạ tuyệt phục đại quái [${enemy.name}]!`,
        type: 'VICTORY'
      },
      {
        id: `vic_log_${Date.now()}_2`,
        text: `💰 Thu hoạch võ tàn dư: +${goldDrop} Vàng, +${expDrop} Kinh nghiệm, +${stoneDrop} Linh thạch pháp môn.`,
        type: 'VICTORY'
      }
    ];

    // --- CÔNG PHÁP VÕ HỌC THU HOẠCH ---
    let kfsExpReward = 15 + Math.floor(Math.random() * 6); // 15-20 EXP cơ bản
    if (enemy.type === 'MINI_BOSS') {
      kfsExpReward = 45 + Math.floor(Math.random() * 20); // 45-65 EXP
    } else if (enemy.type === 'MEGA_BOSS') {
      kfsExpReward = 130 + Math.floor(Math.random() * 50); // 130-180 EXP
    }

    // Phần thưởng Ngộ Tính (Savvy) nếu thắng BOSS dũng mãnh
    let bossSavvyReward = 0;
    if (enemy.type === 'MINI_BOSS') bossSavvyReward = 2 + Math.floor(Math.random() * 2); // 2-3 Ngộ tính
    else if (enemy.type === 'MEGA_BOSS') bossSavvyReward = 5 + Math.floor(Math.random() * 4); // 5-8 Ngộ tính

    if (bossSavvyReward > 0) {
      setSavvy(prev => prev + bossSavvyReward);
      victoryLogs.push({
        id: `boss_savvy_${Date.now()}`,
        text: `🔮 [Ngộ Đạo Cổ Tháp]: Thắng Ma Vương, Đại Hiệp thấu đạt võ đạo nhận thêm +${bossSavvyReward} Ngộ Tính tinh anh!`,
        type: 'SYSTEM'
      });
    }

    // Phần thưởng Mảnh Công Pháp (Shards, chỉ rớt từ BOSS)
    let droppedShardsCount = 0;
    let pickedArtId = '';
    if (enemy.type === 'MINI_BOSS' || enemy.type === 'MEGA_BOSS') {
      droppedShardsCount = enemy.type === 'MINI_BOSS' 
        ? (1 + Math.floor(Math.random() * 2)) // 1-2 mảnh
        : (2 + Math.floor(Math.random() * 3)); // 2-4 mảnh

      // Thuật toán tỉ lệ rớt bảo đảm tiến độ vĩnh hằng:
      // 80% là mảnh của các công pháp đang sử dụng
      // 10% sở hữu nhưng không sử dụng
      // 10% chưa sở hữu để mở khóa build mới
      const equipped = stats.equippedMartialArts || ['ma1'];
      const owned = stats.martialArts || ['ma1'];
      const allArts = MARTIAL_ARTS_POOL.map(a => a.id);
      const unowned = allArts.filter(id => !owned.includes(id));
      const ownedNotEquipped = owned.filter(id => !equipped.includes(id));

      const shardRand = Math.random() * 100;
      if (shardRand < 80 && equipped.length > 0) {
        pickedArtId = equipped[Math.floor(Math.random() * equipped.length)];
      } else if (shardRand < 90 && ownedNotEquipped.length > 0) {
        pickedArtId = ownedNotEquipped[Math.floor(Math.random() * ownedNotEquipped.length)];
      } else if (unowned.length > 0) {
        pickedArtId = unowned[Math.floor(Math.random() * unowned.length)];
      } else {
        pickedArtId = allArts[Math.floor(Math.random() * allArts.length)];
      }
    }

    if (pickedArtId && droppedShardsCount > 0) {
      const artName = MARTIAL_ARTS_POOL.find(a => a.id === pickedArtId)?.name || pickedArtId;
      victoryLogs.push({
        id: `boss_shards_${Date.now()}`,
        text: `💎 [Mảnh Công Pháp]: Thắng Boss tháp, nhặt bảo hộp chứa +${droppedShardsCount} Mảnh [${artName}]!`,
        type: 'SYSTEM'
      });
    }

    // Cập nhật maProgress (EXP cho công pháp đang trang bị trong Run, cộng mảnh thu hoạch được)
    const equippedArtsIds = stats.equippedMartialArts || [];
    const updatedProg = { ...maProgress };
    const levelUpAnnouncements: string[] = [];

    equippedArtsIds.forEach(id => {
      if (updatedProg[id]) {
        const artState = updatedProg[id];
        // Cấp tối đa trong run là 10
        if (artState.level < 10 && artState.stars > 0) {
          let nextEp = artState.exp + kfsExpReward;
          let currentLvl = artState.level;
          let reqEp = currentLvl * 80;
          let didLvlUp = false;

          while (nextEp >= reqEp && currentLvl < 10) {
            nextEp -= reqEp;
            currentLvl += 1;
            reqEp = currentLvl * 80;
            didLvlUp = true;
          }

          if (didLvlUp) {
            const artName = MARTIAL_ARTS_POOL.find(a => a.id === id)?.name || id;
            levelUpAnnouncements.push(`⚡ [Công Pháp] Đắc linh lực thăng hoa! [${artName}] đạt Cấp ${currentLvl} huyễn diệu!`);
          }

          updatedProg[id] = {
            ...artState,
            level: currentLvl,
            exp: currentLvl === 10 ? 0 : nextEp
          };
        }
      }
    });

    // Thêm mảnh
    if (pickedArtId && droppedShardsCount > 0) {
      const artState = updatedProg[pickedArtId] || {
        id: pickedArtId,
        level: 1,
        exp: 0,
        stars: pickedArtId === 'ma1' ? 1 : 0,
        shards: 0,
        realm: 0,
      };
      updatedProg[pickedArtId] = {
        ...artState,
        shards: artState.shards + droppedShardsCount
      };
    }

    // Xúc tiến thông báo lên bảng nhật chí - Tạo id bảo đảm duy nhất tuyệt đối với Math.random
    levelUpAnnouncements.forEach((textMsg, idx) => {
      victoryLogs.push({
        id: `ma_lvlup_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 9)}`,
        text: textMsg,
        type: 'SYSTEM'
      });
    });

    setMaProgress(updatedProg);

    setStats(updatedStats);

    if (droppedItem) {
      victoryLogs.push({
        id: `vic_log_${Date.now()}_3`,
        text: `🎁 NHẶT ĐƯỢC THẦN KHÍ: Đạo hữu may mắn nhặt được [${droppedItem.name}] (Rarity: ${droppedItem.rarity})!`,
        type: 'SYSTEM'
      });
      if (autoEquipMsg) {
        victoryLogs.push({
          id: `vic_log_${Date.now()}_auto_eq`,
          text: autoEquipMsg,
          type: 'SYSTEM'
        });
      } else {
        victoryLogs.push({
          id: `vic_log_${Date.now()}_no_eq`,
          text: `🎒 Trang bị hiện tại của Đại Hiệp vẫn xịn hơn. [${droppedItem.name}] đã được cất cẩn thận vào rương hành trang.`,
          type: 'SYSTEM'
        });
      }
      playRetroSound('equip');
    }

    if (levelUpMsg) {
      victoryLogs.push({
        id: `vic_log_${Date.now()}_lvl`,
        text: levelUpMsg,
        type: 'SYSTEM'
      });
    }

    setBattleLogs(prev => [...prev, ...currentSessionLogs, ...victoryLogs]);
  };

  // --- 6. HÀM TỰ ĐỘNG CHẠY CHIẾN TRẬN AUTO BATTLER SỬ DỤNG TIMER ---
  useEffect(() => {
    let timer: any = null;
    if (isAutoPlaying && enemy && combatPlayerHp > 0 && combatEnemyHp > 0) {
      timer = setInterval(() => {
        triggerOneCombatTick();
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, enemy, combatPlayerHp, combatEnemyHp, combatCompanionHp]);

  // Bộ giám sát tự động kích chuyển tầng khi đang ở chế độ rảnh tay
  useEffect(() => {
    let advanceTimer: any = null;
    if (isAutoPlaying && enemy && combatEnemyHp <= 0 && combatPlayerHp > 0) {
      advanceTimer = setTimeout(() => {
        handleAdvanceFloor();
      }, 1000); // Đặt tốc chuyển tầng nhảy vút thành 1.0 giây để tăng tốc tự động cày tháp theo yêu cầu
    }
    return () => {
      if (advanceTimer) clearTimeout(advanceTimer);
    };
  }, [isAutoPlaying, enemy, combatEnemyHp, combatPlayerHp]);

  // --- 7. ĐỘT PHÁ MA THÁP LÊN TẦNG KẾ (Bao gồm rẽ nhánh Roguelike) ---
  const handleAdvanceFloor = () => {
    const nextFloor = stats.currentFloor + 1;
    
    // Lưu lại tháp kỷ lục
    setStats(prev => ({
      ...prev,
      currentFloor: nextFloor,
      maxFloorReached: Math.max(prev.maxFloorReached, nextFloor)
    }));

    // Quy luật Roguelike: Từ tầng 1 sau khi diệt quái, có 30% gặp "Kỳ Duyên" giang hồ nếu không phải tầng boss
    const isBossNext = nextFloor % 5 === 0;
    const triggerEvent = !isBossNext && Math.random() < 0.35;

    if (triggerEvent) {
      setActiveView('ROGUELIKE_CHOICE');
      setIsAutoPlaying(false);
    } else {
      setActiveView('BATTLE');
      spawnEnemyForFloor(nextFloor);
    }
  };

  // --- 8. NGỘ ĐẠO KỲ DUYÊN HOÀT TẤT ---
  const handleEventResolved = (updatedStats: PlayerStats, addedItem: Item | null, outcomeMsg: string) => {
    setStats(updatedStats);
    let autoEquipMsg = '';

    if (addedItem) {
      const powerNew = getItemPower(addedItem);
      const currentlyEquipped = items.find(i => i.equipped && i.type === addedItem.type);

      if (!currentlyEquipped) {
        addedItem.equipped = true;
        setItems(prev => [...prev, addedItem!]);
        autoEquipMsg = `🤖 [Tự Động Trang Bị] Nhận từ Kì Ngộ giang hồ, Đại Hiệp đã đem mặc [${addedItem.name}] (Công năng: ${powerNew})!`;
      } else {
        const powerOld = getItemPower(currentlyEquipped);
        if (powerNew > powerOld) {
          addedItem.equipped = true;
          setItems(prev => prev.map(item => {
            if (item.id === currentlyEquipped.id) {
              return { ...item, equipped: false };
            }
            return item;
          }).concat(addedItem!));
          autoEquipMsg = `🤖 [Tự Động Nâng Cấp] Nhận bảo giáp Kì Ngộ [${addedItem.name}] xịn vượt trội [${currentlyEquipped.name}] (${powerOld} ➔ ${powerNew} công năng), đã tự đeo thay thế!`;
        } else {
          addedItem.equipped = false;
          setItems(prev => [...prev, addedItem!]);
        }
      }
    }
    
    // Quay lại đấu trường quẹt tháp với stats cập nhật để tính đúng HP
    setActiveView('BATTLE');
    spawnEnemyForFloor(updatedStats.currentFloor, updatedStats);

    if (autoEquipMsg) {
      setBattleLogs(prev => [
        ...prev,
        {
          id: `ki_ngo_equip_${Date.now()}`,
          text: autoEquipMsg,
          type: 'SYSTEM'
        }
      ]);
      playRetroSound('equip');
    }
  };

  // --- 9. NÂNG CẤP CHỈ SỐ BẰNG VÀNG ---
  const handleUpgradeStat = (statType: 'DMG' | 'CRIT' | 'HP' | 'LUCK') => {
    // Chi phí bồi dưỡng dựa trên số lần tu luyện đã mua trong kiếp này
    const getUpgradeCost = (type: 'DMG' | 'CRIT' | 'HP' | 'LUCK') => {
      switch (type) {
        case 'DMG': return Math.floor(15 * Math.pow(1.3, stats.upgradesDmg || 0));
        case 'CRIT': return Math.floor(50 * Math.pow(1.4, stats.upgradesCrit || 0));
        case 'HP': return Math.floor(10 * Math.pow(1.25, stats.upgradesHp || 0));
        case 'LUCK': return Math.floor(40 * Math.pow(1.35, stats.upgradesLuck || 0));
      }
    };

    const cost = getUpgradeCost(statType);
    if (stats.gold < cost) return;

    let updated = { ...stats, gold: stats.gold - cost };
    switch (statType) {
      case 'DMG':
        updated.dmg += 3;
        updated.upgradesDmg = (updated.upgradesDmg || 0) + 1;
        break;
      case 'CRIT':
        if (updated.crit >= 75) return; // Giới hạn cơ bản 75%
        updated.crit += 2;
        updated.upgradesCrit = (updated.upgradesCrit || 0) + 1;
        break;
      case 'HP':
        updated.maxHp += 40;
        updated.hp = updated.maxHp; // Cập nhật máu hiện tại lên mức tối đa mới (hoàn toàn hồi phục)
        updated.upgradesHp = (updated.upgradesHp || 0) + 1;
        break;
      case 'LUCK':
        updated.luck += 4;
        updated.upgradesLuck = (updated.upgradesLuck || 0) + 1;
        break;
    }

    setStats(updated);

    // Hồi đầy máu trong đấu trường ngay lập tức khi nâng cấp chỉ số, khắc phục triệt để lỗi HP không hiển thị đầy
    const resolvedTotalStats = calculateTotalStats(updated, items, activePet, activeCompanion, maProgress);
    setCombatPlayerHp(resolvedTotalStats.maxHp);

    playRetroSound('levelup');
  };

  // --- 10. HÀNH TRANG THAO TÁC (Trang Bị / Tháo hạ / Luỵen Hóa) ---
  const handleEquipItem = (itemId: string) => {
    const freshItems = items.map(item => {
      if (item.id === itemId) {
        // Tháo toàn bộ đồ cùng loại trước đó ra
        return { ...item, equipped: true };
      }
      if (item.equipped && item.type === items.find(i => i.id === itemId)?.type) {
        return { ...item, equipped: false };
      }
      return item;
    });

    setItems(freshItems);
    playRetroSound('equip');
  };

  const handleUnequipItem = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) return { ...item, equipped: false };
      return item;
    }));
    playRetroSound('equip');
  };

  const handleRecycleItem = (itemId: string) => {
    const itemToRecycle = items.find(i => i.id === itemId);
    if (!itemToRecycle) return;

    // Lửa thiêu kiếm gỗ đổi lấy vàng lẻ và cơ may ra linh thạch kì cựu
    let goldGain = 20 + itemToRecycle.level * 5;
    let stonesGain = 0;

    if (itemToRecycle.rarity === 'EPIC') stonesGain = 1;
    else if (itemToRecycle.rarity === 'LEGENDARY') stonesGain = 2;
    else if (itemToRecycle.rarity === 'MYTHIC') stonesGain = 4;
    else if (Math.random() < 0.15) stonesGain = 1; // 15% cơ may rơi đá khí

    setStats(prev => ({
      ...prev,
      gold: prev.gold + goldGain,
      stones: prev.stones + stonesGain
    }));

    // Loại bỏ vật phẩm khỏi hành trang rương
    setItems(prev => prev.filter(i => i.id !== itemId));
    playRetroSound('hit');
  };

  // --- 11. ĐỒNG HÀNH CHIÊU MỘ & NÂNG CẤP CHỈ SỐ ---
  const handleRecruitCompanion = (newC: Companion) => {
    const getCompanionHireCost = (c: Companion) => {
      switch (c.id) {
        case 'c1': return { stones: 2, gold: 50 };
        case 'c2': return { stones: 4, gold: 120 };
        case 'c3': return { stones: 2, gold: 80 };
        case 'c4': return { stones: 3, gold: 70 };
        case 'c5': return { stones: 3, gold: 100 };
        default: return { stones: 1, gold: 40 };
      }
    };

    const cost = getCompanionHireCost(newC);
    if (stats.gold < cost.gold || stats.stones < cost.stones) return;

    setStats(prev => ({
      ...prev,
      gold: prev.gold - cost.gold,
      stones: prev.stones - cost.stones
    }));

    // Thêm đồng hành mới tuyển vào list sở hữu
    setCompanions(prev => [...prev, { ...newC, level: 1 }]);
    setActiveCompanionId(newC.id); // Tự xuất trận ngay
    setCombatCompanionHp(newC.hp); // Làm mới máu đồng hành tham chiến (giải quyết lỗi 0 HP sau tuyển trạch)
    playRetroSound('levelup');
  };

  const handleUpgradeCompanion = (companionId: string) => {
    const target = companions.find(c => c.id === companionId);
    if (!target) return;

    const cost = Math.floor(2 + (target.level * 1.5));
    if (stats.stones < cost) return;

    setStats(prev => ({ ...prev, stones: prev.stones - cost }));
    
    const nextHp = Math.floor(target.hp * 1.2);
    setCompanions(prev => prev.map(c => {
      if (c.id === companionId) {
        return {
          ...c,
          level: c.level + 1,
          hp: nextHp,
          maxHp: Math.floor(c.maxHp * 1.2),
          dmg: Math.floor(c.dmg * 1.15),
        };
      }
      return c;
    }));

    if (companionId === activeCompanionId) {
      setCombatCompanionHp(nextHp); // Đồng bộ máu trong trận liền khi thăng cốt chiến hữu
    }

    playRetroSound('levelup');
  };

  // --- 12. LINH THÚ THUẦN HÓA & NÂNG CẤP CHỈ SỐ TIẾN TRÌNH ---
  const handleTamePet = (newPet: Pet) => {
    // Thêm vào trại đã quy phục của Đại hiệp
    setOwnedPets(prev => [...prev, { ...newPet, level: 1 }]);
    setActivePetId(newPet.id); // Kích hoạt bồi dưỡng xuất sườn
    playRetroSound('levelup');
  };

  const handleUpgradePet = (petId: string) => {
    const target = ownedPets.find(p => p.id === petId);
    if (!target) return;

    const cost = Math.floor(1 + (target.level * 1.2));
    if (stats.stones < cost) return;

    setStats(prev => ({ ...prev, stones: prev.stones - cost }));

    setOwnedPets(prev => prev.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          level: p.level + 1,
          dmgBonus: Math.floor(p.dmgBonus * 1.2 + 2),
          critBonus: Math.floor(p.critBonus * 1.1 + 1),
          hpBonus: Math.floor(p.hpBonus * 1.2 + 10),
          luckBonus: Math.floor(p.luckBonus * 1.15 + 1),
        };
      }
      return p;
    }));

    playRetroSound('levelup');
  };

  // --- 13. TẨY TỦY HOÀN TOÀN CỰU TIẾN TRÌNH (XÓA CHỦ ĐỘNG) ---
  const handleResetSave = () => {
    if (window.confirm('Ngươi có thực sự muốn tẩy tủy toàn bộ tu vi, xóa hết sạch Thần trang, Đồng hành, Linh thú và cống hiến để làm lại từ đầu không?')) {
      localStorage.clear();
      setStats(defaultStats);
      setCompanions([]);
      setOwnedPets([]);
      setItems([{
        id: 'init_w_fresh',
        name: 'Mộc Kiếm Khô Sơn',
        type: 'WEAPON',
        rarity: 'COMMON',
        dmgBonus: 4,
        description: 'Thanh kiếm gỗ rẻ nhặt từ chân núi.',
        equipped: true,
        level: 1,
        flavorText: 'An lành tu vi.'
      }]);
      setActiveCompanionId(null);
      setActivePetId(null);
      spawnEnemyForFloor(1);
      setActiveView('STORY_INTRO');
    }
  };

  // --- 13.5. TÔNG VƯƠNG CÔNG PHÁP ĐIỀU ĐỘNG HỆ THỐNG ---
  const handleEquipMartialArt = (artId: string) => {
    const art = MARTIAL_ARTS_POOL.find(a => a.id === artId);
    if (!art) return;
    
    // Giới hạn trang bị: Tối đa 3 Chủ động, 1 Nội công, 1 Thân pháp
    const currentEquipped = stats.equippedMartialArts || [];
    const isPassiveNoiCong = art.artCategory === 'NỘI CÔNG';
    const isPassiveThanPhap = art.artCategory === 'THÂN PHÁP';
    const isActiveWeapon = !isPassiveNoiCong && !isPassiveThanPhap;

    let nextEquipped = [...currentEquipped];

    if (isActiveWeapon) {
      const equippedActiveCount = MARTIAL_ARTS_POOL.filter(
        a => currentEquipped.includes(a.id) && a.artCategory !== 'NỘI CÔNG' && a.artCategory !== 'THÂN PHÁP'
      ).length;
      if (equippedActiveCount >= 3) {
        const firstActive = MARTIAL_ARTS_POOL.find(
          a => currentEquipped.includes(a.id) && a.artCategory !== 'NỘI CÔNG' && a.artCategory !== 'THÂN PHÁP'
        );
        if (firstActive) {
          nextEquipped = nextEquipped.filter(id => id !== firstActive.id);
        }
      }
    } else if (isPassiveNoiCong) {
      const equippedNoiCong = MARTIAL_ARTS_POOL.find(a => currentEquipped.includes(a.id) && a.artCategory === 'NỘI CÔNG');
      if (equippedNoiCong) {
        nextEquipped = nextEquipped.filter(id => id !== equippedNoiCong.id);
      }
    } else if (isPassiveThanPhap) {
      const equippedThanPhap = MARTIAL_ARTS_POOL.find(a => currentEquipped.includes(a.id) && a.artCategory === 'THÂN PHÁP');
      if (equippedThanPhap) {
        nextEquipped = nextEquipped.filter(id => id !== equippedThanPhap.id);
      }
    }

    if (!nextEquipped.includes(artId)) {
      nextEquipped.push(artId);
    }

    setStats(prev => ({
      ...prev,
      equippedMartialArts: nextEquipped
    }));
    playRetroSound('equip');
  };

  const handleUnequipMartialArt = (artId: string) => {
    setStats(prev => ({
      ...prev,
      equippedMartialArts: (prev.equippedMartialArts || []).filter(id => id !== artId)
    }));
    playRetroSound('equip');
  };

  const handleUnlockMartialArt = (artId: string) => {
    const progress = maProgress[artId];
    if (!progress || progress.shards < 10) return;

    if (progress.stars === 0) {
      // Chưa mở khóa vĩnh viễn -> Khai thông vĩnh viễn (sao = 1) và kích hoạt lượt chạy này
      setMaProgress(prev => ({
        ...prev,
        [artId]: {
          ...prev[artId],
          stars: 1,
          shards: prev[artId].shards - 10
        }
      }));
    } else {
      // Đã mở khóa vĩnh viễn -> Kích hoạt rèn luyện trong lượt kiếm tháp này
      setMaProgress(prev => ({
        ...prev,
        [artId]: {
          ...prev[artId],
          shards: prev[artId].shards - 10
        }
      }));
    }

    setStats(prev => {
      const currentOwn = prev.martialArts || [];
      const nextOwn = currentOwn.includes(artId) ? currentOwn : [...currentOwn, artId];
      return {
        ...prev,
        martialArts: nextOwn
      };
    });

    playRetroSound('levelup');
  };

  const handleStarUpMartialArt = (artId: string) => {
    const progress = maProgress[artId];
    if (!progress || progress.stars === 0 || progress.stars >= 5) return;

    const costs = [0, 10, 15, 30, 50, 100]; // 10, 15, 30, 50, 100
    const cost = costs[progress.stars + 1] || 999;
    if (progress.shards < cost) return;

    setMaProgress(prev => ({
      ...prev,
      [artId]: {
        ...prev[artId],
        stars: prev[artId].stars + 1,
        shards: prev[artId].shards - cost
      }
    }));
    playRetroSound('levelup');
  };

  const handleBreakthroughRealm = (artId: string) => {
    const progress = maProgress[artId];
    if (!progress || progress.stars === 0 || progress.realm >= 3) return;

    const costs = [15, 30, 60];
    const cost = costs[progress.realm];
    if (savvy < cost) return;

    setSavvy(prev => prev - cost);
    setMaProgress(prev => ({
      ...prev,
      [artId]: {
        ...prev[artId],
        realm: prev[artId].realm + 1
      }
    }));
    playRetroSound('levelup');
  };

  const handleSelectStarterArt = (art: any) => {
    const updatedStats = {
      ...stats,
      martialArts: [art.id],
      equippedMartialArts: [art.id]
    };
    setStats(updatedStats);

    setMaProgress(prev => ({
      ...prev,
      [art.id]: {
        ...prev[art.id],
        stars: 1,
        level: 1,
        exp: 0
      }
    }));

    playRetroSound('levelup');
    setActiveView('BATTLE');
  };

  // --- 14. NIẾT BÀN VÃNG SANH - REINCARNATION REBIRTH SYSTEM ---
  const handleReincarnateAndRebirth = (chosenBonus: 'HP' | 'DMG' | 'LUCK') => {
    // Tính toán di sản hồi sinh dựa trên Kỷ lục cao nhất
    const records = Math.max(stats.maxFloorReached, stats.currentFloor);
    
    // Tặng lính thạch và vàng khởi nghiệp
    const bonusGold = 100 + records * 25;
    const bonusStones = 2 + Math.floor(records / 3);

    // Lấy lượng thuộc tính Niết Bàn vĩnh viễn thực sự tích trữ qua nhiều kiếp
    const prevReHp = stats.reincarnationHp || 0;
    const prevReDmg = stats.reincarnationDmg || 0;
    const prevReLuck = stats.reincarnationLuck || 0;
    const prevReCrit = stats.reincarnationCrit || 0;

    let nextReHp = prevReHp;
    let nextReDmg = prevReDmg;
    let nextReLuck = prevReLuck;

    // Áp dụng bồi cốt vĩnh viễn cộng dồn kiếp mới (Niết Bàn lựa chọn)
    if (chosenBonus === 'HP') {
      nextReHp += 60; // Tẩy tủy vĩnh viễn dâng dồn bồi 60 Máu
    } else if (chosenBonus === 'DMG') {
      nextReDmg += 5; // Cầm kiếm dâng dồn bồi 5 lực tấn công
    } else {
      nextReLuck += 8; // Đi bói dâng dồn bồi 8 may mắn
    }

    // Các thuộc tính Kì Ngộ (permHpBonus, permDmgBonus, permLuckBonus, permCritBonus) đều SẼ BỊ MẤT khi qua đời (chết thì mất)!
    // Khởi đầu kiếp tăm tối mới chỉ bao gồm máu, sát thương, vận khi từ lựa chọn Niết Bàn vĩnh cửu.
    const startHp = defaultStats.maxHp + nextReHp;
    const startDmg = defaultStats.dmg + nextReDmg;
    const startLuck = defaultStats.luck + nextReLuck;
    const startCrit = defaultStats.crit + prevReCrit; // Giữ lại tỉ lệ chí mạng vĩnh viễn bồi dưỡng được qua kì ngộ!

    // Reset levels and exp of all martial arts
    setMaProgress(currentProg => {
      const nextProg = { ...currentProg };
      Object.keys(nextProg).forEach(id => {
        nextProg[id] = {
          ...nextProg[id],
          level: 1,
          exp: 0
        };
      });
      return nextProg;
    });

    const finalOwnedArts = reincarnationOption === 2 && selectedInheritArtId
      ? [selectedInheritArtId]
      : [];

    const finalEquippedArts = reincarnationOption === 2 && selectedInheritArtId
      ? [selectedInheritArtId]
      : [];

    const brandNewStats: PlayerStats = {
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: startHp,
      maxHp: startHp,
      dmg: startDmg,
      crit: startCrit,
      luck: startLuck,
      gold: bonusGold,
      stones: stats.stones + bonusStones, // Giữ lại linh thạch sắm sửa pháp bảo, cộng thêm linh thạch thưởng kiếp mới!
      currentFloor: 1, // Reset vội về tầng 1 bới tháp
      maxFloorReached: records,
      permHpBonus: 0,    // Đứt gãy sinh thần kì ngộ, mất đi khi chết
      permDmgBonus: 0,   // Đứt gãy sinh thần kì ngộ, mất đi khi chết
      permLuckBonus: 0,  // Đứt gãy sinh thần kì ngộ, mất đi khi chết
      permCritBonus: 0,  // Đứt gãy sinh thần kì ngộ, mất đi khi chết
      reincarnationHp: nextReHp,
      reincarnationDmg: nextReDmg,
      reincarnationLuck: nextReLuck,
      reincarnationCrit: prevReCrit,
      upgradesDmg: 0,
      upgradesCrit: 0,
      upgradesHp: 0,
      upgradesLuck: 0,
      martialArts: finalOwnedArts,
      equippedMartialArts: finalEquippedArts
    };

    setStats(brandNewStats);
    
    // Giữ lại 1 món trang bị quý nhất đã sở hữu làm truyền gia bảo vật!
    const bestItem = items.sort((a,b) => {
      const val = { COMMON: 1, RARE: 2, EPIC: 3, LEGENDARY: 4, MYTHIC: 5 };
      return val[b.rarity] - val[a.rarity];
    })[0] || null;

    let initialItems: Item[] = [];
    if (bestItem) {
      initialItems.push({
        ...bestItem,
        equipped: true // Tự trang bị báu vật tổ tông
      });
    } else {
      initialItems.push({
        id: `fresh_w_${Date.now()}`,
        name: 'Mộc Kiếm Khô Sơn',
        type: 'WEAPON',
        rarity: 'COMMON',
        dmgBonus: 5,
        description: 'Vật phòng thân của tổ tiên.',
        equipped: true,
        level: 1,
        flavorText: 'An mây phong vũ.'
      });
    }

    setItems(initialItems);

    // Thu dọn đồng hành lâm thời
    setActiveCompanionId(null);
    setActivePetId(null);
    setCompanions([]);
    setOwnedPets([]);

    // Reset quái vật tầng 1 với các giá trị tuyệt đối mới để loại bỏ hoàn toàn dính stale state (lỗi 320/160 HP)
    spawnEnemyForFloor(1, brandNewStats, initialItems, null, null);
    
    if (reincarnationOption === 1) {
      const pool = MARTIAL_ARTS_POOL.filter(art => art.rarity === 'COMMON' || art.rarity === 'RARE');
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const starter3 = shuffled.slice(0, 3);
      setStarterChoices(starter3);
      setActiveView('CHOOSE_INITIAL_MA');
    } else {
      setActiveView('BATTLE');
    }

    setHasNewBonusChosen(null);
    playRetroSound('levelup');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-6 px-4 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <div className="w-full max-w-6xl bg-slate-900/40 rounded-2xl border border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden">
        
        {/* HEADER PANEL */}
        <GameHeader
          stats={stats}
          totalStats={totalStats}
          activePet={activePet}
          activeCompanion={activeCompanion}
          onResetSave={handleResetSave}
        />

        {/* NAVIGATION MENUS / BAR */}
        <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-2 flex flex-wrap gap-1 md:gap-2">
          <button
            id="nav-battle-tab"
            onClick={() => setActiveView('BATTLE')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all rounded cursor-pointer ${
              activeView === 'BATTLE'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            ⚔️ Ma Tháp Đấu Trường
          </button>

          <button
            id="nav-upgrades-tab"
            onClick={() => {
              setActiveView('UPGRADES');
              setIsAutoPlaying(false);
            }}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all rounded cursor-pointer ${
              activeView === 'UPGRADES'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            🔥 Ngũ Hành Tu Luyện
          </button>

          <button
            id="nav-recruitment-tab"
            onClick={() => {
              setActiveView('COMPANIONS_PETS');
              setIsAutoPlaying(false);
            }}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all rounded cursor-pointer ${
              activeView === 'COMPANIONS_PETS'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            🐉 Linh Thú - Đồng Hành
          </button>

          <button
            id="nav-martial-arts-tab"
            onClick={() => {
              setActiveView('MARTIAL_ARTS');
              setIsAutoPlaying(false);
            }}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all rounded cursor-pointer ${
              activeView === 'MARTIAL_ARTS'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            📖 Tông Vương Công Pháp
          </button>

          <button
            id="nav-inventory-tab"
            onClick={() => {
              setActiveView('INVENTORY');
              setIsAutoPlaying(false);
            }}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all rounded cursor-pointer ${
              activeView === 'INVENTORY'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            🎒 Thần Trang Hành Trang
          </button>
        </div>

        {/* --- MAIN GAME WORKSPACE --- */}
        <div className="p-4 md:p-6 flex-1 min-h-[500px]">
          
          {/* A. STORY INTRO PANEL */}
          {activeView === 'STORY_INTRO' && (
            <div className="max-w-xl mx-auto p-6 bg-slate-900 border-2 border-amber-500/25 rounded-xl text-center shadow-xl space-y-5 my-8">
              <span className="text-6xl animate-pulse block">🥋☯️</span>
              <h2 className="text-xl font-black text-amber-300">VẠN CỔ MA THÁP - CHÂN TRUYỀN KIẾM LINH</h2>
              
              <div className="space-y-3 text-xs leading-relaxed text-slate-300 text-justify font-serif italic border-y border-slate-850 py-4 px-2">
                <p>Ma vực phong vũ thổi bùng trăm năm, vây hãm hàng nghìn võ đạo tu sĩ trong ngõ ngách Tháp Thần vô tận. Kẻ bước vào lầu tháp gánh nặng vương quy, dẫm đạp xương máu quái ma để tìm cơ duyên chân lý khai sinh.</p>
                <p>Ngươi - một lãng khách vô danh ôm hoài mộng kiếm hiệp lý tính quy y, dắt sườn một vạt kiếm quèn khởi hành mở toang Ma Phong Môn. Hãy thuần phục Linh Thú bay lơ lửng, kết giao đại kiệt xuất nhân Quách Tĩnh, Tiêu Phong kề sườn chống đỡ vạn hiểm để tiễu trừ boss tháp!</p>
              </div>

              <div className="flex flex-col gap-2 pt-3">
                <button
                  id="btn-start-game-adv"
                  onClick={() => {
                    if (!stats.martialArts || stats.martialArts.length === 0) {
                      const pool = MARTIAL_ARTS_POOL.filter(art => art.rarity === 'COMMON' || art.rarity === 'RARE');
                      const shuffled = [...pool].sort(() => 0.5 - Math.random());
                      const starter3 = shuffled.slice(0, 3);
                      setStarterChoices(starter3);
                      setActiveView('CHOOSE_INITIAL_MA');
                    } else {
                      setActiveView('BATTLE');
                    }
                    playRetroSound('levelup');
                  }}
                  className="py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs tracking-widest rounded-lg transition-all active:scale-95"
                >
                  Mở Cánh Cổng Cổ Tháp 🔓
                </button>
                <span className="text-[10px] text-slate-500 font-mono">Tự động lưu trữ tiến trình theo thời gian thực</span>
              </div>
            </div>
          )}

          {/* B. BATTLEVIEW PANEL */}
          {activeView === 'BATTLE' && (
            <BattleView
              floor={stats.currentFloor}
              playerStats={stats}
              totalStats={totalStats}
              enemy={enemy}
              activeCompanion={activeCompanion}
              activePet={activePet}
              battleLogs={battleLogs}
              isAutoPlaying={isAutoPlaying}
              combatPlayerHp={combatPlayerHp}
              combatCompanionHp={combatCompanionHp}
              combatEnemyHp={combatEnemyHp}
              damagePopups={damagePopups}
              onToggleAutoPlay={() => setIsAutoPlaying(prev => !prev)}
              onAdvanceFloor={handleAdvanceFloor}
              onTriggerDirectCombatTick={triggerOneCombatTick}
              onResetToCemetery={() => {
                setIsAutoPlaying(false);
                setActiveView('GAME_OVER');
              }}
              items={items}
            />
          )}

          {/* C. STATS CULTIVATION UPGRADE PANEL */}
          {activeView === 'UPGRADES' && (
            <StatsUpgrade
              stats={stats}
              onUpgrade={handleUpgradeStat}
            />
          )}

          {/* D. INVENTORY PANEL */}
          {activeView === 'INVENTORY' && (
            <InventoryView
              stats={stats}
              items={items}
              onEquip={handleEquipItem}
              onUnequip={handleUnequipItem}
              onRecycle={handleRecycleItem}
            />
          )}

          {/* E. COMPANIONS AND PETS GARDEN */}
          {activeView === 'COMPANIONS_PETS' && (
            <RecruitmentView
              stats={stats}
              companions={companions}
              ownedPets={ownedPets}
              activeCompanion={activeCompanion}
              activePet={activePet}
              onRecruitCompanion={handleRecruitCompanion}
              onUpgradeCompanion={handleUpgradeCompanion}
              onTamePet={handleTamePet}
              onUpgradePet={handleUpgradePet}
              onSelectCompanion={handleSelectCompanionId => {
                setActiveCompanionId(handleSelectCompanionId);
                // Làm mới máu của companion trận đấu kế tiếp
                const comp = companions.find(c => c.id === handleSelectCompanionId);
                setCombatCompanionHp(comp ? comp.hp : 0);
              }}
              onSelectPet={handleSelectPetId => setActivePetId(handleSelectPetId)}
            />
          )}

          {/* E.2. MARTIAL ARTS PROGRESSION & EQUIPMENT BED */}
          {activeView === 'MARTIAL_ARTS' && (
            <MartialArtsView
              stats={stats}
              savvy={savvy}
              maProgress={maProgress}
              onEquipMartialArt={handleEquipMartialArt}
              onUnequipMartialArt={handleUnequipMartialArt}
              onUnlockMartialArt={handleUnlockMartialArt}
              onStarUpMartialArt={handleStarUpMartialArt}
              onBreakthroughRealm={handleBreakthroughRealm}
            />
          )}

          {/* F. ROGUELIKE CHOICE / RANDOM EVENT NODES */}
          {activeView === 'ROGUELIKE_CHOICE' && (
            <AdventureEventView
              stats={stats}
              onEventResolved={handleEventResolved}
            />
          )}

          {/* G. GAME OVER OVERLAY (NIẾT BÀN VÃNG SANH REBIRTH) */}
          {activeView === 'GAME_OVER' && (
            <div className="max-w-2xl mx-auto p-8 bg-slate-950 border-2 border-rose-500/45 rounded-xl text-center shadow-[0_0_35px_rgba(239,68,68,0.25)] relative overflow-hidden my-6">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600" />
              
              <span className="text-7xl block mb-3 animate-bounce">💀🧘</span>
              <h2 className="text-2xl font-black text-rose-500 tracking-widest uppercase">CÕI NIẾT BÀN VÃNG SANH</h2>
              <p className="text-xs text-slate-400 font-serif italic mt-1 leading-none">Chân tu kiếp này tuy tàn, nhưng thiên mệnh vương đạo bất diệt.</p>

              {/* Thông số cuộc chinh phạt vinh hiển */}
              <div className="my-6 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-xl mx-auto text-xs font-mono">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block uppercase text-[9px] leading-tight">Tầng đạt tới</span>
                  <strong className="text-rose-400 text-lg leading-tight">{stats.currentFloor}</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block uppercase text-[9px] leading-tight">Tháp tối đa kỷ lục</span>
                  <strong className="text-amber-400 text-lg leading-tight">T{stats.maxFloorReached}</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block uppercase text-[9px] leading-tight">Vương Thạch tích tụ</span>
                  <strong className="text-emerald-400 text-lg leading-tight">{stats.stones} Đá</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block uppercase text-[9px] leading-tight">Ngộ Tính Ngưng Tụ</span>
                  <strong className="text-purple-400 text-lg leading-tight">{savvy} Linh</strong>
                </div>
              </div>

              {/* Di Sản Luân Hồi Tích Luỹ Thâm Sâu */}
              <div className="mb-6 p-4 bg-slate-900/80 border border-emerald-500/35 rounded-xl max-w-xl mx-auto text-left">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5 font-mono">
                  ✨ KIẾP LINH DI SẢN TÍCH LŨY (TỪ DUAL OPTIONS & LUÂN HỒI):
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-300">
                  <div className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded border border-slate-850">
                    <span className="text-slate-400">💖 HP vĩnh hằng:</span>
                    <strong className="text-emerald-300">+{stats.reincarnationHp || 0}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded border border-slate-850">
                    <span className="text-slate-400">🗡️ DMG vĩnh hằng:</span>
                    <strong className="text-emerald-300">+{stats.reincarnationDmg || 0}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded border border-slate-850">
                    <span className="text-slate-400">🍀 LUCK vĩnh hằng:</span>
                    <strong className="text-emerald-300">+{stats.reincarnationLuck || 0}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded border border-slate-850">
                    <span className="text-slate-400">⚡ CRIT vĩnh hằng:</span>
                    <strong className="text-emerald-300">+{stats.reincarnationCrit || 0}%</strong>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 italic mt-2 text-center leading-normal font-sans">
                  *Các thuộc tính trên đã được bồi đắc vĩnh viễn vào thể chất nguyên cốt qua mọi kiếp luân hồi khởi sinh của Đại Hiệp.*
                </p>
              </div>

              <div className="space-y-4 max-w-lg mx-auto bg-slate-900/40 p-4 border border-dashed border-rose-950 rounded-lg">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center justify-center gap-1">
                  🌟 Bí Quyết Tẩy Tủy Linh Cốt (Chọn 1 Bonus khởi đầu vĩnh viễn):
                </h3>
                <p className="text-[11px] text-slate-400 italic font-serif leading-relaxed">
                  Nguyện hiến dâng toàn bộ nguyên thần kiếp cũ. Thần tháp cảm ứng linh khí sẽ tích luỹ di sản, bồi hoàn lượng vàng khởi điểm lớn hơn và phong tặng bảo tàng kiếm linh theo vương ấn của ngươi!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setHasNewBonusChosen('HP')}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      hasNewBonusChosen === 'HP' 
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    💖 Dịch Cân Kinh
                    <span className="block text-[8px] opacity-75 font-mono mt-1 font-normal">+60 HP vĩnh viễn</span>
                  </button>

                  <button
                    onClick={() => setHasNewBonusChosen('DMG')}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      hasNewBonusChosen === 'DMG' 
                        ? 'border-rose-500 bg-rose-950/20 text-rose-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    🗡️ Thông Kinh Kinh Lạc
                    <span className="block text-[8px] opacity-75 font-mono mt-1 font-normal">+5 DMG vĩnh viễn</span>
                  </button>

                  <button
                    onClick={() => setHasNewBonusChosen('LUCK')}
                    className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      hasNewBonusChosen === 'LUCK' 
                        ? 'border-purple-500 bg-purple-950/20 text-purple-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    🍀 Cải Mệnh Khí Vận
                    <span className="block text-[8px] opacity-75 font-mono mt-1 font-normal">+8 May Mắn vĩnh viễn</span>
                  </button>
                </div>
              </div>

              {/* Di Sản Võ Học Thừa Kế (2 Options) */}
              <div className="space-y-4 max-w-lg mx-auto bg-slate-900/40 p-4 border border-dashed border-cyan-950 rounded-lg mt-4 text-center">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-1">
                  📖 TUYỂN CHỌN DI SẢN CÔNG PHÁP:
                </h3>
                <p className="text-[11px] text-slate-400 italic font-serif leading-relaxed mt-0.5">
                  Đại hiệp có hai lựa chọn phục sinh luân hồi để bảo bảo tiến trình phát triển và đột phá phù hợp:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-left">
                  <button
                    onClick={() => {
                      setReincarnationOption(1);
                      setSelectedInheritArtId(null);
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                      reincarnationOption === 1
                        ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-slate-200">🔥 Option 1 (Tùy Chọn 1)</span>
                    <span className="block text-[8px] font-mono mt-1 text-rose-400 font-bold">Mất hết công pháp đang có</span>
                    <span className="block text-[8px] font-mono text-slate-500 mt-0.5">Giữ nguyên Số sao & Cảnh giới tiến trình vĩnh viễn!</span>
                  </button>

                  <button
                    onClick={() => {
                      setReincarnationOption(2);
                      const owned = stats.martialArts || [];
                      if (owned.length > 0) {
                        setSelectedInheritArtId(owned[0]);
                      }
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                      reincarnationOption === 2
                        ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300 font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-slate-200">🛡️ Option 2 (Tùy Chọn 2)</span>
                    <span className="block text-[8px] font-mono mt-1 text-emerald-400 font-bold">Thừa kế giữ nguyên 1 môn</span>
                    <span className="block text-[8px] font-mono text-slate-500 mt-0.5">Giữ nguyên sao & cảnh giới của duy nhất môn này!</span>
                  </button>
                </div>

                {reincarnationOption === 1 && (
                  <div className="p-3 bg-slate-950 rounded text-[10px] text-slate-400 font-serif leading-relaxed border border-slate-900 text-left">
                    💡 <strong className="text-amber-400">Thiên Mệnh Chi Sa:</strong> Khi chuyển sinh thành công, một sảnh thần tháp tinh thể sẽ hiến dâng cho bạn <span className="text-amber-300 font-bold">chọn 1 trong 3 Công Pháp (Tự do ngẫu nhiên từ Common tới Rare)</span> để bắt đầu kiếp lữ tuyệt phẩm mới!
                  </div>
                )}

                {reincarnationOption === 2 && (
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] text-slate-400">Chọn đúng 01 quyển Tuyệt học kiếp trước để thừa kế vương giả:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] max-h-48 overflow-y-auto pr-1">
                      {MARTIAL_ARTS_POOL.filter(art => (stats.martialArts || []).includes(art.id)).map(art => (
                        <button
                          key={art.id}
                          id={`inherit-art-${art.id}`}
                          onClick={() => setSelectedInheritArtId(art.id)}
                          className={`p-2 rounded border text-center transition-all cursor-pointer flex flex-col justify-between h-16 ${
                            selectedInheritArtId === art.id
                              ? 'border-amber-500 bg-amber-950/20 text-amber-200 font-bold'
                              : 'border-slate-850 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                          }`}
                        >
                          <span className="truncate block font-bold w-full text-left sm:text-center">{art.name}</span>
                          <span className="block text-[8px] opacity-75 truncate uppercase font-mono w-full text-slate-500 text-left sm:text-center">
                            {art.artCategory} • {art.type === 'ACTIVE' ? 'Chủ động' : 'Thụ động'}
                          </span>
                        </button>
                      ))}
                      {(!stats.martialArts || stats.martialArts.length === 0) && (
                        <div className="col-span-full py-4 text-center text-slate-500 italic text-[11px]">
                          Kiếp trước không mang quyển công pháp nào! Hệ thống khuyên dùng Option 1.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  id="btn-trigger-reincarnation"
                  disabled={!hasNewBonusChosen || (reincarnationOption === 2 && !selectedInheritArtId && stats.martialArts && stats.martialArts.length > 0)}
                  onClick={() => handleReincarnateAndRebirth(hasNewBonusChosen as any)}
                  className={`px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-lg text-slate-950 cursor-pointer ${
                    hasNewBonusChosen && (reincarnationOption === 1 || selectedInheritArtId || !stats.martialArts || stats.martialArts.length === 0)
                      ? 'bg-amber-400 hover:bg-amber-300 active:scale-95' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  {hasNewBonusChosen ? '🔄 Chuyển Sinh Luân Hồi!' : 'Chọn một Thiên Mệnh để hồi sinh'}
                </button>
                <p className="text-[10px] text-slate-500 mt-2 font-mono">Nhấn chuyển sinh sẽ đưa người chơi trở lại Tầng 1 với chỉ số cải cốt mới xịn hơn!</p>
              </div>

            </div>
          )}

          {/* H2. CHOOSE INITIAL MARTIAL ART VIEW ON START */}
          {activeView === 'CHOOSE_INITIAL_MA' && (
            <div className="max-w-4xl mx-auto p-8 bg-slate-950 border border-amber-500/35 rounded-xl text-center shadow-[0_0_50px_rgba(245,158,11,0.15)] my-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 animate-pulse" />
              
              <span className="text-6xl block mb-2 animate-pulse">☯️📖</span>
              <h2 className="text-2xl font-black text-amber-400 tracking-wider uppercase">LỰA CHỌN KHỞI ĐẦU PHÁP MÔN</h2>
              <p className="text-xs text-slate-400 font-serif italic mt-1 leading-relaxed max-w-xl mx-auto">
                Chân khí sơ khai, thiên mệnh tự khai thông! Đại hiệp hãy tuyển chọn đúng 01 quyển Tuyệt học tàn dư sơ khai để làm ngọn đèn soi lối, khai phá Vạn Cổ Thần Ma Tháp!
              </p>

              <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {starterChoices.map((art) => {
                  const isCommon = art.rarity === 'COMMON';
                  return (
                    <div 
                      key={art.id}
                      className={`p-5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-80 bg-slate-900/60 ${
                        isCommon 
                          ? 'border-slate-850 hover:border-slate-600 hover:shadow-md' 
                          : 'border-blue-900/60 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                      }`}
                    >
                      {/* Rarity Ribbon */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-mono tracking-widest uppercase font-bold bg-slate-950">
                        <span className={isCommon ? 'text-slate-400' : 'text-blue-400'}>
                          {art.rarity}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-950 text-amber-500 font-mono">
                          {art.artCategory}
                        </span>
                        
                        <h3 className="text-base font-black text-slate-100 tracking-tight mt-1">
                          {art.name}
                        </h3>
                        
                        <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed italic font-serif">
                          "{art.description}"
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                        <div className="bg-slate-950 p-2 rounded text-[10px] leading-snug">
                          <strong className="text-emerald-400 block font-mono text-[9px] uppercase">Hiệu ứng kích khởi:</strong>
                          <span className="text-slate-300 font-medium">{art.effect}</span>
                        </div>

                        <button
                          onClick={() => handleSelectStarterArt(art)}
                          className={`w-full py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer ${
                            isCommon
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          👁️ Lĩnh Ngộ Công Pháp
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-slate-500 font-mono bg-slate-900/40 py-2 rounded max-w-sm mx-auto">
                ⚠️ Mỗi lượt chơi chỉ khuyên dùng tối đa 01 Công pháp Chủ động làm chiêu kích sát.
              </p>
            </div>
          )}

        </div>

        {/* FOOTER BAR */}
        <div className="bg-slate-950 border-t border-slate-900 p-4 text-center text-[11px] text-slate-500 tracking-normal flex flex-col sm:flex-row sm:justify-between items-center gap-2">
          <span>⚔️ VẠN TẦNG MA THÁP • ĐẠO GIÁO TU LUYỆN AUTO BATTLER ROGUELIKE ⚔️</span>
          <span className="font-mono text-[10px] text-slate-600">Bản Chân Truyền Hoàn Mỹ • Tẩy Tủy Đột Phá vô tận</span>
        </div>
      </div>
    </div>
  );
}
