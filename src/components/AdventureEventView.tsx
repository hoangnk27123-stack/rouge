import React, { useState } from 'react';
import { PlayerStats, Item } from '../types';
import { generateRandomItem } from '../data';
import { Sparkles, Skull, Compass, Gift, CheckCircle, HelpCircle, Flame } from 'lucide-react';

interface AdventureEventViewProps {
  stats: PlayerStats;
  onEventResolved: (updatedStats: PlayerStats, addedItem: Item | null, logMsg: string) => void;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  image: string; // Emoji illustration
  choices: {
    id: string;
    text: string;
    costDesc: string;
    action: (stats: PlayerStats) => {
      newStats: PlayerStats;
      addedItem: Item | null;
      outcomeMsg: string;
    };
  }[];
}

export const AdventureEventView: React.FC<AdventureEventViewProps> = ({
  stats,
  onEventResolved
}) => {
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [resolutionMsg, setResolutionMsg] = useState<string | null>(null);
  const [resolvedItem, setResolvedItem] = useState<Item | null>(null);
  const [savedNewStats, setSavedNewStats] = useState<PlayerStats | null>(null);
  const [pendingChoice, setPendingChoice] = useState<{
    choice: any;
    statType: 'HP' | 'DMG' | 'LUCK' | 'CRIT';
    statVal: number;
  } | null>(null);

  // Tạo và bốc ngẫu nhiên một sự kiện kỳ duyên giang hồ
  React.useEffect(() => {
    if (!currentEvent && !resolutionMsg) {
      const pEvents: EventData[] = [
        {
          id: 'ev_chess',
          title: 'Trân Lung Kỳ Cục Của Tiếu Dao Phái',
          description: 'Hàng trăm năm qua trên vách đá treo leo, một bàn cờ dang dở vạn cổ vẫn phát ra ánh sáng tím lung linh huyền bí. Tương truyền, người đi đúng nước cờ sẽ đạt được kiếm ý tối cao, nhưng dẫu sai một nước, chân khí bạo phát chấn nát thần hồn.',
          image: '♟️🔮',
          choices: [
            {
              id: 'c_chess_1',
              text: 'Ngồi xuống giải cờ, thử vận kiếm ý',
              costDesc: 'Có cơ hội tăng 12% Chí Mạng hoặc Tẩu hỏa nhập ma (-40 HP)',
              action: (p) => {
                const roll = Math.random() < 0.65; // 65% thành công nhờ ngộ tính
                if (roll) {
                  const updated = {
                    ...p,
                    crit: Math.min(100, p.crit + 12),
                    permCritBonus: (p.permCritBonus || 0) + 12
                  };
                  return {
                    newStats: updated,
                    addedItem: null,
                    outcomeMsg: '🎉 Kỳ ngộ đại thành! Ngươi rốt cuộc phá giải được nước cờ hiểm hóc, một vệt phi kiếm ý chí hóa nhập linh khiếu, gia tăng vĩnh viễn 12% tỷ lệ Chí Mạng!'
                  };
                } else {
                  const updated = { ...p, hp: Math.max(10, p.hp - 45) };
                  return {
                    newStats: updated,
                    addedItem: null,
                    outcomeMsg: '❌ Tẩu hỏa nhập ma! Sát khí bàn cờ phản phệ kịch liệt dội sấm sét trực diện tâm can, bạo phát làm ngươi hộc máu dập dờn mất đi 45 HP.'
                  };
                }
              }
            },
            {
              id: 'c_chess_2',
              text: 'Thu hoạch Linh Thạch rải rác xung quanh',
              costDesc: 'Nhận thẳng linh thạch dồi dào an toàn dời gót',
              action: (p) => {
                const updated = { ...p, stones: p.stones + 2, gold: p.gold + 20 };
                return {
                  newStats: updated,
                  addedItem: null,
                  outcomeMsg: '💎 Tránh xa nguy hiểm nhưng bội thu an sương, ngươi nhặt được 2 viên Linh thạch tinh hoa rớt lại ven đường kề sau cổ tháp và 20 lượng vàng.'
                };
              }
            }
          ]
        },
        {
          id: 'ev_alchemy',
          title: 'Thái Thượng Luyện Đan Lô Bị Bỏ Hoang',
          description: 'Bước vào tầng ngách hoang vắng, ngươi sững sờ trước một chiếc đỉnh đồng khổng lồ bốc khói lục diệu cổ xưa. Bên trong có hai lò linh đan đan hương tỏa ra sảng khoái: Một viên Thần Đan đỏ thẫm cường hóa công lực gân cốt, một viên Thanh Đan hồi phục tinh dịch hộ thể.',
          image: '🏺🍃',
          choices: [
            {
              id: 'c_alc_1',
              text: 'Vớt lấy Thần Đan đỏ thẫm đập vỏ bồi tháp',
              costDesc: 'Cường hóa vĩnh viễn +10 Sát Thương dồi dào khí chất',
              action: (p) => {
                const updated = {
                  ...p,
                  dmg: p.dmg + 10,
                  permDmgBonus: (p.permDmgBonus || 0) + 10
                };
                return {
                  newStats: updated,
                  addedItem: null,
                  outcomeMsg: '🔥 Linh đan rực rực nóng cháy huyết mạch! Ngươi ăn vào thần sắc bừng bừng nung chảy nội kình, công lực gia cường thêm bộc phát +10 Sát Thương vĩnh viễn!'
                };
              }
            },
            {
              id: 'c_alc_2',
              text: 'Nuốt chửng Thanh Đan dịu êm lục hương',
              costDesc: 'Hồi phục hoàn toàn HP sinh lực cốt cách',
              action: (p) => {
                const updated = { ...p, hp: p.maxHp };
                return {
                  newStats: updated,
                  addedItem: null,
                  outcomeMsg: '💖 Thần diệu cải tử hoàn sinh! Dòng tiên khí luân hồi xoa dịu mọi vết rách sẹo hung tợn tháp ma, ngươi lập tức khôi phục toàn vẹn 100% Sinh Mệnh.'
                };
              }
            }
          ]
        },
        {
          id: 'ev_beggar',
          title: 'Giang Hồ Kỳ Nhân Hành Khất',
          description: 'Một lão già hành khất áo quần lam lũ rách nát, tay cầm bình rượu vẩn đục, ngồi ngá nghiêng lèm bèm chặn đường tiến lên tầng kế. Lão cười hắc hắc dơ ngón tay cáu bẩn: "Hỡi đạo hữu có thiên mệnh chí tôn, dâng bớt chút đỉnh vàng ăn bánh uống rượu ta liền truyền thụ cơ duyên dốc hầu bảo vật!"',
          image: '👴🏺',
          choices: [
            {
              id: 'c_beg_1',
              text: 'Hảo tâm hạ phẩm, biếu lão bối 80 Vàng bảo dược',
              costDesc: 'Tiêu tốn 80 vàng đổi lấy Thần Trang Pháp Bảo ngẫu nhiên!',
              action: (p) => {
                if (p.gold < 80) {
                  return {
                    newStats: p,
                    addedItem: null,
                    outcomeMsg: '❌ Lão ăn mày liếc mắt bĩu môi khinh khỉnh: "Ấy, tiền tài không đủ chân thành bộc phát!" Ngươi không đủ 80 Vàng để giao dịch dâng hiến.'
                  };
                }
                const randGear = generateRandomItem(p.currentFloor, p.luck + 10);
                const updated = { ...p, gold: p.gold - 80 };
                return {
                  newStats: updated,
                  addedItem: randGear,
                  outcomeMsg: `🎁 Lão ăn khất cười rộ há hốc mồm: "Hảo anh hùng cứu thế!" Lão sờ soạng từ trong cạp quần nát quăng ra báu vật: [${randGear.name}] phẩm chất vạm vỡ!`
                };
              }
            },
            {
              id: 'c_beg_2',
              text: 'Kiên quyết từ khước lão ăn xin mờ ám',
              costDesc: 'Cảnh giác an giữ ngân sách võ lâm',
              action: (p) => {
                const updated = {
                  ...p,
                  luck: p.luck + 3,
                  permLuckBonus: (p.permLuckBonus || 0) + 3
                };
                return {
                  newStats: updated,
                  addedItem: null,
                  outcomeMsg: '🛡️ Ngươi chắp tay tạ lễ lách qua lão đạo nhân. Sự khôn khéo điềm tĩnh giúp ngươi chiêm nghiệm nhân loại nhân sinh (+3 May Mắn Khí Vận).'
                };
              }
            }
          ]
        },
        {
          id: 'ev_myst_statue',
          title: 'Bàn Thờ Tổ Sư Khuyết Danh',
          description: 'Một bức tượng võ thần khuyết danh bị bụi bặm che kín tọa lạc giữa sương mù ma tháp sâu sắc. Dưới chân tượng ghi dòng chữ triết kinh cổ: "Bất kính thần, lập định thân pháp. Thành tâm lễ, khai sinh thiên nhãn bái bảo thạch."',
          image: '🗽🕉️',
          choices: [
            {
              id: 'c_stat_1',
              text: 'Thành kính dập đầu khấn bái hiến tế bửu linh thạch',
              costDesc: 'Đánh đổi 2 Linh Thạch để bức tượng ban phước khí vận tối cao',
              action: (p) => {
                if (p.stones < 2) {
                  return {
                    newStats: p,
                    addedItem: null,
                    outcomeMsg: '❌ Tượng đá lạnh ngắt im lìm, túi đồ báu của ngươi đã hết nhẵn thiêu thốn Linh thạch dâng lễ tế pháp khí.'
                  };
                }
                const updated = {
                  ...p,
                  stones: p.stones - 2,
                  luck: p.luck + 18,
                  permLuckBonus: (p.permLuckBonus || 0) + 18
                };
                return {
                  newStats: updated,
                  addedItem: null,
                  outcomeMsg: '✨ Thiên nhãn bừng sáng hào quang! Tượng đá phục sinh tỏa ra sương ngọc vây lấy cơ thể, linh thức của ngươi khai thiên hóa vũ gia tăng vĩnh viễn +18 điểm dồi dào May Mắn Khí Vận kích duyên!'
                };
              }
            },
            {
              id: 'c_stat_2',
              text: 'Lục soát bệ thờ tìm dã ngọc tinh xảo',
              costDesc: 'Lấy trộm 90 Vàng nhưng cơ vảy đen đủi bám sườn (-5 May Mắn)',
              action: (p) => {
                const updated = { ...p, gold: p.gold + 90, luck: Math.max(1, p.luck - 5) };
                return {
                  newStats: updated,
                  addedItem: null,
                  outcomeMsg: '💰 Ngươi phát hiện hốc ngách chứa đầy vụn vàng thỏi của cựu tu sĩ rơi rớt (+90 Vàng), tuy nhiên khói hương tổ sư phẫn chí ám gột đen sì nguyên khí (-5 May Mắn khí bẩm).'
                };
              }
            }
          ]
        }
      ];

      // Rút ngẫu nhiên một sự kiện kỳ ngộ giang hồ xuất phát
      const randomEv = pEvents[Math.floor(Math.random() * pEvents.length)];
      setCurrentEvent(randomEv);
    }
  }, [currentEvent, resolutionMsg]);

  if (!currentEvent) {
    return <div className="text-center p-8 text-neutral-400 font-mono text-sm animate-pulse">Đang định vị hư không linh khí tiếp nạp...</div>;
  }

  const applyChoice = (choice: any, absorptionType: 'NORMAL' | 'OPTION1_100' | 'OPTION2_20') => {
    if (absorptionType === 'NORMAL') {
      const res = choice.action(stats);
      setSavedNewStats(res.newStats);
      setResolvedItem(res.addedItem);
      setResolutionMsg(res.outcomeMsg);
    } else if (absorptionType === 'OPTION1_100') {
      const res = choice.action(stats);
      setSavedNewStats(res.newStats);
      setResolvedItem(res.addedItem);
      setResolutionMsg(
        res.outcomeMsg + '\n\n⚡ [CÀN KHÔN HẤP THỤ (100%)]: Đã tiếp nhận đầy đủ trị số thuộc tính lâm thời, bộc phá uy dũng vượt tháp nhưng SẼ MẤT KHI CHẾT!'
      );
    } else {
      const res = choice.action(stats);
      let statType = '';
      let statVal = 0;
      if (choice.id === 'c_chess_1') {
        statType = 'CRIT';
        statVal = 12;
      } else if (choice.id === 'c_alc_1') {
        statType = 'DMG';
        statVal = 10;
      } else if (choice.id === 'c_beg_2') {
        statType = 'LUCK';
        statVal = 3;
      } else if (choice.id === 'c_stat_1') {
        statType = 'LUCK';
        statVal = 18;
      }
      
      const newVal = Math.max(1, Math.floor(statVal * 0.2));
      const updatedStats = { ...res.newStats };
      
      if (statType === 'CRIT') {
        updatedStats.crit = Math.min(100, stats.crit + newVal);
        updatedStats.permCritBonus = (stats.permCritBonus || 0);
        updatedStats.reincarnationCrit = (stats.reincarnationCrit || 0) + newVal;
      } else if (statType === 'DMG') {
        updatedStats.dmg = stats.dmg + newVal;
        updatedStats.permDmgBonus = (stats.permDmgBonus || 0);
        updatedStats.reincarnationDmg = (stats.reincarnationDmg || 0) + newVal;
      } else if (statType === 'LUCK') {
        updatedStats.luck = stats.luck + newVal;
        updatedStats.permLuckBonus = (stats.permLuckBonus || 0);
        updatedStats.reincarnationLuck = (stats.reincarnationLuck || 0) + newVal;
      } else if (statType === 'HP') {
        updatedStats.maxHp = stats.maxHp + newVal;
        updatedStats.hp = Math.min(updatedStats.maxHp, stats.hp + newVal);
        updatedStats.permHpBonus = (stats.permHpBonus || 0);
        updatedStats.reincarnationHp = (stats.reincarnationHp || 0) + newVal;
      }

      setSavedNewStats(updatedStats);
      setResolvedItem(res.addedItem);
      
      let msg = res.outcomeMsg;
      if (choice.id === 'c_chess_1') {
        msg = `🎉 Trân Lung Kỳ trận dung nhu, lướt kiếm ý tụ cốt! Ngươi chọn hấp cốt vĩnh viễn, thực nhận +${newVal}% Tỷ lệ Chí Mạng vĩnh hằng!`;
      } else if (choice.id === 'c_alc_1') {
        msg = `🔥 Đan điền tôi luyện tiên linh cốt! Ngươi chọn hấp cốt vĩnh viễn, thực nhận +${newVal} Sát Thương vĩnh hằng!`;
      } else if (choice.id === 'c_beg_2') {
        msg = `🛡️ Nhân duyên phong trần chiêm nghiệm kì hỷ! Ngươi chọn hấp cốt vĩnh viễn, thực nhận +${newVal} May Mắn khí vận vĩnh hằng!`;
      } else if (choice.id === 'c_stat_1') {
        msg = `✨ Tổ sư thông đạo tụ linh khí! Ngươi chọn hấp cốt vĩnh viễn, thực nhận +${newVal} May Mắn khí vận vĩnh hằng!`;
      }

      setResolutionMsg(
        msg + '\n\n💖 [TIÊN CỐT HẤP THỤ (VĨNH VIỄN)]: Chỉ nhận 20% trị số, nhưng linh lực kỳ ngộ đã hóa thâm căn cố cốt, vĩnh viễn được bảo hộ qua mọi kiếp luân hồi!'
      );
    }
  };

  const handleChoiceClick = (choice: typeof currentEvent.choices[0]) => {
    // Không đủ vàng trong giao dịch ăn mày
    if (choice.id === 'c_beg_1' && stats.gold < 80) {
      alert('Không đủ 80 lạng vàng trong túi hành trang để biếu lão kỳ nhân ngoạn mục này.');
      return;
    }
    // Không đủ đá trong tượng phật
    if (choice.id === 'c_stat_1' && stats.stones < 2) {
      alert('Không đủ 2 viên Linh thạch bùa phép lễ nghi dâng lễ bệ khuyết danh.');
      return;
    }

    let statType: 'HP' | 'DMG' | 'LUCK' | 'CRIT' | null = null;
    let statVal = 0;
    if (choice.id === 'c_chess_1') {
      statType = 'CRIT';
      statVal = 12;
    } else if (choice.id === 'c_alc_1') {
      statType = 'DMG';
      statVal = 10;
    } else if (choice.id === 'c_beg_2') {
      statType = 'LUCK';
      statVal = 3;
    } else if (choice.id === 'c_stat_1') {
      statType = 'LUCK';
      statVal = 18;
    }

    if (statType) {
      setPendingChoice({ choice, statType, statVal });
    } else {
      applyChoice(choice, 'NORMAL');
    }
  };

  const handleProceed = () => {
    if (savedNewStats) {
      onEventResolved(savedNewStats, resolvedItem, resolutionMsg || 'Đã hoàn thành Kỳ Duyên giang hồ.');
    }
    // Clear state
    setCurrentEvent(null);
    setResolutionMsg(null);
    setResolvedItem(null);
    setSavedNewStats(null);
  };

  return (
    <div id="adventure-event-panel" className="bg-slate-950 border-2 border-amber-500/40 p-6 rounded-xl text-slate-100 shadow-[0_0_20px_rgba(245,158,11,0.15)] relative max-w-2xl mx-auto overflow-hidden">
      
      {/* Visual background paper and cloud decor */}
      <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 select-none font-serif">☯️</div>
      <div className="absolute bottom-0 left-0 p-8 text-6xl opacity-10 select-none font-serif">🐉</div>

      {pendingChoice ? (
        <div className="space-y-6 py-4 text-center">
          <span className="text-5xl block animate-bounce">☯️🔮</span>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest">LINH KHÍ NHẬP KIẾP CHỌN LỰA</h3>
            <p className="text-xs text-slate-300 leading-normal font-sans">
              Ngươi sắp hấp thụ kỳ duyên cường hóa tăng <strong className="text-amber-300">+{pendingChoice.statVal} {pendingChoice.statType === 'CRIT' ? 'Bạo Kích (%)' : pendingChoice.statType === 'DMG' ? 'Sát Thương' : 'May Mắn'}</strong>. Hãy lựa chọn phương thức truyền tủy:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg mx-auto">
            <button
              id="btn-absorb-temp"
              onClick={() => {
                applyChoice(pendingChoice.choice, 'OPTION1_100');
                setPendingChoice(null);
              }}
              className="p-4 bg-slate-900 border border-slate-850 hover:bg-slate-850/50 hover:border-amber-500/40 rounded-xl text-left transition-all hover:scale-101 flex flex-col justify-between cursor-pointer text-xs"
            >
              <div>
                <strong className="text-amber-400 block text-xs uppercase font-mono mb-1">⚡ 1. CÀN KHÔN LINH PHÁP (100%)</strong>
                <p className="text-slate-300 font-sans mt-0.5 leading-snug">
                  Tiếp nạp nguyên vẹn toàn vẹn chân khí thực lực <span className="text-amber-300 font-bold">+{pendingChoice.statVal}</span> chỉ số.
                </p>
              </div>
              <span className="block text-[10px] text-rose-400 mt-4 font-serif italic">⚠️ Sẽ mất đi hoàn toàn khi ngươi chết hoặc Niết Bàn!</span>
            </button>

            <button
              id="btn-absorb-perm"
              onClick={() => {
                applyChoice(pendingChoice.choice, 'OPTION2_20');
                setPendingChoice(null);
              }}
              className="p-4 bg-slate-900 border border-slate-850 hover:bg-slate-850/50 hover:border-emerald-500/40 rounded-xl text-left transition-all hover:scale-101 flex flex-col justify-between cursor-pointer text-xs"
            >
              <div>
                <strong className="text-emerald-400 block text-xs uppercase font-mono mb-1">💖 2. KIM CANG HỘ CỐT (20%)</strong>
                <p className="text-slate-300 font-sans mt-0.5 leading-snug">
                  Chỉ hấp thụ 20% chân kình thực tế: <span className="text-emerald-300 font-extrabold font-mono">+{Math.max(1, Math.floor(pendingChoice.statVal * 0.2))}</span> chỉ số.
                </p>
              </div>
              <span className="block text-[10px] text-emerald-400 mt-4 font-serif italic">✨ Khắc vào nguyên cốt linh hồn, giữ vĩnh viễn vĩnh hằng!</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              id="btn-cancel-absorption"
              onClick={() => setPendingChoice(null)}
              className="text-[10px] text-slate-500 hover:text-slate-300 font-mono tracking-wider uppercase underline cursor-pointer"
            >
              Quay lại lựa chọn của kỳ ngộ
            </button>
          </div>
        </div>
      ) : !resolutionMsg ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400 uppercase tracking-widest text-xs font-bold font-mono">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Giang Hồ Biến Cố • Kỳ Duyên Tầng Tháp</span>
          </div>

          <div className="flex gap-4 items-center">
            <span className="text-6xl p-3 bg-slate-900 border border-slate-800 rounded-lg select-none">
              {currentEvent.image}
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-amber-300 font-sans tracking-wide">
                {currentEvent.title}
              </h3>
              <p className="text-xs text-slate-500 font-serif leading-none mt-1">Đạo tổ thấu hiểu nhân sinh kỳ ngộ</p>
            </div>
          </div>

          <div className="p-4 bg-slate-905 border border-slate-850 rounded-lg text-xs leading-relaxed text-slate-300 font-serif italic text-justify">
            "{currentEvent.description}"
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-900">
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Hãy hành quyết lựa chọn đắn đo</h4>
            
            {currentEvent.choices.map((choice) => (
              <button
                key={choice.id}
                id={`btn-choice-${choice.id}`}
                onClick={() => handleChoiceClick(choice)}
                className="w-full p-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/30 rounded-lg text-left text-xs transition-all duration-200 group flex justify-between items-center cursor-pointer active:scale-99"
              >
                <div>
                  <div className="font-bold text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:animate-ping" />
                    {choice.text}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Độc hành chi tiết: {choice.costDesc}
                  </div>
                </div>
                <span className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-400 group-hover:text-amber-200 font-mono">Lựa Chọn</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-center py-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto text-3xl animate-bounce">
            🎁
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-black text-amber-300">ĐÃ LẬP THƯ PHÁP LINH CHI</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-serif text-justify bg-slate-900/60 p-4 border border-slate-800 rounded">
              {resolutionMsg}
            </p>
          </div>

          {resolvedItem && (
            <div className="max-w-xs mx-auto p-3 bg-slate-900 border-2 border-dashed border-amber-500/30 rounded-lg flex items-center gap-2.5">
              <span className="text-3xl">🎒</span>
              <div className="text-left">
                <span className="text-[9px] font-mono text-amber-400 uppercase">Trang bị kỳ duyên nhân vật</span>
                <div className="text-xs font-bold text-slate-200">{resolvedItem.name}</div>
                <div className="text-[10px] text-slate-500 italic">{resolvedItem.description}</div>
              </div>
            </div>
          )}

          <div className="pt-4 max-w-sm mx-auto">
            <button
              id="btn-confirm-event-resolved"
              onClick={handleProceed}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs tracking-widest rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Vực Tháp Đi Tiếp
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
