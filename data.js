// 길 · Cesta po Koreji — obsah kurzu korejštiny A1
// Přepis: Revised Romanization podle výslovnosti, slovo po slovu.
// Slova:  ko|přepis|česky|emoji|poznámka(volitelně)
// Věty:   ko|přepis|česky|rozbor slov oddělený ·   (počet slov ko = přepis = rozbor)
// Dialog: A|ko|přepis|česky  (řádek začínající > říkáš ty)

const LINES = {
  H: { name: 'Hangul', ko: '한글', color: '#8E5BB5', sub: 'Doma v Benidormu – naučíš se číst' },
  1: { name: 'Linka 1 · Přílet', ko: '도착', color: '#0052A4', sub: 'Letadlo, letiště, peníze, metro' },
  2: { name: 'Linka 2 · Soul každý den', ko: '서울', color: '#00A84D', sub: 'Hotel, kavárna, trh, palác, čas' },
  3: { name: 'Linka 3 · Zábava', ko: '놀이', color: '#EF7C1C', sub: 'Nákupy, Everland, řeka, věž, večer' },
  4: { name: 'Linka 4 · Cesta domů', ko: '집으로', color: '#00A5DE', sub: 'Nouze, plány a závěrečná zkouška' },
};

// ---------- Písmena ----------
// souhlásky: [jamo, přepis na začátku, přepis na konci, jak zní česky, pomůcka, slabika pro poslech]
const CONSONANTS = [
  ['ㄱ', 'g', 'k', 'mezi k a g', 'Klacek ohnutý jako kosa → k/g', '가'],
  ['ㄴ', 'n', 'n', 'n', 'Nos z profilu → n', '나'],
  ['ㄷ', 'd', 't', 'mezi t a d', 'Dveře otevřené doprava → d', '다'],
  ['ㄹ', 'r', 'l', 'mezi samohláskami r, na konci l', 'Klikatá řeka → r/l', '라'],
  ['ㅁ', 'm', 'm', 'm', 'Čtvercová pusa: mňam → m', '마'],
  ['ㅂ', 'b', 'p', 'mezi p a b', 'Bedna s ušima → b', '바'],
  ['ㅅ', 's', 't', 's (před i jako š)', 'Stan / sjezdovka → s', '사'],
  ['ㅇ', '', 'ng', 'na začátku nic, na konci ng', 'Nula = nic, na konci prsten „ng"', '아'],
  ['ㅈ', 'j', 't', 'jako č / dž', 'Džbán se stříškou → dž', '자'],
  ['ㅎ', 'h', 't', 'h', 'Hlava s kloboukem → h', '하'],
  ['ㅋ', 'k', 'k', 'k s výdechem (kh)', 'ㄱ s čárkou navíc = víc vzduchu', '카'],
  ['ㅌ', 't', 't', 't s výdechem (th)', 'ㄷ s čárkou navíc = víc vzduchu', '타'],
  ['ㅍ', 'p', 'p', 'p s výdechem (ph)', 'Vypadá jako π (pí) → p', '파'],
  ['ㅊ', 'ch', 't', 'č s výdechem', 'ㅈ s čárkou nahoře = víc vzduchu', '차'],
  ['ㄲ', 'kk', 'k', 'tvrdé k bez výdechu', 'Dvě ㄱ = napjaté, krátké k', '까'],
  ['ㄸ', 'tt', '', 'tvrdé t bez výdechu', 'Dvě ㄷ = napjaté t', '따'],
  ['ㅃ', 'pp', '', 'tvrdé p bez výdechu', 'Dvě ㅂ = napjaté p', '빠'],
  ['ㅆ', 'ss', 't', 'ostré, napjaté s', 'Dvě ㅅ = ostré s', '싸'],
  ['ㅉ', 'jj', '', 'napjaté č', 'Dvě ㅈ = napjaté č', '짜'],
];
// samohlásky: [jamo, přepis, jak zní česky, pomůcka, slabika pro poslech]
const VOWELS = [
  ['ㅏ', 'a', 'a', 'Čárka doprava – a ven!', '아'],
  ['ㅓ', 'eo', 'otevřené o (blíž k „a")', 'Čárka doleva – eo', '어'],
  ['ㅗ', 'o', 'zavřené o, kulaté rty', 'Čárka nahoru – o', '오'],
  ['ㅜ', 'u', 'u', 'Čárka dolů – u', '우'],
  ['ㅡ', 'eu', 'jako „y" s roztaženými rty', 'Vodorovná zem – řekni u s úsměvem', '으'],
  ['ㅣ', 'i', 'i', 'Stojící člověk – i', '이'],
  ['ㅑ', 'ya', 'ja', 'Dvě čárky = přidej „j": ja', '야'],
  ['ㅕ', 'yeo', 'jo (otevřené)', 'Dvě čárky doleva: jo', '여'],
  ['ㅛ', 'yo', 'jo', 'Dvě čárky nahoru: jo', '요'],
  ['ㅠ', 'yu', 'ju', 'Dvě čárky dolů: ju', '유'],
  ['ㅐ', 'ae', 'e (otevřenější)', 'ㅏ + ㅣ = e', '애'],
  ['ㅔ', 'e', 'e', 'ㅓ + ㅣ = e (zní skoro jako ㅐ)', '에'],
  ['ㅒ', 'yae', 'je', 'ㅑ + ㅣ (vzácné)', '얘'],
  ['ㅖ', 'ye', 'je', 'ㅕ + ㅣ', '예'],
  ['ㅘ', 'wa', 'wa', 'ㅗ + ㅏ = o+a → wa', '와'],
  ['ㅝ', 'wo', 'wo', 'ㅜ + ㅓ = u+eo → wo', '워'],
  ['ㅙ', 'wae', 'we', 'ㅗ + ㅐ → we', '왜'],
  ['ㅞ', 'we', 'we', 'ㅜ + ㅔ → we (vzácné)', '웨'],
  ['ㅚ', 'oe', 'we', 'ㅗ + ㅣ → zní jako we', '외'],
  ['ㅟ', 'wi', 'wi', 'ㅜ + ㅣ → wi', '위'],
  ['ㅢ', 'ui', 'yi (y + i)', 'ㅡ + ㅣ → yi', '의'],
];

const HANGUL = [
  {
    id: 'h1', code: 'H1', ko: '모음', name: 'Základní samohlásky', emoji: '🔤', scene: '🏠🌴☀️',
    intro: 'Hangul vymyslel král Sedžong v 15. století tak, aby se ho každý naučil za pár dní. Začni šesti samohláskami. Na začátku slabiky před samohláskou stojí němé ㅇ.',
    cons: ['ㅇ'], vow: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'],
    words: `
아이|ai|dítě|👶
오이|oi|okurka|🥒
이|i|zub / dva|🦷
오|o|pět|🖐️
우아|ua|elegantní|🦢`,
    tips: [
      { t: 'Slabika je čtvereček', x: 'Korejština nepíše písmena za sebou, ale skládá je do bloků po slabikách. Každý blok začíná souhláskou. Když slabika začíná samohláskou, napíše se před ni němé ㅇ: ㅏ → 아.' },
      { t: 'Svislé a vodorovné', x: 'Svislé samohlásky (ㅏ ㅓ ㅣ) stojí vpravo od souhlásky: 아 어 이. Vodorovné (ㅗ ㅜ ㅡ) pod ní: 오 우 으.' },
    ],
  },
  {
    id: 'h2', code: 'H2', ko: '자음', name: 'Základní souhlásky', emoji: '🧱', scene: '🦁🦋🌳',
    intro: 'Devět souhlásek, se kterými přečteš stovky slov. Tvary napodobují polohu jazyka a rtů při vyslovení.',
    cons: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅈ', 'ㅎ'], vow: [],
    words: `
나무|namu|strom|🌳
바다|bada|moře|🌊
모자|moja|čepice|🧢
나비|nabi|motýl|🦋
고기|gogi|maso|🥩
하마|hama|hroch|🦛
사자|saja|lev|🦁
거미|geomi|pavouk|🕷️
머리|meori|hlava, vlasy|💆
다리|dari|noha / most|🦵
지도|jido|mapa|🗺️
구두|gudu|společenské boty|👞
모기|mogi|komár|🦟
오리|ori|kachna|🦆
가수|gasu|zpěvák|🎤
바나나|banana|banán|🍌
라디오|radio|rádio|📻
어머니|eomeoni|matka|👩‍🦳
아버지|abeoji|otec|👨‍🦳
비|bi|déšť|🌧️
소|so|kráva|🐄`,
    tips: [
      { t: 'ㄱ ㄷ ㅂ ㅈ jsou „měkké"', x: 'Na začátku slova zní skoro jako k, t, p, č, mezi samohláskami jako g, d, b, dž. 고기 = „kogi".' },
      { t: 'ㄹ je r i l', x: 'Mezi samohláskami lehké r (다리 = dari), na konci slabiky l (물 = mul).' },
      { t: 'ㅅ před ㅣ', x: '시 se čte „ši", ne „si". Proto 시간 (čas) zní „šigan".' },
    ],
  },
  {
    id: 'h3', code: 'H3', ko: '모음 2', name: 'Samohlásky s „j" a e', emoji: '✨', scene: '🐕🦀🎵',
    intro: 'Druhá čárka přidá zvuk „j": ㅏ → ㅑ (ja). A spojením se ㅣ vznikne e: ㅐ a ㅔ.',
    cons: [], vow: ['ㅑ', 'ㅕ', 'ㅛ', 'ㅠ', 'ㅐ', 'ㅔ', 'ㅖ'],
    words: `
우유|uyu|mléko|🥛
여자|yeoja|žena|👩
요리|yori|vaření|🍳
야구|yagu|baseball|⚾
개|gae|pes|🐕
게|ge|krab|🦀
노래|norae|píseň|🎵
배|bae|loď / hruška / břicho|⛵|tři významy, jeden zápis
시계|sigye|hodinky|⌚
휴지|hyuji|toaletní papír, kapesník|🧻
메뉴|menyu|jídelní lístek|📋
여우|yeou|liška|🦊
새|sae|pták|🐦
해|hae|slunce|☀️
예|ye|ano (formálně)|🙆`,
    tips: [
      { t: 'ㅐ a ㅔ zní skoro stejně', x: 'Dnes je většina Korejců nerozliší – obojí je české e. Rozdíl si pamatuj jen kvůli psaní: 개 (pes) × 게 (krab).' },
    ],
  },
  {
    id: 'h4', code: 'H4', ko: '자음 2', name: 'Silné souhlásky', emoji: '💨', scene: '☕🍕📷',
    intro: 'Čárka navíc = výdech (ㅋ ㅌ ㅍ ㅊ). Zdvojené písmeno = napjatý, tvrdý zvuk (ㄲ ㄸ ㅃ ㅆ ㅉ). Teď už přečteš kávu i pizzu!',
    cons: ['ㅋ', 'ㅌ', 'ㅍ', 'ㅊ', 'ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'], vow: [],
    words: `
커피|keopi|káva|☕
코|ko|nos|👃
기차|gicha|vlak|🚆
차|cha|čaj / auto|🍵|stejné slovo pro čaj i auto
치마|chima|sukně|👗
포도|podo|hrozny|🍇
피자|pija|pizza|🍕
토마토|tomato|rajče|🍅
카메라|kamera|fotoaparát|📷
오빠|oppa|starší bratr (říká žena)|🧑
토끼|tokki|králík|🐇
아저씨|ajeossi|pán (oslovení)|👨
쓰레기|sseuregi|odpadky|🗑️
비싸요|bissayo|je to drahé|💸
짜요|jjayo|je to slané|🧂
스키|seuki|lyže|⛷️`,
    tips: [
      { t: 'Tři druhy k', x: 'ㄱ (měkké, bez výdechu), ㅋ (s výdechem – podrž si dlaň před pusou, ucítíš vzduch), ㄲ (napjaté, krátké, žádný vzduch). Stejně t: ㄷ ㅌ ㄸ, p: ㅂ ㅍ ㅃ, č: ㅈ ㅊ ㅉ.' },
    ],
  },
  {
    id: 'h5', code: 'H5', ko: '모음 3', name: 'Dvojhlásky', emoji: '🌀', scene: '🍎🐷👂',
    intro: 'Dvě samohlásky v jedné slabice: ㅗ + ㅏ = ㅘ (wa). Je jich sedm, ale v praxi potkáš hlavně ㅘ, ㅝ, ㅚ, ㅟ a ㅢ.',
    cons: [], vow: ['ㅘ', 'ㅝ', 'ㅙ', 'ㅚ', 'ㅟ', 'ㅢ'],
    words: `
사과|sagwa|jablko|🍎
과자|gwaja|sušenky|🍪
돼지|dwaeji|prase|🐷
회사|hoesa|firma|🏢
귀|gwi|ucho|👂
의사|uisa|lékař|👨‍⚕️
의자|uija|židle|🪑
왜|wae|proč|❔
가위|gawi|nůžky|✂️
바퀴|bakwi|kolo (u auta)|🛞
위|wi|nahoře, nad|⬆️
웨이터|weiteo|číšník|🤵
쉬어요|swieoyo|odpočívám|😌`,
    tips: [
      { t: 'ㅢ má tři výslovnosti', x: 'Na začátku slova „yi" (의사), uprostřed slova často „i", a jako „můj/jeho" (koncovka 의) „e". Neboj, rozumět ti budou.' },
    ],
  },
  {
    id: 'h6', code: 'H6', ko: '받침', name: 'Koncové souhlásky', emoji: '🧩', scene: '🍚🌸🍜',
    intro: 'Souhláska pod slabikou se jmenuje 받침 (batčhim). Na konci slabiky zní jen 7 zvuků: k, n, t, l, m, p, ng.',
    cons: [], vow: [], finals: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ'],
    words: `
밥|bap|vařená rýže / jídlo|🍚
산|san|hora|⛰️
강|gang|řeka|🏞️
김치|gimchi|kimči|🥬
책|chaek|kniha|📕
옷|ot|oblečení|👚
꽃|kkot|květina|🌸
김밥|gimbap|kimbap (rýžová rolka)|🍙
라면|ramyeon|instantní nudle|🍜
맥주|maekju|pivo|🍺
소주|soju|sodžu (pálenka)|🥃
서울|seoul|Soul|🏙️
핸드폰|haendeupon|mobil|📱
컴퓨터|keompyuteo|počítač|💻
아이스크림|aiseukeurim|zmrzlina|🍦
곰|gom|medvěd|🐻
달|dal|měsíc (na nebi)|🌙
한국어|hangugeo|korejština|🇰🇷|píše se 한국어, čte se [한구거]`,
    tips: [
      { t: 'Sedm koncových zvuků', x: 'ㄱ ㅋ ㄲ → k · ㄴ → n · ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ → t · ㄹ → l · ㅁ → m · ㅂ ㅍ → p · ㅇ → ng. Proto 옷 (oblečení) i 꽃 (květina) končí na „t".' },
      { t: 'Vázání: koncovka „přeskočí"', x: 'Když další slabika začíná němým ㅇ, koncová souhláska se přesune do ní: 한국어 → [한구거] hangugeo, 음악 → [으막] eumak, 있어요 → [이써요] isseoyo.' },
      { t: 'Nosovky: ㅂ + ㄴ → m', x: '감사합니다 se čte [감사함니다] gamsahamnida. Stejně 입니다 → [임니다].' },
      { t: 'Tiché ㅎ', x: 'Mezi samohláskami ㅎ skoro zmizí: 좋아요 → [조아요] joayo, 괜찮아요 → [괜차나요].' },
    ],
  },
];

