import { PlayerStats, Item, Pet, Companion } from './types';

// Helper tính độ gia trì của passive công pháp
export function getPassiveScale(
  artId: string,
  maProgress?: Record<string, { id: string; level: number; exp: number; stars: number; shards: number; realm: number }>
) {
  if (!maProgress || !maProgress[artId]) return 1.0;
  const progress = maProgress[artId];
  // Cấp: +5% mỗi cấp, Sao: +10% mỗi sao (nếu stars = 0 tức chưa học thì scale = 0)
  if (progress.stars === 0) return 0.0;
  const levelFactor = 1 + (progress.level - 1) * 0.05 + (progress.stars - 1) * 0.10;
  // Cảnh Giới: Nhập Môn (0) = 1.0, Tiểu Thành (1) = 1.35, Đại Thành (2) = 1.70, Viên Mãn (3) = 2.00
  let realmFactor = 1.0;
  if (progress.realm === 1) realmFactor = 1.35;
  else if (progress.realm === 2) realmFactor = 1.70;
  else if (progress.realm === 3) realmFactor = 2.00;
  return levelFactor * realmFactor;
}

// Tính toán tổng chỉ số thực tế sau khi tính trang bị, linh thú và đồng hành
export function calculateTotalStats(
  base: PlayerStats,
  items: Item[],
  activePet: Pet | null,
  activeCompanion: Companion | null,
  maProgress?: Record<string, { id: string; level: number; exp: number; stars: number; shards: number; realm: number }>
) {
  let dmg = base.dmg;
  let crit = base.crit;
  let maxHp = base.maxHp;
  let luck = base.luck;

  // 1. Cộng chỉ số từ trang bị được trang bị
  const equippedItems = items.filter(item => item.equipped);
  equippedItems.forEach(item => {
    if (item.dmgBonus) dmg += item.dmgBonus;
    if (item.critBonus) crit += item.critBonus;
    if (item.hpBonus) maxHp += item.hpBonus;
    if (item.luckBonus) luck += item.luckBonus;
  });

  // 2. Cộng chỉ số thụ động từ Linh Thú (Pet)
  if (activePet) {
    dmg += activePet.dmgBonus;
    crit += activePet.critBonus;
    maxHp += activePet.hpBonus;
    luck += activePet.luckBonus;
  }

  // 3. Cộng chỉ số thụ động từ Tuyệt học võ công (Passive)
  const equippedMartialArts = base.equippedMartialArts || [];
  if (equippedMartialArts.includes('ma3')) { // Cửu Dương Thần Công
    const scale = getPassiveScale('ma3', maProgress);
    dmg = Math.floor(dmg * (1 + 0.25 * scale)); // Nhân buff sát thương dựa trên quy mô công pháp
    maxHp += Math.floor(300 * scale); // +300 máu thăng hệ số nâng cấp
  }
  if (equippedMartialArts.includes('ma_noi_1')) { // Cửu Âm Chân Kinh
    const scale = getPassiveScale('ma_noi_1', maProgress);
    dmg = Math.floor(dmg * (1 + 0.25 * scale)); 
    luck += Math.floor(15 * scale);
  }
  if (equippedMartialArts.includes('ma_noi_2')) { // Quỳ Hoa Bảo Điển
    const scale = getPassiveScale('ma_noi_2', maProgress);
    crit += Math.floor(15 * scale); 
    dmg = Math.floor(dmg * (1 + 0.15 * scale)); 
  }

  // Check if any equipped passive is at realm 3 (viên mãn) to apply the master +20% total damage bonus
  let hasRealm3Passive = false;
  const passiveIds = ['ma3', 'ma5', 'ma_noi_1', 'ma_noi_2', 'ma_noi_3', 'ma_than_1', 'ma_than_2', 'ma_than_3'];
  equippedMartialArts.forEach(artId => {
    if (passiveIds.includes(artId)) {
      const progress = maProgress?.[artId];
      if (progress && progress.realm === 3) {
        hasRealm3Passive = true;
      }
    }
  });

  if (hasRealm3Passive) {
    dmg = Math.floor(dmg * 1.20); // +20% sát thương tổng thể
  }

  // 3. Đồng Hành không cộng trục tiếp vào chỉ số cơ bản của người chơi (họ chiến đấu tự lập)
  // Nhưng một số đồng hành hỗ trợ có thể buff lâm thời trong trận chiến, ta sẽ xử lý trong vòng lặp combat.

  return {
    level: base.level,
    exp: base.exp,
    maxExp: base.maxExp,
    hp: base.hp > maxHp ? maxHp : base.hp, // Giới hạn máu hiện tại không vượt quá máu max mới
    maxHp,
    dmg,
    crit: Math.min(100, crit), // Tối đa 100% chí mạng
    luck,
    gold: base.gold,
    stones: base.stones,
    currentFloor: base.currentFloor,
    maxFloorReached: base.maxFloorReached,
  };
}

// Tính lượng Exp cần thiết để thăng cấp tầng võ học tiếp theo
export function getRequiredExpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.35, level - 1));
}

// Tạo chuỗi may mắn ngẫu nhiên
export function checkChance(percentage: number): boolean {
  return Math.random() * 100 <= percentage;
}

// Tạo mô phỏng sát thương võ học cổ trang phong phú
export function getRandomCombatMsg(attacker: string, target: string, skill?: string): string {
  const genericMsgs = [
    `Bộ pháp quỷ dị, ${attacker} huy động khí kình chém thấu vai ${target}!`,
    `${attacker} dồn kình lực vào đầu ngón tay kích chính diện ${target}!`,
    `${attacker} lướt nhanh ảo hóa kiếm ảnh vây hãm chí mạng ${target}!`,
    `Tụ khí đan điền, ${attacker} tung liên hoàn cước đá văng binh khí của ${target}!`,
    `${attacker} tạt ngang tung chiêu hiểm học hiểm ác nhắm vào tùng lâm của ${target}!`
  ];

  if (skill) {
    return `🔥 [${skill}] Thần thông chí cao! ${attacker} dồn mười phần công lực thi triển hất văng hộ thể chân khí của ${target}!`;
  }

  return genericMsgs[Math.floor(Math.random() * genericMsgs.length)];
}
