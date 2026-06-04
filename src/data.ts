import { Companion, Pet, Item, MartialArt, RoguelikeChoice, ItemRarity, ItemType } from './types';

// Danh sách Đồng Hành
export const PRESET_COMPANIONS: Companion[] = [
  {
    id: 'c1',
    name: 'Quách Tĩnh',
    title: 'Bắc Hiệp',
    role: 'TANK',
    hp: 450,
    maxHp: 450,
    dmg: 28,
    skillName: 'Hàng Long Thập Bát Chưởng',
    skillDesc: 'Gây 150% sát thương và tạo khiên giảm 30% sát thương nhận vào trong 3 lượt.',
    skillCooldown: 4,
    currentCooldown: 0,
    avatar: '🛡️⚔️ Quách Tĩnh',
    description: 'Tính tình khảng khái, chính trực, sở hữu nội công thâm hậu vững như bàn thạch.',
    level: 1,
  },
  {
    id: 'c2',
    name: 'Tiêu Phong',
    title: 'Cựu Bang Chủ Cái Bang',
    role: 'TANK',
    hp: 500,
    maxHp: 500,
    dmg: 35,
    skillName: 'Kháng Long Hữu Hối',
    skillDesc: 'Đánh lui kẻ địch gây 180% sát thương và hồi phục 15% máu đã mất.',
    skillCooldown: 5,
    currentCooldown: 0,
    avatar: '🐉🔥 Tiêu Phong',
    description: 'Khí phách hiên ngang, dũng mãnh đệ nhất thiên hạ, luôn đứng mũi chịu sào bảo vệ đồng đội.',
    level: 1,
  },
  {
    id: 'c3',
    name: 'Đoàn Dự',
    title: 'Đại Lý Thế Tử',
    role: 'SUPPORT',
    hp: 280,
    maxHp: 280,
    dmg: 25,
    skillName: 'Lục Mạch Thần Kiếm',
    skillDesc: 'Bắn ra kiếm khí vô hình gây 120% sát thương bỏ qua phòng ngự địch và tăng 15% bạo kích cho đồng đội.',
    skillCooldown: 3,
    currentCooldown: 0,
    avatar: '✨💎 Đoàn Dự',
    description: 'Phong lưu nho nhã, sở hữu khả năng di chuyển quỷ dị nhờ Lăng Ba Vi Bộ.',
    level: 1,
  },
  {
    id: 'c4',
    name: 'Vương Ngữ Yên',
    title: 'Thần Tiên Tỷ Tỷ',
    role: 'SUPPORT',
    hp: 250,
    maxHp: 250,
    dmg: 15,
    skillName: 'Chỉ Điểm Võ Học',
    skillDesc: 'Thấu hiểu mọi võ học thiên hạ, hóa giải chiêu thức địch (giảm 40% công địch trong 2 lượt) và tăng 25% sát thương người chơi.',
    skillCooldown: 4,
    currentCooldown: 0,
    avatar: '🌸📖 Vương Ngữ Yên',
    description: 'Thông minh trí tuệ siêu phàm, tuy không có võ công phòng thân nhưng thấu hiểu vạn pháp.',
    level: 1,
  },
  {
    id: 'c5',
    name: 'Tiểu Long Nữ',
    title: 'Cổ Mộ Tiên Tử',
    role: 'DPS',
    hp: 300,
    maxHp: 300,
    dmg: 42,
    skillName: 'Ngọc Nữ Tâm Kinh',
    skillDesc: 'Song kiếm hợp bích gây chí mạng 220% sát thương lên kẻ địch máu thấp nhất.',
    skillCooldown: 3,
    currentCooldown: 0,
    avatar: '❄️🤍 Tiểu Long Nữ',
    description: 'Thanh lãnh thoát tục như tiên nữ giáng trần, kiếm pháp nhanh nhẹn tinh tế vô song.',
    level: 1,
  },
  {
    id: 'c6',
    name: 'Hư Trúc',
    title: 'Tiêu Dao Phái Chưởng Môn',
    role: 'SUPPORT',
    hp: 380,
    maxHp: 380,
    dmg: 22,
    skillName: 'Thiên Sơn Lục Dương Chưởng',
    skillDesc: 'Tịnh hóa và hồi phục 25% sinh lực tối đa cho toàn đội mẫu thân.',
    skillCooldown: 4,
    currentCooldown: 0,
    avatar: '📿☯️ Hư Trúc',
    description: 'Lòng phật từ bi dạt dào, sở hữu hơn trăm năm thuần hậu tu vi của tam lão Tiêu Dao.',
    level: 1,
  }
];