// ---------- Zastávky ----------
const ST = [];
function STOP(o) { ST.push(o); }

STOP({
  id: 's1', line: 1, code: '101', ko: '기내', rr: 'ginae', name: 'V letadle', topic: 'Pozdravy a zdvořilost', emoji: '✈️', scene: '✈️☁️🧑‍✈️',
  intro: 'Sedíš v letadle z Pekingu do Soulu. Letuška tě pozdraví korejsky – než přistaneš, nauč se slova, bez kterých se v Koreji neobejdeš.',
  words: `
안녕하세요|annyeonghaseyo|dobrý den / ahoj (zdvořile)|👋|platí celý den, ráno i večer
안녕|annyeong|ahoj (jen s kamarády)|🙌
감사합니다|gamsahamnida|děkuji (formálně)|🙏|čte se [감사함니다]
고마워요|gomawoyo|díky (zdvořile, vřeleji)|😊
네|ne|ano / jo / rozumím|✅|Korejci ho říkají i jako „poslouchám"
아니요|aniyo|ne|❌
죄송합니다|joesonghamnida|omlouvám se (formálně)|🙇
미안해요|mianhaeyo|promiň(te)|😅
괜찮아요|gwaenchanayo|to nic / v pořádku / ne, díky|👌|odpověď na omluvu i zdvořilé odmítnutí
실례합니다|sillyehamnida|s dovolením / promiňte|🙋|když někoho vyrušíš nebo se prodíráš
저기요|jeogiyo|prosím vás! (zavolat obsluhu)|🙋‍♂️
잠깐만요|jamkkanmanyo|moment, prosím|✋
안녕히 가세요|annyeonghi gaseyo|na shledanou (tomu, kdo odchází)|🚶
안녕히 계세요|annyeonghi gyeseyo|na shledanou (tomu, kdo zůstává)|🏠
만나서 반가워요|mannaseo bangawoyo|rád vás poznávám|🤝
잘 먹겠습니다|jal meokgetseumnida|dobrou chuť (říkáš před jídlem)|🍱
잘 먹었습니다|jal meogeotseumnida|bylo to výborné (po jídle)|😋
물|mul|voda|💧
주스|juseu|džus|🧃
담요|damyo|deka|🛌
화장실|hwajangsil|toaleta|🚻
좀|jom|trochu / prosím (zjemní prosbu)|🤏
주세요|juseyo|dejte mi, prosím|🤲
이거|igeo|tohle|👉
뭐예요?|mwoyeyo|co je to?|❓
어디예요?|eodiyeyo|kde je?|📍`,
  sents: `
안녕하세요|annyeonghaseyo|Dobrý den.|dobrý den
물 좀 주세요|mul jom juseyo|Vodu, prosím.|voda·prosím (zjemnění)·dejte mi
커피 주세요|keopi juseyo|Kávu, prosím.|káva·dejte mi
담요 좀 주세요|damyo jom juseyo|Deku, prosím.|deka·prosím (zjemnění)·dejte mi
네 감사합니다|ne gamsahamnida|Ano, děkuji.|ano·děkuji
아니요 괜찮아요|aniyo gwaenchanayo|Ne, děkuji (to je dobré).|ne·v pořádku
저기요 주스 좀 주세요|jeogiyo juseu jom juseyo|Prosím vás, džus, prosím.|haló, prosím vás·džus·prosím·dejte mi
화장실이 어디예요?|hwajangsiri eodiyeyo?|Kde je toaleta?|toaleta (podmět)·kde je
이거 뭐예요?|igeo mwoyeyo?|Co je tohle?|tohle·co je
죄송합니다 잠깐만요|joesonghamnida jamkkanmanyo|Promiňte, moment.|omlouvám se·moment
실례합니다|sillyehamnida|S dovolením.|s dovolením
만나서 반가워요|mannaseo bangawoyo|Rád vás poznávám.|když se potkáme·jsem rád
안녕히 가세요|annyeonghi gaseyo|Na shledanou.|v klidu·jděte`,
  grammar: [
    { t: '주세요 = dejte mi, prosím', x: 'Nejužitečnější slovo v Koreji. Řekni věc + 주세요 a dostaneš ji. Když přidáš 좀 (trochu), zní prosba ještě zdvořileji.', ex: '물 주세요|mul juseyo|Vodu, prosím.\n물 좀 주세요|mul jom juseyo|Vodu, prosím (jemněji).\n이거 주세요|igeo juseyo|Tohle, prosím.' },
    { t: 'Dvě úrovně zdvořilosti', x: 'Koncovka -요 (고마워요, 미안해요) je zdvořilá běžná řeč – s ní vystačíš skoro všude. -ㅂ니다 (감사합니다, 죄송합니다) je formálnější: letuška, obchod, úřad. Bez -요 (안녕, 고마워) jen s kamarády.', ex: '고마워요|gomawoyo|Díky.\n감사합니다|gamsahamnida|Děkuji (formálně).\n안녕|annyeong|Ahoj (kamarádovi).' },
    { t: 'Dvě rozloučení', x: '가세요 = „jděte" – říkáš tomu, kdo odchází. 계세요 = „zůstaňte" – říkáš, když odcházíš ty. Odcházíte-li oba, řekněte si 안녕히 가세요.', ex: '안녕히 가세요|annyeonghi gaseyo|Na shledanou (odcházíš ty).\n안녕히 계세요|annyeonghi gyeseyo|Na shledanou (odchází on).' },
  ],
  dialog: {
    who: 'Letuška', face: '👩‍✈️',
    lines: `
A|안녕하세요! 뭐 드릴까요?|annyeonghaseyo! mwo deurilkkayo?|Dobrý den! Co vám mohu nabídnout?
>|물 좀 주세요|mul jom juseyo|Vodu, prosím.
A|여기 있어요|yeogi isseoyo|Tady máte.
>|감사합니다|gamsahamnida|Děkuji.
A|커피도 드릴까요?|keopido deurilkkayo?|Dáte si i kávu?
>|아니요 괜찮아요|aniyo gwaenchanayo|Ne, děkuji.
A|담요 필요하세요?|damyo piryohaseyo?|Potřebujete deku?
>|네 주세요|ne juseyo|Ano, prosím.`,
  },
  culture: [
    'Pozdrav = lehká úklona hlavou a 안녕하세요. Podání ruky je méně časté – a když, tak jemně, často s druhou rukou podpírající předloktí.',
    'Když něco podáváš nebo bereš (kartu, peníze, vizitku), použij obě ruce, nebo pravou s levou na předloktí. Je to projev respektu.',
  ],
});

STOP({
  id: 's2', line: 1, code: '102', ko: '입국', rr: 'ipguk', name: 'Letiště Incheon', topic: 'Představení se', emoji: '🛂', scene: '🛂🧳🇰🇷',
  intro: 'Přistál jsi v Incheonu. U pasové kontroly i s novými lidmi se budeš představovat – kdo jsi a odkud.',
  words: `
저|jeo|já (zdvořile)|🙋
저는|jeoneun|já (jako téma věty)|👆
제|je|můj (zdvořile)|👤
이름|ireum|jméno|🏷️
사람|saram|člověk|🧍
체코|cheko|Česko|🇨🇿
스페인|seupein|Španělsko|🇪🇸
브라질|beurajil|Brazílie|🇧🇷
한국|hanguk|Korea|🇰🇷
여권|yeogwon|pas|🛂
여행|yeohaeng|cesta, výlet|🧳
관광|gwangwang|turistika (prohlídky)|📸
친구|chingu|kamarád|🧑‍🤝‍🧑
변호사|byeonhosa|právník, advokát|⚖️
회사원|hoesawon|zaměstnanec firmy|👔
학생|haksaeng|student|🎓
선생님|seonsaengnim|učitel / pane (oslovení)|🧑‍🏫
이에요|ieyo|je, jsem (po souhlásce)|🟰
예요|yeyo|je, jsem (po samohlásce)|〰️
아니에요|anieyo|není, nejsem|🚫
뭐|mwo|co|🤔
누구|nugu|kdo|🕵️
어디|eodi|kde, kam|🧭
어느 나라|eoneu nara|která země|🌍
여기요|yeogiyo|tady (máte)|🫴
일주일|iljuil|týden|📅
살아요|sarayo|bydlím, žiju|🏡
처음 뵙겠습니다|cheoeum boepgetseumnida|těší mě (formálně, poprvé)|🎩`,
  sents: `
저는 야쿱이에요|jeoneun yakubieyo|Jsem Jakub.|já (téma)·jsem Jakub
이름이 뭐예요?|ireumi mwoyeyo?|Jak se jmenujete?|jméno (podmět)·co je
저는 체코 사람이에요|jeoneun cheko saramieyo|Jsem Čech.|já (téma)·Česko·jsem člověk
친구는 브라질 사람이에요|chinguneun beurajil saramieyo|Kamarád je Brazilec.|kamarád (téma)·Brazílie·je člověk
제 친구 호마리우예요|je chingu homariuyeyo|To je můj kamarád Romário.|můj·kamarád·je Romário
어느 나라 사람이에요?|eoneu nara saramieyo?|Odkud jste?|která·země·jste člověk
저는 한국 사람이 아니에요|jeoneun hanguk sarami anieyo|Nejsem Korejec.|já (téma)·Korea·člověk (podmět)·nejsem
저는 변호사예요|jeoneun byeonhosayeyo|Jsem právník.|já (téma)·jsem právník
여행이에요|yeohaengieyo|Jsem tu na výletě.|je to výlet
일주일이에요|iljuirieyo|Na týden.|je to týden
저는 스페인에 살아요|jeoneun seupeine sarayo|Bydlím ve Španělsku.|já (téma)·ve Španělsku·bydlím
누구예요?|nuguyeyo?|Kdo je to?|kdo je
처음 뵙겠습니다|cheoeum boepgetseumnida|Těší mě.|poprvé·uvidím vás`,
  grammar: [
    { t: '이에요 / 예요 = je, jsem, jsi', x: 'Přidáš za podstatné jméno. Končí-li souhláskou → 이에요 (사람이에요), končí-li samohláskou → 예요 (변호사예요). S otazníkem je to otázka: 학생이에요? = Jsi student?', ex: '사람이에요|saramieyo|Je to člověk.\n변호사예요|byeonhosayeyo|Jsem právník.\n학생이에요?|haksaengieyo?|Jsi student?' },
    { t: '은 / 는 = téma věty', x: 'Označuje, o čem mluvíš – „co se týče mě…". Po souhlásce 은, po samohlásce 는: 저는, 친구는, 이름은.', ex: '저는 야쿱이에요|jeoneun yakubieyo|Já jsem Jakub.\n친구는 학생이에요|chinguneun haksaengieyo|Kamarád je student.' },
    { t: '아니에요 = není, nejsem', x: 'Zápor k 이에요/예요. Slovo před ním dostane 이/가: 한국 사람이 아니에요 (nejsem Korejec).', ex: '학생이 아니에요|haksaengi anieyo|Nejsem student.\n저는 의사가 아니에요|jeoneun uisaga anieyo|Nejsem lékař.' },
  ],
  dialog: {
    who: 'Pasová kontrola', face: '👮',
    lines: `
A|안녕하세요. 여권 주세요|annyeonghaseyo. yeogwon juseyo|Dobrý den. Pas, prosím.
>|네, 여기요|ne, yeogiyo|Ano, tady.
A|어느 나라 사람이에요?|eoneu nara saramieyo?|Odkud jste?
>|저는 체코 사람이에요|jeoneun cheko saramieyo|Jsem Čech.
A|여행이에요?|yeohaengieyo?|Jste tu na výletě?
>|네, 관광이에요|ne, gwangwangieyo|Ano, turistika.
A|며칠 동안 있어요?|myeochil dongan isseoyo?|Na kolik dní?
>|일주일이에요|iljuirieyo|Na týden.
A|좋은 여행 되세요!|joeun yeohaeng doeseyo!|Ať se vám cesta vydaří!
>|감사합니다|gamsahamnida|Děkuji.`,
  },
  culture: [
    'Korejci se často ptají na věk a povolání – podle toho volí, jak s tebou mluvit. Není to nezdvořilost.',
    'Cizí jména se přepisují podle zvuku: Jakub = 야쿱, Romário = 호마리우 (jako slavný brazilský fotbalista). Korejci říkají příjmení první: 김민수 = Kim Minsu.',
  ],
});

