import React, { useState } from 'react';
import { PlayerStats, Item, ItemType, ItemRarity } from '../types';
import { Shield, Swords, Sparkles, BookOpen, Trash2, Heart, Star, CheckCircle } from 'lucide-react';

interface InventoryViewProps {
  stats: PlayerStats;
  items: Item[];
  onEquip: (itemId: string) => void;
  onUnequip: (itemId: string) => void;
  onRecycle: (itemId: string) => void;
}

const RARITY_DETAILS: Record<ItemRarity, { label: string; textClass: string; bgClass: string; borderClass: string }> = {
  COMMON: { label: 'Bình Thường', textClass: 'text-slate-400', bgClass: 'bg-slate-950/70', borderClass: 'border-slate-800' },
  RARE: { label: 'Quý Hiếm', textClass: 'text-emerald-400 font-bold', bgClass: 'bg-emerald-950/20', borderClass: 'border-emerald-900/60' },
  EPIC: { label: 'U Minh', textClass: 'text-purple-400 font-bold', bgClass: 'bg-purple-950/30', borderClass: 'border-purple-900/60' },
  LEGENDARY: { label: 'Truyền Thuyết', textClass: 'text-amber-400 font-extrabold shadow-amber-500/20', bgClass: 'bg-amber-950/45', borderClass: 'border-amber-500/50' },
  MYTHIC: { label: 'Thần Thoại', textClass: 'text-rose-400 font-black animate-pulse shadow-rose-500/20', bgClass: 'bg-rose-950/50', borderClass: 'border-rose-500/70' }
};

const ITEM_TYPE_ICONS: Record<ItemType, React.ReactNode> = {
  WEAPON: <Swords className="w-4 h-4 text-rose-400" />,
  ARMOR: <Shield className="w-4 h-4 text-sky-400" />,
  TREASURE: <Sparkles className="w-4 h-4 text-purple-400" />,
  BOOK: <BookOpen className="w-4 h-4 text-yellow-400" />
};

const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  WEAPON: 'Thần Binh',
  ARMOR: 'Hộ Giáp',
  TREASURE: 'Linh Bảo',
  BOOK: 'Thiên Thư'
};

