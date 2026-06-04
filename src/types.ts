export type RoleType = 'TANK' | 'SUPPORT' | 'DPS';

export interface Companion {
  id: string;
  name: string;
  role: RoleType;
  title: string;
  hp: number;
  maxHp: number;
  dmg: number;
  skillName: string;
  skillDesc: string;
  skillCooldown: number; // in seconds or turns
  currentCooldown: number;
  avatar: string; // color or character design tag
  description: string;
  level: number;
}

export type PetElement = 'WIND' | 'THUNDER' | 'FIRE' | 'WATER';

export interface Pet {
  id: string;
  name: string;
  element: PetElement;
  elementName: string;
  level: number;
  dmgBonus: number; // absolute or percentage
  critBonus: number; // percentage
  luckBonus: number; // absolute
  hpBonus: number; // absolute
  skillName: string;
  skillDesc: string;
  avatar: string;
  captureChance: number; // base chance to tame (0-100)
}

export type ItemRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export type ItemType = 'WEAPON' | 'ARMOR' | 'TREASURE' | 'BOOK';

export type WeaponType = 'KIẾM' | 'ĐAO' | 'BỔNG' | 'CHƯỞNG';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  dmgBonus?: number;
  critBonus?: number; // percentage
  hpBonus?: number;
  luckBonus?: number;
  description: string;
  equipped?: boolean;
  flavorText?: string;
  level: number;
  weaponType?: WeaponType;
}

export interface MartialArt {
  id: string;
  name: string;
  damageMultiplier: number;
  effect?: string;
  cooldown: number; // turns
  currentCooldown: number;
  description: string;
  rarity: ItemRarity;
  type: 'ACTIVE' | 'PASSIVE';
  artCategory: 'KIẾM' | 'ĐAO' | 'BỔNG' | 'CHƯỞNG' | 'NỘI CÔNG' | 'THÂN PHÁP';
}

export interface PlayerStats {
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  dmg: number;
  crit: number; // percentage (0 - 100)
  luck: number; // absolute score (influences drops, e.g. 10 base)
  gold: number;
  stones: number; // Spirit stones (Linh Thạch)
  maxFloorReached: number;
  currentFloor: number;
  permHpBonus?: number;
  permDmgBonus?: number;
  permLuckBonus?: number;
  permCritBonus?: number;
  reincarnationHp?: number;
  reincarnationDmg?: number;
  reincarnationLuck?: number;
  reincarnationCrit?: number;
  upgradesDmg?: number;
  upgradesCrit?: number;
  upgradesHp?: number;
  upgradesLuck?: number;
  martialArts?: string[];
  equippedMartialArts?: string[];
}

export type EnemyType = 'REGULAR' | 'MINI_BOSS' | 'MEGA_BOSS';

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  dmg: number;
  crit: number;
  skillName?: string;
  skillDesc?: string;
  skillCd?: number;
  currentCd?: number;
  avatar: string;
  rewards: {
    exp: number;
    gold: number;
    stones: number;
    itemChance: number; // calculated using player Luck
  };
}

export interface BattleLog {
  id: string;
  text: string;
  type: 'PLAYER_ATTACK' | 'ENEMY_ATTACK' | 'COMPANION_SKILL' | 'PET_SKILL' | 'SYSTEM' | 'CRIT' | 'DEFEAT' | 'VICTORY' | 'HP_RESTORE';
}

export type GameView = 'BATTLE' | 'UPGRADES' | 'ROGUELIKE_CHOICE' | 'COMPANIONS_PETS' | 'INVENTORY' | 'GAME_OVER' | 'VICTORY_SCREEN' | 'STORY_INTRO' | 'MARTIAL_ARTS' | 'CHOOSE_INITIAL_MA';

export interface RoguelikeChoice {
  id: string;
  title: string;
  description: string;
  type: 'STAT' | 'GOLD' | 'COMPANION' | 'PET_ENCOUNTER' | 'ITEM' | 'HEAL' | 'RISK_GAMBLE';
  costStones?: number;
  costGold?: number;
  icon: string;
  action: (state: any) => any; // we'll implement this carefully in the context
}