STOP({
  id: 's3', line: 1, code: '103', ko: '환전', rr: 'hwanjeon', name: 'Směnárna', topic: 'Čísla a peníze', emoji: '💱', scene: '💶💱💴',
  intro: 'Měníš eura na wony. Na ceny, telefonní čísla a minuty se používají sino-korejská čísla 일, 이, 삼…',
  words: `
영|yeong|nula|0️⃣
공|gong|nula (v telefonním čísle)|☎️
일|il|jedna / práce|1️⃣
이|i|dva|2️⃣
삼|sam|tři|3️⃣
사|sa|čtyři|4️⃣|zní jako „smrt" – v Koreji nešťastné číslo
오|o|pět|5️⃣
육|yuk|šest|6️⃣
칠|chil|sedm|7️⃣
팔|pal|osm|8️⃣
구|gu|devět|9️⃣
십|sip|deset|🔟
백|baek|sto|💯
천|cheon|tisíc|🔢
만|man|deset tisíc|🧮
원|won|won (měna)|🪙
유로|yuro|euro|💶
돈|don|peníze|💰
환전|hwanjeon|výměna peněz|💱
얼마예요?|eolmayeyo|kolik to stojí?|🏷️
카드|kadeu|karta|💳
현금|hyeongeum|hotovost|💵
영수증|yeongsujeung|účtenka|🧾
돼요|dwaeyo|jde to, funguje|🆗
전화번호|jeonhwabeonho|telefonní číslo|📞
번|beon|číslo (č.) / krát|#️⃣
환율|hwanyul|kurz|📈
천 원|cheon won|1 000 wonů|💴
만 원|man won|10 000 wonů|💷`,
  sents: `
얼마예요?|eolmayeyo?|Kolik to stojí?|kolik je
이거 얼마예요?|igeo eolmayeyo?|Kolik stojí tohle?|tohle·kolik je
만 원이에요|man wonieyo|Stojí to 10 000 wonů.|deset tisíc·je wonů
오천 원이에요|ocheon wonieyo|Je to 5 000 wonů.|pět tisíc·je wonů
삼만 오천 원이에요|samman ocheon wonieyo|Je to 35 000 wonů.|třicet tisíc·pět tisíc·je wonů
이만 원이에요|iman wonieyo|Je to 20 000 wonů.|dvacet tisíc·je wonů
환전해 주세요|hwanjeonhae juseyo|Vyměňte mi peníze, prosím.|vyměňte·prosím
백 유로 환전해 주세요|baek yuro hwanjeonhae juseyo|Vyměňte mi prosím 100 eur.|sto·euro·vyměňte·prosím
카드 돼요?|kadeu dwaeyo?|Můžu platit kartou?|karta·jde to
현금만 돼요|hyeongeumman dwaeyo|Jen hotovost.|jen hotovost·jde
영수증 주세요|yeongsujeung juseyo|Účtenku, prosím.|účtenka·dejte mi
전화번호가 뭐예요?|jeonhwabeonhoga mwoyeyo?|Jaké je vaše telefonní číslo?|tel. číslo (podmět)·co je
환율이 얼마예요?|hwanyuri eolmayeyo?|Jaký je kurz?|kurz (podmět)·kolik je`,
  grammar: [
    { t: 'Sino-korejská čísla', x: '일, 이, 삼… se používají na peníze, telefon, minuty, data, patra a linky metra. Skládají se jako stavebnice: 십 = 10, 이십 = 20, 이십오 = 25, 삼백 = 300.', ex: '십오|sibo|15\n이십|isip|20\n삼백|sambaek|300\n이천|icheon|2 000' },
    { t: 'Pozor: 만 = 10 000', x: 'Korejci počítají po desetitisících. 10 000 = 만 (ne „deset tisíc"), 50 000 = 오만, 100 000 = 십만. Bankovky: 천 원, 오천 원, 만 원, 오만 원.', ex: '만 원|man won|10 000 ₩\n오만 원|oman won|50 000 ₩\n십만 원|simman won|100 000 ₩' },
    { t: '돼요? = jde to? · -만 = jen', x: '카드 돼요? (Bere se karta?), 이거 돼요? (Jde tohle?). Přípona -만 znamená „jen": 현금만 = jen hotovost, 이거만 = jen tohle.', ex: '카드 돼요?|kadeu dwaeyo?|Jde to kartou?\n이거만 주세요|igeoman juseyo|Jen tohle, prosím.' },
  ],
  dialog: {
    who: 'Směnárna', face: '💁',
    lines: `
A|안녕하세요. 뭐 도와드릴까요?|annyeonghaseyo. mwo dowadeurilkkayo?|Dobrý den. S čím vám mohu pomoci?
>|환전해 주세요|hwanjeonhae juseyo|Chtěl bych si vyměnit peníze.
A|얼마 환전해 드릴까요?|eolma hwanjeonhae deurilkkayo?|Kolik vám mám vyměnit?
>|백 유로 환전해 주세요|baek yuro hwanjeonhae juseyo|Sto eur, prosím.
A|네. 십오만 원이에요|ne. siboman wonieyo|Dobře. To je 150 000 wonů.
>|영수증 주세요|yeongsujeung juseyo|Účtenku, prosím.
A|여기 있어요|yeogi isseoyo|Tady máte.
>|감사합니다|gamsahamnida|Děkuji.`,
  },
  culture: [
    'Na letišti bývá horší kurz – vyměň jen trochu, zbytek ve městě (Myeongdong má směnárny s dobrým kurzem). Kartou zaplatíš skoro všude.',
    'Číslo 4 (사) zní jako „smrt" (死). Ve výtazích proto 4. patro často chybí nebo je označené písmenem F.',
  ],
});

STOP({
  id: 's4', line: 1, code: '104', ko: '지하철', rr: 'jihacheol', name: 'Metro', topic: 'Doprava a cesta', emoji: '🚇', scene: '🚇🗺️🎫',
  intro: 'Z letiště jedeš vlakem AREX do Hongdae a tam přestoupíš na linku 2 do Jamsilu. Kam, kudy a jakou linkou?',
  words: `
지하철|jihacheol|metro|🚇
역|yeok|stanice|🚉
버스|beoseu|autobus|🚌
택시|taeksi|taxi|🚕
공항|gonghang|letiště|✈️
표|pyo|jízdenka, lístek|🎫
교통카드|gyotongkadeu|dopravní karta (T-money)|💳
충전|chungjeon|dobití|🔋
호선|hoseon|linka metra|🛤️
출구|chulgu|východ|🚪
갈아타요|garatayo|přestupuji|🔁
가요|gayo|jdu, jedu|➡️
와요|wayo|přicházím, přijíždí|⬅️
타요|tayo|nastupuji, jedu (čím)|⤴️
내려요|naeryeoyo|vystupuji|⤵️
어떻게|eotteoke|jak|🧐
여기|yeogi|tady|📌
거기|geogi|tam (u tebe)|👇
저기|jeogi|tamhle|👈
여기서|yeogiseo|tady (na tomto místě)|📍
다음|daeum|příští, další|⏭️
몇|myeot|kolik (+ počítadlo)|🔢
가까워요|gakkawoyo|je to blízko|🤏
멀어요|meoreoyo|je to daleko|🔭
잠실|jamsil|Jamsil (čtvrť)|🏟️
서울역|seoullyeok|Soulské nádraží|🚄|čte se [서울력]`,
  sents: `
지하철역이 어디예요?|jihacheollyeogi eodiyeyo?|Kde je stanice metra?|stanice metra (podmět)·kde je
잠실에 가요|jamsire gayo|Jedu do Jamsilu.|do Jamsilu·jedu
잠실역에 어떻게 가요?|jamsillyeoge eotteoke gayo?|Jak se dostanu na stanici Jamsil?|na stanici Jamsil·jak·jedu
이호선을 타요|ihoseoneul tayo|Jedu linkou 2.|linku 2 (předmět)·nastupuju
어디에서 갈아타요?|eodieseo garatayo?|Kde přestupuju?|kde·přestupuju
다음 역은 잠실이에요|daeum yeogeun jamsirieyo|Příští stanice je Jamsil.|příští·stanice (téma)·je Jamsil
여기서 내려요|yeogiseo naeryeoyo|Tady vystupuju.|tady·vystupuju
교통카드 충전해 주세요|gyotongkadeu chungjeonhae juseyo|Dobijte mi kartu, prosím.|dopravní karta·dobijte·prosím
몇 번 출구예요?|myeot beon chulguyeyo?|Který je to východ?|kolik·číslo·je východ
삼 번 출구예요|sam beon chulguyeyo|Východ číslo 3.|tři·číslo·je východ
멀어요?|meoreoyo?|Je to daleko?|je daleko
아니요 가까워요|aniyo gakkawoyo|Ne, je to blízko.|ne·je blízko
공항에 가 주세요|gonghange ga juseyo|Na letiště, prosím. (v taxíku)|na letiště·jeďte·prosím`,
  grammar: [
    { t: '에 = do, na (kam)', x: 'Za místo, kam jdeš nebo jedeš: 잠실에 가요 (jedu do Jamsilu), 공항에 가요 (jedu na letiště). Pojí se se slovesy 가요 (jdu) a 와요 (přicházím).', ex: '잠실에 가요|jamsire gayo|Jedu do Jamsilu.\n한국에 와요|hanguge wayo|Přijíždím do Koreje.' },
    { t: '타요 / 내려요 / 갈아타요', x: 'Na dopravní prostředek se „nasedá": 지하철을 타요 = jedu metrem, 택시 타요 = vezmu si taxi. 내려요 = vystupuju, 갈아타요 = přestupuju.', ex: '버스를 타요|beoseureul tayo|Jedu autobusem.\n다음 역에서 내려요|daeum yeogeseo naeryeoyo|Vystupuju na příští stanici.' },
    { t: '-아/어 주세요 = udělejte mi, prosím', x: 'Sloveso + 주세요 = prosba o službu: 가 주세요 (jeďte, prosím), 충전해 주세요 (dobijte, prosím), 환전해 주세요 (vyměňte).', ex: '잠실역에 가 주세요|jamsillyeoge ga juseyo|Na stanici Jamsil, prosím.\n여기서 세워 주세요|yeogiseo sewo juseyo|Zastavte tady, prosím.' },
  ],
  dialog: {
    who: 'Kolemjdoucí', face: '🧑',
    lines: `
>|실례합니다|sillyehamnida|Promiňte.
A|네?|ne?|Ano?
>|잠실역에 어떻게 가요?|jamsillyeoge eotteoke gayo?|Jak se dostanu na stanici Jamsil?
A|이호선을 타세요|ihoseoneul taseyo|Jeďte linkou 2.
>|어디에서 갈아타요?|eodieseo garatayo?|Kde přestupuju?
A|홍대입구역에서 갈아타세요|hongdaeipguyeogeseo garataseyo|Přestupte na stanici Hongik Univ. (Hongdae).
>|멀어요?|meoreoyo?|Je to daleko?
A|아니요, 가까워요|aniyo, gakkawoyo|Ne, je to blízko.
>|감사합니다!|gamsahamnida!|Děkuji!`,
  },
  culture: [
    'Kartu T-money (티머니) koupíš a dobiješ v každé večerce (GS25, CU, 7-Eleven) i v automatech na stanicích. Platí v metru, autobusu i taxíku.',
    'V metru jsou označená místa pro seniory a růžová místa pro těhotné – nesedej si na ně, ani když jsou volná. A v soupravách se mluví potichu.',
  ],
});