// Danh sách Linh Thú (Pets)
export const PRESET_PETS: Pet[] = [
  {
    id: 'p1',
    name: 'Hỏa Kỳ Lân',
    element: 'FIRE',
    elementName: 'Hệ Hỏa (Đứng Trước)',
    level: 1,
    dmgBonus: 30,
    critBonus: 5,
    luckBonus: 0,
    hpBonus: 50,
    skillName: 'Kỳ Lân Thánh Hỏa',
    skillDesc: 'Phun lửa thiêu rụi địch nhân, tăng thêm 15% Sát Thương cho chủ nhân ở lượt kế.',
    avatar: '🦁🔥',
    captureChance: 45
  },
  {
    id: 'p2',
    name: 'Thanh Long Vương',
    element: 'THUNDER',
    elementName: 'Hệ Lôi (Bay Trên Đầu)',
    level: 1,
    dmgBonus: 20,
    critBonus: 12,
    luckBonus: 5,
    hpBonus: 30,
    skillName: 'Cửu Thiên Lôi Công',
    skillDesc: 'Triệu hồi sấm sét oanh tạc địch nhân, tăng mạnh 15% tỷ lệ Chí Mạng.',
    avatar: '🐉⚡',
    captureChance: 25
  },
  {
    id: 'p3',
    name: 'Ngọc Thiềm Thừ',
    element: 'WATER',
    elementName: 'Hệ Thủy (Đứng Sau)',
    level: 1,
    dmgBonus: 10,
    critBonus: 0,
    luckBonus: 15,
    hpBonus: 120,
    skillName: 'Thổ Nạp Trường Sinh',
    skillDesc: 'Hút linh khí trời đất, hồi 10% máu tối đa cho chủ nhân sau mỗi lượt đấu.',
    avatar: '🐸💚',
    captureChance: 60
  },
  {
    id: 'p4',
    name: 'Kim Sí Kim Điêu',
    element: 'WIND',
    elementName: 'Hệ Phong (Bay Trên Đầu)',
    level: 1,
    dmgBonus: 15,
    critBonus: 8,
    luckBonus: 25,
    hpBonus: 20,
    skillName: 'Cuồng Phong Thần Vũ',
    skillDesc: 'Tạo bão cát cản tầm nhìn kẻ địch (giảm né tránh/giảm chính xác của địch) và đem lại may mắn nhặt bảo vật cực cao (+25 LUCK).',
    avatar: '🦅🍃',
    captureChance: 50
  },
  {
    id: 'p5',
    name: 'Băng Lam Phượng Hoàng',
    element: 'WATER',
    elementName: 'Hệ Thủy (Đứng Sau)',
    level: 1,
    dmgBonus: 25,
    critBonus: 8,
    luckBonus: 10,
    hpBonus: 80,
    skillName: 'Băng Phách Thần Quang',
    skillDesc: 'Phát ra hàn khí đóng băng dòng tuần hoàn của địch, hồi máu và gia tăng sát thương vĩnh viễn.',
    avatar: '🐦❄️',
    captureChance: 30
  }
];

// Tên Vũ khí, Giáp, Bảo vật Thần khí theo phẩm chất
export const ITEM_NAMES: Record<string, string[]> = {
  WEAPON: [
    'Thiết Kiếm', 'Quạt Lông Vũ', 'Đồ Long Đao', 'Ỷ Thiên Kiếm', 'Phá Thiên Kích', 'Ngọc Tiêu',
    'Thanh Vân Kiếm', 'Thất Sát Kiếm', 'Huyền Thiết Trọng Kiếm', 'Yên Vũ Tiêu', 'Phục Ma Côn', 'Càn Khôn Luân'
  ],
  ARMOR: [
    'Giáp Vải Thô', 'Áo Bào Đạo Nhân', 'Áo Giáp Hắc Thiết', 'Mềm Giáp Tơ Tằm', 'Nhuyễn Giáp Kim Ty',
    'Băng Linh Chiến Giáp', 'Càn Khôn Hộ Giáp', 'Cổ Ngọc Nghê Thường', 'Thần Hoàng Khải Giáp'
  ],
  TREASURE: [
    'Nhẫn Ngọc Cổ', 'Bình Định Phong', 'Ý Chỉ Võ Lâm', 'Tượng Phật Tổ', 'Hương Lư Đồng',
    'Nguyên Khí Đan', 'Huyết Ngọc Bội', 'Cửu Chuyển Linh Thán', 'Hỗn Độn Kính', 'Vạn Cổ Đỉnh'
  ]
};

