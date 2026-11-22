/**
 * Ý nghĩa bói (Divinatory Meanings) theo nguyên bản:
 * A. E. Waite, "The Pictorial Key to the Tarot" (London: William Rider & Son, 1910) — public domain.
 * Ảnh: bộ Rider–Waite–Smith gốc, minh hoạ Pamela Colman Smith (1909) — public domain, lưu trữ trên Wikimedia Commons.
 *
 * `en` giữ nguyên văn (có thể rút gọn phần mô tả hình) của Waite; `vi` là bản dịch sát nghĩa.
 * `rev: null` nghĩa là Waite không ghi nghĩa ngược cho lá đó.
 */

export type Suit = "major" | "wands" | "cups" | "swords" | "pentacles";

export type Meaning = { en: string; vi: string };

export type TarotCard = {
  id: string;
  name: string;
  nameVi: string;
  suit: Suit;
  /** Tên file trên Wikimedia Commons (không có đuôi .jpg) */
  file: string;
  up: Meaning;
  rev: Meaning | null;
};

export const SUIT_LABEL: Record<Suit, string> = {
  major: "Ẩn chính (Major Arcana)",
  wands: "Bộ Gậy (Wands)",
  cups: "Bộ Cốc (Cups)",
  swords: "Bộ Kiếm (Swords)",
  pentacles: "Bộ Tiền (Pentacles)",
};

export const SOURCE = {
  book: "A. E. Waite — The Pictorial Key to the Tarot (1910)",
  bookUrl: "https://sacred-texts.com/tarot/pkt/index.htm",
  art: "Pamela Colman Smith — Rider–Waite–Smith deck (1909)",
  artUrl:
    "https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)",
};