STOP({
  id: 's5', line: 2, code: '201', ko: '호텔', rr: 'hotel', name: 'Hotel Jamsil', topic: 'Je / není · v pokoji', emoji: '🏨', scene: '🏨🛎️🔑',
  intro: 'Check-in v hotelu v Jamsilu. Co v pokoji je, co chybí a jak si o to říct.',
  words: `
호텔|hotel|hotel|🏨
방|bang|pokoj|🚪
열쇠|yeolsoe|klíč|🔑
카드 키|kadeu ki|klíčová karta|🗝️
예약|yeyak|rezervace|📝
체크인|chekeuin|check-in|🛎️
체크아웃|chekeuaut|check-out|🧳
와이파이|waipai|wi-fi|📶
비밀번호|bimilbeonho|heslo|🔐
수건|sugeon|ručník|🧺
침대|chimdae|postel|🛏️
에어컨|eeokeon|klimatizace|❄️
난방|nanbang|topení|♨️
엘리베이터|ellibeiteo|výtah|🛗
층|cheung|patro|🏢
아침|achim|snídaně / ráno|🍳
있어요|isseoyo|je, mám (existuje)|✔️
없어요|eopseoyo|není, nemám|✖️
가방|gabang|taška|👜
짐|jim|zavazadla|🎒
편의점|pyeonuijeom|večerka|🏪
더|deo|víc, ještě|➕
고장 났어요|gojang nasseoyo|je to rozbité|🔧
어서 오세요|eoseo oseyo|vítejte (v obchodě, hotelu)|🤗`,
  sents: `
예약했어요|yeyakaesseoyo|Mám rezervaci.|rezervoval jsem
체크인 해 주세요|chekeuin hae juseyo|Check-in, prosím.|check-in·udělejte·prosím
와이파이 있어요?|waipai isseoyo?|Máte tu wi-fi?|wi-fi·je
와이파이 비밀번호가 뭐예요?|waipai bimilbeonhoga mwoyeyo?|Jaké je heslo na wi-fi?|wi-fi·heslo (podmět)·co je
수건이 없어요|sugeoni eopseoyo|Chybí ručník.|ručník (podmět)·není
수건 더 주세요|sugeon deo juseyo|Ještě ručníky, prosím.|ručník·víc·dejte mi
에어컨이 고장 났어요|eeokeoni gojang nasseoyo|Klimatizace je rozbitá.|klimatizace (podmět)·porucha·nastala
아침 몇 시예요?|achim myeot siyeyo?|V kolik je snídaně?|snídaně·kolik·je hodin
체크아웃 몇 시예요?|chekeuaut myeot siyeyo?|V kolik je check-out?|check-out·kolik·je hodin
엘리베이터가 어디 있어요?|ellibeiteoga eodi isseoyo?|Kde je výtah?|výtah (podmět)·kde·je
편의점 있어요?|pyeonuijeom isseoyo?|Je tu večerka?|večerka·je
짐 좀 맡겨도 돼요?|jim jom matgyeodo dwaeyo?|Můžu si tu nechat zavazadla?|zavazadla·prosím·když nechám·jde to
방이 몇 층이에요?|bangi myeot cheungieyo?|V kterém patře je pokoj?|pokoj (podmět)·kolik·je patro`,
  grammar: [
    { t: '있어요 / 없어요 = je / není', x: 'Jedno slovo pro existenci i vlastnictví: 와이파이 있어요? = Je tu wi-fi? / Máte wi-fi? 수건이 없어요 = Není (tu) ručník.', ex: '시간 있어요?|sigan isseoyo?|Máš čas?\n돈이 없어요|doni eopseoyo|Nemám peníze.' },
    { t: '이 / 가 = podmět', x: 'Označuje, co je nebo není: po souhlásce 이 (수건이), po samohlásce 가 (비밀번호가). V mluvě se často vynechává.', ex: '방이 커요|bangi keoyo|Pokoj je velký.\n와이파이가 없어요|waipaiga eopseoyo|Není wi-fi.' },
    { t: '어디 있어요? = kde je?', x: 'S 있어요 se ptáš, kde něco je: 화장실이 어디 있어요? Znamená totéž co 어디예요?', ex: '역이 어디 있어요?|yeogi eodi isseoyo?|Kde je stanice?\n화장실이 어디 있어요?|hwajangsiri eodi isseoyo?|Kde je toaleta?' },
  ],
  dialog: {
    who: 'Recepce', face: '🛎️',
    lines: `
A|어서 오세요!|eoseo oseyo!|Vítejte!
>|안녕하세요. 예약했어요|annyeonghaseyo. yeyakaesseoyo|Dobrý den. Mám rezervaci.
A|성함이 어떻게 되세요?|seonghami eotteoke doeseyo?|Na jaké jméno, prosím?
>|야쿱 크레이치예요|yakup keureichiyeyo|Jakub Krejčí.
A|네, 카드 키 여기 있어요. 방은 칠 층이에요|ne, kadeu ki yeogi isseoyo. bangeun chil cheungieyo|Tady je karta. Pokoj je v 7. patře.
>|와이파이 비밀번호가 뭐예요?|waipai bimilbeonhoga mwoyeyo?|Jaké je heslo na wi-fi?
A|방에 있어요|bange isseoyo|Je na pokoji.
>|아침 몇 시예요?|achim myeot siyeyo?|V kolik je snídaně?
A|일곱 시부터 열 시까지예요|ilgop sibuteo yeol sikkajiyeyo|Od sedmi do deseti.
>|감사합니다!|gamsahamnida!|Děkuji!`,
  },
  culture: [
    'Spropitné se v Koreji nedává – v hotelu, restauraci ani v taxíku. Nikdo ho nečeká.',
    'Zásuvky jsou typu C/F jako v Evropě (220 V) – adaptér nepotřebuješ.',
  ],
});

STOP({
  id: 's6', line: 2, code: '202', ko: '카페', rr: 'kape', name: 'Kavárna', topic: 'Objednávání a počítání', emoji: '☕', scene: '☕🧊🍰',
  intro: 'Korejci kavárny milují. Objednej si ledové americano – a nauč se korejská „domácí" čísla na počítání kusů a lidí.',
  words: `
하나|hana|jedna|☝️
둘|dul|dva|✌️
셋|set|tři|🤟
넷|net|čtyři|🍀|čtyřlístek = čtyři
다섯|daseot|pět|✋
여섯|yeoseot|šest|🎲
일곱|ilgop|sedm|🌈|sedm barev duhy
여덟|yeodeol|osm|🐙|chobotnice má osm ramen
아홉|ahop|devět|🎳
열|yeol|deset|🙌
개|gae|kus (počítadlo věcí)|📦
잔|jan|šálek, sklenka|🍷
병|byeong|láhev|🍾
명|myeong|osoba (počítadlo lidí)|👥
아이스 아메리카노|aiseu amerikano|ledové americano|🧊
라떼|ratte|latte|🥛
우유|uyu|mléko|🍼
따뜻한|ttatteutan|teplý, horký|♨️
케이크|keikeu|dort|🍰
빵|ppang|pečivo, chléb|🍞
설탕|seoltang|cukr|🍬
포장|pojang|s sebou (zabalit)|🛍️
주문|jumun|objednávka|🧾
큰 거|keun geo|ten velký|🔝
작은 거|jageun geo|ten malý|🔽
빼 주세요|ppae juseyo|vynechte, prosím (bez…)|🚫
앉아요|anjayo|sedám si|💺
진동벨|jindongbel|bzučák (vibrující pager)|📳`,
  sents: `
아이스 아메리카노 한 잔 주세요|aiseu amerikano han jan juseyo|Jedno ledové americano, prosím.|ledové·americano·jeden·šálek·dejte mi
따뜻한 라떼 두 잔 주세요|ttatteutan ratte du jan juseyo|Dvě horká latte, prosím.|horké·latte·dva·šálky·dejte mi
여기서 드세요?|yeogiseo deuseyo?|Budete tady?|tady·budete jíst/pít
포장해 주세요|pojanghae juseyo|S sebou, prosím.|zabalte·prosím
케이크 하나 주세요|keikeu hana juseyo|Jeden dort, prosím.|dort·jeden·dejte mi
빵 두 개 주세요|ppang du gae juseyo|Dvě pečiva, prosím.|pečivo·dva·kusy·dejte mi
몇 명이에요?|myeot myeongieyo?|Kolik vás je?|kolik·je osob
두 명이에요|du myeongieyo|Jsme dva.|dva·je osob
맥주 세 병 주세요|maekju se byeong juseyo|Tři lahve piva, prosím.|pivo·tři·láhve·dejte mi
설탕 빼 주세요|seoltang ppae juseyo|Bez cukru, prosím.|cukr·vynechte·prosím
큰 거 주세요|keun geo juseyo|Velké, prosím.|velká·věc·dejte mi
여기 앉아도 돼요?|yeogi anjado dwaeyo?|Můžu si sem sednout?|tady·když si sednu·jde to
주문할게요|jumunhalgeyo|Chci si objednat.|objednám si`,
  grammar: [
    { t: 'Dvě sady čísel', x: 'Domácí čísla 하나, 둘, 셋… slouží k počítání kusů, lidí, šálků a hodin. Sino-čísla 일, 이, 삼… na peníze, minuty, telefon a patra.', ex: '커피 두 잔|keopi du jan|dvě kávy\n이천 원|icheon won|2 000 wonů' },
    { t: 'Počítadla 개, 잔, 병, 명', x: 'Věc + číslo + počítadlo: 커피 한 잔, 빵 두 개, 맥주 세 병, 두 명. Před počítadlem se zkracují: 하나 → 한, 둘 → 두, 셋 → 세, 넷 → 네.', ex: '한 잔|han jan|jeden šálek\n두 개|du gae|dva kusy\n세 명|se myeong|tři osoby\n네 병|ne byeong|čtyři láhve' },
    { t: 'Tady, nebo s sebou?', x: 'Obsluha se zeptá 여기서 드세요? (budete tady?) nebo 포장이세요? (s sebou?). Stačí odpovědět 여기서요 nebo 포장이요.', ex: '여기서요|yeogiseoyo|Tady.\n포장이요|pojangiyo|S sebou.' },
  ],
  dialog: {
    who: 'Barista', face: '🧑‍🍳',
    lines: `
A|어서 오세요. 주문하시겠어요?|eoseo oseyo. jumunhasigesseoyo?|Vítejte. Co si dáte?
>|아이스 아메리카노 두 잔 주세요|aiseu amerikano du jan juseyo|Dvě ledová americana, prosím.
A|사이즈는요?|saijeuneunyo?|A velikost?
>|큰 거 주세요|keun geo juseyo|Velké, prosím.
A|여기서 드세요?|yeogiseo deuseyo?|Budete tady?
>|아니요, 포장해 주세요|aniyo, pojanghae juseyo|Ne, s sebou, prosím.
A|구천 원이에요|gucheon wonieyo|Je to 9 000 wonů.
>|카드 돼요?|kadeu dwaeyo?|Můžu kartou?
A|네. 진동벨이 울리면 오세요|ne. jindongberi ullimyeon oseyo|Ano. Až bzučák zavibruje, přijďte.`,
  },
  culture: [
    'Ledové americano (zkráceně 아아) pijí Korejci i v zimě – je to skoro národní nápoj.',
    'V kavárnách často dostaneš bzučák (진동벨), který zavibruje, až je objednávka hotová. Nádobí po sobě vracíš na pult.',
  ],
});

STOP({
  id: 's7', line: 2, code: '203', ko: '광장시장', rr: 'gwangjangsijang', name: 'Trh Gwangjang', topic: 'Jídlo, chutě, chci', emoji: '🥞', scene: '🏮🥞🍶',
  intro: 'Gwangjang je nejstarší trh v Soulu: mungové placky, mini kimbap, tteokbokki. Objednej si u stánku a řekni, jak ti chutná.',
  words: `
음식|eumsik|jídlo (pokrm)|🍲
빈대떡|bindaetteok|mungová placka|🥞
떡볶이|tteokbokki|rýžové válečky v pálivé omáčce|🍢
마약김밥|mayakgimbap|mini kimbap „droga"|🍘|specialita trhu Gwangjang
만두|mandu|plněné taštičky|🥟
닭고기|dakgogi|kuřecí maso|🍗
돼지고기|dwaejigogi|vepřové|🥓
소고기|sogogi|hovězí|🐂
야채|yachae|zelenina|🥦
매워요|maewoyo|je to pálivé|🌶️
맛있어요|masisseoyo|je to dobré|😋
맛없어요|madeopseoyo|není to dobré|😖
달아요|darayo|je to sladké|🍭
먹어요|meogeoyo|jím|🍽️
마셔요|masyeoyo|piju|🥤
막걸리|makgeolli|rýžové víno makgeolli|🍶
젓가락|jeotgarak|hůlky|🥢
숟가락|sutgarak|lžíce|🥄
계산|gyesan|placení, účet|💳
배고파요|baegopayo|mám hlad|😩
배불러요|baebulleoyo|jsem najedený|😌
정말|jeongmal|opravdu|💯
많이|mani|hodně|📈
조금|jogeum|trochu|📉
이모|imo|teta (oslovení paní u stánku)|👵`,
  sents: `
빈대떡 하나 주세요|bindaetteok hana juseyo|Jednu mungovou placku, prosím.|placka·jednu·dejte mi
떡볶이 먹고 싶어요|tteokbokki meokgo sipeoyo|Chci ochutnat tteokbokki.|tteokbokki·jíst·chci
막걸리 마시고 싶어요|makgeolli masigo sipeoyo|Chci pít makgeolli.|makgeolli·pít·chci
안 맵게 해 주세요|an maepge hae juseyo|Nepálivé, prosím.|ne·pálivě·udělejte·prosím
이거 매워요?|igeo maewoyo?|Je tohle pálivé?|tohle·je pálivé
조금 매워요|jogeum maewoyo|Je to trochu pálivé.|trochu·je pálivé
정말 맛있어요!|jeongmal masisseoyo!|Je to fakt dobré!|opravdu·je dobré
배고파요|baegopayo|Mám hlad.|mám hlad
고기 안 먹어요|gogi an meogeoyo|Nejím maso.|maso·ne·jím
이모 계산해 주세요|imo gyesanhae juseyo|Paní, zaplatím, prosím.|teto·spočítejte·prosím
젓가락 주세요|jeotgarak juseyo|Hůlky, prosím.|hůlky·dejte mi
뭐 먹고 싶어요?|mwo meokgo sipeoyo?|Co chceš jíst?|co·jíst·chceš
만두를 먹어요|mandureul meogeoyo|Jím taštičky.|taštičky (předmět)·jím`,
  grammar: [
    { t: '을 / 를 = předmět (co)', x: 'Označuje, co jíš, piješ nebo kupuješ: 만두를 먹어요, 커피를 마셔요. Po souhlásce 을 (밥을), po samohlásce 를 (만두를). V mluvě se často vynechá.', ex: '밥을 먹어요|babeul meogeoyo|Jím rýži.\n커피를 마셔요|keopireul masyeoyo|Piju kávu.' },
    { t: '-고 싶어요 = chci (něco dělat)', x: 'Přidej ke kmeni slovesa (slovníkový tvar bez -다): 먹다 → 먹고 싶어요 (chci jíst), 마시다 → 마시고 싶어요 (chci pít), 가다 → 가고 싶어요 (chci jít).', ex: '먹고 싶어요|meokgo sipeoyo|Chci jíst.\n집에 가고 싶어요|jibe gago sipeoyo|Chci jít domů.' },
    { t: '안 = ne', x: 'Dej 안 před sloveso nebo přídavné jméno: 안 먹어요 (nejím), 안 매워요 (není pálivé), 안 가요 (nejdu).', ex: '안 매워요|an maewoyo|Není to pálivé.\n술 안 마셔요|sul an masyeoyo|Nepiju alkohol.' },
  ],
  dialog: {
    who: 'Paní u stánku', face: '👵',
    lines: `
A|어서 와요! 뭐 줄까요?|eoseo wayo! mwo julkkayo?|Pojď dál! Co ti dám?
>|이모, 빈대떡 하나 주세요|imo, bindaetteok hana juseyo|Paní, jednu mungovou placku, prosím.
A|막걸리도 줄까요?|makgeollido julkkayo?|Dáš si k tomu makgeolli?
>|네, 막걸리 한 잔 주세요|ne, makgeolli han jan juseyo|Ano, jednu sklenku makgeolli.
A|떡볶이는요? 조금 매워요|tteokbokkineunyo? jogeum maewoyo|A tteokbokki? Je trochu pálivé.
>|안 맵게 해 주세요|an maepge hae juseyo|Nepálivé, prosím.
A|맛있어요?|masisseoyo?|Chutná?
>|정말 맛있어요!|jeongmal masisseoyo!|Je to fakt dobré!
A|많이 먹어요!|mani meogeoyo!|Jez hodně!
>|계산해 주세요|gyesanhae juseyo|Zaplatím, prosím.`,
  },
  culture: [
    'Paní u stánku nebo v malé restauraci oslovíš 이모 (teta), majitele 사장님 (šéfe). Na obsluhu se nahlas volá 저기요!',
    'Hůlky nikdy nezapichuj do rýže (připomíná to pohřební obřad) a misku nezvedej k ústům – jí se lžící z misky na stole.',
  ],
});