export const MARTIAL_ARTS_POOL: MartialArt[] = [
  {
    id: 'ma1',
    name: 'Thái Cực Kiếm Pháp',
    damageMultiplier: 1.45,
    effect: 'Cương nhu phối hợp: Gây 145% dame, tự hồi 5% HP tối đa',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Chậm rãi nhu hòa nhưng mượn lực đánh lực, dĩ nhu khắc cương siêu đẳng, lấy tĩnh chế động.',
    rarity: 'RARE',
    type: 'ACTIVE',
    artCategory: 'KIẾM'
  },
  {
    id: 'ma2',
    name: 'Hàng Long Chưởng Thức',
    damageMultiplier: 2.05,
    effect: 'Tuyệt kỹ giáng long: Gây 205% dame, làm choáng kẻ địch 1 hiệp',
    cooldown: 4,
    currentCooldown: 0,
    description: 'Tuyệt kỹ đệ nhất dương cương cương mãnh chi cực, vô lý xé rách mọi phòng tuyến quân thù.',
    rarity: 'EPIC',
    type: 'ACTIVE',
    artCategory: 'CHƯỞNG'
  },
  {
    id: 'ma3',
    name: 'Cửu Dương Thần Công',
    damageMultiplier: 1.0,
    effect: 'Cửu thần hộ thể: +25% Công cơ bản & +300 Máu tối đa dồn cộng thêm (Thụ động)',
    cooldown: 0,
    currentCooldown: 0,
    description: 'Nội công tuyệt đỉnh nhân thế, chân khí tinh chất cuồn cuộn không dứt tựa như mặt trời rực rỡ.',
    rarity: 'LEGENDARY',
    type: 'PASSIVE',
    artCategory: 'NỘI CÔNG'
  },
  {
    id: 'ma4',
    name: 'Độc Cô Cửu Kiếm',
    damageMultiplier: 2.65,
    effect: 'Chỉ điểm sơ hở: Gây 265% dame, tăng vọt thêm 30% tỉ lệ chí mạng',
    cooldown: 4,
    currentCooldown: 0,
    description: 'Tìm sơ hở của vạn tông chiêu thức thế gian mà phá, dĩ vô chiêu thắng hữu chiêu cực đoan.',
    rarity: 'LEGENDARY',
    type: 'ACTIVE',
    artCategory: 'KIẾM'
  },
  {
    id: 'ma5',
    name: 'Dịch Cân Kinh',
    damageMultiplier: 1.0,
    effect: 'Khí huyết trường sinh: Mỗi hiệp đấu tự động hồi phục 8% sinh mệnh tối đa (Thụ động)',
    cooldown: 0,
    currentCooldown: 0,
    description: 'Bảo điển thay gân đổi cốt diệu dụng vô tỷ của Thiếu Lâm Tự, dồi dào hồi sinh dâng khí.',
    rarity: 'MYTHIC',
    type: 'PASSIVE',
    artCategory: 'NỘI CÔNG'
  },
  {
    id: 'ma6',
    name: 'Ám Nhiên Tiêu Hồn Chưởng',
    damageMultiplier: 2.15,
    effect: 'Tiêu hồn thương kiếp: Gây 215% dame, sát lực x3.2 lần khi máu dưới 35%',
    cooldown: 4,
    currentCooldown: 0,
    description: 'Võ học bắt nguồn từ tâm trạng u uất sầu khổ tuyệt vọng cực độ mà phóng thích bộc kích thần kỳ.',
    rarity: 'EPIC',
    type: 'ACTIVE',
    artCategory: 'CHƯỞNG'
  },
  {
    id: 'ma7',
    name: 'Nhất Dương Chỉ',
    damageMultiplier: 1.6,
    effect: 'Kích kịch huyệt: Gây 160% dame, xuyên phá, bỏ qua 50% phòng vệ địch',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Ngón tay chỉ xuất như chớp, vận kình phong xuyên thấu chỉ điểm kịch huyệt kẻ địch thần tốc.',
    rarity: 'RARE',
    type: 'ACTIVE',
    artCategory: 'CHƯỞNG'
  },
  {
    id: 'ma_kiem_1',
    name: 'Thần Đồng Kiếm Pháp',
    damageMultiplier: 1.15,
    effect: 'Kiếm chiêu sơ khởi cơ bản nhanh gọn: Gây 115% sát thương',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Cơ bản kiếm pháp giang hồ phổ biến rộng rãi cho môn sinh võ học sơ khai bộc kình.',
    rarity: 'COMMON',
    type: 'ACTIVE',
    artCategory: 'KIẾM'
  },
  {
    id: 'ma_kiem_3',
    name: 'Tịch Tà Kiếm Phổ',
    damageMultiplier: 3.25,
    effect: 'Quỷ phong siêu tốc: Gây 325% dồn lực thương, bạo kích tăng vọt 40% và xuyên 100% giáp',
    cooldown: 4,
    currentCooldown: 0,
    description: 'Đường kiếm nhanh phi thường, quỷ mị âm hiểm tột cùng khiến địch không thể trở tay cuồng loạn.',
    rarity: 'MYTHIC',
    type: 'ACTIVE',
    artCategory: 'KIẾM'
  },
  {
    id: 'ma_chuong_1',
    name: 'Thiết Sa Chưởng',
    damageMultiplier: 1.20,
    effect: 'Thô bạo kình lực đẩy lùi: Gây 120% sát thương chưởng kình',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Bách luyện hắc sa dồi dào kình lực cương dũng đập nát đá tảng vách tháp.',
    rarity: 'COMMON',
    type: 'ACTIVE',
    artCategory: 'CHƯỞNG'
  },
  {
    id: 'ma_chuong_3',
    name: 'Như Lai Thần Chưởng',
    damageMultiplier: 3.50,
    effect: 'Phật quang sinh linh: Gây 350% công lực cực thịnh, tự hồi 45% lượng HP tổn thất',
    cooldown: 5,
    currentCooldown: 0,
    description: 'Tuyệt học thần chưởng chí tôn, chưởng phong từ trên trời giáng xuống phục linh cứu mệnh.',
    rarity: 'MYTHIC',
    type: 'ACTIVE',
    artCategory: 'CHƯỞNG'
  },
  {
    id: 'ma_dao_1',
    name: 'Ngũ Hổ Đoạn Môn Đao',
    damageMultiplier: 1.25,
    effect: 'Mãnh hổ hám lâm: Gây 125% đao kình, bộc phát tăng nhẹ 10% công',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Đao kình cuồn cuộn mãnh liệt thích hợp trảm kích oanh liệt pháp phạm, vạn lực khai môn.',
    rarity: 'COMMON',
    type: 'ACTIVE',
    artCategory: 'ĐAO'
  },
  {
    id: 'ma_dao_2',
    name: 'Huyết Đao Cuồng Lâu',
    damageMultiplier: 1.55,
    effect: 'Hút máu luyện hồn: Gây 155% đao khí, hồi sinh mệnh bằng 15% lượng sát thương nạp',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Thần đao ma phái hung ác uống máu tiên sinh dâng tràn sinh cơ tu vi cho chủ nhân.',
    rarity: 'RARE',
    type: 'ACTIVE',
    artCategory: 'ĐAO'
  },
  {
    id: 'ma_dao_3',
    name: 'Ma Đao Thất Sát',
    damageMultiplier: 2.0,
    effect: 'Sát ý dâng cao: Gây 200% sát thương, tăng cường thêm 20% tỉ lệ nổ chí mạng',
    cooldown: 4,
    currentCooldown: 0,
    description: 'Cực điên ma đao cuồng bạo phóng thích sát khí ngút trời cô độc vạn phần chết chóc.',
    rarity: 'EPIC',
    type: 'ACTIVE',
    artCategory: 'ĐAO'
  },
  {
    id: 'ma_dao_4',
    name: 'Ngạo Hàn Lục Quyết',
    damageMultiplier: 2.45,
    effect: 'Hàn đao oanh thiền: Gây 245% sát lực, đóng băng làm yếu giáp phòng ngự kẻ địch đi 35%',
    cooldown: 4,
    currentCooldown: 0,
    description: 'Băng hàn đao kình ngập trời ngưng hóa cực phong sương tuyết lạn rạch rách đêm dài.',
    rarity: 'LEGENDARY',
    type: 'ACTIVE',
    artCategory: 'ĐAO'
  },
  {
    id: 'ma_bong_1',
    name: 'Đả Cẩu Bổng Pháp',
    damageMultiplier: 2.60,
    effect: 'Bổng ảnh phong thiên: Gây 260% sát lực nặng nề, làm choáng địch nhân 1 lượt',
    cooldown: 4,
    currentCooldown: 0,
    description: 'Tròn trịa biến ảo tuyệt luân phi thường, bổng ảnh chập chùng vây hãm thiên quân vạn mã sụp đổ.',
    rarity: 'LEGENDARY',
    type: 'ACTIVE',
    artCategory: 'BỔNG'
  },
  {
    id: 'ma_bong_2',
    name: 'Phục Ma Thập Tam Côn',
    damageMultiplier: 1.50,
    effect: 'Phục ma thủ hộ: Gây 150% côn pháp, giảm mạnh 20% sát thương nhận vào trong 2 hiệp',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Thiếu Lâm quẹt bổng chí thanh thanh tịnh tà ma trấn áp dã tính cường kình.',
    rarity: 'RARE',
    type: 'ACTIVE',
    artCategory: 'BỔNG'
  },
  {
    id: 'ma_bong_3',
    name: 'Yên Vũ Phiến Côn Pháo',
    damageMultiplier: 1.90,
    effect: 'Lạc hoa huyễn ảnh: Gây 190% sát thương, gây hiệu ứng mù giảm tầm đánh của kẻ thù',
    cooldown: 4,
    currentCooldown: 0,
    description: 'Kỳ môn vũ côn tinh tế kết hợp tiêu sái phong nhã ảo mộng của phiến côn vũ.',
    rarity: 'EPIC',
    type: 'ACTIVE',
    artCategory: 'BỔNG'
  },
  {
    id: 'ma_noi_1',
    name: 'Cửu Âm Chân Kinh',
    damageMultiplier: 1.0,
    effect: 'Kinh điển vĩ đại: +25% Sát thương tổng thể & +15 Vận may vĩnh cửu phúc phần (Thụ động)',
    cooldown: 0,
    currentCooldown: 0,
    description: 'Bảo điển bao la vạn tượng đệ nhất đạo gia võ học tôn quý bảo lưu chân mệnh.',
    rarity: 'LEGENDARY',
    type: 'PASSIVE',
    artCategory: 'NỘI CÔNG'
  },
  {
    id: 'ma_noi_2',
    name: 'Quỳ Hoa Bảo Điển',
    damageMultiplier: 1.0,
    effect: 'Cực bạo tốc tinh túy: +15% Tỷ lệ Chí mạng & +15% Sát thương bạo sinh bồi hoàng (Thụ động)',
    cooldown: 0,
    currentCooldown: 0,
    description: 'Bí tịch huyền bí tà đạo đày nản phách hồn, chiêu thức siêu tốc bạo bốc thần sầu kiếp lữ.',
    rarity: 'MYTHIC',
    type: 'PASSIVE',
    artCategory: 'NỘI CÔNG'
  },
  {
    id: 'ma_noi_3',
    name: 'Tiêu Dao Tiểu Vô Tướng Công',
    damageMultiplier: 1.0,
    effect: 'Sinh vô đoản hạn: Vận công tích lũy linh hoạt +15 Sát thương sau mỗi lượt đánh (Thụ động)',
    cooldown: 0,
    currentCooldown: 0,
    description: 'Mô phỏng muôn vàn võ học thế gian kỳ diệu, biến hóa sâu sắc không một dấu vết tích tụ.',
    rarity: 'EPIC',
    type: 'PASSIVE',
    artCategory: 'NỘI CÔNG'
  },
  {
    id: 'ma_noi_act_1',
    name: 'Bắc Minh Thần Công',
    damageMultiplier: 2.30,
    effect: 'Thôn kình luyện hóa: Gây 230% lượng chưởng lực thôn tính, hồi phục HP bằng 20% của dame',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Bắc Minh đại hải cuộn trào nạp giếng kình lực thâm uyển dung thâu vạn vật thiên địa.',
    rarity: 'LEGENDARY',
    type: 'ACTIVE',
    artCategory: 'NỘI CÔNG'
  },
  {
    id: 'ma_than_1',
    name: 'Lăng Ba Vi Bộ',
    damageMultiplier: 1.0,
    effect: 'Kích hoạt (60% + 5%/Sao): Di hình hoán ảnh triệt tiêu né tránh (25% * Cảnh giới + 3% * Cấp độ) sát thương oanh kích.',
    cooldown: 0,
    currentCooldown: 0,
    description: 'Khinh công di chuyển linh diệu phi thường phỏng theo bát quái đồ quỷ khóc thần sầu cực hạn.',
    rarity: 'LEGENDARY',
    type: 'PASSIVE',
    artCategory: 'THÂN PHÁP'
  },
  {
    id: 'ma_than_2',
    name: 'Vân Long Chiết Thân',
    damageMultiplier: 1.0,
    effect: 'Kích hoạt (60% + 5%/Sao): Né đòn cơ bản triệt tiêu né tránh (15% * Cảnh giới + 3% * Cấp độ) sát thương oanh kích.',
    cooldown: 0,
    currentCooldown: 0,
    description: 'Rồng lướt tầng mây nhẹ nhõm uốn lượn vượt phong vân phong vũ hộ thể.',
    rarity: 'RARE',
    type: 'PASSIVE',
    artCategory: 'THÂN PHÁP'
  },
  {
    id: 'ma_than_3',
    name: 'Thần Hành Bách Biến',
    damageMultiplier: 1.0,
    effect: 'Kích hoạt (60% + 5%/Sao): Nhạy bén bộ pháp triệt tiêu né tránh (20% * Cảnh giới + 3% * Cấp độ) sát thương oanh kích.',
    cooldown: 0,
    currentCooldown: 0,
    description: 'Bộ pháp điêu luyện nhấp nhổm thoắt ẩn thoắt hiện vô cùng trơn trượt nghịch ngợm chống địch quân.',
    rarity: 'EPIC',
    type: 'PASSIVE',
    artCategory: 'THÂN PHÁP'
  }
];