export function imageUrl(card: TarotCard, width = 480) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${card.file}.jpg?width=${width}`;
}

const m = (en: string, vi: string): Meaning => ({ en, vi });

const MAJOR: TarotCard[] = [
  {
    id: "m00",
    name: "The Fool",
    nameVi: "Kẻ Khờ",
    suit: "major",
    file: "RWS_Tarot_00_Fool",
    up: m(
      "Folly, mania, extravagance, intoxication, delirium, frenzy, bewrayment.",
      "Sự dại dột, cuồng nhiệt, phung phí, say sưa, mê sảng, điên cuồng, tự để lộ mình.",
    ),
    rev: m(
      "Negligence, absence, distribution, carelessness, apathy, nullity, vanity.",
      "Lơ là, vắng mặt, phân tán, cẩu thả, thờ ơ, vô nghĩa, hão huyền.",
    ),
  },
  {
    id: "m01",
    name: "The Magician",
    nameVi: "Nhà Ảo Thuật",
    suit: "major",
    file: "RWS_Tarot_01_Magician",
    up: m(
      "Skill, diplomacy, address, subtlety; sickness, pain, loss, disaster, snares of enemies; self-confidence, will; the Querent, if male.",
      "Kỹ năng, ngoại giao, khéo léo, tinh tế; (cũng có thể) bệnh tật, đau đớn, mất mát, tai hoạ, bẫy của kẻ thù; tự tin, ý chí; người hỏi, nếu là nam.",
    ),
    rev: m(
      "Physician, Magus, mental disease, disgrace, disquiet.",
      "Thầy thuốc, pháp sư, bệnh về tâm trí, ô nhục, bất an.",
    ),
  },
  {
    id: "m02",
    name: "The High Priestess",
    nameVi: "Nữ Tư Tế",
    suit: "major",
    file: "RWS_Tarot_02_High_Priestess",
    up: m(
      "Secrets, mystery, the future as yet unrevealed; silence, tenacity; mystery, wisdom, science.",
      "Bí mật, huyền bí, tương lai chưa hé lộ; im lặng, bền bỉ; huyền nhiệm, minh triết, tri thức.",
    ),
    rev: m(
      "Passion, moral or physical ardour, conceit, surface knowledge.",
      "Đam mê, nhiệt huyết về tinh thần hoặc thể xác, tự phụ, hiểu biết hời hợt.",
    ),
  },
  {
    id: "m03",
    name: "The Empress",
    nameVi: "Hoàng Hậu",
    suit: "major",
    file: "RWS_Tarot_03_Empress",
    up: m(
      "Fruitfulness, action, initiative, length of days; the unknown, clandestine; also difficulty, doubt, ignorance.",
      "Sự sung túc, hành động, chủ động, trường thọ; điều chưa biết, điều bí mật; cũng là khó khăn, hoài nghi, thiếu hiểu biết.",
    ),
    rev: m(
      "Light, truth, the unravelling of involved matters, public rejoicings; according to another reading, vacillation.",
      "Ánh sáng, sự thật, gỡ rối những việc phức tạp, niềm vui chung; theo cách đọc khác: dao động, thiếu quyết đoán.",
    ),
  },
  {
    id: "m04",
    name: "The Emperor",
    nameVi: "Hoàng Đế",
    suit: "major",
    file: "RWS_Tarot_04_Emperor",
    up: m(
      "Stability, power, protection, realization; a great person; aid, reason, conviction; also authority and will.",
      "Ổn định, quyền lực, che chở, hiện thực hoá; một nhân vật lớn; sự trợ giúp, lý trí, niềm tin vững; cũng là uy quyền và ý chí.",
    ),
    rev: m(
      "Benevolence, compassion, credit; also confusion to enemies, obstruction, immaturity.",
      "Nhân từ, trắc ẩn, tín nhiệm; cũng là làm kẻ thù rối loạn, cản trở, non nớt.",
    ),
  },
  {
    id: "m05",
    name: "The Hierophant",
    nameVi: "Giáo Hoàng",
    suit: "major",
    file: "RWS_Tarot_05_Hierophant",
    up: m(
      "Marriage, alliance, captivity, servitude; by another account, mercy and goodness; inspiration; the man to whom the Querent has recourse.",
      "Hôn nhân, liên minh, sự ràng buộc, phục tùng; theo cách khác: lòng nhân và điều tốt; cảm hứng; người mà người hỏi tìm đến nương tựa.",
    ),
    rev: m(
      "Society, good understanding, concord, overkindness, weakness.",
      "Xã hội, thấu hiểu nhau, hoà hợp, tốt bụng quá mức, yếu đuối.",
    ),
  },
  {
    id: "m06",
    name: "The Lovers",
    nameVi: "Người Yêu",
    suit: "major",
    file: "RWS_Tarot_06_Lovers",
    up: m(
      "Attraction, love, beauty, trials overcome.",
      "Sức hút, tình yêu, cái đẹp, thử thách đã vượt qua.",
    ),
    rev: m(
      "Failure, foolish designs. Another account speaks of marriage frustrated and contrarieties of all kinds.",
      "Thất bại, toan tính dại dột. Cách đọc khác nói về hôn nhân trắc trở và đủ loại trái ngược.",
    ),
  },
  {
    id: "m07",
    name: "The Chariot",
    nameVi: "Cỗ Xe",
    suit: "major",
    file: "RWS_Tarot_07_Chariot",
    up: m(
      "Succour, providence; also war, triumph, presumption, vengeance, trouble.",
      "Sự cứu giúp, ơn trên; cũng là chiến tranh, chiến thắng, tự phụ, báo thù, rắc rối.",
    ),
    rev: m(
      "Riot, quarrel, dispute, litigation, defeat.",
      "Náo loạn, cãi vã, tranh chấp, kiện tụng, thất bại.",
    ),
  },
  {
    id: "m08",
    name: "Strength",
    nameVi: "Sức Mạnh",
    suit: "major",
    file: "RWS_Tarot_08_Strength",
    up: m(
      "Power, energy, action, courage, magnanimity; also complete success and honours.",
      "Sức mạnh, năng lượng, hành động, can đảm, độ lượng; cũng là thành công trọn vẹn và vinh dự.",
    ),
    rev: m(
      "Despotism, abuse of power, weakness, discord, sometimes even disgrace.",
      "Chuyên chế, lạm quyền, yếu đuối, bất hoà, đôi khi cả ô nhục.",
    ),
  },
  {
    id: "m09",
    name: "The Hermit",
    nameVi: "Ẩn Sĩ",
    suit: "major",
    file: "RWS_Tarot_09_Hermit",
    up: m(
      "Prudence, circumspection; also and especially treason, dissimulation, roguery, corruption.",
      "Thận trọng, dè dặt; cũng như (và đặc biệt là) phản trắc, che giấu, gian xảo, hư hỏng.",
    ),
    rev: m(
      "Concealment, disguise, policy, fear, unreasoned caution.",
      "Che đậy, nguỵ trang, mưu tính, sợ hãi, thận trọng vô lý.",
    ),
  },
  {
    id: "m10",
    name: "Wheel of Fortune",
    nameVi: "Vòng Quay Định Mệnh",
    suit: "major",
    file: "RWS_Tarot_10_Wheel_of_Fortune",
    up: m(
      "Destiny, fortune, success, elevation, luck, felicity.",
      "Định mệnh, vận may, thành công, thăng tiến, may mắn, hạnh phúc.",
    ),
    rev: m("Increase, abundance, superfluity.", "Gia tăng, dồi dào, dư thừa."),
  },
  {
    id: "m11",
    name: "Justice",
    nameVi: "Công Lý",
    suit: "major",
    file: "RWS_Tarot_11_Justice",
    up: m(
      "Equity, rightness, probity, executive; triumph of the deserving side in law.",
      "Công bằng, lẽ phải, chính trực, quyền thi hành; bên xứng đáng thắng về mặt pháp lý.",
    ),
    rev: m(
      "Law in all its departments, legal complications, bigotry, bias, excessive severity.",
      "Luật pháp ở mọi phương diện, rắc rối pháp lý, cố chấp, thiên vị, quá khắt khe.",
    ),
  },
  {
    id: "m12",
    name: "The Hanged Man",
    nameVi: "Người Treo Ngược",
    suit: "major",
    file: "RWS_Tarot_12_Hanged_Man",
    up: m(
      "Wisdom, circumspection, discernment, trials, sacrifice, intuition, divination, prophecy.",
      "Minh triết, thận trọng, sáng suốt, thử thách, hy sinh, trực giác, bói toán, tiên tri.",
    ),
    rev: m(
      "Selfishness, the crowd, body politic.",
      "Ích kỷ, đám đông, bộ máy xã hội.",
    ),
  },
  {
    id: "m13",
    name: "Death",
    nameVi: "Cái Chết",
    suit: "major",
    file: "RWS_Tarot_13_Death",
    up: m(
      "End, mortality, destruction, corruption; also, for a man, the loss of a benefactor; for a woman, many contrarieties; for a maid, failure of marriage projects.",
      "Kết thúc, sự hữu hạn, đổ vỡ, mục ruỗng; với nam giới: mất đi người nâng đỡ; với nữ giới: nhiều trái ngược; với thiếu nữ: dự định hôn nhân không thành.",
    ),
    rev: m(
      "Inertia, sleep, lethargy, petrifaction, somnambulism; hope destroyed.",
      "Trì trệ, ngủ vùi, uể oải, hoá đá, mộng du; hy vọng tan vỡ.",
    ),
  },
  {
    id: "m14",
    name: "Temperance",
    nameVi: "Tiết Độ",
    suit: "major",
    file: "RWS_Tarot_14_Temperance",
    up: m(
      "Economy, moderation, frugality, management, accommodation.",
      "Tiết kiệm, điều độ, giản dị, quản lý khéo, biết dung hoà.",
    ),
    rev: m(
      "Things connected with churches, religions, sects, the priesthood; disunion, unfortunate combinations, competing interests.",
      "Những điều liên quan đến giáo hội, tôn giáo, giáo phái, giới tu sĩ; chia rẽ, kết hợp không may, lợi ích xung đột.",
    ),
  },
  {
    id: "m15",
    name: "The Devil",
    nameVi: "Ác Quỷ",
    suit: "major",
    file: "RWS_Tarot_15_Devil",
    up: m(
      "Ravage, violence, vehemence, extraordinary efforts, force, fatality; that which is predestined but is not for this reason evil.",
      "Tàn phá, bạo lực, mãnh liệt, nỗ lực phi thường, sức ép, định số; điều đã được định sẵn nhưng không vì thế mà là xấu.",
    ),
    rev: m(
      "Evil fatality, weakness, pettiness, blindness.",
      "Định mệnh xấu, yếu đuối, nhỏ nhen, mù quáng.",
    ),
  },
  {
    id: "m16",
    name: "The Tower",
    nameVi: "Toà Tháp",
    suit: "major",
    file: "RWS_Tarot_16_Tower",
    up: m(
      "Misery, distress, indigence, adversity, calamity, disgrace, deception, ruin. It is a card in particular of unforeseen catastrophe.",
      "Khốn khổ, phiền muộn, túng thiếu, nghịch cảnh, tai ương, ô nhục, lừa dối, sụp đổ. Đặc biệt là lá của biến cố bất ngờ.",
    ),
    rev: m(
      "According to one account, the same in a lesser degree; also oppression, imprisonment, tyranny.",
      "Theo một cách đọc: như chiều xuôi nhưng nhẹ hơn; cũng là áp bức, giam cầm, chuyên chế.",
    ),
  },
  {
    id: "m17",
    name: "The Star",
    nameVi: "Ngôi Sao",
    suit: "major",
    file: "RWS_Tarot_17_Star",
    up: m(
      "Loss, theft, privation, abandonment; another reading says—hope and bright prospects.",
      "Mất mát, trộm cắp, thiếu thốn, bị bỏ rơi; cách đọc khác: hy vọng và triển vọng tươi sáng.",
    ),
    rev: m(
      "Arrogance, haughtiness, impotence.",
      "Kiêu ngạo, ngạo mạn, bất lực.",
    ),
  },
  {
    id: "m18",
    name: "The Moon",
    nameVi: "Mặt Trăng",
    suit: "major",
    file: "RWS_Tarot_18_Moon",
    up: m(
      "Hidden enemies, danger, calumny, darkness, terror, deception, occult forces, error.",
      "Kẻ thù giấu mặt, nguy hiểm, vu khống, bóng tối, sợ hãi, lừa dối, thế lực huyền bí, sai lầm.",
    ),
    rev: m(
      "Instability, inconstancy, silence, lesser degrees of deception and error.",
      "Bất ổn, thất thường, im lặng, lừa dối và sai lầm ở mức nhẹ hơn.",
    ),
  },
  {
    id: "m19",
    name: "The Sun",
    nameVi: "Mặt Trời",
    suit: "major",
    file: "RWS_Tarot_19_Sun",
    up: m(
      "Material happiness, fortunate marriage, contentment.",
      "Hạnh phúc vật chất, hôn nhân may mắn, mãn nguyện.",
    ),
    rev: m(
      "The same in a lesser sense.",
      "Như chiều xuôi nhưng ở mức nhẹ hơn.",
    ),
  },
  {
    id: "m20",
    name: "Judgement",
    nameVi: "Phán Xét",
    suit: "major",
    file: "RWS_Tarot_20_Judgement",
    up: m(
      "Change of position, renewal, outcome. Another account specifies total loss through lawsuit.",
      "Thay đổi vị thế, đổi mới, kết cục. Cách đọc khác: mất trắng vì kiện tụng.",
    ),
    rev: m(
      "Weakness, pusillanimity, simplicity; also deliberation, decision, sentence.",
      "Yếu đuối, nhút nhát, ngây thơ; cũng là cân nhắc, quyết định, phán quyết.",
    ),
  },
  {
    id: "m21",
    name: "The World",
    nameVi: "Thế Giới",
    suit: "major",
    file: "RWS_Tarot_21_World",
    up: m(
      "Assured success, recompense, voyage, route, emigration, flight, change of place.",
      "Thành công chắc chắn, phần thưởng, chuyến đi, con đường, di cư, ra đi, thay đổi nơi chốn.",
    ),
    rev: m(
      "Inertia, fixity, stagnation, permanence.",
      "Trì trệ, đứng yên, ứ đọng, bất biến.",
    ),
  },
];

type MinorEntry = [Meaning, Meaning | null];

const RANKS: [string, string][] = [
  ["Ace", "Át"],
  ["Two", "Hai"],
  ["Three", "Ba"],
  ["Four", "Bốn"],
  ["Five", "Năm"],
  ["Six", "Sáu"],
  ["Seven", "Bảy"],
  ["Eight", "Tám"],
  ["Nine", "Chín"],
  ["Ten", "Mười"],
  ["Page", "Tiểu Đồng"],
  ["Knight", "Hiệp Sĩ"],
  ["Queen", "Nữ Hoàng"],
  ["King", "Vua"],
];

const WANDS: MinorEntry[] = [
  [
    m(
      "Creation, invention, enterprise, the powers which result in these; principle, beginning, source; birth, family, origin; money, fortune, inheritance.",
      "Sáng tạo, phát minh, khởi nghiệp, những sức mạnh sinh ra chúng; nguyên lý, khởi đầu, cội nguồn; sự ra đời, gia đình, nguồn gốc; tiền bạc, tài lộc, thừa kế.",
    ),
    m(
      "Fall, decadence, ruin, perdition, to perish; also a certain clouded joy.",
      "Sa sút, suy đồi, đổ nát, diệt vong; cũng là một niềm vui bị che mờ.",
    ),
  ],
  [
    m(
      "Riches, fortune, magnificence; physical suffering, disease, chagrin, sadness, mortification.",
      "Giàu có, tài lộc, huy hoàng; (đồng thời) đau đớn thể xác, bệnh tật, phiền muộn, buồn bã, tủi nhục.",
    ),
    m(
      "Surprise, wonder, enchantment, emotion, trouble, fear.",
      "Bất ngờ, kinh ngạc, say mê, xúc động, rối ren, sợ hãi.",
    ),
  ],
  [
    m(
      "Strength, enterprise, effort, trade, commerce, discovery; able co-operation in business.",
      "Sức mạnh, dám làm, nỗ lực, buôn bán, thương mại, khám phá; hợp tác làm ăn hiệu quả.",
    ),
    m(
      "The end of troubles, suspension or cessation of adversity, toil and disappointment.",
      "Rắc rối kết thúc, nghịch cảnh, vất vả và thất vọng tạm ngừng hoặc chấm dứt.",
    ),
  ],
  [
    m(
      "Country life, haven of refuge, a species of domestic harvest-home, repose, concord, harmony, prosperity, peace, and the perfected work of these.",
      "Đời sống thôn dã, chốn nương náu, như mùa gặt sum vầy trong nhà; nghỉ ngơi, hoà thuận, hài hoà, thịnh vượng, bình yên và thành quả trọn vẹn của chúng.",
    ),
    m(
      "The meaning remains unaltered; it is prosperity, increase, felicity, beauty, embellishment.",
      "Ý nghĩa không đổi: thịnh vượng, gia tăng, hạnh phúc, vẻ đẹp, sự tô điểm.",
    ),
  ],
  [
    m(
      "Imitation, as, for example, sham fight, but also the strenuous competition and struggle of the search after riches and fortune; the battle of life. Hence some attributions say that it is a card of gold, gain, opulence.",
      "Sự mô phỏng như một trận đánh giả, nhưng cũng là cạnh tranh, vật lộn gay gắt để tìm kiếm của cải; cuộc chiến mưu sinh. Vì vậy có cách đọc coi đây là lá của vàng bạc, lợi lộc, sung túc.",
    ),
    m(
      "Litigation, disputes, trickery, contradiction.",
      "Kiện tụng, tranh chấp, mánh khoé, mâu thuẫn.",
    ),
  ],
  [
    m(
      "A victor triumphing; great news; expectation crowned with its own desire, the crown of hope.",
      "Người chiến thắng khải hoàn; tin vui lớn; điều mong đợi được toại nguyện, vòng nguyệt quế của hy vọng.",
    ),
    m(
      "Apprehension, fear, as of a victorious enemy at the gate; treachery, disloyalty; indefinite delay.",
      "Lo âu, sợ hãi như kẻ thù đã thắng đang đứng trước cổng; phản bội, bất trung; trì hoãn vô thời hạn.",
    ),
  ],
  [
    m(
      "Valour; discussion, wordy strife; in business—negotiations, war of trade, barter, competition. It is further a card of success.",
      "Dũng cảm; tranh luận, khẩu chiến; trong làm ăn: thương lượng, chiến tranh thương mại, trao đổi, cạnh tranh. Đây còn là lá của thành công.",
    ),
    m(
      "Perplexity, embarrassments, anxiety. Also a caution against indecision.",
      "Bối rối, lúng túng, lo âu. Cũng là lời cảnh báo về sự thiếu quyết đoán.",
    ),
  ],
  [
    m(
      "Activity in undertakings, swiftness, as that of an express messenger; great haste, great hope, speed towards an end which promises assured felicity; that which is on the move; also the arrows of love.",
      "Hoạt động sôi nổi, nhanh như sứ giả hoả tốc; vội vã lớn, hy vọng lớn, lao nhanh đến kết cục hứa hẹn hạnh phúc; mọi thứ đang chuyển động; cũng là mũi tên của tình yêu.",
    ),
    m(
      "Arrows of jealousy, internal dispute, stingings of conscience, quarrels; and domestic disputes for persons who are married.",
      "Mũi tên ghen tuông, tranh chấp nội bộ, cắn rứt lương tâm, cãi vã; với người đã kết hôn là bất hoà trong nhà.",
    ),
  ],
  [
    m(
      "Strength in opposition. If attacked, the person will meet an onslaught boldly; delay, suspension, adjournment.",
      "Sức mạnh khi bị đối đầu. Nếu bị tấn công, người này sẽ dũng cảm đương đầu; trì hoãn, tạm dừng, dời lại.",
    ),
    m("Obstacles, adversity, calamity.", "Chướng ngại, nghịch cảnh, tai hoạ."),
  ],
  [
    m(
      "Oppression simply, but also fortune, gain, any kind of success, and then it is the oppression of these things. It is also a card of false-seeming, disguise, perfidy.",
      "Đơn giản là sự đè nặng, nhưng cũng là tài lộc, lợi lộc, thành công — và khi ấy là gánh nặng của chính những điều đó. Đây cũng là lá của vẻ ngoài giả dối, nguỵ trang, phản trắc.",
    ),
    m(
      "Contrarieties, difficulties, intrigues, and their analogies.",
      "Trái ngược, khó khăn, âm mưu và những điều tương tự.",
    ),
  ],
  [
    m(
      "Dark young man, faithful, a lover, an envoy, a postman. Has the chief qualities of his suit. He may signify family intelligence.",
      "Chàng trai trẻ tóc sẫm, trung thành, một người tình, một sứ giả, người đưa thư. Mang phẩm chất chính của bộ Gậy. Có thể là tin tức gia đình.",
    ),
    m(
      "Anecdotes, announcements, evil news. Also indecision and the instability which accompanies it.",
      "Chuyện kể, thông báo, tin xấu. Cũng là thiếu quyết đoán và sự bất ổn đi kèm.",
    ),
  ],
  [
    m(
      "Departure, absence, flight, emigration. A dark young man, friendly. Change of residence.",
      "Ra đi, vắng mặt, rời bỏ, di cư. Một chàng trai tóc sẫm thân thiện. Thay đổi chỗ ở.",
    ),
    m(
      "Rupture, division, interruption, discord.",
      "Đổ vỡ, chia rẽ, gián đoạn, bất hoà.",
    ),
  ],
  [
    m(
      "A dark woman, countrywoman, friendly, chaste, loving, honourable. Also, love of money, or a certain success in business.",
      "Người phụ nữ tóc sẫm, chân chất, thân thiện, đoan chính, giàu tình cảm, đáng kính. Cũng là yêu tiền bạc, hoặc một thành công nhất định trong làm ăn.",
    ),
    m(
      "Good, economical, obliging, serviceable. Signifies also—in certain positions—opposition, jealousy, even deceit and infidelity.",
      "Tốt bụng, tiết kiệm, sẵn lòng giúp đỡ, tận tuỵ. Ở một số vị trí còn mang nghĩa chống đối, ghen tuông, thậm chí lừa dối và không chung thuỷ.",
    ),
  ],
  [
    m(
      "Dark man, friendly, countryman, generally married, honest and conscientious. The card always signifies honesty, and may mean news concerning an unexpected heritage.",
      "Người đàn ông tóc sẫm, thân thiện, chân chất, thường đã có gia đình, trung thực và tận tâm. Lá này luôn mang nghĩa trung thực, và có thể báo tin về một món thừa kế bất ngờ.",
    ),
    m(
      "Good, but severe; austere, yet tolerant.",
      "Tốt, nhưng nghiêm khắc; khắt khe mà vẫn bao dung.",
    ),
  ],
];

const CUPS: MinorEntry[] = [
  [
    m(
      "House of the true heart, joy, content, abode, nourishment, abundance, fertility; Holy Table, felicity hereof.",
      "Ngôi nhà của trái tim chân thật, niềm vui, mãn nguyện, chốn ở, nuôi dưỡng, dồi dào, sinh sôi; Bàn Thánh và phúc lành từ đó.",
    ),
    m(
      "House of the false heart, mutation, instability, revolution.",
      "Ngôi nhà của trái tim giả dối, biến đổi, bất ổn, đảo lộn.",
    ),
  ],
  [
    m(
      "Love, passion, friendship, affinity, union, concord, sympathy, the interrelation of the sexes.",
      "Tình yêu, đam mê, tình bạn, sự đồng điệu, kết đôi, hoà hợp, đồng cảm, mối gắn kết nam nữ.",
    ),
    null,
  ],
  [
    m(
      "The conclusion of any matter in plenty, perfection and merriment; happy issue, victory, fulfilment, solace, healing.",
      "Mọi việc kết thúc trong dư dả, trọn vẹn và vui vẻ; kết cục tốt đẹp, chiến thắng, viên mãn, an ủi, chữa lành.",
    ),
    m(
      "Expedition, dispatch, achievement, end. It signifies also the side of excess in physical enjoyment, and the pleasures of the senses.",
      "Nhanh chóng, xong việc, thành tựu, kết thúc. Cũng chỉ mặt thái quá của hưởng thụ thể xác và khoái lạc giác quan.",
    ),
  ],
  [
    m(
      "Weariness, disgust, aversion, imaginary vexations, as if the wine of this world had caused satiety only; another wine, as if a fairy gift, is now offered, but he sees no consolation therein. This is also a card of blended pleasure.",
      "Chán chường, ngán ngẩm, ác cảm, phiền muộn tưởng tượng — như rượu đời chỉ mang lại sự ngấy; một chén khác như quà tiên đang được trao, nhưng người ấy không thấy an ủi gì. Đây cũng là lá của niềm vui lẫn lộn.",
    ),
    m(
      "Novelty, presage, new instruction, new relations.",
      "Điều mới mẻ, điềm báo, bài học mới, mối quan hệ mới.",
    ),
  ],
  [
    m(
      "It is a card of loss, but something remains over; three have been taken, but two are left; inheritance, patrimony, transmission, but not corresponding to expectations; marriage, but not without bitterness or frustration.",
      "Lá của mất mát nhưng vẫn còn lại một phần: ba chén đã đổ, hai chén vẫn còn; thừa kế, gia sản, truyền lại — nhưng không như kỳ vọng; hôn nhân nhưng không thiếu cay đắng hay thất vọng.",
    ),
    m(
      "News, alliances, affinity, consanguinity, ancestry, return, false projects.",
      "Tin tức, liên minh, đồng điệu, huyết thống, tổ tiên, sự trở về, dự định sai lầm.",
    ),
  ],
  [
    m(
      "A card of the past and of memories, looking back, as—for example—on childhood; happiness, enjoyment, but coming rather from the past; things that have vanished. Another reading reverses this, giving new relations, new knowledge, new environment.",
      "Lá của quá khứ và ký ức, nhìn lại — chẳng hạn tuổi thơ; hạnh phúc, niềm vui nhưng đến từ quá khứ; những điều đã mất. Cách đọc khác thì ngược lại: mối quan hệ mới, hiểu biết mới, môi trường mới.",
    ),
    m(
      "The future, renewal, that which will come to pass presently.",
      "Tương lai, sự đổi mới, điều sắp xảy ra.",
    ),
  ],
  [
    m(
      "Fairy favours, images of reflection, sentiment, imagination, things seen in the glass of contemplation; some attainment in these degrees, but nothing permanent or substantial is suggested.",
      "Ân huệ của tiên, hình ảnh phản chiếu, cảm xúc, tưởng tượng, những gì thấy được trong gương chiêm nghiệm; có đạt được chút gì đó, nhưng không có gì bền vững hay thực chất.",
    ),
    m(
      "Desire, will, determination, project.",
      "Khát khao, ý chí, quyết tâm, dự định.",
    ),
  ],
  [
    m(
      "The decline of a matter, or that a matter which has been thought to be important is really of slight consequence—either for good or evil.",
      "Một việc đang suy tàn, hoặc việc tưởng quan trọng thực ra chẳng mấy hệ trọng — dù tốt hay xấu.",
    ),
    m("Great joy, happiness, feasting.", "Niềm vui lớn, hạnh phúc, yến tiệc."),
  ],
  [
    m(
      "Concord, contentment, physical bien-être; also victory, success, advantage; satisfaction for the Querent.",
      "Hoà hợp, mãn nguyện, khoẻ khoắn về thể chất; cũng là chiến thắng, thành công, lợi thế; người hỏi được toại ý.",
    ),
    m(
      "Truth, loyalty, liberty; but the readings vary and include mistakes, imperfections, etc.",
      "Sự thật, trung thành, tự do; nhưng các cách đọc khác nhau, gồm cả sai lầm, khiếm khuyết…",
    ),
  ],
  [
    m(
      "Contentment, repose of the entire heart; the perfection of that state; also perfection of human love and friendship; the town, village or country inhabited by the Querent.",
      "Mãn nguyện, trái tim hoàn toàn bình yên; trạng thái ấy ở mức trọn vẹn; cũng là sự hoàn hảo của tình yêu và tình bạn; thị trấn, làng quê hay đất nước nơi người hỏi sống.",
    ),
    m(
      "Repose of the false heart, indignation, violence.",
      "Sự yên ổn của trái tim giả dối, phẫn nộ, bạo lực.",
    ),
  ],
  [
    m(
      "Fair young man, one impelled to render service and with whom the Querent will be connected; a studious youth; news, message; application, reflection, meditation; also these things directed to business.",
      "Chàng trai tóc sáng, sẵn lòng giúp đỡ và sẽ có liên hệ với người hỏi; người trẻ chăm học; tin tức, lời nhắn; chuyên cần, suy ngẫm, chiêm nghiệm; cũng là những điều ấy hướng vào công việc.",
    ),
    m(
      "Taste, inclination, attachment, seduction, deception, artifice.",
      "Sở thích, khuynh hướng, quyến luyến, quyến rũ, lừa dối, mưu mẹo.",
    ),
  ],
  [
    m(
      "Arrival, approach—sometimes that of a messenger; advances, proposition, demeanour, invitation, incitement.",
      "Sự đến, tiếp cận — đôi khi là của một sứ giả; lời ngỏ, đề nghị, phong thái, lời mời, sự thôi thúc.",
    ),
    m(
      "Trickery, artifice, subtlety, swindling, duplicity, fraud.",
      "Mánh khoé, mưu mẹo, xảo quyệt, lừa đảo, hai mặt, gian lận.",
    ),
  ],
  [
    m(
      "Good, fair woman; honest, devoted woman, who will do service to the Querent; loving intelligence, and hence the gift of vision; success, happiness, pleasure; also wisdom, virtue; a perfect spouse and a good mother.",
      "Người phụ nữ tốt, tóc sáng; trung thực, tận tuỵ, sẽ giúp đỡ người hỏi; trí tuệ giàu yêu thương nên có khả năng thấu thị; thành công, hạnh phúc, niềm vui; cũng là minh triết, đức hạnh; người bạn đời trọn vẹn và người mẹ tốt.",
    ),
    m(
      "The accounts vary; good woman; otherwise, distinguished woman but one not to be trusted; perverse woman; vice, dishonour, depravity.",
      "Các cách đọc khác nhau: người phụ nữ tốt; hoặc người phụ nữ nổi bật nhưng không đáng tin; người phụ nữ ngang trái; thói xấu, ô danh, sa đoạ.",
    ),
  ],
  [
    m(
      "Fair man, man of business, law, or divinity; responsible, disposed to oblige the Querent; also equity, art and science; creative intelligence.",
      "Người đàn ông tóc sáng, làm kinh doanh, luật hoặc thần học; có trách nhiệm, sẵn lòng giúp người hỏi; cũng là công bằng, nghệ thuật và khoa học; trí tuệ sáng tạo.",
    ),
    m(
      "Dishonest, double-dealing man; roguery, exaction, injustice, vice, scandal, pillage, considerable loss.",
      "Người đàn ông bất lương, hai mặt; gian xảo, bóc lột, bất công, thói xấu, bê bối, cướp đoạt, tổn thất lớn.",
    ),
  ],
];

const SWORDS: MinorEntry[] = [
  [
    m(
      "Triumph, the excessive degree in everything, conquest, triumph of force. It is a card of great force, in love as well as in hatred.",
      "Chiến thắng, mức độ tột cùng ở mọi thứ, chinh phục, thắng lợi của sức mạnh. Đây là lá của sức mạnh lớn, trong yêu cũng như trong ghét.",
    ),
    m(
      "The same, but the results are disastrous.",
      "Như chiều xuôi, nhưng kết quả là tai hại.",
    ),
  ],
  [
    m(
      "Conformity and the equipoise which it suggests, courage, friendship, concord in a state of arms; tenderness, affection, intimacy.",
      "Sự tương hợp và thế cân bằng nó gợi ra, can đảm, tình bạn, hoà hợp trong thế giằng co; dịu dàng, trìu mến, thân mật.",
    ),
    m(
      "Imposture, falsehood, duplicity, disloyalty.",
      "Mạo danh, giả dối, hai mặt, bất trung.",
    ),
  ],
  [
    m(
      "Removal, absence, delay, division, rupture, dispersion, and all that the design signifies naturally.",
      "Rời xa, vắng mặt, trì hoãn, chia cắt, đổ vỡ, ly tán, và tất cả những gì hình vẽ (trái tim bị ba kiếm xuyên) tự nhiên gợi ra.",
    ),
    m(
      "Mental alienation, error, loss, distraction, disorder, confusion.",
      "Tâm trí lạc lối, sai lầm, mất mát, xao lãng, hỗn loạn, rối ren.",
    ),
  ],
  [
    m(
      "Vigilance, retreat, solitude, hermit's repose, exile, tomb and coffin.",
      "Cảnh giác, rút lui, cô tịch, sự nghỉ ngơi của ẩn sĩ, lưu đày, mộ phần và quan tài.",
    ),
    m(
      "Wise administration, circumspection, economy, avarice, precaution, testament.",
      "Quản lý khôn ngoan, thận trọng, tiết kiệm, keo kiệt, đề phòng, di chúc.",
    ),
  ],
  [
    m(
      "Degradation, destruction, revocation, infamy, dishonour, loss, with the variants and analogues of these.",
      "Sa sút, huỷ hoại, thu hồi, tiếng xấu, ô nhục, mất mát, cùng các biến thể tương tự.",
    ),
    m(
      "The same; burial and obsequies.",
      "Như chiều xuôi; chôn cất và tang lễ.",
    ),
  ],
  [
    m(
      "Journey by water, route, way, envoy, commissionary, expedient.",
      "Hành trình đường thuỷ, lộ trình, con đường, sứ giả, người được uỷ thác, cách giải quyết tạm.",
    ),
    m(
      "Declaration, confession, publicity; one account says that it is a proposal of love.",
      "Tuyên bố, thú nhận, công khai; một cách đọc nói đây là lời tỏ tình.",
    ),
  ],
  [
    m(
      "Design, attempt, wish, hope, confidence; also quarrelling, a plan that may fail, annoyance.",
      "Ý đồ, thử sức, mong muốn, hy vọng, tự tin; cũng là cãi vã, kế hoạch có thể thất bại, phiền toái.",
    ),
    m(
      "Good advice, counsel, instruction, slander, babbling.",
      "Lời khuyên tốt, tư vấn, chỉ dẫn, nói xấu, ba hoa.",
    ),
  ],
  [
    m(
      "Bad news, violent chagrin, crisis, censure, power in trammels, conflict, calumny; also sickness.",
      "Tin xấu, phiền muộn dữ dội, khủng hoảng, chỉ trích, quyền lực bị trói buộc, xung đột, vu khống; cũng là bệnh tật.",
    ),
    m(
      "Disquiet, difficulty, opposition, accident, treachery; what is unforeseen; fatality.",
      "Bất an, khó khăn, chống đối, tai nạn, phản bội; điều không lường trước; định số.",
    ),
  ],
  [
    m(
      "Death, failure, miscarriage, delay, deception, disappointment, despair.",
      "Cái chết, thất bại, hỏng việc, trì hoãn, lừa dối, thất vọng, tuyệt vọng.",
    ),
    m(
      "Imprisonment, suspicion, doubt, reasonable fear, shame.",
      "Giam cầm, nghi ngờ, hoài nghi, nỗi sợ có cơ sở, hổ thẹn.",
    ),
  ],
  [
    m(
      "Whatsoever is intimated by the design; also pain, affliction, tears, sadness, desolation. It is not especially a card of violent death.",
      "Bất cứ điều gì hình vẽ gợi ra; cũng là đau đớn, khổ sở, nước mắt, buồn bã, hoang tàn. Đây không hẳn là lá của cái chết bạo lực.",
    ),
    m(
      "Advantage, profit, success, favour, but none of these are permanent; also power and authority.",
      "Lợi thế, lợi nhuận, thành công, ân huệ — nhưng không điều nào bền lâu; cũng là quyền lực và uy thế.",
    ),
  ],
  [
    m(
      "Authority, overseeing, secret service, vigilance, spying, examination, and the qualities thereto belonging.",
      "Uy quyền, giám sát, công việc bí mật, cảnh giác, dò xét, kiểm tra, và những phẩm chất đi kèm.",
    ),
    m(
      "More evil side of these qualities; what is unforeseen, unprepared state; sickness is also intimated.",
      "Mặt xấu hơn của các phẩm chất ấy; điều không lường trước, tình trạng không chuẩn bị; cũng ám chỉ bệnh tật.",
    ),
  ],
  [
    m(
      "Skill, bravery, capacity, defence, address, enmity, wrath, war, destruction, opposition, resistance, ruin; sometimes death.",
      "Kỹ năng, dũng cảm, năng lực, phòng vệ, khéo léo, thù địch, giận dữ, chiến tranh, huỷ diệt, đối đầu, kháng cự, đổ nát; đôi khi là cái chết.",
    ),
    m(
      "Imprudence, incapacity, extravagance.",
      "Khinh suất, bất tài, phung phí.",
    ),
  ],
  [
    m(
      "Widowhood, female sadness and embarrassment, absence, sterility, mourning, privation, separation.",
      "Goá bụa, nỗi buồn và sự bối rối của người phụ nữ, vắng mặt, hiếm muộn, tang chế, thiếu thốn, chia ly.",
    ),
    m(
      "Malice, bigotry, artifice, prudery, bale, deceit.",
      "Ác ý, cố chấp, mưu mẹo, làm ra vẻ đoan trang, tai hoạ, lừa dối.",
    ),
  ],
  [
    m(
      "Whatsoever arises out of the idea of judgment and all its connexions—power, command, authority, militant intelligence, law, offices of the crown, and so forth.",
      "Mọi điều xuất phát từ ý niệm phán xét và những gì liên quan — quyền lực, chỉ huy, uy quyền, trí tuệ sắc bén, luật pháp, chức vụ nhà nước…",
    ),
    m(
      "Cruelty, perversity, barbarity, perfidy, evil intention.",
      "Tàn nhẫn, ngang ngược, dã man, phản trắc, ý đồ xấu.",
    ),
  ],
];

const PENTACLES: MinorEntry[] = [
  [
    m(
      "Perfect contentment, felicity, ecstasy; also speedy intelligence; gold.",
      "Mãn nguyện trọn vẹn, hạnh phúc, ngây ngất; cũng là tin tức nhanh; vàng bạc.",
    ),
    m(
      "The evil side of wealth, bad intelligence; also great riches.",
      "Mặt xấu của giàu sang, tin xấu; cũng là của cải lớn.",
    ),
  ],
  [
    m(
      "Gaiety, recreation and its connexions; news and messages in writing, as obstacles, agitation, trouble, embroilment.",
      "Vui vẻ, giải trí và những gì liên quan; tin tức, thư từ bằng văn bản — về trở ngại, xáo động, rắc rối, rối ren.",
    ),
    m(
      "Enforced gaiety, simulated enjoyment, literal sense, handwriting, composition, letters of exchange.",
      "Vui gượng, giả vờ tận hưởng, hiểu theo nghĩa đen, chữ viết tay, soạn thảo, hối phiếu.",
    ),
  ],
  [
    m(
      "Métier, trade, skilled labour; usually, however, regarded as a card of nobility, aristocracy, renown, glory.",
      "Nghề nghiệp, buôn bán, lao động tay nghề cao; tuy vậy thường được coi là lá của sự cao quý, quý tộc, danh tiếng, vinh quang.",
    ),
    m(
      "Mediocrity, in work and otherwise, puerility, pettiness, weakness.",
      "Tầm thường trong công việc và những mặt khác, trẻ con, nhỏ nhen, yếu kém.",
    ),
  ],
  [
    m(
      "The surety of possessions, cleaving to that which one has, gift, legacy, inheritance.",
      "Sự chắc chắn về tài sản, bám giữ những gì mình có, quà tặng, di sản, thừa kế.",
    ),
    m("Suspense, delay, opposition.", "Treo lơ lửng, trì hoãn, chống đối."),
  ],
  [
    m(
      "Material trouble above all; destitution, or otherwise. For some cartomancists, it is a card of love and lovers—wife, husband, friend, mistress; also concordance, affinities.",
      "Trên hết là khó khăn vật chất; túng quẫn hoặc tương tự. Với một số người xem bài, đây là lá của tình yêu và người yêu — vợ, chồng, bạn, người tình; cũng là sự hợp nhau, đồng điệu.",
    ),
    m(
      "Disorder, chaos, ruin, discord, profligacy.",
      "Rối loạn, hỗn mang, đổ nát, bất hoà, trác táng.",
    ),
  ],
  [
    m(
      "Presents, gifts, gratification; another account says attention, vigilance; now is the accepted time, present prosperity.",
      "Quà tặng, ban phát, sự hài lòng; cách đọc khác: chú tâm, cảnh giác; bây giờ chính là thời điểm, thịnh vượng hiện tại.",
    ),
    m(
      "Desire, cupidity, envy, jealousy, illusion.",
      "Ham muốn, tham lam, đố kỵ, ghen tuông, ảo tưởng.",
    ),
  ],
  [
    m(
      "Money, business, barter; but one reading gives altercation, quarrels; innocence, ingenuity, purgation.",
      "Tiền bạc, làm ăn, trao đổi; nhưng một cách đọc cho là cãi cọ, xích mích; cũng là ngây thơ, khéo léo, gột rửa.",
    ),
    m(
      "Cause for anxiety regarding money which it may be proposed to lend.",
      "Có lý do lo lắng về khoản tiền định cho vay.",
    ),
  ],
  [
    m(
      "Work, employment, commission, craftsmanship, skill in craft and business, perhaps in the preparatory stage.",
      "Công việc, việc làm, đơn đặt hàng, tay nghề, kỹ năng trong nghề và kinh doanh — có lẽ ở giai đoạn chuẩn bị.",
    ),
    m(
      "Voided ambition, vanity, cupidity, exaction, usury. It may also signify the possession of skill, in the sense of the ingenious mind turned to cunning and intrigue.",
      "Tham vọng tan biến, phù phiếm, tham lam, bóc lột, cho vay nặng lãi. Cũng có thể là có tài, nhưng đầu óc khéo léo bị dùng vào mánh lới và mưu mô.",
    ),
  ],
  [
    m(
      "Prudence, safety, success, accomplishment, certitude, discernment.",
      "Thận trọng, an toàn, thành công, hoàn thành, chắc chắn, sáng suốt.",
    ),
    m(
      "Roguery, deception, voided project, bad faith.",
      "Gian xảo, lừa dối, dự định đổ bể, bất tín.",
    ),
  ],
  [
    m(
      "Gain, riches; family matters, archives, extraction, the abode of a family.",
      "Lợi lộc, giàu có; việc gia đình, gia phả, dòng dõi, nơi cư ngụ của một gia tộc.",
    ),
    m(
      "Chance, fatality, loss, robbery, games of hazard; sometimes gift, dowry, pension.",
      "Ngẫu nhiên, định số, mất mát, trộm cướp, cờ bạc may rủi; đôi khi là quà, của hồi môn, lương hưu.",
    ),
  ],
  [
    m(
      "Application, study, scholarship, reflection; another reading says news, messages and the bringer thereof; also rule, management.",
      "Chuyên cần, học tập, học vấn, suy ngẫm; cách đọc khác: tin tức, lời nhắn và người mang tin; cũng là quy tắc, quản lý.",
    ),
    m(
      "Prodigality, dissipation, liberality, luxury; unfavourable news.",
      "Hoang phí, phóng túng, rộng rãi quá mức, xa hoa; tin không tốt.",
    ),
  ],
  [
    m(
      "Utility, serviceableness, interest, responsibility, rectitude—all on the normal and external plane.",
      "Hữu ích, tận tuỵ, lợi ích, trách nhiệm, ngay thẳng — tất cả ở bình diện thường ngày và bên ngoài.",
    ),
    m(
      "Inertia, idleness, repose of that kind, stagnation; also placidity, discouragement, carelessness.",
      "Trì trệ, lười biếng, sự nghỉ ngơi kiểu đó, ứ đọng; cũng là điềm nhiên, nản lòng, cẩu thả.",
    ),
  ],
  [
    m(
      "Opulence, generosity, magnificence, security, liberty.",
      "Sung túc, hào phóng, lộng lẫy, an toàn, tự do.",
    ),
    m(
      "Evil, suspicion, suspense, fear, mistrust.",
      "Điều xấu, nghi kỵ, treo lơ lửng, sợ hãi, mất lòng tin.",
    ),
  ],
  [
    m(
      "Valour, realizing intelligence, business and normal intellectual aptitude, sometimes mathematical gifts and attainments of this kind; success in these paths.",
      "Dũng khí, trí tuệ biết hiện thực hoá, năng khiếu kinh doanh và trí lực vững vàng, đôi khi có tài toán học; thành công trên những con đường đó.",
    ),
    m(
      "Vice, weakness, ugliness, perversity, corruption, peril.",
      "Thói xấu, yếu đuối, xấu xí, ngang trái, sa đoạ, hiểm nguy.",
    ),
  ],
];

const SUIT_META: {
  suit: Exclude<Suit, "major">;
  en: string;
  vi: string;
  file: string;
  list: MinorEntry[];
}[] = [
  { suit: "wands", en: "Wands", vi: "Gậy", file: "Wands", list: WANDS },
  { suit: "cups", en: "Cups", vi: "Cốc", file: "Cups", list: CUPS },
  { suit: "swords", en: "Swords", vi: "Kiếm", file: "Swords", list: SWORDS },
  {
    suit: "pentacles",
    en: "Pentacles",
    vi: "Tiền",
    file: "Pents",
    list: PENTACLES,
  },
];

const MINOR: TarotCard[] = SUIT_META.flatMap(({ suit, en, vi, file, list }) =>
  list.map(([up, rev], i) => {
    const [rankEn, rankVi] = RANKS[i];
    return {
      id: `${suit}${String(i + 1).padStart(2, "0")}`,
      name: `${rankEn} of ${en}`,
      nameVi: `${rankVi} ${vi}`,
      suit,
      file: `${file}${String(i + 1).padStart(2, "0")}`,
      up,
      rev,
    };
  }),
);

export const DECK: TarotCard[] = [...MAJOR, ...MINOR];