STOP({
  id: 's8', line: 2, code: '204', ko: '경복궁', rr: 'gyeongbokgung', name: 'Palác Gyeongbokgung', topic: 'Kde to je · směry', emoji: '🏯', scene: '🏯👘📸',
  intro: 'Největší soulský palác. Najdi pokladnu, toalety a cestu – nauč se, kde co je a kudy jít.',
  words: `
아래|arae|dole, pod|🔻
앞|ap|před, vpředu|🔼
뒤|dwi|za, vzadu|🔙
옆|yeop|vedle|↔️
안|an|uvnitř|📥
밖|bak|venku|📤
오른쪽|oreunjjok|vpravo|👉
왼쪽|oenjjok|vlevo|🫲
쭉|jjuk|pořád (rovně)|⬆️
가세요|gaseyo|jděte|🚶‍♂️
궁|gung|palác|🏯
문|mun|brána, dveře|⛩️
입구|ipgu|vchod|🚶‍♀️
매표소|maepyoso|pokladna|🎟️
한복|hanbok|hanbok (korejský kroj)|👘
사진|sajin|fotka|🖼️
찍어요|jjigeoyo|fotím|📷
근처|geuncheo|okolí, poblíž|🧭
건물|geonmul|budova|🏛️
길|gil|cesta, ulice|🛣️
은행|eunhaeng|banka|🏦
식당|sikdang|restaurace, jídelna|🍜
가게|gage|obchod|🏬
정류장|jeongnyujang|zastávka|🚏
건너편|geonneopyeon|naproti (přes ulici)|🔄
무료|muryo|zdarma|🆓
그리고|geurigo|a, a potom|🔗`,
  sents: `
화장실이 어디 있어요?|hwajangsiri eodi isseoyo?|Kde jsou toalety?|toaleta (podmět)·kde·je
매표소는 입구 옆에 있어요|maepyosoneun ipgu yeope isseoyo|Pokladna je vedle vchodu.|pokladna (téma)·vchod·vedle·je
오른쪽으로 가세요|oreunjjogeuro gaseyo|Jděte doprava.|doprava·jděte
왼쪽으로 가세요|oenjjogeuro gaseyo|Jděte doleva.|doleva·jděte
쭉 가세요|jjuk gaseyo|Jděte pořád rovně.|pořád·jděte
식당이 근처에 있어요?|sikdangi geuncheoe isseoyo?|Je tu poblíž restaurace?|restaurace (podmět)·poblíž·je
은행 건너편에 있어요|eunhaeng geonneopyeone isseoyo|Je to naproti bance.|banka·naproti·je
사진 찍어 주세요|sajin jjigeo juseyo|Vyfoťte nás, prosím.|fotku·vyfoťte·prosím
여기서 사진 찍어도 돼요?|yeogiseo sajin jjigeodo dwaeyo?|Můžu tu fotit?|tady·fotku·když vyfotím·jde to
한복 입으면 무료예요|hanbok ibeumyeon muryoyeyo|V hanboku je vstup zdarma.|hanbok·když obleču·je zdarma
문 앞에서 만나요|mun apeseo mannayo|Sejdeme se před bránou.|brána·před·sejdeme se
버스 정류장이 어디예요?|beoseu jeongnyujangi eodiyeyo?|Kde je autobusová zastávka?|autobus·zastávka (podmět)·kde je`,
  grammar: [
    { t: 'Místo + 에 있어요', x: 'Kde něco je: [věc]이/가 [místo]에 있어요. Se směrovými slovy: 입구 옆에 (vedle vchodu), 은행 앞에 (před bankou), 건물 뒤에 (za budovou), 가방 안에 (v tašce).', ex: '은행 앞에 있어요|eunhaeng ape isseoyo|Je to před bankou.\n가방 안에 있어요|gabang ane isseoyo|Je to v tašce.' },
    { t: '-(으)로 = směrem', x: '오른쪽으로 가세요 (jděte doprava), 왼쪽으로 (doleva). Po samohlásce a ㄹ jen -로: 이쪽으로 (tudy), 저쪽으로 (tamtudy).', ex: '이쪽으로 오세요|ijjogeuro oseyo|Pojďte tudy.\n왼쪽으로 가세요|oenjjogeuro gaseyo|Jděte doleva.' },
    { t: '-(으)세요 = zdvořilý pokyn', x: '가세요 (jděte), 오세요 (pojďte), 보세요 (podívejte se). Uslyšíš to od každého, kdo ti radí cestu.', ex: '쭉 가세요|jjuk gaseyo|Jděte rovně.\n여기 보세요|yeogi boseyo|Podívejte se sem.' },
  ],
  dialog: {
    who: 'Informace', face: 'ℹ️',
    lines: `
>|실례합니다. 매표소가 어디 있어요?|sillyehamnida. maepyosoga eodi isseoyo?|Promiňte, kde je pokladna?
A|입구 옆에 있어요|ipgu yeope isseoyo|Vedle vchodu.
>|화장실은요?|hwajangsireunyo?|A toalety?
A|쭉 가세요. 그리고 오른쪽으로 가세요|jjuk gaseyo. geurigo oreunjjogeuro gaseyo|Jděte rovně a pak doprava.
>|사진 찍어도 돼요?|sajin jjigeodo dwaeyo?|Můžu fotit?
A|네, 괜찮아요|ne, gwaenchanayo|Ano, klidně.
>|감사합니다!|gamsahamnida!|Děkuji!`,
  },
  culture: [
    'V hanboku máš vstup do královských paláců zdarma. Půjčovny hanboků jsou hned u bran.',
    'Gyeongbokgung je v úterý zavřený. U brány Gwanghwamun se obvykle v 10:00 a 14:00 střídají stráže v historických uniformách.',
  ],
});

STOP({
  id: 's9', line: 2, code: '205', ko: '북촌', rr: 'bukchon', name: 'Bukchon', topic: 'Čas a dny', emoji: '🕘', scene: '🏘️🕘🗺️',
  intro: 'Prohlídka tradiční čtvrti Bukchon začíná v devět. Kolik je hodin, kdy a jaký je den?',
  words: `
시|si|hodina (na hodinách)|🕐
분|bun|minuta|⏱️
반|ban|půl|🌓
지금|jigeum|teď|⏰
몇 시예요?|myeot siyeyo|kolik je hodin?|🕰️
오전|ojeon|dopoledne|🌅
오후|ohu|odpoledne|🌇
저녁|jeonyeok|večer / večeře|🌆
밤|bam|noc|🦉
오늘|oneul|dnes|📍
내일|naeil|zítra|➡️
어제|eoje|včera|⬅️
주말|jumal|víkend|🎉
월요일|woryoil|pondělí|🌙|월 = měsíc
화요일|hwayoil|úterý|🔥|화 = oheň
수요일|suyoil|středa|💧|수 = voda
목요일|mogyoil|čtvrtek|🌳|목 = dřevo
금요일|geumyoil|pátek|🥇|금 = kov, zlato
토요일|toyoil|sobota|🪨|토 = země
일요일|iryoil|neděle|☀️|일 = slunce
언제|eonje|kdy|📆
시간|sigan|čas / hodina (doba)|⌛
부터|buteo|od|▶️
까지|kkaji|do|⏹️
일찍|iljjik|brzy|🐓
늦어요|neujeoyo|jdu pozdě / je pozdě|🐢
만나요|mannayo|setkáme se|🫂
일어나요|ireonayo|vstávám|🌄
시작해요|sijakaeyo|začíná, začínám|🏁
투어|tueo|prohlídka (tour)|🚩`,
  sents: `
지금 몇 시예요?|jigeum myeot siyeyo?|Kolik je teď hodin?|teď·kolik·je hodin
아홉 시예요|ahop siyeyo|Je devět hodin.|devět·je hodin
열 시 반이에요|yeol si banieyo|Je půl jedenácté (10:30).|deset·hodin·je půl
세 시 이십 분이에요|se si isip bunieyo|Je 3:20.|tři·hodiny·dvacet·je minut
투어는 아홉 시에 시작해요|tueoneun ahop sie sijakaeyo|Prohlídka začíná v devět.|prohlídka (téma)·devět·v hodin·začíná
몇 시에 만나요?|myeot sie mannayo?|V kolik se sejdeme?|kolik·v hodin·sejdeme se
몇 시에 일어나요?|myeot sie ireonayo?|V kolik vstáváš?|kolik·v hodin·vstáváš
오늘은 수요일이에요|oneureun suyoirieyo|Dnes je středa.|dnes (téma)·je středa
내일 에버랜드에 가요|naeil ebeoraendeue gayo|Zítra jedeme do Everlandu.|zítra·do Everlandu·jedeme
오전 열 시부터 밤 열 시까지예요|ojeon yeol sibuteo bam yeol sikkajiyeyo|Je to od 10 dopoledne do 10 večer.|dopoledne·deset·od hodin·noc·deset·je do hodin
늦어서 죄송합니다|neujeoseo joesonghamnida|Promiňte, že jdu pozdě.|protože jdu pozdě·omlouvám se
시간 있어요?|sigan isseoyo?|Máš čas?|čas·je
주말에 뭐 해요?|jumare mwo haeyo?|Co děláš o víkendu?|o víkendu·co·děláš`,
  grammar: [
    { t: 'Hodiny domácími, minuty sino', x: '한 시, 두 시, 세 시 … 열두 시 (domácí čísla) + 오 분, 십 분, 삼십 분 (sino-čísla). 7:30 = 일곱 시 삼십 분, nebo jednoduše 일곱 시 반.', ex: '한 시|han si|1:00\n일곱 시 반|ilgop si ban|7:30\n열두 시 십오 분|yeoldu si sibo bun|12:15' },
    { t: '에 = v (čas)', x: 'Časový údaj + 에: 아홉 시에 (v devět), 월요일에 (v pondělí), 주말에 (o víkendu). Ale 오늘, 내일, 어제, 지금 jsou bez 에.', ex: '아홉 시에 만나요|ahop sie mannayo|Sejdeme se v devět.\n내일 가요|naeil gayo|Jedu zítra.' },
    { t: '부터 … 까지 = od … do', x: '열 시부터 열 시까지 = od deseti do deseti. Funguje i pro místa: 서울부터 부산까지 = ze Soulu do Pusanu.', ex: '월요일부터 금요일까지|woryoilbuteo geumyoilkkaji|od pondělí do pátku' },
  ],
  dialog: {
    who: 'Průvodce', face: '🧑‍💼',
    lines: `
A|안녕하세요! 투어 예약하셨어요?|annyeonghaseyo! tueo yeyakasyeosseoyo?|Dobrý den! Máte rezervaci na prohlídku?
>|네, 두 명이에요|ne, du myeongieyo|Ano, jsme dva.
A|좋아요. 아홉 시에 시작해요|joayo. ahop sie sijakaeyo|Dobře. Začínáme v devět.
>|지금 몇 시예요?|jigeum myeot siyeyo?|Kolik je teď hodin?
A|여덟 시 오십 분이에요|yeodeol si osip bunieyo|Je 8:50.
>|투어는 몇 시까지예요?|tueoneun myeot sikkajiyeyo?|Do kolika je prohlídka?
A|열두 시 반까지예요|yeoldu si bankkajiyeyo|Do půl jedné.
>|감사합니다!|gamsahamnida!|Děkuji!`,
  },
  culture: [
    'Korejci jsou dochvilní – na sraz s průvodcem přijď aspoň 10 minut předem.',
    'Dny v týdnu jsou podle živlů: 월 měsíc, 화 oheň, 수 voda, 목 dřevo, 금 kov, 토 země, 일 slunce. Bukchon je obydlená čtvrť – mluv tam potichu.',
  ],
});