export const InventoryView: React.FC<InventoryViewProps> = ({
  stats,
  items,
  onEquip,
  onUnequip,
  onRecycle
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Nhóm thiết bị đã trang bị
  const equippedWeapons = items.filter(i => i.equipped && i.type === 'WEAPON');
  const equippedArmors = items.filter(i => i.equipped && i.type === 'ARMOR');
  const equippedTreasures = items.filter(i => i.equipped && i.type === 'TREASURE');
  const equippedBooks = items.filter(i => i.equipped && i.type === 'BOOK');

  const unequippedItems = items.filter(i => !i.equipped);

  const selectAndShowItem = (item: Item) => {
    setSelectedItem(item);
  };

  // Tính tổng trị số rèn giáp rương chứa đồ
  const totalItemSlots = 40;
  const occupiedSlots = items.length;

  return (
    <div id="inventory-panel" className="bg-slate-900 border-2 border-slate-800 p-6 rounded-xl text-slate-100 shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* CỘT TRÁI: THẦN TRANG ĐANG MẶC TRÊN NGƯỜI */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl relative">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> Linh Khiếu Thần Trang
            </h3>

            {/* Các Khay Trang Bị */}
            <div className="space-y-3">
              {/* Slot VŨ KHÍ */}
              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between gap-2.5 min-h-[58px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-rose-950/30 border border-rose-900/30 flex items-center justify-center font-bold text-lg">
                    ⚔️
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase leading-none font-mono">Binh Khí Hộ Thân</div>
                    {equippedWeapons.length > 0 ? (
                      <button 
                        onClick={() => selectAndShowItem(equippedWeapons[0])}
                        className="text-xs font-bold text-rose-400 hover:underline block text-left"
                      >
                        {equippedWeapons[0].name}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 block">Kẽ hở tay không</span>
                    )}
                  </div>
                </div>
                {equippedWeapons.length > 0 && (
                  <button
                    onClick={() => onUnequip(equippedWeapons[0].id)}
                    className="text-[10px] text-slate-400 hover:text-rose-400 font-mono px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                  >
                    Tháo
                  </button>
                )}
              </div>

              {/* Slot HỘ GIÁP */}
              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between gap-2.5 min-h-[58px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-sky-950/30 border border-sky-900/30 flex items-center justify-center font-bold text-lg">
                    👕
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase leading-none font-mono">Phòng Ngự Hộ Giáp</div>
                    {equippedArmors.length > 0 ? (
                      <button 
                        onClick={() => selectAndShowItem(equippedArmors[0])}
                        className="text-xs font-bold text-sky-400 hover:underline block text-left"
                      >
                        {equippedArmors[0].name}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 block">Tiêu mặc xiêm y mỏng</span>
                    )}
                  </div>
                </div>
                {equippedArmors.length > 0 && (
                  <button
                    onClick={() => onUnequip(equippedArmors[0].id)}
                    className="text-[10px] text-slate-400 hover:text-rose-400 font-mono px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                  >
                    Tháo
                  </button>
                )}
              </div>

              {/* Slot BẢO VẬT */}
              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between gap-2.5 min-h-[58px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-purple-950/30 border border-purple-900/30 flex items-center justify-center font-bold text-lg">
                    💍
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase leading-none font-mono">Linh Bảo Khí Vận</div>
                    {equippedTreasures.length > 0 ? (
                      <button 
                        onClick={() => selectAndShowItem(equippedTreasures[0])}
                        className="text-xs font-bold text-purple-400 hover:underline block text-left"
                      >
                        {equippedTreasures[0].name}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 block">Chưa sở hữu pháp bảo</span>
                    )}
                  </div>
                </div>
                {equippedTreasures.length > 0 && (
                  <button
                    onClick={() => onUnequip(equippedTreasures[0].id)}
                    className="text-[10px] text-slate-400 hover:text-rose-400 font-mono px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                  >
                    Tháo
                  </button>
                )}
              </div>

              {/* Slot KIẾM PHÁP BÍ KÍP */}
              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between gap-2.5 min-h-[58px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-yellow-950/30 border border-yellow-905/30 flex items-center justify-center font-bold text-lg">
                    📜
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase leading-none font-mono">Bí Mật Thiên Thư</div>
                    {equippedBooks.length > 0 ? (
                      <button 
                        onClick={() => selectAndShowItem(equippedBooks[0])}
                        className="text-xs font-bold text-yellow-400 hover:underline block text-left"
                      >
                        {equippedBooks[0].name}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600 block">Chưa lĩnh ngộ điển văn</span>
                    )}
                  </div>
                </div>
                {equippedBooks.length > 0 && (
                  <button
                    onClick={() => onUnequip(equippedBooks[0].id)}
                    className="text-[10px] text-slate-400 hover:text-rose-400 font-mono px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                  >
                    Tháo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CỘT GIỮA: RƯƠNG TRANG BỊ CHƯA SỬ DỤNG */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              📂 Hành Trang Đồ Đạc <span className="text-xs font-mono font-normal text-slate-500">([{occupiedSlots} / {totalItemSlots}])</span>
            </h3>
            <span className="text-[11px] text-slate-400">Ấn trang bị để tăng sức mạnh!</span>
          </div>

          {unequippedItems.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-500">
              <span className="text-3xl block mb-2">🎒</span>
              <p className="text-xs">U minh tế phẩm trống rỗng. Hãy hạ quái tháp, hoàn thành sự kiện kỳ duyên để nhận trang bị ngẫu nhiên.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 max-h-[340px] overflow-y-auto gap-2.5 p-1 bg-slate-950/50 rounded-lg border border-slate-800">
              {unequippedItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const r = RARITY_DETAILS[item.rarity];
                
                return (
                  <div
                    key={item.id}
                    id={`inventory-item-${item.id}`}
                    onClick={() => selectAndShowItem(item)}
                    className={`p-2 rounded-lg cursor-pointer transition-all duration-200 border-2 select-none flex items-center gap-2 relative ${
                      isSelected ? 'border-amber-400 shadow-lg bg-slate-800' : `${r.borderClass} ${r.bgClass} hover:bg-slate-900`
                    }`}
                  >
                    <div className="w-8 h-8 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-center font-bold text-sm">
                      {item.type === 'WEAPON' ? '⚔️' : item.type === 'ARMOR' ? '👕' : item.type === 'TREASURE' ? '💍' : '📜'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate text-slate-200" title={item.name}>
                        {item.name}
                      </h4>
                      <p className={`text-[9px] uppercase font-mono ${r.textClass}`}>
                        {r.label}
                      </p>
                    </div>

                    {/* Badge level */}
                    <span className="absolute top-1 right-1 text-[8px] font-mono bg-slate-900 border border-slate-800 px-1 rounded text-amber-500">
                      T{item.level}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: CHI TIẾT VÀ HÀNH ĐỘNG CỦA VẬT PHẨM ĐANG CHỌN */}
        <div className="w-full lg:w-1/3">
          {selectedItem ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono bg-slate-900 border border-slate-700/60 text-slate-400 px-2 py-0.5 rounded flex items-center gap-1">
                    {ITEM_TYPE_ICONS[selectedItem.type]}
                    {ITEM_TYPE_LABELS[selectedItem.type]}
                  </span>
                  <span className={`text-xs ${RARITY_DETAILS[selectedItem.rarity].textClass} font-mono uppercase bg-slate-900 md:px-2 py-0.5 rounded border border-slate-800`}>
                    {selectedItem.rarity}
                  </span>
                </div>

                <h3 className="text-md font-extrabold text-amber-300 mb-1">{selectedItem.name}</h3>
                <p className="text-[11px] italic font-serif text-slate-500 leading-relaxed font-semibold mb-4">
                  "{selectedItem.flavorText}"
                </p>

                {/* SỰ THAY ĐỔI CỦA CHỈ SỐ */}
                <div className="space-y-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs mb-4">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cộng dồn nội lực</h4>
                  
                  {selectedItem.dmgBonus && (
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Sát thương (Công):</span>
                      <span className="text-rose-400 font-bold">+{selectedItem.dmgBonus} DMG</span>
                    </div>
                  )}
                  {selectedItem.critBonus && (
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Tỷ lệ Chí mạng (Bạo):</span>
                      <span className="text-yellow-400 font-bold">+{selectedItem.critBonus}%</span>
                    </div>
                  )}
                  {selectedItem.hpBonus && (
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Sinh Mệnh Hộ Thể (Máu):</span>
                      <span className="text-emerald-400 font-bold">+{selectedItem.hpBonus} HP</span>
                    </div>
                  )}
                  {selectedItem.luckBonus && (
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">May Mắn Khí Vận (Mệnh):</span>
                      <span className="text-purple-400 font-bold">+{selectedItem.luckBonus} LUCK</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-4 bg-slate-900/20 p-2 border border-dashed border-slate-800 rounded">
                  {selectedItem.description}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-2 border-t border-slate-800/80 pt-3">
                {selectedItem.equipped ? (
                  <button
                    id="btn-unequip-selected"
                    onClick={() => {
                      onUnequip(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-bold uppercase transition-all tracking-wider cursor-pointer"
                  >
                    Tháo Xuống
                  </button>
                ) : (
                  <button
                    id="btn-equip-selected"
                    onClick={() => {
                      onEquip(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 tracking-wider cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Trang Bị Lên Người
                  </button>
                )}

                {/* Recycle button */}
                {!selectedItem.equipped && (
                  <button
                    id="btn-recycle-selected"
                    onClick={() => {
                      onRecycle(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="w-full py-2 bg-slate-950 hover:bg-rose-950/50 hover:text-rose-400 border border-slate-800 hover:border-rose-900/45 text-slate-400 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Luyện Hóa Đan Dược
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-500 flex flex-col justify-center items-center h-full min-h-[300px]">
              <span className="text-2xl animate-bounce">🔍</span>
              <p className="text-xs mt-2 leading-relaxed">Chọn một vật phẩm trong danh sách hành trang hoặc thần trang bên trái để xem mô tả chiêm ngưỡng thần uy.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
