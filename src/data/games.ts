import mobileLegendsBanner from '../assets/pict/mobile-legends-banner.jpeg';
import freeFireBanner from '../assets/pict/free-fire-banner.jpeg';
import valorantBanner from '../assets/pict/valorant-banner.jpeg';
import pubgMobileBanner from '../assets/pict/pubg-mobile-banner.jpeg';
import honorOfKingsBanner from '../assets/pict/honor-of-kings-banner.jpeg';
import fcMobileBanner from '../assets/pict/fc-mobile-banner.jpeg';
import leagueOfLegendsBanner from '../assets/pict/league-of-legends-banner.jpeg';
import callOfDutyMobileBanner from '../assets/pict/call-of-duty-mobile-banner.jpeg';
import zepettoBannerFull from '../assets/pict/zepetto-banner-full.png';
import bloodStrikeBannerFull from '../assets/pict/blood-strike-banner-full.png';
import arenaBreakoutBannerFull from '../assets/pict/arena-breakout-banner-full.png';
import growtopiaBannerFull from '../assets/pict/growtopia-banner-full.png';
import honkaiImpactBannerFull from '../assets/pict/honkai-impact-banner-full.png';
import deltaForceBannerFull from '../assets/pict/delta-force-banner-full.png';
import magicChessBannerFull from '../assets/pict/magic-chess-banner-full.png';
import pointBlankBannerFull from '../assets/pict/point-blank-banner-full.png';
import pubgNewStateBannerFull from '../assets/pict/pubg-new-state-banner-full.png';
import sausageManBannerFull from '../assets/pict/sausage-man-banner-full.png';
import arenaOfValorBannerFull from '../assets/pict/arena-of-valor-banner-full.png';
import arenaBreakoutInfiniteBannerFull from '../assets/pict/arena-breakout-infinite-banner-full.png';
import qrisLogo from '../assets/pict/qris-logo.png';

export interface GamePackage {
  id: string;
  name: string;
  price: string;
  bonus?: string;
  discount?: string;
  group?: string;
}

export interface PaymentGroup {
  id: string;
  title: string;
  methods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  brand: string;
  label: string;
  fee: number;
  logoSrc?: string;
  logoAlt?: string;
}

export interface SecondaryFieldConfig {
  label: string;
  placeholder: string;
  inputMode?: 'numeric' | 'text';
  maxLength?: number;
}

export interface GameDetail {
  slug: string;
  id: number;
  title: string;
  category: string;
  accent: string;
  image?: string;
  imageFit?: 'cover' | 'contain';
  imagePosition?: string;
  imageScale?: string;
  cardImageFit?: 'cover' | 'contain';
  cardImagePosition?: string;
  cardImageScale?: string;
  heroMinHeight?: string;
  heroLabel: string;
  description: string;
  benefits: string[];
  accountInstructions?: string[];
  playerIdLabel?: string;
  playerIdPlaceholder?: string;
  playerIdInputMode?: 'numeric' | 'text';
  playerIdMaxLength?: number;
  secondaryField?: SecondaryFieldConfig;
  packages: GamePackage[];
}

const createPackages = (
  prefix: string,
  group: string,
  items: Array<{ name: string; price: string; bonus?: string; discount?: string }>,
): GamePackage[] =>
  items.map((item, index) => ({
    id: `${prefix}-${index + 1}`,
    name: item.name,
    price: item.price,
    bonus: item.bonus,
    discount: item.discount,
    group,
  }));

const freeFirePackages: GamePackage[] = [
  ...createPackages('ffm', 'membership', [
    { name: 'Membership Minggu', price: 'Rp29.030' },
    { name: 'Membership Bulanan', price: 'Rp85.000' },
  ]),
  ...createPackages('ffd', 'diamonds', [
    { name: '5 Diamonds', price: 'Rp860' },
    { name: '10 Diamonds', price: 'Rp1.715' },
    { name: '12 Diamonds', price: 'Rp1.895' },
    { name: '15 Diamonds', price: 'Rp2.586' },
    { name: '20 Diamonds', price: 'Rp3.405' },
    { name: '25 Diamonds', price: 'Rp4.254' },
    { name: '30 Diamonds', price: 'Rp5.105' },
    { name: '40 Diamonds', price: 'Rp6.526' },
    { name: '50 Diamonds', price: 'Rp6.704' },
    { name: '55 Diamonds', price: 'Rp7.760' },
    { name: '60 Diamonds', price: 'Rp8.710' },
    { name: '70 Diamonds', price: 'Rp9.270' },
    { name: '75 Diamonds', price: 'Rp10.293' },
    { name: '80 Diamonds', price: 'Rp11.239' },
    { name: '90 Diamonds', price: 'Rp12.721' },
    { name: '100 Diamonds', price: 'Rp13.772' },
    { name: '120 Diamonds', price: 'Rp16.813' },
    { name: '130 Diamonds', price: 'Rp17.821' },
    { name: '140 Diamonds', price: 'Rp18.538' },
    { name: '145 Diamonds', price: 'Rp19.389' },
    { name: '150 Diamonds', price: 'Rp20.240' },
    { name: '160 Diamonds', price: 'Rp21.941' },
    { name: '170 Diamonds', price: 'Rp23.643' },
    { name: '180 Diamonds', price: 'Rp24.825' },
    { name: '190 Diamonds', price: 'Rp25.242' },
    { name: '200 Diamonds', price: 'Rp27.753' },
    { name: '210 Diamonds', price: 'Rp28.000' },
    { name: '250 Diamonds', price: 'Rp34.245' },
    { name: '260 Diamonds', price: 'Rp35.235' },
    { name: '280 Diamonds', price: 'Rp37.638' },
    { name: '300 Diamonds', price: 'Rp42.782' },
    { name: '355 Diamonds', price: 'Rp45.372' },
    { name: '360 Diamonds', price: 'Rp47.223' },
    { name: '375 Diamonds', price: 'Rp49.872' },
    { name: '425 Diamonds', price: 'Rp56.736' },
    { name: '475 Diamonds', price: 'Rp64.038' },
    { name: '500 Diamonds', price: 'Rp68.103' },
    { name: '545 Diamonds', price: 'Rp74.013' },
    { name: '600 Diamonds', price: 'Rp79.552' },
    { name: '645 Diamonds', price: 'Rp87.114' },
    { name: '720 Diamonds', price: 'Rp94.284' },
    { name: '770 Diamonds', price: 'Rp102.382' },
    { name: '800 Diamonds', price: 'Rp105.628' },
    { name: '860 Diamonds', price: 'Rp113.142' },
    { name: '930 Diamonds', price: 'Rp122.382' },
    { name: '1000 Diamonds', price: 'Rp133.137' },
    { name: '1080 Diamonds', price: 'Rp142.615' },
    { name: '1215 Diamonds', price: 'Rp158.138' },
    { name: '1300 Diamonds', price: 'Rp170.527' },
    { name: '1450 Diamonds', price: 'Rp187.375' },
    { name: '1510 Diamonds', price: 'Rp196.138' },
    { name: '1580 Diamonds', price: 'Rp205.638' },
    { name: '1800 Diamonds', price: 'Rp235.582' },
    { name: '1875 Diamonds', price: 'Rp245.827' },
    { name: '1975 Diamonds', price: 'Rp257.416' },
    { name: '2000 Diamonds', price: 'Rp262.132' },
    { name: '2100 Diamonds', price: 'Rp270.726' },
    { name: '2140 Diamonds', price: 'Rp276.425' },
    { name: '2190 Diamonds', price: 'Rp283.523' },
    { name: '2225 Diamonds', price: 'Rp288.139' },
    { name: '2280 Diamonds', price: 'Rp293.624' },
    { name: '2355 Diamonds', price: 'Rp305.782' },
    { name: '2400 Diamonds', price: 'Rp311.291' },
    { name: '2575 Diamonds', price: 'Rp335.391' },
    { name: '2750 Diamonds', price: 'Rp358.517' },
    { name: '3000 Diamonds', price: 'Rp389.138' },
    { name: '3310 Diamonds', price: 'Rp430.096' },
    { name: '3640 Diamonds', price: 'Rp468.725' },
    { name: '3800 Diamonds', price: 'Rp497.172' },
    { name: '4050 Diamonds', price: 'Rp521.010' },
    { name: '4340 Diamonds', price: 'Rp556.582' },
    { name: '4450 Diamonds', price: 'Rp573.528' },
    { name: '4720 Diamonds', price: 'Rp606.426' },
    { name: '4800 Diamonds', price: 'Rp616.523' },
    { name: '5500 Diamonds', price: 'Rp711.302' },
    { name: '6000 Diamonds', price: 'Rp775.829' },
  ]),
];