STOP({
  id: 's10', line: 3, code: '301', ko: '명동', rr: 'myeongdong', name: 'Myeongdong', topic: 'Nákupy a barvy', emoji: '🛍️', scene: '🛍️💄👕',
  intro: 'Kosmetika, oblečení, pouliční jídlo. Zeptej se na cenu, barvu a velikost – a zkus usmlouvat.',
  words: `
그거|geugeo|to (u tebe)|🫵
저거|jeogeo|tamto|☝️
티셔츠|tisyeocheu|tričko|👕
신발|sinbal|boty|👟
화장품|hwajangpum|kosmetika|💄
선물|seonmul|dárek|🎁
싸요|ssayo|je to levné|🤑
커요|keoyo|je to velké|🐘
작아요|jagayo|je to malé|🐭
예뻐요|yeppeoyo|je to hezké|😍
너무|neomu|moc, příliš|❗
색|saek|barva|🎨
빨간색|ppalgansaek|červená|🔴
파란색|paransaek|modrá|🔵
검은색|geomeunsaek|černá|⚫
흰색|huinsaek|bílá|⚪
노란색|noransaek|žlutá|🟡
초록색|choroksaek|zelená|🟢
사이즈|saijeu|velikost|📏
깎아 주세요|kkakka juseyo|slevte mi, prosím|✂️
할인|harin|sleva|🏷️
봉투|bongtu|taška (igelitka)|🛒
면세|myeonse|tax free (bez daně)|🧾
사요|sayo|kupuji|💸
다른|dareun|jiný|🔀
그냥|geunyang|jen tak|🤷`,
  sents: `
너무 비싸요|neomu bissayo|To je moc drahé.|moc·je drahé
조금 깎아 주세요|jogeum kkakka juseyo|Slevte trochu, prosím.|trochu·slevte·prosím
다른 색 있어요?|dareun saek isseoyo?|Máte jinou barvu?|jiná·barva·je
파란색 있어요?|paransaek isseoyo?|Máte modrou?|modrá·je
더 큰 사이즈 있어요?|deo keun saijeu isseoyo?|Máte větší velikost?|víc·velká·velikost·je
입어 봐도 돼요?|ibeo bwado dwaeyo?|Můžu si to zkusit?|obléct·když zkusím·jde to
이거 너무 작아요|igeo neomu jagayo|Tohle je moc malé.|tohle·moc·je malé
예뻐요!|yeppeoyo!|To je hezké!|je hezké
이거 살게요|igeo salgeyo|Tohle si vezmu.|tohle·koupím
선물이에요|seonmurieyo|Je to dárek.|je dárek
봉투 필요하세요?|bongtu piryohaseyo?|Potřebujete tašku?|taška·potřebujete
면세 돼요?|myeonse dwaeyo?|Jde to bez daně?|tax free·jde to
그냥 구경하는 거예요|geunyang gugyeonghaneun geoyeyo|Jen se dívám.|jen·prohlížení·to je`,
  grammar: [
    { t: '이거 / 그거 / 저거', x: '이거 = tohle (u mě), 그거 = to (u tebe), 저거 = tamto (daleko od nás obou). Před podstatným jménem jen 이 / 그 / 저: 이 티셔츠 = toto tričko. Stejně 여기 / 거기 / 저기.', ex: '저거 얼마예요?|jeogeo eolmayeyo?|Kolik stojí tamto?\n이 티셔츠 주세요|i tisyeocheu juseyo|Toto tričko, prosím.' },
    { t: 'Přídavná jména jsou slovesa', x: 'Korejské „být drahý" je jedno slovo: 비싸요 = je to drahé. Žádné „je" navíc: 이거 비싸요 (tohle je drahé), 이거 예뻐요 (tohle je hezké).', ex: '방이 커요|bangi keoyo|Pokoj je velký.\n신발이 작아요|sinbari jagayo|Boty jsou malé.' },
    { t: '-(으)ㄹ게요 = udělám (rozhodnutí)', x: 'Když se rozhodneš: 이거 살게요 (tohle si vezmu), 주문할게요 (objednám si), 갈게요 (půjdu).', ex: '이거 살게요|igeo salgeyo|Tohle si koupím.\n다시 올게요|dasi olgeyo|Ještě se vrátím.' },
  ],
  dialog: {
    who: 'Prodavačka', face: '💁‍♀️',
    lines: `
A|어서 오세요!|eoseo oseyo!|Vítejte!
>|이 티셔츠 얼마예요?|i tisyeocheu eolmayeyo?|Kolik stojí tohle tričko?
A|이만 원이에요|iman wonieyo|20 000 wonů.
>|다른 색 있어요?|dareun saek isseoyo?|Máte jinou barvu?
A|네, 검은색하고 흰색 있어요|ne, geomeunsaekhago huinsaek isseoyo|Ano, černou a bílou.
>|검은색 주세요. 조금 깎아 주세요|geomeunsaek juseyo. jogeum kkakka juseyo|Černou, prosím. A trochu slevte.
A|그럼 만 팔천 원이요|geureom man palcheon woniyo|Tak 18 000 wonů.
>|좋아요, 이거 살게요!|joayo, igeo salgeyo!|Dobře, beru!`,
  },
  culture: [
    'Smlouvat se dá na trzích a u stánků, ne v řetězcích a obchodech s kosmetikou.',
    'Turisté můžou nakupovat bez DPH (tax free) – stačí ukázat pas. V označených obchodech se daň často odečte rovnou u pokladny.',
  ],
});

STOP({
  id: 's11', line: 3, code: '302', ko: '에버랜드', rr: 'ebeoraendeu', name: 'Everland', topic: 'Slovesa v přítomném čase', emoji: '🎢', scene: '🎢🐼🎡',
  intro: 'Zábavní park Everland: horské dráhy, safari, pandy. Tady pochopíš, jak fungují korejská slovesa.',
  words: `
해요|haeyo|dělám (하다)|🛠️
봐요|bwayo|dívám se, vidím (보다)|👀
놀아요|norayo|bavím se, hraju si (놀다)|🎠
기다려요|gidaryeoyo|čekám (기다리다)|⏳
읽어요|ilgeoyo|čtu (읽다)|📖
들어요|deureoyo|poslouchám (듣다)|🎧
알아요|arayo|vím, znám (알다)|💡
몰라요|mollayo|nevím, neznám (모르다)|🤷‍♂️
줄|jul|fronta, řada|🧍
길어요|gireoyo|je to dlouhé|📜
놀이기구|norigigu|atrakce|🎡
롤러코스터|rolleokoseuteo|horská dráha|🎢
동물|dongmul|zvíře|🦒
판다|panda|panda|🐼
재미있어요|jaemiisseoyo|je to zábavné|🤩
재미없어요|jaemieopseoyo|je to nuda|😑
무서워요|museowoyo|je to strašidelné / bojím se|😱
신나요|sinnayo|je to super, vzrušující|🥳
많아요|manayo|je toho hodně|🐜
같이|gachi|spolu|👫|čte se [가치]
또|tto|zase, znovu|🔁
빨리|ppalli|rychle|⚡
천천히|cheoncheonhi|pomalu|🐌
얼마나|eolmana|jak (moc, dlouho)|❔
퍼레이드|peoreideu|průvod|🎊
불꽃놀이|bulkkonnori|ohňostroj|🎆|čte se [불꼰노리]
입장권|ipjanggwon|vstupenka|🎟️
그럼|geureom|tak, takže / jasně|👌`,
  sents: `
롤러코스터 타요!|rolleokoseuteo tayo!|Jdeme na horskou dráhu!|horská dráha·jedeme
줄이 길어요|juri gireoyo|Fronta je dlouhá.|fronta (podmět)·je dlouhá
얼마나 기다려요?|eolmana gidaryeoyo?|Jak dlouho se čeká?|jak dlouho·čekáme
삼십 분 기다려요|samsip bun gidaryeoyo|Čeká se 30 minut.|třicet·minut·čekáme
판다를 봐요|pandareul bwayo|Díváme se na pandy.|pandu (předmět)·vidíme
너무 무서워요!|neomu museowoyo!|To je strašně strašidelné!|moc·je strašidelné
정말 재미있어요|jeongmal jaemiisseoyo|Je to fakt zábava.|opravdu·je zábavné
사람이 많아요|sarami manayo|Je tu hodně lidí.|lidé (podmět)·je hodně
같이 사진 찍어요|gachi sajin jjigeoyo|Vyfoťme se spolu.|spolu·fotku·fotíme
에버랜드에서 놀아요|ebeoraendeueseo norayo|Bavíme se v Everlandu.|v Everlandu·bavíme se
또 타요!|tto tayo!|Jedeme znovu!|znovu·jedeme
저는 안 타요|jeoneun an tayo|Já nejedu.|já (téma)·ne·jedu
퍼레이드 몇 시예요?|peoreideu myeot siyeyo?|V kolik je průvod?|průvod·kolik·je hodin
빨리 가요!|ppalli gayo!|Pojď rychle!|rychle·jdeme`,
  grammar: [
    { t: 'Přítomný čas -아요 / -어요 / -해요', x: 'Vezmi kmen (slovesa bez -다). Je-li poslední samohláska ㅏ nebo ㅗ → -아요 (놀다 → 놀아요, 보다 → 봐요). Jinak → -어요 (먹다 → 먹어요, 마시다 → 마셔요). 하다 → 해요. Stejný tvar je oznámení, otázka i výzva: 가요! = jdeme!', ex: '가다 → 가요|gada → gayo|jít → jdu\n먹다 → 먹어요|meokda → meogeoyo|jíst → jím\n보다 → 봐요|boda → bwayo|vidět → vidím\n하다 → 해요|hada → haeyo|dělat → dělám' },
    { t: '에서 = kde se něco děje', x: '에 = kam jdu / kde něco je. 에서 = kde něco dělám: 에버랜드에 가요 (jedu do Everlandu), 에버랜드에서 놀아요 (bavím se v Everlandu).', ex: '카페에서 커피를 마셔요|kapeeseo keopireul masyeoyo|Piju kávu v kavárně.\n집에서 쉬어요|jibeseo swieoyo|Odpočívám doma.' },
    { t: '안 + sloveso = ne', x: '저는 안 타요 (nejedu). U sloves s 하다 se 안 vkládá dovnitř: 공부 안 해요 (nestuduju), 운동 안 해요 (necvičím).', ex: '안 가요|an gayo|Nejdu.\n운동 안 해요|undong an haeyo|Necvičím.' },
  ],
  dialog: {
    who: 'Kamarád', face: '🧑',
    lines: `
A|우와, 사람이 정말 많아요!|uwa, sarami jeongmal manayo!|Páni, je tu fakt hodně lidí!
>|롤러코스터 타요!|rolleokoseuteo tayo!|Pojďme na horskou dráhu!
A|줄이 길어요. 얼마나 기다려요?|juri gireoyo. eolmana gidaryeoyo?|Fronta je dlouhá. Jak dlouho se čeká?
>|삼십 분 기다려요|samsip bun gidaryeoyo|Čeká se 30 minut.
A|무서워요?|museowoyo?|Je to strašidelné?
>|네, 너무 무서워요!|ne, neomu museowoyo!|Jo, strašně!
A|그럼 판다를 봐요|geureom pandareul bwayo|Tak se pojďme podívat na pandy.
>|좋아요! 같이 가요|joayo! gachi gayo|Super! Pojďme spolu.`,
  },
  culture: [
    'Do Everlandu jezdí z Jamsilu autobus 5700A (asi hodinu). Čekací doby na atrakce uvidíš v aplikaci parku.',
    'Korejci milují společné fotky a selfie (셀카). Neboj se požádat: 사진 찍어 주세요!',
  ],
});

STOP({
  id: 's12', line: 3, code: '303', ko: '한강', rr: 'hangang', name: 'Řeka Han', topic: 'Počasí a pocity', emoji: '🌉', scene: '🌉🌇⛴️',
  intro: 'Plavba po řece Han při západu slunce. Jaké je počasí a jak se cítíš?',
  words: `
날씨|nalssi|počasí|🌤️
추워요|chuwoyo|je zima|🥶
더워요|deowoyo|je horko|🥵
따뜻해요|ttatteutaeyo|je teplo|🌡️
시원해요|siwonhaeyo|je příjemně chladno|🍃
바람|baram|vítr|💨
불어요|bureoyo|fouká|🌬️
눈|nun|sníh / oko|❄️
비가 와요|biga wayo|prší|☔
흐려요|heuryeoyo|je zataženo|☁️
맑아요|malgayo|je jasno|🌞
우산|usan|deštník|☂️
코트|koteu|kabát|🧥
입어요|ibeoyo|oblékám si|👔
좋아요|joayo|je to dobré, super|👍
나빠요|nappayo|je to špatné|👎
싫어요|sireoyo|nechci / nemám rád|😤
피곤해요|pigonhaeyo|jsem unavený|😴
행복해요|haengbokaeyo|jsem šťastný|😊
기분|gibun|nálada|🎭
어때요?|eottaeyo|jaké to je? / co ty na to?|🤨
멋있어요|meosisseoyo|je to úžasné, cool|😎
아름다워요|areumdawoyo|je to krásné|🌸
야경|yagyeong|noční výhled|🌃
노을|noeul|západ slunce, červánky|🌇
그런데|geureonde|ale, mimochodem|↪️
그래서|geuraeseo|a tak, proto|⏩
진짜|jinjja|fakt, opravdu (hovorově)|‼️
자요|jayo|spím (자다)|🛌`,
  sents: `
오늘 날씨가 좋아요|oneul nalssiga joayo|Dnes je hezky.|dnes·počasí (podmět)·je dobré
너무 추워요!|neomu chuwoyo!|Je hrozná zima!|moc·je zima
바람이 많이 불어요|barami mani bureoyo|Hodně fouká.|vítr (podmět)·hodně·fouká
내일 비가 와요?|naeil biga wayo?|Bude zítra pršet?|zítra·déšť (podmět)·přichází
우산 있어요?|usan isseoyo?|Máš deštník?|deštník·je
야경이 정말 아름다워요|yagyeongi jeongmal areumdawoyo|Noční výhled je nádherný.|noční výhled (podmět)·opravdu·je krásný
기분이 좋아요|gibuni joayo|Mám dobrou náladu.|nálada (podmět)·je dobrá
조금 피곤해요|jogeum pigonhaeyo|Jsem trochu unavený.|trochu·jsem unavený
추워요 그래서 코트를 입어요|chuwoyo geuraeseo koteureul ibeoyo|Je zima, tak si beru kabát.|je zima·proto·kabát (předmět)·oblékám si
배가 예뻐요 그런데 비싸요|baega yeppeoyo geureonde bissayo|Loď je hezká, ale drahá.|loď (podmět)·je hezká·ale·je drahá
진짜 멋있어요!|jinjja meosisseoyo!|To je fakt úžasné!|fakt·je úžasné
노을이 예뻐요|noeuri yeppeoyo|Západ slunce je krásný.|západ slunce (podmět)·je hezký`,
  grammar: [
    { t: 'Pocity a počasí bez „já"', x: '추워요 znamená „je zima" i „je mi zima". Podmět se vynechává – z kontextu je jasné, že mluvíš o sobě: 피곤해요 = jsem unavený.', ex: '더워요|deowoyo|Je horko. / Je mi horko.\n배고파요|baegopayo|Mám hlad.' },
    { t: 'Nepravidelné ㅂ', x: 'Slova na -ㅂ다 mění ㅂ na 워: 춥다 → 추워요, 덥다 → 더워요, 맵다 → 매워요, 아름답다 → 아름다워요. Už je znáš!', ex: '춥다 → 추워요|chupda → chuwoyo|být zima\n맵다 → 매워요|maepda → maewoyo|být pálivý' },
    { t: '그리고 / 그런데 / 그래서', x: 'Spojky na začátku věty: 그리고 = a (potom), 그런데 = ale / mimochodem, 그래서 = a tak, proto.', ex: '피곤해요 그래서 자요|pigonhaeyo geuraeseo jayo|Jsem unavený, tak jdu spát.\n싸요 그런데 맛있어요|ssayo geureonde masisseoyo|Je to levné, ale dobré.' },
  ],
  dialog: {
    who: 'Kamarád', face: '🧑',
    lines: `
A|와, 노을 봐요!|wa, noeul bwayo!|Páni, podívej na ten západ slunce!
>|진짜 아름다워요!|jinjja areumdawoyo!|Fakt nádhera!
A|그런데 좀 추워요|geureonde jom chuwoyo|Ale je trochu zima.
>|네, 바람이 많이 불어요|ne, barami mani bureoyo|Jo, hodně fouká.
A|기분 어때요?|gibun eottaeyo?|Jak se cítíš?
>|기분이 좋아요. 그런데 조금 피곤해요|gibuni joayo. geureonde jogeum pigonhaeyo|Mám dobrou náladu, ale jsem trochu unavený.
A|그럼 오늘 일찍 자요|geureom oneul iljjik jayo|Tak dnes půjdeme brzy spát.
>|좋아요!|joayo!|Dobře!`,
  },
  culture: [
    'Na konci listopadu bývá v Soulu zhruba 0–10 °C a večer u řeky fouká – vezmi si teplou bundu.',
    'Typický zážitek: ve večerce u řeky si v automatu uvaříš instantní ramyeon a sníš ho na břehu.',
  ],
});

