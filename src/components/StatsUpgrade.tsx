import React from 'react';
import { PlayerStats } from '../types';
import { Swords, Heart, Sparkles, Star, ChevronUp, Zap } from 'lucide-react';

interface StatsUpgradeProps {
  stats: PlayerStats;
  onUpgrade: (statType: 'DMG' | 'CRIT' | 'HP' | 'LUCK') => void;
}

export const StatsUpgrade: React.FC<StatsUpgradeProps> = ({ stats, onUpgrade }) => {
  // Hàm tính chi phí nâng cấp động dựa trên số lần tu luyện đã mua trong kiếp này
  const getUpgradeCost = (type: 'DMG' | 'CRIT' | 'HP' | 'LUCK') => {
    switch (type) {
      case 'DMG':
        return Math.floor(15 * Math.pow(1.3, stats.upgradesDmg || 0));
      case 'CRIT':
        return Math.floor(50 * Math.pow(1.4, stats.upgradesCrit || 0));
      case 'HP':
        return Math.floor(10 * Math.pow(1.25, stats.upgradesHp || 0));
      case 'LUCK':
        return Math.floor(40 * Math.pow(1.35, stats.upgradesLuck || 0));
      default:
        return 999;
    }
  };

  const costDMG = getUpgradeCost('DMG');
  const costCRIT = getUpgradeCost('CRIT');
  const costHP = getUpgradeCost('HP');
  const costLUCK = getUpgradeCost('LUCK');

  const upgradeItems = [
    {
      type: 'DMG' as const,
      name: 'Rèn Luyện Thể Phách (Công)',
      desc: 'Tôi luyện gân cốt kì kinh bát mạch, nâng cao dương cương kiếm thức. Tăng vĩnh viễn +3 Sát Thương cơ bản.',
      currentValue: `${stats.dmg} Công lực`,
      cultivatedValue: `+${(stats.upgradesDmg || 0) * 3} Sát Thương`,
      breakdown: `Bản gốc: 15 | Tu luyện: +${(stats.upgradesDmg || 0) * 3} | Luân hồi vĩnh hằng: +${stats.reincarnationDmg || 0}${stats.permDmgBonus ? ` | Kỳ duyên tạm: +${stats.permDmgBonus}` : ''}`,
      cost: costDMG,
      icon: <Swords className="w-6 h-6 text-rose-400" />,
      color: 'border-rose-500/20 bg-rose-950/10 hover:border-rose-500/45',
      iconBg: 'bg-rose-500/15 text-rose-400',
      btnColor: 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50',
    },
    {
      type: 'CRIT' as const,
      name: 'Ngộ Đạo Kiếm Ý (Bạo)',
      desc: 'Luyện tập thần thức, gia tăng giác ngoại kiến thức để đánh vào tử huyệt địch nhân. Tăng vĩnh viễn +2% Chí Mạng cơ bản.',
      currentValue: `${stats.crit}% Chí mạng`,
      cultivatedValue: `+${(stats.upgradesCrit || 0) * 2}% Bạo kích`,
      breakdown: `Bản gốc: 5% | Tu luyện: +${(stats.upgradesCrit || 0) * 2}% | Luân hồi vĩnh hằng: +${stats.reincarnationCrit || 0}%${stats.permCritBonus ? ` | Kỳ duyên tạm: +${stats.permCritBonus}%` : ''}`,
      cost: costCRIT,
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      color: 'border-yellow-500/20 bg-yellow-950/10 hover:border-yellow-500/45',
      iconBg: 'bg-yellow-500/15 text-yellow-400',
      btnColor: 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-950/50',
      maxed: stats.crit >= 75
    },
    {
      type: 'HP' as const,
      name: 'Hỗn Nguyên Thần Đan (Thủ)',
      desc: 'Dưỡng sinh khí hải tu luyện đan điền, gia tăng nguyên thần hộ thể thâm hậu. Tăng vĩnh viễn +40 Sinh Mệnh cơ bản.',
      currentValue: `${stats.maxHp} HP khí huyết`,
      cultivatedValue: `+${(stats.upgradesHp || 0) * 40} HP tối đa`,
      breakdown: `Bản gốc: 120 | Tu luyện: +${(stats.upgradesHp || 0) * 40} | Luân hồi vĩnh hằng: +${stats.reincarnationHp || 0}${stats.permHpBonus ? ` | Kỳ duyên tạm: +${stats.permHpBonus}` : ''}`,
      cost: costHP,
      icon: <Heart className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/45',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      btnColor: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50',
    },
    {
      type: 'LUCK' as const,
      name: 'Thiên Mệnh Khí Vận (Mệnh)',
      desc: 'Cải mệnh nghịch thiên đại vận cát tường. Tăng cường tỷ lệ rớt bảo vật thần khí hiếm tháp. Tăng vĩnh viễn +4 May Mắn cơ bản.',
      currentValue: `${stats.luck} Khí vận`,
      cultivatedValue: `+${(stats.upgradesLuck || 0) * 4} May mắn`,
      breakdown: `Bản gốc: 10 | Tu luyện: +${(stats.upgradesLuck || 0) * 4} | Luân hồi vĩnh hằng: +${stats.reincarnationLuck || 0}${stats.permLuckBonus ? ` | Kỳ duyên tạm: +${stats.permLuckBonus}` : ''}`,
      cost: costLUCK,
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      color: 'border-purple-500/20 bg-purple-950/10 hover:border-purple-500/45',
      iconBg: 'bg-purple-500/15 text-purple-400',
      btnColor: 'bg-purple-600 hover:bg-purple-500 shadow-purple-950/50',
    },
  ];

  return (
    <div id="stats-upgrade-panel" className="bg-slate-900 border-2 border-slate-800 p-6 rounded-xl text-slate-100 shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500 opacity-60" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-lg text-amber-400">
          <Star className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-wider text-amber-300">ĐÀN TU LUYỆN NGŨ HÀNH</h2>
          <p className="text-xs text-slate-400">Tiêu hao Vàng thu thập được từ quái tháp để tẩy tủy bồi đắp kinh kỳ vĩnh viễn thế chất.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgradeItems.map((item) => {
          const isAffordable = stats.gold >= item.cost;
          return (
            <div
              key={item.type}
              id={`stat-card-${item.type}`}
              className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 ${item.color} group relative overflow-hidden`}
            >
              {/* Card bg sheen hover effect */}
              <div className="absolute -inset-y-2 left-0 w-1/3 bg-slate-300/5 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[400%] transition-transform duration-1000 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-200">{item.name}</h3>
                      <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                        Tổng chỉ số: <span className="text-amber-400 font-mono font-bold text-xs">{item.currentValue}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-400 mt-0.5 mb-1">
                        Đã cộng tu luyện: <span className="font-mono font-bold text-emerald-300 text-xs">{item.cultivatedValue}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono border-t border-slate-800/60 pt-1 leading-normal italic">
                        {item.breakdown}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 mb-4 min-h-[48px] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-800/60">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Phí bồi dưỡng</span>
                  <span className={`text-sm font-bold font-mono ${isAffordable ? 'text-yellow-400' : 'text-slate-500'}`}>
                    {item.maxed ? 'MAX LEVEL' : `${item.cost} VÀNG`}
                  </span>
                </div>

                {!item.maxed ? (
                  <button
                    id={`btn-upgrade-${item.type}`}
                    disabled={!isAffordable}
                    onClick={() => onUpgrade(item.type)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition-all uppercase cursor-pointer ${
                      isAffordable
                        ? `${item.btnColor} text-slate-950 active:scale-95 shadow-md`
                        : 'bg-slate-800 cursor-not-allowed text-slate-500 border border-slate-700/50'
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                    Đột Phá
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-bold uppercase border border-emerald-500/30 px-2 py-1 rounded bg-emerald-950/20">
                    Cận Cực
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>💰 Ngân khố tích lũy của đạo hữu: <strong className="text-yellow-400 font-mono font-bold text-sm">{stats.gold}</strong> Vàng</span>
        <span>🔥 Đánh quái tầng cao để thu hoạch bội phần vàng rơi rớt!</span>
      </div>
    </div>
  );
};