const honorOfKingsPackages: GamePackage[] = [
  ...createPackages('hokw', 'weekly-card', [
    { name: 'Weekly Card', price: 'Rp17.500' },
    { name: 'Weekly Card Plus', price: 'Rp53.000' },
  ]),
  ...createPackages('hokt', 'tokens', [
    { name: '80 Tokens', price: 'Rp15.000' },
    { name: '240 Tokens', price: 'Rp43.627' },
    { name: '400 Tokens', price: 'Rp74.382' },
    { name: '560 Tokens', price: 'Rp102.826' },
    { name: '800 Tokens', price: 'Rp149.281' },
    { name: '1200 Tokens', price: 'Rp219.138' },
    { name: '2400 Tokens', price: 'Rp440.275' },
    { name: '4000 Tokens', price: 'Rp732.148' },
    { name: '8000 Tokens', price: 'Rp1.480.372' },
  ]),
];

const valorantPackages = createPackages('vp', 'points', [
  { name: '475 Points', price: 'Rp54.183' },
  { name: '1000 Points', price: 'Rp108.139' },
  { name: '1475 Points', price: 'Rp163.136' },
  { name: '2050 Points', price: 'Rp215.272' },
  { name: '3050 Points', price: 'Rp321.528' },
  { name: '3650 Points', price: 'Rp374.826' },
  { name: '4125 Points', price: 'Rp427.263' },
  { name: '4650 Points', price: 'Rp478.273' },
  { name: '5350 Points', price: 'Rp535.283' },
  { name: '5700 Points', price: 'Rp585.382' },
  { name: '5825 Points', price: 'Rp590.725' },
  { name: '6350 Points', price: 'Rp642.173' },
  { name: '7400 Points', price: 'Rp751.173' },
  { name: '9000 Points', price: 'Rp910.148' },
  { name: '11000 Points', price: 'Rp1.055.164' },
  { name: '11475 Points', price: 'Rp1.102.726' },
]);

const zepetoPackages: GamePackage[] = [
  ...createPackages('zz', 'zems', [
    { name: '14 ZEMs', price: 'Rp15.128' },
    { name: '28 ZEMs', price: 'Rp29.294' },
    { name: '58 ZEMs', price: 'Rp59.392' },
    { name: '128 ZEMs', price: 'Rp125.372' },
    { name: '323 ZEMs', price: 'Rp315.294' },
    { name: '1.000 ZEMs', price: 'Rp945.278' },
  ]),
  ...createPackages('zc', 'coins', [
    { name: '4.680 Coins', price: 'Rp14.538' },
    { name: '9.700 Coins', price: 'Rp29.678' },
    { name: '25.200 Coins', price: 'Rp73.726' },
    { name: '40.700 Coins', price: 'Rp117.261' },
    { name: '110.000 Coins', price: 'Rp308.628' },
    { name: '300.000 Coins', price: 'Rp815.212' },
  ]),
];

const arenaBreakoutPackages: GamePackage[] = [
  ...createPackages('abp', 'passes', [
    { name: 'Beginner Select', price: 'Rp13.472' },
    { name: 'Advance Battle Pass', price: 'Rp17.637' },
    { name: 'Bulletproof Case Privileges', price: 'Rp39.281' },
    { name: 'Premium Battle Pass', price: 'Rp66.628' },
    { name: 'Quarterly Premium Battle Pass', price: 'Rp198.826' },
  ]),
  ...createPackages('abb', 'bonds', [
    { name: '60 + 6 Bonds', price: 'Rp14.572' },
    { name: '310 + 25 Bonds', price: 'Rp70.635' },
    { name: '630 + 45 Bonds', price: 'Rp141.263' },
    { name: '1580 + 110 Bonds', price: 'Rp345.182' },
    { name: '3200 + 200 Bonds', price: 'Rp700.127' },
    { name: '6500 + 320 Bonds', price: 'Rp1.342.827' },
  ]),
];