STOP({
  id: 's13', line: 3, code: '304', ko: 'N서울타워', rr: 'en seoul tawo', name: 'N Seoul Tower', topic: 'Minulý čas', emoji: '🗼', scene: '🗼🔭🔒',
  intro: 'Z vyhlídky vidíš celé město. A povídáš si, co jste dělali včera – minulý čas.',
  words: `
타워|tawo|věž|🗼
전망대|jeonmangdae|vyhlídka|🔭
케이블카|keibeulka|lanovka|🚡
자물쇠|jamulsoe|visací zámek|🔒
올라가요|ollagayo|jdu nahoru|⏫
내려가요|naeryeogayo|jdu dolů|⏬
걸어서|georeoseo|pěšky|🥾
힘들어요|himdeureoyo|je to náročné|😮‍💨
했어요|haesseoyo|dělal jsem (하다)|✅
갔어요|gasseoyo|šel jsem, byl jsem (가다)|🧳
먹었어요|meogeosseoyo|jedl jsem (먹다)|🍴
봤어요|bwasseoyo|viděl jsem (보다)|👁️
마셨어요|masyeosseoyo|pil jsem (마시다)|🍹
샀어요|sasseoyo|koupil jsem (사다)|🛍️
잤어요|jasseoyo|spal jsem (자다)|💤
좋았어요|joasseoyo|bylo to dobré|🌟
재미있었어요|jaemiisseosseoyo|byla to zábava|🎉
아까|akka|před chvílí|⏪
처음|cheoeum|poprvé / začátek|🥇
벌써|beolsseo|už (tak brzy)|⏩
아직|ajik|ještě (ne)|⏳
다|da|všechno|💯
잘|jal|dobře|✨
경치|gyeongchi|výhled, scenérie|🏞️
도시|dosi|město|🌆
지난주|jinanju|minulý týden|🔙
작년|jangnyeon|loni|📅|čte se [장년]`,
  sents: `
어제 뭐 했어요?|eoje mwo haesseoyo?|Co jsi dělal včera?|včera·co·dělal jsi
에버랜드에 갔어요|ebeoraendeue gasseoyo|Byl jsem v Everlandu.|do Everlandu·šel jsem
판다를 봤어요|pandareul bwasseoyo|Viděl jsem pandy.|pandu (předmět)·viděl jsem
정말 재미있었어요|jeongmal jaemiisseosseoyo|Byla to fakt zábava.|opravdu·bylo zábavné
아침에 뭐 먹었어요?|achime mwo meogeosseoyo?|Co jsi měl k snídani?|ráno·co·jedl jsi
김밥 먹었어요|gimbap meogeosseoyo|Jedl jsem kimbap.|kimbap·jedl jsem
케이블카 탔어요?|keibeulka tasseoyo?|Jel jsi lanovkou?|lanovka·jel jsi
아니요 걸어서 올라갔어요|aniyo georeoseo ollagasseoyo|Ne, šel jsem nahoru pěšky.|ne·pěšky·vyšel jsem
조금 힘들었어요|jogeum himdeureosseoyo|Bylo to trochu náročné.|trochu·bylo náročné
경치가 정말 좋아요|gyeongchiga jeongmal joayo|Výhled je opravdu skvělý.|výhled (podmět)·opravdu·je dobrý
서울에 처음 왔어요|seoure cheoeum wasseoyo|Jsem v Soulu poprvé.|do Soulu·poprvé·přišel jsem
선물 다 샀어요?|seonmul da sasseoyo?|Koupil jsi už všechny dárky?|dárky·všechno·koupil jsi
아직 안 샀어요|ajik an sasseoyo|Ještě jsem nekoupil.|ještě·ne·koupil jsem
어제 잘 잤어요?|eoje jal jasseoyo?|Vyspal ses dobře?|včera·dobře·spal jsi`,
  grammar: [
    { t: 'Minulý čas -았어요 / -었어요 / -했어요', x: 'Stejné pravidlo jako přítomný čas, jen místo -요 přijde -ㅆ어요: 가요 → 갔어요, 먹어요 → 먹었어요, 해요 → 했어요, 봐요 → 봤어요.', ex: '가요 → 갔어요|gayo → gasseoyo|jdu → šel jsem\n먹어요 → 먹었어요|meogeoyo → meogeosseoyo|jím → jedl jsem\n해요 → 했어요|haeyo → haesseoyo|dělám → dělal jsem' },
    { t: 'Je → bylo', x: 'Funguje i u přídavných jmen: 좋아요 → 좋았어요 (bylo dobré), 재미있어요 → 재미있었어요 (byla zábava), 추워요 → 추웠어요 (byla zima).', ex: '추웠어요|chuwosseoyo|Byla zima.\n맛있었어요|masisseosseoyo|Bylo to dobré.' },
    { t: '아직 / 벌써', x: '아직 안 … = ještě ne: 아직 안 먹었어요 (ještě jsem nejedl). 벌써 = už (dřív, než se čekalo): 벌써 다 했어요? (už máš všechno hotové?).', ex: '아직 안 왔어요|ajik an wasseoyo|Ještě nepřišel.\n벌써 열 시예요|beolsseo yeol siyeyo|Už je deset.' },
  ],
  dialog: {
    who: 'Paní na vyhlídce', face: '👩',
    lines: `
A|서울에 처음 왔어요?|seoure cheoeum wasseoyo?|Jste v Soulu poprvé?
>|네, 처음 왔어요|ne, cheoeum wasseoyo|Ano, poprvé.
A|어제 뭐 했어요?|eoje mwo haesseoyo?|Co jste dělal včera?
>|에버랜드에 갔어요. 정말 재미있었어요|ebeoraendeue gasseoyo. jeongmal jaemiisseosseoyo|Byl jsem v Everlandu. Byla to fakt zábava.
A|케이블카 탔어요?|keibeulka tasseoyo?|Jel jste lanovkou?
>|아니요, 걸어서 올라갔어요|aniyo, georeoseo ollagasseoyo|Ne, šel jsem nahoru pěšky.
A|와, 힘들었어요?|wa, himdeureosseoyo?|Páni, bylo to náročné?
>|조금 힘들었어요. 그런데 경치가 정말 좋아요!|jogeum himdeureosseoyo. geureonde gyeongchiga jeongmal joayo!|Trochu. Ale ten výhled je skvělý!`,
  },
  culture: [
    'Na terase věže visí tisíce „zámků lásky" – páry je zamykají jako slib.',
    'Nahoru vede lanovka z Myeongdongu, nebo se dá jít pěšky parkem Namsan (zhruba 30–40 minut do kopce).',
  ],
});

STOP({
  id: 's14', line: 3, code: '305', ko: '이태원', rr: 'itaewon', name: 'Itaewon večer', topic: 'Seznámení, rodina, koníčky', emoji: '🌈', scene: '🌈🍸💃',
  intro: 'Večer v Itaewonu a Haebangchonu: bary, hudba, noví známí. Řekni, kdo jsi, co máš rád a odkud jsi.',
  words: `
좋아해요|joahaeyo|mám rád (좋아하다)|❤️
싫어해요|sireohaeyo|nemám rád|💔
사랑해요|saranghaeyo|miluju (tě)|🥰
취미|chwimi|koníček|🎯
음악|eumak|hudba|🎶|čte se [으막]
영화|yeonghwa|film|🎬
운동|undong|sport, cvičení|🏋️
춤|chum|tanec|💃
가족|gajok|rodina|👨‍👩‍👦
엄마|eomma|máma|🤱
아빠|appa|táta|👨
형|hyeong|starší bratr (říká muž)|🧔
누나|nuna|starší sestra (říká muž)|👱‍♀️
동생|dongsaeng|mladší sourozenec|🧒
형제|hyeongje|sourozenci|👬
남자|namja|muž|🚹
나이|nai|věk|🎂
살|sal|rok (věku)|🕯️
스물|seumul|dvacet (domácí)|🔟
서른|seoreun|třicet (domácí)|🧮
생일 축하해요|saengil chukahaeyo|všechno nejlepší k narozeninám|🎈
일해요|ilhaeyo|pracuji|💼
공부해요|gongbuhaeyo|studuji|📚
영어|yeongeo|angličtina|🇬🇧
말해요|malhaeyo|mluvím, říkám|🗣️
하고|hago|a, s (spojuje jména)|➰
도|do|také|🔂
무슨|museun|jaký, co za|🧩
술|sul|alkohol|🍸
건배|geonbae|na zdraví! (přípitek)|🥂
연락처|yeollakcheo|kontakt|📇
진짜요?|jinjjayo|fakt?|😮
저도요|jeodoyo|já taky|🙋‍♀️`,
  sents: `
취미가 뭐예요?|chwimiga mwoyeyo?|Jaký máš koníček?|koníček (podmět)·co je
저는 여행을 좋아해요|jeoneun yeohaengeul joahaeyo|Rád cestuju.|já (téma)·cestování (předmět)·mám rád
음악하고 춤을 좋아해요|eumakhago chumeul joahaeyo|Mám rád hudbu a tanec.|hudba a·tanec (předmět)·mám rád
저도요!|jeodoyo!|Já taky!|já taky
몇 살이에요?|myeot sarieyo?|Kolik ti je?|kolik·je let
서른 살이에요|seoreun sarieyo|Je mi třicet.|třicet·je let
한국어 조금 해요|hangugeo jogeum haeyo|Mluvím trochu korejsky.|korejština·trochu·dělám
한국어를 잘 못해요|hangugeoreul jal motaeyo|Neumím moc dobře korejsky.|korejštinu (předmět)·dobře·neumím
형제가 있어요?|hyeongjega isseoyo?|Máš sourozence?|sourozenci (podmět)·jsou
형이 한 명 있어요|hyeongi han myeong isseoyo|Mám jednoho staršího bratra.|starší bratr (podmět)·jeden·osoba·je
무슨 일 해요?|museun il haeyo?|Co děláš za práci?|jaká·práce·děláš
건배!|geonbae!|Na zdraví!|na zdraví
연락처 주세요|yeollakcheo juseyo|Dej mi kontakt.|kontakt·dejte mi`,
  grammar: [
    { t: '좋아요 × 좋아해요', x: '좋아요 = je to dobré / líbí se mi to (věc je podmět). 좋아해요 = mám rád (já mám rád něco): 저는 음악을 좋아해요.', ex: '이거 좋아요|igeo joayo|Tohle je dobré.\n저는 커피를 좋아해요|jeoneun keopireul joahaeyo|Mám rád kávu.' },
    { t: '하고 = a, s · 도 = také', x: '하고 spojuje podstatná jména: 음악하고 춤 (hudba a tanec), 친구하고 가요 (jdu s kamarádem). 도 = také, nahradí 은/는, 이/가 i 을/를: 저도 (já taky), 커피도 (i kávu).', ex: '친구하고 왔어요|chinguhago wasseoyo|Přišel jsem s kamarádem.\n저도 좋아해요|jeodo joahaeyo|Já to mám taky rád.' },
    { t: 'Věk domácími čísly', x: '열 10, 스물 20, 서른 30, 마흔 40. Před 살 se zkracuje 스물 → 스무 a koncovky 하나 → 한, 둘 → 두, 셋 → 세, 넷 → 네: 스무 살, 스물두 살, 서른한 살.', ex: '스무 살|seumu sal|20 let\n서른다섯 살|seoreundaseot sal|35 let' },
  ],
  dialog: {
    who: 'Nový známý', face: '🧑‍🎤',
    lines: `
A|안녕하세요! 어느 나라 사람이에요?|annyeonghaseyo! eoneu nara saramieyo?|Ahoj! Odkud jsi?
>|체코 사람이에요. 그런데 스페인에 살아요|cheko saramieyo. geureonde seupeine sarayo|Jsem z Česka, ale bydlím ve Španělsku.
A|와, 한국어 잘해요!|wa, hangugeo jalhaeyo!|Páni, mluvíš dobře korejsky!
>|아니에요, 조금 해요|anieyo, jogeum haeyo|Ale ne, jen trochu.
A|취미가 뭐예요?|chwimiga mwoyeyo?|Jaký máš koníček?
>|여행하고 음악을 좋아해요|yeohaenghago eumageul joahaeyo|Mám rád cestování a hudbu.
A|저도요! 건배!|jeodoyo! geonbae!|Já taky! Na zdraví!
>|건배!|geonbae!|Na zdraví!`,
  },
  culture: [
    'Při pití si nenalévej sám – nalije ti někdo jiný a ty jemu. Staršímu nalévej oběma rukama.',
    'Na pochvalu „한국어 잘해요!" se skromně odpovídá 아니에요 (ale ne) – i když mluvíš skvěle.',
  ],
});