// Generator trang bị dựa vào phẩm chất và Luck
export function generateRandomItem(floor: number, playerLuck: number): Item {
  const rarities: { rarity: ItemRarity; chance: number }[] = [
    { rarity: 'COMMON', chance: 100 },
    { rarity: 'RARE', chance: 40 + playerLuck * 0.5 },
    { rarity: 'EPIC', chance: 15 + playerLuck * 0.3 },
    { rarity: 'LEGENDARY', chance: 4 + playerLuck * 0.15 },
    { rarity: 'MYTHIC', chance: 1 + playerLuck * 0.05 },
  ];

  // Tính phẩm chất ngẫu nhiên từ cao xuống thấp dựa trên Luck khí vận
  let selectedRarity: ItemRarity = 'COMMON';
  const roll = Math.random() * 100;
  
  // Xác định phẩm chất cao nhất mà chúng ta roll trúng
  if (roll <= rarities[4].chance) selectedRarity = 'MYTHIC';
  else if (roll <= rarities[3].chance) selectedRarity = 'LEGENDARY';
  else if (roll <= rarities[2].chance) selectedRarity = 'EPIC';
  else if (roll <= rarities[1].chance) selectedRarity = 'RARE';
  else selectedRarity = 'COMMON';

  const types: ItemType[] = ['WEAPON', 'ARMOR', 'TREASURE', 'BOOK'];
  const type = types[Math.floor(Math.random() * types.length)];

  // Tạo chỉ số bonus dựa vào floor & phẩm chất
  let scale = 1 + floor * 0.15;
  let rarityMultiplier = 1;
  switch (selectedRarity) {
    case 'COMMON': rarityMultiplier = 1; break;
    case 'RARE': rarityMultiplier = 1.6; break;
    case 'EPIC': rarityMultiplier = 2.4; break;
    case 'LEGENDARY': rarityMultiplier = 4.0; break;
    case 'MYTHIC': rarityMultiplier = 6.5; break;
  }

  const id = `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Lấy tên ngẫu nhiên phù hợp
  let weaponType: 'KIẾM' | 'ĐAO' | 'BỔNG' | 'CHƯỞNG' | undefined;
  let nameList = ITEM_NAMES[type] || ITEM_NAMES['WEAPON'];
  if (type === 'BOOK') {
    nameList = ['Tàn Trang Bí Quyển', 'Võ Lâm Mật Tịch', 'Thiên Thư Bản Thảo', 'Kỳ Môn Độn Giáp Đạo', 'Thần Điêu Kiếm Tinh'];
  }
  let baseName = nameList[Math.floor(Math.random() * nameList.length)];

  if (type === 'WEAPON') {
    const wTypes: ('KIẾM' | 'ĐAO' | 'BỔNG' | 'CHƯỞNG')[] = ['KIẾM', 'ĐAO', 'BỔNG', 'CHƯỞNG'];
    weaponType = wTypes[Math.floor(Math.random() * wTypes.length)];
    if (weaponType === 'KIẾM') {
      const swords = ['Thiết Kiếm', 'Ỷ Thiên Kiếm', 'Thanh Vân Kiếm', 'Thất Sát Kiếm', 'Huyền Thiết Trọng Kiếm', 'Thần Điêu Cổ Kiếm'];
      baseName = swords[Math.floor(Math.random() * swords.length)];
    } else if (weaponType === 'ĐAO') {
      const blades = ['Đồ Long Đao', 'Phác Đao Gia Truyền', 'U Minh Huyết Đao', 'Phá Thiên Kích Đao', 'Thần Phong Khảm Đao'];
      baseName = blades[Math.floor(Math.random() * blades.length)];
    } else if (weaponType === 'BỔNG') {
      const staffs = ['Phục Ma Côn', 'Ngọc Địch Côn', 'Đả Cẩu Bổng Thần Trúc', 'Yên Vũ Tiêu', 'Phá Giới Thiết Bổng'];
      baseName = staffs[Math.floor(Math.random() * staffs.length)];
    } else {
      const palms = ['Huyền Thiết Hộ Thủ', 'Kim Sí Chỉ Giáp', 'Càn Khôn Găng Tay', 'U Minh Trảo Sáo', 'Phật Quang Hộ Chưởng Chỉ'];
      baseName = palms[Math.floor(Math.random() * palms.length)];
    }
  }

  let name = `${baseName} (+${floor})`;

  let dmgBonus: number | undefined;
  let critBonus: number | undefined;
  let hpBonus: number | undefined;
  let luckBonus: number | undefined;
  let desc = '';

  if (type === 'WEAPON') {
    dmgBonus = Math.floor((12 + Math.random() * 10) * scale * rarityMultiplier);
    critBonus = Math.floor(3 + Math.random() * 5 + (rarityMultiplier * 1.5));
    desc = `[Binh khí: ${weaponType}] Thần binh tăng mạnh ${dmgBonus} Sát thương và ${critBonus}% Chí mạng.`;
  } else if (type === 'ARMOR') {
    hpBonus = Math.floor((80 + Math.random() * 50) * scale * rarityMultiplier);
    desc = `Hộ giáp phòng ngự kiên cố, gia cường thêm ${hpBonus} Máu tối đa.`;
  } else if (type === 'TREASURE') {
    luckBonus = Math.floor((5 + Math.random() * 5) * rarityMultiplier + (floor * 0.5));
    dmgBonus = Math.floor((5 + Math.random() * 5) * scale * rarityMultiplier);
    hpBonus = Math.floor((30 + Math.random() * 30) * scale * rarityMultiplier);
    desc = `Linh bảo tự nhiên tụ linh khí, tăng thêm ${luckBonus} May mắn, ${dmgBonus} Sát thương và ${hpBonus} Máu.`;
  } else {
    // Sổ võ học bí tịch cổ xưa
    critBonus = Math.floor(5 + Math.random() * 8 + (rarityMultiplier * 1.2));
    dmgBonus = Math.floor((6 + Math.random() * 6) * scale * rarityMultiplier);
    desc = `Thiên thư ghi chép khẩu quyết, tăng ${critBonus}% chí mạng bạo liệt và ${dmgBonus} công lực.`;
  }

  const flavorTexts = [
    'Lời đồn giang hồ ai có được vật này sẽ xưng bá tam giới.',
    'Từng là vũ khí chí tôn của một đại cao thủ quy ẩn lâm tuyền.',
    'Hào quang tinh chất thần diệu phát ra khiến tâm thần sảng khoái.',
    'Nhăng nhít vết tích đao kiếm của vô số trận tranh hùng vạn tải tiền triều.',
    'Ẩn chứa khí phách ngút ngàn, vạn năm bất biến.'
  ];
  const flavorText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];

  return {
    id,
    name,
    type,
    rarity: selectedRarity,
    dmgBonus,
    critBonus,
    hpBonus,
    luckBonus,
    description: desc,
    flavorText,
    level: floor,
    equipped: false,
    weaponType
  };
}

// Sinh quái vật dựa trên tầng tháp
export function generateWaveEnemies(floor: number): any {
  const isMiniBoss = floor % 5 === 0 && floor % 10 !== 0;
  const isMegaBoss = floor % 10 === 0;

  let typeName = 'REGULAR';
  if (isMiniBoss) typeName = 'MINI_BOSS';
  if (isMegaBoss) typeName = 'MEGA_BOSS';

  let hp = Math.floor(100 + (floor * 58) * (isMiniBoss ? 2.5 : isMegaBoss ? 5.5 : 1.0));
  let dmg = Math.floor(10 + (floor * 4.5) * (isMiniBoss ? 1.8 : isMegaBoss ? 3.0 : 1.0));
  let crit = Math.min(25, 5 + Math.floor(floor * 0.7));

  let name = '';
  let avatar = '';
  let skillName = undefined;
  let skillDesc = undefined;

  // Lấy bối cảnh huyền huyễn kỳ ảo võ đạo ma đầu
  if (isMegaBoss) {
    const bossList = [
      { name: 'Xích Viêm Ma Đế', av: '👹🔥', sN: 'Địa Ngục Viêm Triều', sD: 'Công quét kịch liệt, thiêu cháy 25% máu hiện tại.' },
      { name: 'Vô Cực Ma Tổ', av: '💀🌌', sN: 'Vô Cực Thôn Phệ', sD: 'Hút sinh lực từ tất cả địch nhân, tự hồi phục 30% máu.' },
      { name: 'U Minh Minh Vương', av: '🦇🔮', sN: 'Minh Diễn Bí Thuật', sD: 'Gây Sát thương cực đại, chặn đứng khả năng hồi máu.' },
      { name: 'Độc Cô Cầu Bại (Oán Niệm)', av: '🤺💨', sN: 'Manh Kiếm Thần Ảnh', sD: 'Bỏ qua toàn bộ phòng ngự kiếm ý chí tử kiếm trận.' }
    ];
    const boss = bossList[(floor / 10 - 1) % bossList.length];
    name = `Võ Thần Nghịch Thiên: ${boss.name}`;
    avatar = boss.av;
    skillName = boss.sN;
    skillDesc = boss.sD;
  } else if (isMiniBoss) {
    const miniBossList = [
      { name: 'Hạc Hắc Ám Hoàng', av: '🦅🖤', sN: 'Thép Kim Sí Kích', sD: 'Sát thương chí mạng siêu mạnh tốc độ phong vũ.' },
      { name: 'Yên Hoa Ma Nữ', av: '🧝‍♀️💜', sN: 'Huyễn Thuật Di Linh', sD: 'Gây độc rút máu liên tục gặm nhấm tâm can.' },
      { name: 'Phạt Thiền Cuồng Tăng', av: '🧟‍♂️📿', sN: 'Kim Cương Diệt Pháp', sD: 'Đập nát chiêu thức bọc giáp phòng thủ vô địch.' }
    ];
    const miniboss = miniBossList[Math.floor(Math.random() * miniBossList.length)];
    name = `Phó Điện Chủ: ${miniboss.name}`;
    avatar = miniboss.av;
    skillName = miniboss.sN;
    skillDesc = miniboss.sD;
  } else {
    const monsterNames = [
      'Cự Đãng Tiên Phong', 'Mao Cương Cổ Thây', 'Tuyết Hà Cự Lang', 'Đại Điện Thủ Vệ', 'Hắc Y Thích Khách',
      'Minh Phủ Cô Hồn', 'Quỷ Diện Dơi Ma', 'Huyết Ảnh Giáo Chúng', 'Độc Giáo Dược Nhân', 'Lôi Vân Thú'
    ];
    const monsterAvatars = ['🐺', '🧟', '🦅', '💂', '🐍', '💀', '👽', '🕷️', '👹', '🦖'];
    const idx = Math.floor(Math.random() * monsterNames.length);
    name = monsterNames[idx];
    avatar = monsterAvatars[idx % monsterAvatars.length];
  }

  // Tiền thưởng & tài khố tăng tiến
  const goldReward = Math.floor((15 + floor * 4.5) * (isMiniBoss ? 3 : isMegaBoss ? 7 : 1));
  const expReward = Math.floor((12 + floor * 3.8) * (isMiniBoss ? 3.5 : isMegaBoss ? 8 : 1));
  const stonesReward = isMegaBoss ? 3 : isMiniBoss ? 1 : (Math.random() < 0.15 ? 1 : 0);

  return {
    id: `enemy_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name,
    type: typeName,
    hp,
    maxHp: hp,
    dmg,
    crit,
    skillName,
    skillDesc,
    currentCd: 0,
    skillCd: isMegaBoss ? 3 : isMiniBoss ? 4 : undefined,
    avatar,
    rewards: {
      exp: expReward,
      gold: goldReward,
      stones: stonesReward,
      itemChance: isMegaBoss ? 100 : isMiniBoss ? 55 : 8 + (floor * 0.2)
    }
  };
}