const bloodStrikePackages: GamePackage[] = [
  ...createPackages('bsg', 'golds', [
    { name: '100 Golds', price: 'Rp12.311' },
    { name: '300 Golds', price: 'Rp36.821' },
    { name: '500 Golds', price: 'Rp61.261' },
    { name: '600 + 45 Golds', price: 'Rp73.281' },
    { name: '800 + 60 Golds', price: 'Rp97.528' },
    { name: '1000 Golds', price: 'Rp122.182' },
    { name: '1200 + 110 Golds', price: 'Rp146.281' },
    { name: '1500 + 140 Golds', price: 'Rp183.172' },
    { name: '2000 Golds', price: 'Rp243.926' },
    { name: '2500 + 300 Golds', price: 'Rp306.452' },
    { name: '3000 + 360 Golds', price: 'Rp366.715' },
    { name: '4000 + 520 Golds', price: 'Rp487.627' },
    { name: '5000 Golds', price: 'Rp607.182' },
    { name: '6000 + 900 Golds', price: 'Rp728.927' },
    { name: '7000 + 1060 Golds', price: 'Rp450.182' },
    { name: '8000 + 1160 Golds', price: 'Rp972.382' },
    { name: '9000 + 1260 Golds', price: 'Rp1.095.628' },
    { name: '10000 + 1600 Golds', price: 'Rp1.217.826' },
    { name: '15000 + 2400 Golds', price: 'Rp1.897.386' },
    { name: '20000 + 3200 Golds', price: 'Rp2.430.826' },
    { name: '25000 + 4000 Golds', price: 'Rp3.035.286' },
    { name: '50000 + 8000 Gold', price: 'Rp6.053.827' },
  ]),
];

const callOfDutyMobilePackages = createPackages('cd', 'cp', [
  { name: '63 CP', price: 'Rp9.537' },
  { name: '128 CP', price: 'Rp18.892' },
  { name: '321 CP', price: 'Rp47.218' },
  { name: '645 CP', price: 'Rp94.872' },
  { name: '800 CP', price: 'Rp114.482' },
  { name: '1373 CP', price: 'Rp188.582' },
  { name: '2060 CP', price: 'Rp282.729' },
  { name: '2750 CP', price: 'Rp361.392' },
  { name: '3564 CP', price: 'Rp470.293' },
  { name: '7656 CP', price: 'Rp944.826' },
  { name: '15312 CP', price: 'Rp2.037.826' },
  { name: '38280 CP', price: 'Rp5.087.826' },
]);

const deltaForcePackages = createPackages('dfc', 'coins', [
  { name: '30 Delta Coins', price: 'Rp6.582' },
  { name: '60 Delta Coins', price: 'Rp12.852' },
  { name: '300 + 20 Delta Coins', price: 'Rp63.826' },
  { name: '420 + 40 Delta Coins', price: 'Rp92.528' },
  { name: '680 + 70 Delta Coins', price: 'Rp127.492' },
  { name: '1280 + 200 Delta Coins', price: 'Rp254.628' },
  { name: '1680 + 300 Delta Coins', price: 'Rp320.275' },
  { name: '3280 + 670 Delta Coins', price: 'Rp638.728' },
  { name: '6480 + 1620 Delta Coins', price: 'Rp1.276.582' },
]);

const fcMobilePackages: GamePackage[] = [
  ...createPackages('fcp', 'fc-points', [
    { name: '40 FC Points', price: 'Rp6.862' },
    { name: '100 FC Points', price: 'Rp16.728' },
    { name: '520 FC Points', price: 'Rp78.129' },
    { name: '1070 FC Points', price: 'Rp157.825' },
    { name: '2200 FC Points', price: 'Rp325.726' },
    { name: '5750 FC Points', price: 'Rp784.682' },
    { name: '12000 FC Points', price: 'Rp1.573.492' },
  ]),
  ...createPackages('fcs', 'silver', [
    { name: '39 Silver', price: 'Rp6.738' },
    { name: '99 Silver', price: 'Rp16.182' },
    { name: '499 Silver', price: 'Rp78.382' },
    { name: '999 Silver', price: 'Rp158.183' },
    { name: '1999 Silver', price: 'Rp327.827' },
    { name: '4999 Silver', price: 'Rp783.725' },
    { name: '9999 Silver', price: 'Rp1.576.382' },
  ]),
];

const growtopiaPackages = createPackages('gt', 'packs', [
  { name: 'Chest O Gems', price: 'Rp28.000' },
  { name: 'Scrolls Value Pack', price: 'Rp44.382' },
  { name: 'Bandages Value Pack', price: 'Rp45.276' },
  { name: 'Dungeon Pass', price: 'Rp72.286' },
  { name: 'Gem Fountain', price: 'Rp74.285' },
  { name: 'Royal Grow Pass', price: 'Rp142.826' },
  { name: "It's Rainin Gems", price: 'Rp153.372' },
  { name: 'Road To Glory', price: 'Rp367.582' },
  { name: 'Gem Bounty', price: 'Rp453.726' },
  { name: 'Gem Abundance', price: 'Rp703.382' },
  { name: '1 Year Subscription Token', price: 'Rp703.725' },
]);

const honkaiImpactPackages: GamePackage[] = [
  ...createPackages('hi3m', 'monthly-card', [
    { name: 'Monthly Card', price: 'Rp87.392' },
  ]),
  ...createPackages('hi3b', 'b-chips', [
    { name: '30 B-Chips', price: 'Rp9.372' },
    { name: '65 B-Chips', price: 'Rp18.284' },
    { name: '330 B-Chips', price: 'Rp88.738' },
    { name: '990 B-Chips', price: 'Rp254.376' },
    { name: '1320 B-Chips', price: 'Rp345.528' },
    { name: '1980 B-Chips', price: 'Rp530.293' },
    { name: '3300 B-Chips', price: 'Rp876.271' },
    { name: '6600 B-Chips', price: 'Rp1.747.276' },
  ]),
  ...createPackages('hi3c', 'crystals', [
    { name: '65 Crystal', price: 'Rp18.327' },
    { name: '330 Crystal', price: 'Rp87.527' },
    { name: '660 Crystal', price: 'Rp154.283' },
    { name: '1320 Crystal', price: 'Rp345.628' },
    { name: '3300 Crystal', price: 'Rp873.732' },
    { name: '6600 Crystal', price: 'Rp1.751.382' },
  ]),
];

const leagueOfLegendsPackages = createPackages('lolc', 'cores', [
  { name: '425 Cores', price: 'Rp53.628' },
  { name: '1000 Cores', price: 'Rp110.128' },
  { name: '1850 Cores', price: 'Rp215.182' },
  { name: '3275 Cores', price: 'Rp375.382' },
  { name: '4800 Cores', price: 'Rp540.183' },
  { name: '10000 Cores', price: 'Rp1.083.628' },
]);