STOP({
  id: 's15', line: 4, code: '401', ko: '약국', rr: 'yakguk', name: 'Lékárna', topic: 'Tělo a nouze', emoji: '⚕️', scene: '⚕️🤕🆘',
  intro: 'Bolí hlava po dlouhém dni? Nebo něco ztratíš? Tahle zastávka je pojistka pro nouzi.',
  words: `
약국|yakguk|lékárna|⚕️
약|yak|lék|💊
병원|byeongwon|nemocnice, klinika|🏥
아파요|apayo|bolí to / jsem nemocný|🤕
목|mok|krk|🧣
손|son|ruka|✋
발|bal|chodidlo|🦶
감기|gamgi|nachlazení|🤒
밴드|baendeu|náplast|🩹
알레르기|allereugi|alergie|🤧
땅콩|ttangkong|arašídy|🥜
도와주세요|dowajuseyo|pomoc! / pomozte mi|🆘
경찰|gyeongchal|policie|👮
불러 주세요|bulleo juseyo|zavolejte, prosím|📞
잃어버렸어요|ireobeoryeosseoyo|ztratil jsem|🔍
지갑|jigap|peněženka|👛
위험해요|wiheomhaeyo|je to nebezpečné|⚠️
조심하세요|josimhaseyo|buďte opatrní|🚧
괜찮으세요?|gwaenchaneuseyo|jste v pořádku?|🫶
대사관|daesagwan|velvyslanectví|🏛️
다시 한번|dasi hanbeon|ještě jednou|🔄
알겠어요|algesseoyo|rozumím, jasně|🫡
하루|haru|den (24 hodin)|🌞`,
  sents: `
머리가 아파요|meoriga apayo|Bolí mě hlava.|hlava (podmět)·bolí
배가 아파요|baega apayo|Bolí mě břicho.|břicho (podmět)·bolí
목이 아파요|mogi apayo|Bolí mě v krku.|krk (podmět)·bolí
열이 나요|yeori nayo|Mám horečku.|horečka (podmět)·vychází
감기약 주세요|gamgiyak juseyo|Něco na nachlazení, prosím.|lék na nachlazení·dejte mi
약국이 어디 있어요?|yakgugi eodi isseoyo?|Kde je lékárna?|lékárna (podmět)·kde·je
도와주세요!|dowajuseyo!|Pomoc!|pomozte mi
경찰 불러 주세요|gyeongchal bulleo juseyo|Zavolejte policii, prosím.|policie·zavolejte·prosím
지갑을 잃어버렸어요|jigabeul ireobeoryeosseoyo|Ztratil jsem peněženku.|peněženku (předmět)·ztratil jsem
천천히 말해 주세요|cheoncheonhi malhae juseyo|Mluvte pomalu, prosím.|pomalu·mluvte·prosím
다시 한번 말해 주세요|dasi hanbeon malhae juseyo|Řekněte to ještě jednou, prosím.|znovu·jednou·řekněte·prosím
이해 못 했어요|ihae mot haesseoyo|Nerozuměl jsem.|porozumění·nemohl·udělal jsem
영어 하는 사람 있어요?|yeongeo haneun saram isseoyo?|Je tu někdo, kdo mluví anglicky?|angličtina·mluvící·člověk·je
병원에 가야 돼요|byeongwone gaya dwaeyo|Musím do nemocnice.|do nemocnice·muset jít·je třeba
땅콩 알레르기가 있어요|ttangkong allereugiga isseoyo|Mám alergii na arašídy.|arašídy·alergie (podmět)·je`,
  grammar: [
    { t: '[část těla]이/가 아파요', x: 'Bolí mě…: 머리가 아파요 (hlava), 배가 아파요 (břicho), 목이 아파요 (krk). Samotné 아파요 = jsem nemocný / bolí to.', ex: '다리가 아파요|dariga apayo|Bolí mě noha.\n이가 아파요|iga apayo|Bolí mě zub.' },
    { t: '-아/어 주세요 = prosba o pomoc', x: 'Už znáš 가 주세요. Platí pro všechno: 도와주세요 (pomozte), 불러 주세요 (zavolejte), 말해 주세요 (řekněte), 기다려 주세요 (počkejte).', ex: '기다려 주세요|gidaryeo juseyo|Počkejte, prosím.\n써 주세요|sseo juseyo|Napište mi to, prosím.' },
    { t: '-아/어야 돼요 = musím', x: '가다 → 가야 돼요 (musím jít), 먹다 → 먹어야 돼요 (musím jíst), 하다 → 해야 돼요 (musím udělat).', ex: '가야 돼요|gaya dwaeyo|Musím jít.\n약을 먹어야 돼요|yageul meogeoya dwaeyo|Musím si vzít lék.' },
  ],
  dialog: {
    who: 'Lékárník', face: '👨‍⚕️',
    lines: `
A|어서 오세요. 어디가 아파요?|eoseo oseyo. eodiga apayo?|Dobrý den. Co vás bolí?
>|머리가 아파요|meoriga apayo|Bolí mě hlava.
A|열도 나요?|yeoldo nayo?|Máte i horečku?
>|아니요, 열은 없어요|aniyo, yeoreun eopseoyo|Ne, horečku nemám.
A|이 약 드세요. 하루에 세 번 드세요|i yak deuseyo. harue se beon deuseyo|Berte tenhle lék, třikrát denně.
>|천천히 말해 주세요|cheoncheonhi malhae juseyo|Mluvte pomalu, prosím.
A|하루에… 세… 번이요|harue… se… beoniyo|Denně… tři… krát.
>|네, 알겠어요. 감사합니다!|ne, algesseoyo. gamsahamnida!|Dobře, rozumím. Děkuji!`,
  },
  culture: [
    'Tísňová čísla: 112 policie, 119 záchranka a hasiči, 1330 turistická linka (anglicky, nonstop).',
    'Lékárnu poznáš podle velkého znaku 약. Na běžné potíže ti poradí bez receptu; základní léky a náplasti mají i večerky.',
  ],
});

STOP({
  id: 's16', line: 4, code: '402', ko: '창덕궁', rr: 'changdeokgung', name: 'Changdeokgung', topic: 'Plány · můžu / nemůžu', emoji: '🍁', scene: '🍁🏯🌿',
  intro: 'Tajná zahrada paláce Changdeokgung v podzimních barvách. Mluv o plánech: co uděláš, co můžeš a co nemůžeš.',
  words: `
정원|jeongwon|zahrada|🌿
비원|biwon|Tajná zahrada|🤫
단풍|danpung|podzimní listí|🍁
가을|gaeul|podzim|🍂
겨울|gyeoul|zima (roční období)|⛄
봄|bom|jaro|🌱
여름|yeoreum|léto|🏖️
계획|gyehoek|plán|🗓️
다음 주|daeum ju|příští týden|🔜
돌아가요|doragayo|vracím se|↩️
집|jip|domov, dům|🏡
이제|ije|teď už|⏲️
비행기|bihaenggi|letadlo|🛫
다시|dasi|znovu|🔃
꼭|kkok|určitě|✊
아마|ama|možná, asi|🤞
계속|gyesok|dál, pořád|➿
배워요|baewoyo|učím se (배우다)|📝
어려워요|eoryeowoyo|je to těžké|😓
쉬워요|swiwoyo|je to snadné|✌️
수영|suyeong|plavání|🏊
운전|unjeon|řízení auta|🚗
못|mot|nemůžu (zápor schopnosti)|⛔
기억해요|gieokaeyo|pamatuju si|🧠
보고 싶어요|bogo sipeoyo|chybíš mi / chci vidět|🥺
또 올게요|tto olgeyo|zase přijedu|🔂`,
  sents: `
내일 창덕궁에 갈 거예요|naeil changdeokgunge gal geoyeyo|Zítra půjdu do Changdeokgungu.|zítra·do Changdeokgungu·půjdu·(budoucnost)
뭐 할 거예요?|mwo hal geoyeyo?|Co budeš dělat?|co·dělat·budeš
비원을 볼 거예요|biwoneul bol geoyeyo|Uvidím Tajnou zahradu.|Tajnou zahradu (předmět)·uvidím·(budoucnost)
단풍이 예쁠 거예요|danpungi yeppeul geoyeyo|Listí bude asi krásné.|listí (podmět)·hezké·bude
한국어를 계속 배울 거예요|hangugeoreul gyesok baeul geoyeyo|Budu se dál učit korejsky.|korejštinu (předmět)·dál·učit se·budu
한국어 읽을 수 있어요|hangugeo ilgeul su isseoyo|Umím číst korejsky.|korejština·číst·možnost·je
매운 음식 먹을 수 있어요?|maeun eumsik meogeul su isseoyo?|Můžeš jíst pálivé jídlo?|pálivé·jídlo·jíst·možnost·je
수영 못 해요|suyeong mot haeyo|Neumím plavat.|plavání·nemůžu·dělám
오늘은 못 가요|oneureun mot gayo|Dnes nemůžu jít.|dnes (téma)·nemůžu·jít
일요일에 스페인에 돌아가요|iryoire seupeine doragayo|V neděli se vracím do Španělska.|v neděli·do Španělska·vracím se
한국어는 어려워요 그런데 재미있어요|hangugeoneun eoryeowoyo geureonde jaemiisseoyo|Korejština je těžká, ale zábavná.|korejština (téma)·je těžká·ale·je zábavná
이제 집에 가요|ije jibe gayo|Teď jedeme domů.|teď už·domů·jdeme
또 올게요!|tto olgeyo!|Zase přijedu!|znovu·přijdu
한국이 보고 싶을 거예요|hangugi bogo sipeul geoyeyo|Korea mi bude chybět.|Korea (podmět)·vidět·chtít·bude`,
  grammar: [
    { t: 'Budoucnost -(으)ㄹ 거예요', x: 'Kmen končí samohláskou → -ㄹ 거예요 (가다 → 갈 거예요, 보다 → 볼 거예요). Souhláskou → -을 거예요 (먹다 → 먹을 거예요). U přídavných jmen = asi bude: 예쁠 거예요.', ex: '갈 거예요|gal geoyeyo|Půjdu.\n먹을 거예요|meogeul geoyeyo|Budu jíst.\n추울 거예요|chuul geoyeyo|Asi bude zima.' },
    { t: 'Můžu / umím -(으)ㄹ 수 있어요', x: '갈 수 있어요 (můžu jít), 먹을 수 있어요 (můžu jíst). Zápor: -(으)ㄹ 수 없어요 (nemůžu).', ex: '운전할 수 있어요|unjeonhal su isseoyo|Umím řídit.\n갈 수 없어요|gal su eopseoyo|Nemůžu jít.' },
    { t: '못 = nemůžu × 안 = nechci', x: '못 vyjadřuje, že něco nejde: 못 가요 (nemůžu jít), 못 먹어요 (nemůžu jíst). U 하다: 수영 못 해요. Srovnej 안 가요 = nepůjdu (rozhodl jsem se).', ex: '못 먹어요|mot meogeoyo|Nemůžu to jíst.\n안 먹어요|an meogeoyo|Nejím to (nechci).' },
  ],
  dialog: {
    who: 'Kamarád', face: '🧑',
    lines: `
A|내일 뭐 할 거예요?|naeil mwo hal geoyeyo?|Co budeš dělat zítra?
>|창덕궁에 갈 거예요|changdeokgunge gal geoyeyo|Půjdu do Changdeokgungu.
A|비원도 볼 거예요?|biwondo bol geoyeyo?|Uvidíš i Tajnou zahradu?
>|네, 예약했어요|ne, yeyakaesseoyo|Ano, mám rezervaci.
A|좋아요! 단풍이 예쁠 거예요|joayo! danpungi yeppeul geoyeyo|Super! Listí bude krásné.
>|일요일에는 스페인에 돌아가요|iryoireneun seupeine doragayo|V neděli se vracím do Španělska.
A|아쉬워요! 또 올 거예요?|aswiwoyo! tto ol geoyeyo?|Škoda! Přijedeš zase?
>|네, 꼭 또 올게요!|ne, kkok tto olgeyo!|Ano, určitě zase přijedu!`,
  },
  culture: [
    'Do Tajné zahrady (후원, lidově 비원) se chodí jen s průvodcem a lístky se rezervují předem – rychle mizí.',
    'Konec listopadu je konec sezóny podzimního listí (단풍). V palácových zahradách bývá ještě barevně.',
  ],
});

// Přestupní stanice = opakování celé linky; poslední = závěrečná zkouška A1
const REVIEWS = [
  { id: 'r1', line: 1, code: '환승', ko: '환승', name: 'Přestup: opakování linky 1', of: ['s1', 's2', 's3', 's4'] },
  { id: 'r2', line: 2, code: '환승', ko: '환승', name: 'Přestup: opakování linky 2', of: ['s5', 's6', 's7', 's8', 's9'] },
  { id: 'r3', line: 3, code: '환승', ko: '환승', name: 'Přestup: opakování linky 3', of: ['s10', 's11', 's12', 's13', 's14'] },
  { id: 'final', line: 4, code: 'A1', ko: '집으로', name: 'Cesta domů: zkouška A1', of: null },
];