const magicChessPackages: GamePackage[] = [
  ...createPackages('mcw', 'weekly-card', [
    { name: 'Weekly Card', price: 'Rp28.826' },
  ]),
  ...createPackages('mcd', 'diamonds', [
    { name: '5 Diamond', price: 'Rp1.556', bonus: '5 + 0 Bonus' },
    { name: '12 Diamond', price: 'Rp3.312', bonus: '11 + 1 Bonus' },
    { name: '19 Diamond', price: 'Rp4.978', bonus: '17 + 2 Bonus' },
    { name: '28 Diamond', price: 'Rp7.382', bonus: '25 + 3 Bonus' },
    { name: '44 Diamond', price: 'Rp11.362', bonus: '40 + 4 Bonus' },
    { name: '59 Diamond', price: 'Rp15.472', bonus: '53 + 6 Bonus' },
    { name: '85 Diamond', price: 'Rp22.128', bonus: '77 + 8 Bonus' },
    { name: '170 Diamond', price: 'Rp43.172', bonus: '154 + 16 Bonus' },
    { name: '240 Diamond', price: 'Rp60.162', bonus: '217 + 23 Bonus' },
    { name: '296 Diamond', price: 'Rp73.172', bonus: '256 + 40 Bonus' },
    { name: '408 Diamond', price: 'Rp97.275', bonus: '376 + 41 Bonus' },
    { name: '568 Diamond', price: 'Rp133.182', bonus: '503 + 65 Bonus' },
    { name: '875 Diamond', price: 'Rp207.265', bonus: '774 + 101 Bonus' },
    { name: '2010 Diamond', price: 'Rp468.382', bonus: '1708 + 302 Bonus' },
    { name: '4830 Diamond', price: 'Rp1.083.326', bonus: '4003 + 827 Bonus' },
  ]),
  ...createPackages('mcf', 'first-recharge', [
    { name: 'First Recharge 50 + 50 Diamond', price: 'Rp14.293' },
    { name: 'First Recharge 150 + 150 Diamond', price: 'Rp43.127' },
    { name: 'First Recharge 250 + 250 Diamond', price: 'Rp72.273' },
    { name: 'First Recharge 500 + 500 Diamond', price: 'Rp142.172' },
  ]),
];

const pointBlankPackages = createPackages('pbc', 'cash', [
  { name: '1200 PB Cash', price: 'Rp9.527' },
  { name: '2400 PB Cash', price: 'Rp18.472' },
  { name: '6000 PB Cash', price: 'Rp46.528' },
  { name: '12000 PB Cash', price: 'Rp92.782' },
  { name: '36000 PB Cash', price: 'Rp277.283' },
  { name: '60000 PB Cash', price: 'Rp464.628' },
]);

const pubgNewStatePackages = createPackages('pns', 'nc', [
  { name: '300 NC', price: 'Rp15.127' },
  { name: '1500 + 80 Bonus NC', price: 'Rp77.692' },
  { name: '3600 + 250 Bonus NC', price: 'Rp184.183' },
  { name: '9300 + 930 Bonus NC', price: 'Rp476.382' },
  { name: '15000 + 1800 Bonus NC', price: 'Rp778.276' },
  { name: '30000 + 5000 Bonus NC', price: 'Rp1.524.726' },
]);

const pubgMobilePackages = createPackages('pm', 'uc', [
  { name: '60 UC', price: 'Rp15.572', bonus: '60 + 0' },
  { name: '120 UC', price: 'Rp31.126', bonus: '120 + 0' },
  { name: '180 UC', price: 'Rp47.138', bonus: '180 + 0' },
  { name: '325 UC', price: 'Rp75.372', bonus: '300 + 25' },
  { name: '385 UC', price: 'Rp90.482', bonus: '360 + 25' },
  { name: '445 UC', price: 'Rp105.382', bonus: '420 + 25' },
  { name: '505 UC', price: 'Rp121.482', bonus: '480 + 25' },
  { name: '650 UC', price: 'Rp152.327', bonus: '600 + 50' },
  { name: '720 UC', price: 'Rp166.382', bonus: '600 + 120' },
  { name: '975 UC', price: 'Rp226.382', bonus: '900 + 75' },
  { name: '1045 UC', price: 'Rp243.283', bonus: '950 + 85' },
  { name: '1320 UC', price: 'Rp300.283', bonus: '1200 + 120' },
  { name: '1800 UC', price: 'Rp378.382', bonus: '1500 + 300' },
  { name: '1860 UC', price: 'Rp395.173', bonus: '1560 + 300' },
  { name: '2125 UC', price: 'Rp455.382', bonus: '1800 + 325' },
  { name: '2460 UC', price: 'Rp530.282', bonus: '2100 + 360' },
  { name: '2728 UC', price: 'Rp602.482', bonus: '2400 + 385' },
  { name: '3850 UC', price: 'Rp753.625', bonus: '3000 + 8590' },
  { name: '3925 UC', price: 'Rp826.183', bonus: '3300 + 625' },
]);

const sausageManPackages = createPackages('smc', 'candies', [
  { name: '61 Candy', price: 'Rp12.628' },
  { name: '186 Candy', price: 'Rp38.127' },
  { name: '318 Candy', price: 'Rp63.182' },
  { name: '686 Candy', price: 'Rp125.382' },
  { name: '1378 Candy', price: 'Rp251.395' },
  { name: '2118 Candy', price: 'Rp374.128' },
  { name: '3548 Candy', price: 'Rp624.328' },
  { name: '7108 Candy', price: 'Rp1.243.193' },
]);

const arenaOfValorPackages = createPackages('aov', 'vouchers', [
  { name: '40 Vouchers', price: 'Rp9.271' },
  { name: '90 Vouchers', price: 'Rp18.183' },
  { name: '230 Vouchers', price: 'Rp45.682' },
  { name: '470 Vouchers', price: 'Rp89.725' },
  { name: '600 Vouchers', price: 'Rp125.162' },
  { name: '700 Vouchers', price: 'Rp145.127' },
  { name: '950 Vouchers', price: 'Rp184.729' },
  { name: '1030 Vouchers', price: 'Rp210.182' },
  { name: '1430 Vouchers', price: 'Rp280.192' },
  { name: '2390 Vouchers', price: 'Rp470.289' },
  { name: '3300 Vouchers', price: 'Rp671.627' },
  { name: '4800 Vouchers', price: 'Rp922.286' },
  { name: '7050 Vouchers', price: 'Rp1.395.627' },
  { name: '9420 Vouchers', price: 'Rp1.870.273' },
  { name: '24050 Vouchers', price: 'Rp2.607.827' },
  { name: '48200 Vouchers', price: 'Rp9.608.826' },
]);

const arenaBreakoutInfinitePackages = createPackages('abi', 'bonds', [
  { name: '100 Bonds', price: 'Rp17.217' },
  { name: '500 + 10 Bonds', price: 'Rp84.278' },
  { name: '1000 + 40 Bonds', price: 'Rp180.183' },
  { name: '2500 + 125 Bonds', price: 'Rp424.826' },
  { name: '5000 + 300 Bonds', price: 'Rp844.726' },
  { name: '10000 + 800 Bonds', price: 'Rp1.682.527' },
]);

export const games: GameDetail[] = [
  {
    id: 1,
    slug: 'mobile-legends',
    title: 'Mobile Legends',
    category: 'MOBA',
    accent: 'accent-cyan',
    image: mobileLegendsBanner,
    imageFit: 'cover',
    imagePosition: 'center top',
    imageScale: '118%',
    heroLabel: 'Weekly Diamond Pass',
    description:
      'Top up Mobile Legends cepat, aman, dan langsung masuk. Cocok untuk weekly pass, diamond rutin, dan push rank tanpa ribet.',
    benefits: ['Proses instan', 'Pembayaran aman', 'Layanan pelanggan aktif', 'WDP harian maksimal total 70 hari'],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID',
    playerIdInputMode: 'numeric',
    secondaryField: {
      label: 'Server / Zone',
      placeholder: 'Masukkan server ID',
      inputMode: 'numeric',
      maxLength: 8,
    },
    packages: [
      { id: 'ml-1', name: '1 Weekly Diamond Pass', price: 'Rp27.777', group: 'weekly-pass' },
      { id: 'ml-2', name: '2 Weekly Diamond Pass', price: 'Rp55.500', group: 'weekly-pass' },
      { id: 'ml-3', name: '3 Weekly Diamond Pass', price: 'Rp83.160', group: 'weekly-pass' },
      { id: 'ml-4', name: '3 Diamonds', price: 'Rp1.100', bonus: '3 + 0 Bonus', group: 'diamonds' },
      { id: 'ml-5', name: '5 Diamonds', price: 'Rp1.500', bonus: '5 + 0 Bonus', group: 'diamonds' },
      { id: 'ml-6', name: '10 Diamonds', price: 'Rp2.923', bonus: '10 + 0 Bonus', group: 'diamonds' },
      { id: 'ml-7', name: '12 Diamonds', price: 'Rp3.414', bonus: '11 + 1 Bonus', group: 'diamonds' },
      { id: 'ml-8', name: '17 Diamonds', price: 'Rp4.704', bonus: '16 + 1 Bonus', group: 'diamonds' },
      { id: 'ml-9', name: '19 Diamonds', price: 'Rp5.358', bonus: '17 + 2 Bonus', group: 'diamonds' },
      { id: 'ml-10', name: '22 Diamonds', price: 'Rp6.352', bonus: '20 + 2 Bonus', group: 'diamonds' },
      { id: 'ml-11', name: '28 Diamonds', price: 'Rp7.765', bonus: '25 + 3 Bonus', group: 'diamonds' },
      { id: 'ml-12', name: '36 Diamonds', price: 'Rp9.752', bonus: '33 + 3 Bonus', group: 'diamonds' },
      { id: 'ml-13', name: '44 Diamonds', price: 'Rp11.650', bonus: '40 + 4 Bonus', group: 'diamonds' },
      { id: 'ml-14', name: '59 Diamonds', price: 'Rp15.531', bonus: '53 + 6 Bonus', group: 'diamonds' },
      { id: 'ml-15', name: '64 Diamonds', price: 'Rp17.013', bonus: '58 + 6 Bonus', group: 'diamonds' },
      { id: 'ml-16', name: '71 Diamonds', price: 'Rp19.108', bonus: '64 + 7 Bonus', group: 'diamonds' },
      { id: 'ml-17', name: '85 Diamonds', price: 'Rp22.305', bonus: '77 + 8 Bonus', group: 'diamonds' },
      { id: 'ml-18', name: '113 Diamonds', price: 'Rp30.073', bonus: '102 + 11 Bonus', group: 'diamonds' },
      { id: 'ml-19', name: '128 Diamonds', price: 'Rp33.952', bonus: '117 + 12 Bonus', group: 'diamonds' },
      { id: 'ml-20', name: '148 Diamonds', price: 'Rp39.208', bonus: '134 + 14 Bonus', group: 'diamonds' },
      { id: 'ml-21', name: '170 Diamonds', price: 'Rp44.632', bonus: '154 + 16 Bonus', group: 'diamonds' },
      { id: 'ml-22', name: '176 Diamonds', price: 'Rp46.696', bonus: '160 + 17 Bonus', group: 'diamonds' },
      { id: 'ml-23', name: '184 Diamonds', price: 'Rp49.030', bonus: '166 + 18 Bonus', group: 'diamonds' },
      { id: 'ml-24', name: '210 Diamonds', price: 'Rp55.432', bonus: '190 + 20 Bonus', group: 'diamonds' },
      { id: 'ml-25', name: '222 Diamonds', price: 'Rp58.775', bonus: '201 + 21 Bonus', group: 'diamonds' },
      { id: 'ml-26', name: '240 Diamonds', price: 'Rp62.630', bonus: '217 + 23 Bonus', group: 'diamonds' },
      { id: 'ml-27', name: '277 Diamonds', price: 'Rp72.840', bonus: '251 + 26 Bonus', group: 'diamonds' },
      { id: 'ml-28', name: '284 Diamonds', price: 'Rp74.284', bonus: '261 + 40 Bonus', group: 'diamonds' },
      { id: 'ml-29', name: '296 Diamonds', price: 'Rp77.123', bonus: '246 + 40 Bonus', group: 'diamonds' },
      { id: 'ml-30', name: '300 Diamonds', price: 'Rp78.300', bonus: '261 + 40 Bonus', group: 'diamonds' },
      { id: 'ml-31', name: '332 Diamonds', price: 'Rp87.421', bonus: '289 + 43 Bonus', group: 'diamonds' },
      { id: 'ml-32', name: '340 Diamonds', price: 'Rp88.921', bonus: '296 + 44 Bonus', group: 'diamonds' },
      { id: 'ml-33', name: '355 Diamonds', price: 'Rp93.532', bonus: '309 + 46 Bonus', group: 'diamonds' },
      { id: 'ml-34', name: '370 Diamonds', price: 'Rp96.333', bonus: '324 + 46 Bonus', group: 'diamonds' },
      { id: 'ml-35', name: '453 Diamonds', price: 'Rp118.772', bonus: '408 + 45 Bonus', group: 'diamonds' },
      { id: 'ml-36', name: '568 Diamonds', price: 'Rp145.656', bonus: '503 + 65 Bonus', group: 'diamonds' },
      { id: 'ml-37', name: '642 Diamonds', price: 'Rp164.631', bonus: '571 + 71 Bonus', group: 'diamonds' },
      { id: 'ml-38', name: '761 Diamonds', price: 'Rp183.923', bonus: '637 + 79 Bonus', group: 'diamonds' },
      { id: 'ml-39', name: '792 Diamonds', price: 'Rp204.333', bonus: '707 + 85 Bonus', group: 'diamonds' },
      { id: 'ml-40', name: '875 Diamonds', price: 'Rp223.021', bonus: '774 + 101 Bonus', group: 'diamonds' },
      { id: 'ml-41', name: '963 Diamonds', price: 'Rp240.521', bonus: '851 + 109 Bonus', group: 'diamonds' },
      { id: 'ml-42', name: '1000 Diamonds', price: 'Rp252.000', bonus: '887 + 113 Bonus', group: 'diamonds' },
      { id: 'ml-43', name: '1136 Diamonds', price: 'Rp290.500', bonus: '990 + 146 Bonus', group: 'diamonds' },
      { id: 'ml-44', name: '1159 Diamonds', price: 'Rp297.235', bonus: '1031 + 128 Bonus', group: 'diamonds' },
      { id: 'ml-45', name: '1220 Diamonds', price: 'Rp302.625', bonus: '1083 + 138 Bonus', group: 'diamonds' },
      { id: 'ml-46', name: '1506 Diamonds', price: 'Rp385.425', bonus: '1335 + 172 Bonus', group: 'diamonds' },
      { id: 'ml-47', name: '1704 Diamonds', price: 'Rp436.327', bonus: '1509 + 195 Bonus', group: 'diamonds' },
    ],
  },
  {
    id: 2,
    slug: 'free-fire',
    title: 'Free Fire',
    category: 'Battle Royale',
    accent: 'accent-orange',
    image: freeFireBanner,
    imageFit: 'cover',
    imagePosition: 'center top',
    imageScale: '114%',
    heroLabel: 'Diamond Instan',
    description:
      'Beli diamond dan membership Free Fire untuk bundle, booyah pass, dan event spesial dengan checkout yang simpel dan cepat.',
    benefits: ['Diamond masuk cepat', 'Membership tersedia', 'Pilihan nominal lengkap', 'Support metode bayar populer'],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Free Fire',
    playerIdInputMode: 'numeric',
    packages: freeFirePackages,
  },
  {
    id: 3,
    slug: 'valorant',
    title: 'Valorant',
    category: 'Tactical Shooter',
    accent: 'accent-red',
    image: valorantBanner,
    imageFit: 'cover',
    imagePosition: 'center',
    imageScale: '100%',
    heroLabel: 'Valorant Points',
    description:
      'Isi ulang Valorant Points buat skin, battlepass, dan bundle favorit dengan tampilan checkout yang rapi dan terpercaya.',
    benefits: ['Nominal VP lengkap', 'Cocok untuk bundle dan battle pass', 'Input Riot ID fleksibel', 'Checkout lebih jelas'],
    accountInstructions: [
      'Untuk menemukan Riot ID Anda, buka halaman profil akun dan salin Riot ID + Tag menggunakan tombol di samping Riot ID.',
      'Contoh format: Javes#123',
    ],
    playerIdLabel: 'Riot ID + Tag',
    playerIdPlaceholder: 'Contoh: Javes#123',
    playerIdInputMode: 'text',
    playerIdMaxLength: 32,
    packages: valorantPackages,
  },
  {
    id: 5,
    slug: 'pubg-mobile',
    title: 'PUBG Mobile',
    category: 'Survival',
    accent: 'accent-green',
    image: pubgMobileBanner,
    imageFit: 'cover',
    imagePosition: 'center top',
    imageScale: '114%',
    heroLabel: 'Unknown Cash',
    description:
      'Top up PUBG Mobile dengan pilihan UC lengkap untuk kebutuhan Royale Pass, skin, dan event bundle harian.',
    benefits: ['Nominal UC lebih lengkap', 'Bonus UC ikut ditampilkan', 'Instruksi ID jelas', 'Visual selaras homepage'],
    accountInstructions: [
      'Untuk menemukan user ID Anda, klik foto profil yang terletak di pojok kanan atas.',
      'Di sudut kiri akan terlihat informasi ID akun Anda.',
      'Contoh: 513018121',
    ],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID PUBG Mobile',
    playerIdInputMode: 'numeric',
    packages: pubgMobilePackages,
  },
  {
    id: 6,
    slug: 'honor-of-kings',
    title: 'Honor of Kings',
    category: '5v5 Arena',
    accent: 'accent-gold',
    image: honorOfKingsBanner,
    imageFit: 'cover',
    imagePosition: 'center top',
    imageScale: '114%',
    heroLabel: 'Tokens',
    description:
      'Top up Honor of Kings dengan weekly card dan token lengkap untuk kebutuhan event, rank, dan skin favorit.',
    benefits: ['Weekly card tersedia', 'Token lengkap', 'Tampilan premium', 'Checkout tetap konsisten'],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Honor of Kings',
    playerIdInputMode: 'numeric',
    packages: honorOfKingsPackages,
  },
  {
    id: 7,
    slug: 'fc-mobile',
    title: 'FC Mobile',
    category: 'Sports',
    accent: 'accent-blue',
    image: fcMobileBanner,
    imageFit: 'cover',
    imagePosition: 'center top',
    imageScale: '114%',
    heroLabel: 'FC Points & Silver',
    description:
      'Top up EA SPORTS FC Mobile untuk FC Points dan Silver dengan nominal lengkap khusus region Indonesia.',
    benefits: ['FC Points dan Silver lengkap', 'Khusus region Indonesia', 'Instruksi UID jelas', 'Mudah scale up'],
    accountInstructions: [
      'Hanya untuk region Indonesia.',
      'Buka pengaturan akun dan salin FC UID menggunakan tombol di samping FC UID.',
    ],
    playerIdLabel: 'FC UID',
    playerIdPlaceholder: 'Masukkan FC UID',
    playerIdInputMode: 'numeric',
    packages: fcMobilePackages,
  },
  {
    id: 8,
    slug: 'league-of-legends',
    title: 'League of Legends',
    category: 'PC MOBA',
    accent: 'accent-pink',
    image: leagueOfLegendsBanner,
    imageFit: 'cover',
    imagePosition: 'center top',
    imageScale: '114%',
    heroLabel: 'LoL Cores',
    description:
      'Top up League of Legends dengan pilihan Cores lengkap untuk kebutuhan pass, skin, dan event store Riot.',
    benefits: ['Pilihan Cores lengkap', 'Input Riot ID + Tag', 'Layout desktop-mobile', 'Visual kuat'],
    accountInstructions: [
      'Untuk menemukan Riot ID Anda, buka halaman profil akun dan salin Riot ID + Tag menggunakan tombol di samping Riot ID.',
      'Contoh: admin#123',
    ],
    playerIdLabel: 'Riot ID + Tag',
    playerIdPlaceholder: 'Contoh: admin#123',
    playerIdInputMode: 'text',
    playerIdMaxLength: 32,
    packages: leagueOfLegendsPackages,
  },
  {
    id: 9,
    slug: 'zepeto',
    title: 'Zepetto',
    category: 'Social Avatar',
    accent: 'accent-violet',
    image: zepettoBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'ZEMs & Coins',
    description:
      'Top up ZEMs dan Coins Zepetto dengan format username yang mudah diisi dan pilihan nominal yang sudah lengkap.',
    benefits: ['Paket ZEMs lengkap', 'Paket Coins tersedia', 'Cocok untuk avatar dan item shop', 'Form username fleksibel'],
    accountInstructions: [
      'Login ke akun Anda dan buka Profil Anda.',
      'Username ZEPETO ada di bawah foto profil dan bisa disalin dengan sekali ketukan.',
      'Mohon jangan ubah username ZEPETO setelah pembelian sampai pesanan diterima.',
    ],
    playerIdLabel: 'Username ZEPETO',
    playerIdPlaceholder: 'Masukkan username ZEPETO',
    playerIdInputMode: 'text',
    playerIdMaxLength: 32,
    packages: zepetoPackages,
  },
  {
    id: 11,
    slug: 'arena-breakout',
    title: 'Arena Breakout',
    category: 'Extraction Shooter',
    accent: 'accent-indigo',
    image: arenaBreakoutBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    cardImageFit: 'cover',
    cardImagePosition: 'center top',
    cardImageScale: '116%',
    heroMinHeight: '640px',
    heroLabel: 'Battle Pass & Bonds',
    description:
      'Halaman Arena Breakout siap dipakai untuk battle pass dan Bonds dengan petunjuk ID yang lebih jelas.',
    benefits: ['Battle pass lengkap', 'Paket Bonds lengkap', 'Alur checkout konsisten', 'Cocok untuk promo event'],
    accountInstructions: [
      'Ketuk ikon karakter untuk membuka profil akun.',
      'User ID tercantum di bawah nama karakter Anda.',
      'Contoh ID: 1234567890',
    ],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Arena Breakout',
    playerIdInputMode: 'numeric',
    packages: arenaBreakoutPackages,
  },
  {
    id: 12,
    slug: 'call-of-duty-mobile',
    title: 'Call of Duty Mobile',
    category: 'FPS',
    accent: 'accent-indigo',
    image: callOfDutyMobileBanner,
    imageFit: 'cover',
    imagePosition: 'center top',
    imageScale: '114%',
    heroLabel: 'CP Store',
    description:
      'Top up Call of Duty Mobile dengan pilihan CP lengkap untuk battle pass, lucky draw, dan bundle event.',
    benefits: ['Nominal CP lengkap', 'Petunjuk OpenID tersedia', 'Tampilan solid', 'Mudah sambung backend'],
    accountInstructions: [
      'Klik ikon pengaturan di kanan layar lalu buka tab lainnya.',
      'OpenID bisa ditemukan di bagian bawah halaman tersebut.',
      'Silakan masukkan OpenID Anda di form.',
    ],
    playerIdLabel: 'Open ID',
    playerIdPlaceholder: 'Masukkan Open ID CODM',
    playerIdInputMode: 'numeric',
    packages: callOfDutyMobilePackages,
  },
  {
    id: 13,
    slug: 'blood-strike',
    title: 'Blood Strike',
    category: 'Battle Royale FPS',
    accent: 'accent-red',
    image: bloodStrikeBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    cardImageFit: 'cover',
    cardImagePosition: 'center top',
    cardImageScale: '116%',
    heroMinHeight: '640px',
    heroLabel: 'Gold Store',
    description:
      'Top up Blood Strike dengan pilihan Gold yang lengkap, termasuk bonus gold untuk nominal besar.',
    benefits: ['Daftar Gold panjang', 'Cocok untuk event top up', 'Checkout konsisten', 'Input user ID sederhana'],
    accountInstructions: [
      'Klik ikon profil untuk membuka data akun Anda.',
      'User ID tercantum di bawah nama karakter.',
    ],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Blood Strike',
    playerIdInputMode: 'numeric',
    packages: bloodStrikePackages,
  },
  {
    id: 14,
    slug: 'delta-force',
    title: 'Delta Force',
    category: 'PC Tactical Shooter',
    accent: 'accent-slate',
    image: deltaForceBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'Delta Coins',
    description:
      'Top up Delta Force PC dengan daftar Delta Coins lengkap untuk kebutuhan gear, pass, dan item premium.',
    benefits: ['Khusus Delta Force PC', 'Nominal lengkap', 'Instruksi ID jelas', 'Checkout konsisten'],
    accountInstructions: [
      'Masuk ke profile Anda untuk melihat data akun.',
      'User ID tercantum di bawah nama karakter Anda.',
      'Contoh: 1234567890',
    ],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Delta Force',
    playerIdInputMode: 'numeric',
    packages: deltaForcePackages,
  },
  {
    id: 15,
    slug: 'growtopia',
    title: 'Growtopia',
    category: 'Sandbox MMO',
    accent: 'accent-green',
    image: growtopiaBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'Packs & Passes',
    description:
      'Top up Growtopia untuk gems pack, dungeon pass, dan subscription token dengan daftar produk yang sudah siap dipakai.',
    benefits: ['Banyak item pack', 'Cocok untuk pemain aktif', 'GrowID lebih jelas', 'Bisa langsung checkout'],
    accountInstructions: [
      'Luncurkan game dan klik Play Online.',
      'Masuk ke halaman Log In.',
      'Di sisi kanan halaman tersebut Anda akan menemukan kolom yang menunjukkan GrowID Anda.',
    ],
    playerIdLabel: 'GrowID',
    playerIdPlaceholder: 'Masukkan GrowID',
    playerIdInputMode: 'text',
    playerIdMaxLength: 32,
    packages: growtopiaPackages,
  },
  {
    id: 16,
    slug: 'honkai-impact-3',
    title: 'Honkai Impact 3',
    category: 'Action RPG',
    accent: 'accent-violet',
    image: honkaiImpactBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'B-Chips & Crystal',
    description:
      'Top up Honkai Impact 3 untuk Monthly Card, B-Chips, dan Crystal dengan kategori produk yang sudah dipisah rapi.',
    benefits: ['Monthly Card tersedia', 'B-Chips lengkap', 'Crystal lengkap', 'Instruksi user ID jelas'],
    accountInstructions: [
      'Buka aplikasi Honkai Impact 3 lalu klik informasi level di kiri atas layar.',
      'User ID Anda akan terlihat di sana.',
    ],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Honkai Impact 3',
    playerIdInputMode: 'numeric',
    packages: honkaiImpactPackages,
  },
  {
    id: 17,
    slug: 'magic-chess-go-go',
    title: 'Magic Chess: Go Go',
    category: 'Auto Battler',
    accent: 'accent-gold',
    image: magicChessBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'Diamond Store',
    description:
      'Top up Magic Chess: Go Go untuk weekly card, diamond, dan first recharge dengan bonus yang ikut ditampilkan.',
    benefits: ['Weekly card tersedia', 'Bonus diamond tampil jelas', 'First recharge ada', 'Cocok untuk event top up'],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Magic Chess',
    playerIdInputMode: 'numeric',
    packages: magicChessPackages,
  },
  {
    id: 18,
    slug: 'point-blank',
    title: 'Point Blank',
    category: 'FPS',
    accent: 'accent-indigo',
    image: pointBlankBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'PB Cash',
    description:
      'Top up Point Blank dengan pilihan PB Cash dari nominal kecil sampai besar untuk item shop dan event bundle.',
    benefits: ['PB Cash lengkap', 'Checkout simpel', 'Cocok untuk promo event', 'Struktur halaman konsisten'],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Point Blank',
    playerIdInputMode: 'text',
    playerIdMaxLength: 32,
    packages: pointBlankPackages,
  },
  {
    id: 19,
    slug: 'pubg-new-state-mobile',
    title: 'PUBG: New State Mobile',
    category: 'Survival',
    accent: 'accent-cyan',
    image: pubgNewStateBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'NC Store',
    description:
      'Top up PUBG: New State Mobile untuk NC dan bonus NC dengan susunan nominal yang siap dipakai di checkout.',
    benefits: ['Bonus NC tersedia', 'Nominal ringkas', 'Layout tetap konsisten', 'Mudah ditambah lagi nanti'],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID New State',
    playerIdInputMode: 'numeric',
    packages: pubgNewStatePackages,
  },
  {
    id: 20,
    slug: 'sausage-man',
    title: 'Sausage Man',
    category: 'Battle Royale',
    accent: 'accent-orange',
    image: sausageManBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'Candy Store',
    description:
      'Top up Sausage Man dengan pilihan Candy lengkap untuk skin, pass, dan kebutuhan event in-game lainnya.',
    benefits: ['Candy lengkap', 'Instruksi user ID jelas', 'Cocok untuk semua nominal', 'Checkout siap pakai'],
    accountInstructions: [
      'Klik menu profile di kiri atas pada menu utama game.',
      'User ID akan terlihat di bagian bawah kanan karakter game Anda.',
      'Contoh ID: v2aer',
    ],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Sausage Man',
    playerIdInputMode: 'text',
    playerIdMaxLength: 24,
    packages: sausageManPackages,
  },
  {
    id: 21,
    slug: 'arena-of-valor',
    title: 'Arena of Valor',
    category: 'MOBA',
    accent: 'accent-cyan',
    image: arenaOfValorBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'Vouchers',
    description:
      'Top up Arena of Valor dengan pilihan vouchers lengkap untuk skin, event, dan kebutuhan in-game lainnya.',
    benefits: ['Nominal vouchers lengkap', 'Instruksi Player ID jelas', 'Cocok untuk semua nominal', 'Checkout siap pakai'],
    accountInstructions: [
      'Ketuk ikon pengaturan lalu scroll ke bawah ke bagian Umum.',
      'Klik Player ID untuk melihat ID akun Anda.',
      'Contoh: 888347346994333',
    ],
    playerIdLabel: 'Player ID',
    playerIdPlaceholder: 'Masukkan Player ID Arena of Valor',
    playerIdInputMode: 'numeric',
    packages: arenaOfValorPackages,
  },
  {
    id: 22,
    slug: 'arena-breakout-infinite-pc',
    title: 'Arena Breakout: Infinite (PC)',
    category: 'PC Extraction Shooter',
    accent: 'accent-slate',
    image: arenaBreakoutInfiniteBannerFull,
    imageFit: 'contain',
    imagePosition: 'center top',
    imageScale: '100%',
    heroMinHeight: '640px',
    heroLabel: 'Bonds',
    description:
      'Top up Arena Breakout: Infinite (PC) dengan pilihan Bonds lengkap untuk kebutuhan item premium dan progres akun.',
    benefits: ['Khusus versi PC', 'Pilihan Bonds lengkap', 'Struktur checkout konsisten', 'Siap dipakai langsung'],
    playerIdLabel: 'User ID',
    playerIdPlaceholder: 'Masukkan user ID Arena Breakout Infinite',
    playerIdInputMode: 'numeric',
    packages: arenaBreakoutInfinitePackages,
  },
];

export const getGameBySlug = (slug: string) =>
  games.find((game) => game.slug === slug);

export const paymentGroups: PaymentGroup[] = [
  {
    id: 'qris',
    title: 'QRIS',
    methods: [
      { id: 'qris-main', brand: 'QRIS', label: 'QRIS All Payment', fee: 0, logoSrc: qrisLogo, logoAlt: 'Logo QRIS' },
    ],
  },
];
