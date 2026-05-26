import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeHelp, ChevronDown, ChevronUp, Info, ShieldCheck, Wallet, X, Zap } from 'lucide-react';
import '../assets/game-detail.css';
import { paymentGroups } from '../data/games';
import type { GameDetail } from '../data/games';
import type { PaymentDraft } from '../types/payment';

interface GameDetailPageProps {
  game: GameDetail;
  onBack: () => void;
  onStartPayment: (payment: PaymentDraft) => Promise<void>;
}

type NoticeState = {
  message: string;
  variant: 'info' | 'error';
};

type ApiService = {
  code: string;
  game: string;
  name: string;
  price: {
    basic: number;
    premium?: number;
    special?: number;
  };
  description?: string | null;
  server?: string;
  status?: string;
};

type DisplayPackage = NonNullable<GameDetail['packages']>[number] & {
  serviceCode?: string;
  sellingPrice?: number;
  resellerPrice?: number;
};

type NicknameLookupResponse = {
  success?: boolean;
  nickname?: string;
  message?: string;
};

type NicknameLookupState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  nickname: string;
  message: string;
};

const API_BASE_URL =
  typeof window !== 'undefined' &&
  (
    window.location.hostname === 'javestopup.site' ||
    window.location.hostname === 'www.javestopup.site'
  )
    ? window.location.origin
    : 'http://141.11.25.134:3000';

const NICKNAME_API_BASE_URL =
  typeof window !== 'undefined' &&
  (
    window.location.hostname === 'javestopup.site' ||
    window.location.hostname === 'www.javestopup.site'
  )
    ? window.location.origin
    : 'https://javestopup.site';

const resellerGameNamesBySlug: Record<string, string[]> = {
  'arena-breakout': ['Arena Breakout'],
  'arena-breakout-infinite-pc': ['Arena Breakout: Infinite (PC)'],
  'arena-of-valor': ['Arena of Valor'],
  'call-of-duty-mobile': ['Call Of Duty Mobile (Indonesia)', 'Call of Duty Mobile (Indonesia)'],
  'fc-mobile': ['EA SPORTS FC Mobile'],
  'free-fire': ['Free Fire'],
  'genshin-impact': ['Genshin Impact'],
  'honor-of-kings': ['Honor of Kings Global', 'Honor of Kings'],
  'league-of-legends': ['League of Legends'],
  'mobile-legends': ['Mobile Legends A', 'Mobile Legends', 'Mobile Legends (Global)'],
  'pubg-mobile': ['PUBG Mobile'],
  'roblox': ['Roblox'],
  'valorant': ['Valorant'],
  'zepeto': ['Zepetto', 'Zepeto'],
};

const strictServiceSyncGames = new Set(['mobile-legends']);

type ApiServicesResponse = {
  result?: boolean;
  data?: ApiService[] | null;
  message?: string;
};

const cachedServicesBySlug = new Map<string, ApiService[]>();
const servicesRequestBySlug = new Map<string, Promise<ApiService[]>>();

const canonicalizeUnit = (value: string) =>
  value
    .replace(/\bdiamonds\b/g, 'diamond')
    .replace(/\bpoints\b/g, 'point')
    .replace(/\bbonds\b/g, 'bond')
    .replace(/\btokens\b/g, 'token')
    .replace(/\bvouchers\b/g, 'voucher')
    .replace(/\bcores\b/g, 'core')
    .replace(/\bcandies\b/g, 'candy')
    .replace(/\bzems\b/g, 'zem')
    .replace(/\bcoins\b/g, 'coin');

const matchableUnitPhrases = [
  'weekly diamond pass',
  'weekly card',
  'weekly pass',
  'monthly card',
  'first recharge',
  'b chip',
  'fc point',
  'diamond',
  'point',
  'token',
  'voucher',
  'core',
  'candy',
  'zem',
  'coin',
  'bond',
  'crystal',
  'silver',
  'gold',
  'pack',
  'pass',
  'cash',
  'uc',
  'cp',
  'nc',
].sort((left, right) => right.length - left.length);

const normalizeText = (value: string) =>
  canonicalizeUnit(
    value
      .toLowerCase()
      .replace(/(\d)[.,](\d)/g, '$1$2')
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\b(\d+)x\b/g, '$1')
      .replace(/\s+/g, ' ')
      .replace(/[^\w#+]+/g, ' ')
      .trim(),
  );

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getNameVariants = (name: string) => {
  const normalizedName = normalizeText(name);
  const compactName = normalizedName.replace(/\bbonus\b/g, '').replace(/\s+/g, ' ').trim();
  const leadingAmountMatch = compactName.match(/^(\d+(?:\s+\d+)*)\s+([a-z#+]+)/);
  const variants = new Set<string>([normalizedName, compactName]);

  if (leadingAmountMatch) {
    variants.add(`${leadingAmountMatch[1]} ${leadingAmountMatch[2]}`.trim());
  }

  matchableUnitPhrases.forEach((unitPhrase) => {
    const matcher = new RegExp(`(\\d+(?:\\s+\\d+)*)\\s+${escapeRegExp(unitPhrase)}\\b`, 'g');

    for (const match of compactName.matchAll(matcher)) {
      variants.add(`${match[1]} ${unitPhrase}`.trim());
    }
  });

  return Array.from(variants).filter(Boolean);
};

const parseLocalPrice = (value: string) => Number(value.replace(/[^\d]/g, ''));

const formatDisplayPrice = (value: number) => `Rp${value.toLocaleString('id-ID')}`;

const getSelectedPackageBasePrice = (item: { price: string; sellingPrice?: number }) =>
  item.sellingPrice ?? parseLocalPrice(item.price);

const getServicePrice = (service: ApiService) => service.price.basic ?? service.price.premium ?? service.price.special ?? 0;

const inferRemotePackageGroup = (gameSlug: string, serviceName: string) => {
  const normalizedServiceName = normalizeText(serviceName);

  if (gameSlug === 'mobile-legends') {
    if (normalizedServiceName.includes('pass')) {
      return 'weekly-pass';
    }

    return 'diamonds';
  }

  return 'general';
};

const getServicesByGame = async (gameSlug: string, resellerGameNames: string[]) => {
  const cachedServices = cachedServicesBySlug.get(gameSlug);

  if (cachedServices) {
    return cachedServices;
  }

  const pendingRequest = servicesRequestBySlug.get(gameSlug);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = (async () => {
    for (const resellerGameName of resellerGameNames) {
      const response = await fetch(
        `${API_BASE_URL}/api/services?${new URLSearchParams({ filter_game: resellerGameName }).toString()}`,
      );

      if (!response.ok) {
        throw new Error(
          `GET /api/services?filter_game=${encodeURIComponent(resellerGameName)} gagal dengan status ${response.status}`,
        );
      }

      const payload = (await response.json()) as ApiServicesResponse;
      const services = payload.data ?? [];

      if (payload.result === false && payload.message === 'Layanan tidak ditemukan.') {
        continue;
      }

      if (services.length > 0) {
        return services;
      }
    }

    return [];
  })()
    .then((services) => {
      cachedServicesBySlug.set(gameSlug, services);
      return services;
    })
    .finally(() => {
      servicesRequestBySlug.delete(gameSlug);
    });

  servicesRequestBySlug.set(gameSlug, request);

  return request;
};

const renderPaymentMethodVisual = (groupId: string, method: (typeof paymentGroups)[number]['methods'][number], className?: string) => {
  if (method.logoSrc) {
    return <img src={method.logoSrc} alt={method.logoAlt ?? method.brand} className={className ?? 'detail-payment-logo'} />;
  }

  return <span className={`detail-payment-badge detail-payment-badge-${groupId}`}>{method.brand}</span>;
};

const GameDetailPage = ({ game, onBack, onStartPayment }: GameDetailPageProps) => {
  const isPosterHero = game.imageFit === 'contain' && Boolean(game.heroMinHeight);
  const [selectedPackageGroup, setSelectedPackageGroup] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [expandedPaymentId, setExpandedPaymentId] = useState('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [secondaryFieldValue, setSecondaryFieldValue] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [paymentNotice, setPaymentNotice] = useState<NoticeState | null>(null);
  const [availablePackages, setAvailablePackages] = useState<DisplayPackage[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [nicknameLookup, setNicknameLookup] = useState<NicknameLookupState>({
    status: 'idle',
    nickname: '',
    message: '',
  });
  const customerSectionRef = useRef<HTMLElement | null>(null);
  const packageSectionRef = useRef<HTMLElement | null>(null);
  const playerIdInputRef = useRef<HTMLInputElement | null>(null);
  const serverZoneInputRef = useRef<HTMLInputElement | null>(null);
  const whatsAppInputRef = useRef<HTMLInputElement | null>(null);
  const noticeTimeoutRef = useRef<number | null>(null);
  const nicknameRequestIdRef = useRef(0);

  const selectedPackage = useMemo(
    () => availablePackages.find((item) => item.id === selectedPackageId),
    [availablePackages, selectedPackageId],
  );

  useEffect(() => {
    let isActive = true;

    const resellerGameNames = resellerGameNamesBySlug[game.slug] ?? [game.title];
    const isStrictServiceSync = strictServiceSyncGames.has(game.slug);

    const toLocalPackageFallback = () =>
      game.packages.map((item) => ({
        ...item,
        price: formatDisplayPrice(getSelectedPackageBasePrice(item)),
        sellingPrice: parseLocalPrice(item.price),
      }));

    const localPackagesByName = new Map<string, GameDetail['packages'][number]>();

    game.packages.forEach((item) => {
      getNameVariants(item.name).forEach((variant) => {
        if (!localPackagesByName.has(variant)) {
          localPackagesByName.set(variant, item);
        }
      });
    });

    const syncPackagesForGame = async () => {
      setIsLoadingServices(true);
      setServicesError(null);
      const localPackages = toLocalPackageFallback();
      setAvailablePackages(isStrictServiceSync ? [] : localPackages);

      if (resellerGameNames.length === 0) {
        setIsLoadingServices(false);
        return;
      }

      try {
        const services = await getServicesByGame(game.slug, resellerGameNames);

        const availableServices = services.filter(
          (service) => !service.status || service.status === 'available',
        );

        const getMatchedLocalPackage = (serviceName: string) =>
          getNameVariants(serviceName)
            .map((variant) => localPackagesByName.get(variant))
            .find((item): item is GameDetail['packages'][number] => Boolean(item));

        const remotePackages = availableServices
          .map((service) => {
            const localPackage = getMatchedLocalPackage(service.name);
            const servicePrice = getServicePrice(service);
            const localSellingPrice = localPackage ? parseLocalPrice(localPackage.price) : undefined;
            const effectiveSellingPrice =
              typeof localSellingPrice === 'number'
                ? Math.max(localSellingPrice, servicePrice)
                : servicePrice;

            return {
              id: service.code,
              name: localPackage?.name ?? service.name,
              price: formatDisplayPrice(
                getSelectedPackageBasePrice({
                  price: formatDisplayPrice(effectiveSellingPrice),
                  sellingPrice: effectiveSellingPrice,
                }),
              ),
              group: localPackage?.group ?? inferRemotePackageGroup(game.slug, service.name),
              bonus: localPackage?.bonus,
              discount: localPackage?.discount,
              serviceCode: service.code,
              sellingPrice: effectiveSellingPrice,
              resellerPrice: servicePrice,
            } satisfies DisplayPackage;
          })
          .sort((left, right) => (left.sellingPrice ?? 0) - (right.sellingPrice ?? 0));

        const cheapestServiceByName = new Map<string, ApiService>();

        availableServices.forEach((service) => {
          const localPackage = getMatchedLocalPackage(service.name);
          const normalizedName = localPackage ? normalizeText(localPackage.name) : normalizeText(service.name);
          const currentService = cheapestServiceByName.get(normalizedName);
          const servicePrice = getServicePrice(service);

          if (!currentService || servicePrice < getServicePrice(currentService)) {
            cheapestServiceByName.set(normalizedName, service);
          }
        });

        const mappedPackages = Array.from(cheapestServiceByName.values())
          .map((service) => {
            const localPackage = getMatchedLocalPackage(service.name);
            const servicePrice = getServicePrice(service);

            if (!localPackage) {
              console.warn(
                `[pricing] Missing selling price mapping for serviceCode "${service.code}" and product "${service.name}" in game "${game.slug}".`,
              );
              return null;
            }

            const localSellingPrice = parseLocalPrice(localPackage.price);
            const effectiveSellingPrice = Math.max(localSellingPrice, servicePrice);

            return {
              id: service.code,
              name: localPackage.name,
              price: formatDisplayPrice(
                getSelectedPackageBasePrice({
                  price: formatDisplayPrice(effectiveSellingPrice),
                  sellingPrice: effectiveSellingPrice,
                }),
              ),
              group: localPackage.group,
              bonus: localPackage.bonus,
              discount: localPackage.discount,
              serviceCode: service.code,
              sellingPrice: effectiveSellingPrice,
              resellerPrice: servicePrice,
            } satisfies DisplayPackage;
          })
          .filter((item) => item !== null) as DisplayPackage[];

        const nextPackages =
          isStrictServiceSync
            ? remotePackages
            : mappedPackages.length > 0
            ? mappedPackages.sort((left, right) => (left.sellingPrice ?? 0) - (right.sellingPrice ?? 0))
            : toLocalPackageFallback();

        if (isActive) {
          setAvailablePackages(nextPackages);
          setServicesError(
            isStrictServiceSync && remotePackages.length === 0
              ? 'Katalog produk otomatis belum tersedia untuk game ini.'
              : mappedPackages.length === 0 && services.length > 0 && !isStrictServiceSync
              ? 'Produk reseller ditemukan, tetapi nama nominal belum sinkron penuh dengan daftar website.'
              : null,
          );
        }
      } catch {
        if (isActive) {
          setAvailablePackages(isStrictServiceSync ? [] : localPackages);
          setServicesError(
            isStrictServiceSync
              ? 'Produk reseller belum bisa dimuat untuk game ini. Coba lagi beberapa saat.'
              : 'Produk reseller belum bisa dimuat, sementara memakai daftar lokal.',
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingServices(false);
        }
      }
    };

    void syncPackagesForGame();

    return () => {
      isActive = false;
    };
  }, [game]);

  const packageGroups = useMemo(() => {
    const seen = new Set<string>();
    const groupPriority: Record<string, number> = {
      diamonds: 0,
      membership: 1,
      'weekly-pass': 2,
      'weekly-card': 3,
      points: 4,
      tokens: 5,
      zems: 6,
      coins: 7,
      passes: 8,
      bonds: 9,
      golds: 10,
      cp: 11,
      'fc-points': 12,
      silver: 13,
      packs: 14,
      'monthly-card': 15,
      'b-chips': 16,
      crystals: 17,
      cores: 18,
      'first-recharge': 19,
      cash: 20,
      nc: 21,
      uc: 22,
      candies: 23,
    };

    const gameSpecificGroupPriority: Record<string, number> =
      game.slug === 'honor-of-kings'
        ? {
            tokens: 0,
            'weekly-card': 1,
          }
        : game.slug === 'arena-breakout'
          ? {
              bonds: 0,
              passes: 1,
            }
          : game.slug === 'honkai-impact-3'
            ? {
                crystals: 0,
                'monthly-card': 1,
                'b-chips': 2,
              }
        : {};

    return game.packages
      .length === 0
      ? []
      : availablePackages
      .map((item) => item.group)
      .filter((group): group is string => {
        if (!group || seen.has(group)) {
          return false;
        }

        seen.add(group);
        return true;
      })
      .sort((left, right) => {
        const leftPriority = gameSpecificGroupPriority[left] ?? groupPriority[left] ?? 99;
        const rightPriority = gameSpecificGroupPriority[right] ?? groupPriority[right] ?? 99;

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        return left.localeCompare(right);
      });
  }, [availablePackages, game.packages.length, game.slug]);

  const hasPackageGroups = packageGroups.length > 1;

  const visiblePackages = useMemo(() => {
    if (!hasPackageGroups || !selectedPackageGroup) {
      return availablePackages;
    }

    return availablePackages.filter((item) => item.group === selectedPackageGroup);
  }, [availablePackages, hasPackageGroups, selectedPackageGroup]);

  const selectedPaymentMethod = useMemo(
    () =>
      paymentGroups
        .flatMap((group) => group.methods)
        .find((method) => method.id === selectedPaymentMethodId),
    [selectedPaymentMethodId],
  );

  useEffect(() => {
    setSelectedPackageGroup(packageGroups[0] ?? '');
    setSelectedPackageId('');
    setExpandedPaymentId('');
    setSelectedPaymentMethodId('');
    setIsCheckoutDialogOpen(false);
    setPlayerId('');
    setSecondaryFieldValue('');
    setWhatsAppNumber('');
    setNicknameLookup({
      status: 'idle',
      nickname: '',
      message: '',
    });
    setPaymentNotice(null);
  }, [game.slug, packageGroups]);

  useEffect(() => {
    if (!paymentNotice) {
      return;
    }

    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current);
    }

    noticeTimeoutRef.current = window.setTimeout(() => {
      setPaymentNotice(null);
      noticeTimeoutRef.current = null;
    }, 2800);

    return () => {
      if (noticeTimeoutRef.current) {
        window.clearTimeout(noticeTimeoutRef.current);
        noticeTimeoutRef.current = null;
      }
    };
  }, [paymentNotice]);

  useEffect(() => {
    const trimmedPlayerId = playerId.trim();
    const trimmedSecondaryField = secondaryFieldValue.trim();
    const requiresSecondaryField = Boolean(game.secondaryField);

    if (!trimmedPlayerId || (requiresSecondaryField && !trimmedSecondaryField)) {
      setNicknameLookup({
        status: 'idle',
        nickname: '',
        message: '',
      });
      return;
    }

    setNicknameLookup({
      status: 'loading',
      nickname: '',
      message: '',
    });

    const nextRequestId = nicknameRequestIdRef.current + 1;
    nicknameRequestIdRef.current = nextRequestId;

    const debounceTimer = window.setTimeout(() => {
      const fetchNickname = async () => {
        try {
          const response = await fetch(`${NICKNAME_API_BASE_URL}/api/nickname`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: game.slug,
              target: trimmedPlayerId,
              additional_target: trimmedSecondaryField || undefined,
            }),
          });

          const payload = (await response.json()) as NicknameLookupResponse;

          if (nicknameRequestIdRef.current !== nextRequestId) {
            return;
          }

          if (!response.ok || payload.success === false || !payload.nickname?.trim()) {
            setNicknameLookup({
              status: 'error',
              nickname: '',
              message: 'Nickname tidak ditemukan, pastikan User ID dan Zone/Server benar.',
            });
            return;
          }

          setNicknameLookup({
            status: 'success',
            nickname: payload.nickname.trim(),
            message: payload.message ?? 'Success.',
          });
        } catch {
          if (nicknameRequestIdRef.current !== nextRequestId) {
            return;
          }

          setNicknameLookup({
            status: 'error',
            nickname: '',
            message: 'Nickname tidak ditemukan, pastikan User ID dan Zone/Server benar.',
          });
        }
      };

      void fetchNickname();
    }, 700);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [game.secondaryField, game.slug, playerId, secondaryFieldValue]);

  const packageDescription = useMemo(() => {
    if (isLoadingServices) {
      return 'Sedang memuat produk terbaru untuk game ini.';
    }

    if (servicesError) {
      return servicesError;
    }

    if (hasPackageGroups) {
      return 'Pilih kategori dulu, lalu tentukan nominal yang ingin kamu beli.';
    }

    return 'Nominal bisa kamu ganti lagi nanti dari data produk asli.';
  }, [hasPackageGroups, isLoadingServices, servicesError]);

  const basePrice = useMemo(() => {
    if (!selectedPackage) {
      return 0;
    }

    return getSelectedPackageBasePrice(selectedPackage);
  }, [selectedPackage]);

  const sanitizeInput = (value: string, inputMode: 'numeric' | 'text' = 'numeric', maxLength?: number) => {
    const normalizedValue = inputMode === 'numeric' ? value.replace(/\D/g, '') : value;
    return typeof maxLength === 'number' ? normalizedValue.slice(0, maxLength) : normalizedValue;
  };

  const formatPrice = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

  const formatPackageGroupLabel = (group: string) => {
    if (group === 'diamonds') {
      return 'Diamonds';
    }

    if (group === 'weekly-pass') {
      return 'Weekly Pass';
    }

    if (group === 'membership') {
      return 'Membership';
    }

    if (group === 'weekly-card') {
      return 'Weekly Card';
    }

    if (group === 'fc-points') {
      return 'FC Points';
    }

    if (group === 'monthly-card') {
      return 'Monthly Card';
    }

    if (group === 'b-chips') {
      return 'B-Chips';
    }

    if (group === 'first-recharge') {
      return 'First Recharge';
    }

    if (group === 'cash') {
      return 'PB Cash';
    }

    if (group === 'nc') {
      return 'NC';
    }

    if (group === 'uc') {
      return 'UC';
    }

    return group
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const formatPackageGroupBadge = (group?: string) => {
    if (group === 'weekly-pass') {
      return 'WP';
    }

    if (group === 'membership') {
      return 'MB';
    }

    if (group === 'weekly-card') {
      return 'WC';
    }

    if (group === 'points') {
      return 'PT';
    }

    if (group === 'tokens') {
      return 'TK';
    }

    if (group === 'zems') {
      return 'ZM';
    }

    if (group === 'coins') {
      return 'CN';
    }

    if (group === 'passes') {
      return 'PS';
    }

    if (group === 'bonds') {
      return 'BD';
    }

    if (group === 'golds') {
      return 'GD';
    }

    if (group === 'cp') {
      return 'CP';
    }

    if (group === 'fc-points') {
      return 'FC';
    }

    if (group === 'silver') {
      return 'SV';
    }

    if (group === 'packs') {
      return 'PK';
    }

    if (group === 'monthly-card') {
      return 'MC';
    }

    if (group === 'b-chips') {
      return 'BC';
    }

    if (group === 'crystals') {
      return 'CR';
    }

    if (group === 'cores') {
      return 'CO';
    }

    if (group === 'first-recharge') {
      return 'FR';
    }

    if (group === 'cash') {
      return 'PB';
    }

    if (group === 'nc') {
      return 'NC';
    }

    if (group === 'uc') {
      return 'UC';
    }

    if (group === 'candies') {
      return 'CD';
    }

    return 'DM';
  };

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement | null>) => {
    if (!sectionRef.current) {
      return;
    }

    const headerOffset = 130;
    const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(sectionTop, 0),
      behavior: 'smooth',
    });
  };

  const scrollToInput = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (!inputRef.current) {
      return;
    }

    const headerOffset = 118;
    const inputTop = inputRef.current.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(inputTop, 0),
      behavior: 'smooth',
    });

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 220);
  };

  const hasCustomerData = game.secondaryField
    ? Boolean(playerId.trim() && secondaryFieldValue.trim() && whatsAppNumber.trim())
    : Boolean(playerId.trim() && whatsAppNumber.trim());

  const isNicknameVerified = nicknameLookup.status === 'success' && Boolean(nicknameLookup.nickname);
  const checkoutReady = Boolean(selectedPackage && selectedPaymentMethod && hasCustomerData && isNicknameVerified);
  const totalPrice = selectedPaymentMethod ? basePrice + selectedPaymentMethod.fee : basePrice;

  const showMissingPackageNotice = () => {
    scrollToSection(packageSectionRef);
    setPaymentNotice({
      message: 'Silahkan pilih nominal top up terlebih dahulu',
      variant: 'info',
    });
  };

  const showMissingCustomerNotice = () => {
    if (!playerId.trim()) {
      scrollToInput(playerIdInputRef);
    } else if (game.secondaryField && !secondaryFieldValue.trim()) {
      scrollToInput(serverZoneInputRef);
    } else {
      scrollToInput(whatsAppInputRef);
    }

    setPaymentNotice({
      message: 'Silahkan isi data game terlebih dahulu',
      variant: 'error',
    });
  };

  const buildPendingPayment = (): PaymentDraft | null => {
    if (!selectedPackage) {
      return null;
    }

    if (!selectedPaymentMethod || !hasCustomerData) {
      return null;
    }

    if (!isNicknameVerified) {
      return null;
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 30 * 60 * 1000);
    const randomToken = Math.random().toString(36).slice(2, 10).toUpperCase();
    const orderPrefix = game.slug.slice(0, 2).toUpperCase();
    return {
      orderId: `${orderPrefix}-${Date.now()}-${randomToken}`,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      gameSlug: game.slug,
      gameTitle: game.title,
      packageName: selectedPackage.name,
      packagePrice: basePrice,
      totalPrice,
      paymentBrand: selectedPaymentMethod.brand,
      paymentLabel: selectedPaymentMethod.label,
      paymentFee: selectedPaymentMethod.fee,
      sellingPrice: basePrice,
      resellerPrice: selectedPackage.resellerPrice,
      playerId: playerId.trim(),
      playerIdLabel: game.playerIdLabel,
      nickname: nicknameLookup.nickname,
      zoneId: secondaryFieldValue.trim(),
      secondaryFieldLabel: game.secondaryField?.label,
      whatsAppNumber: whatsAppNumber.trim(),
      packageGroup: selectedPackage.group,
      serviceCode: selectedPackage.serviceCode,
    };
  };

  const handleCreateInvoice = async () => {
    if (!selectedPackage) {
      showMissingPackageNotice();
      return;
    }

    if (!hasCustomerData) {
      showMissingCustomerNotice();
      return;
    }

    if (!isNicknameVerified) {
      scrollToInput(playerIdInputRef);
      setPaymentNotice({
        message: 'Nickname player harus berhasil dicek sebelum melanjutkan checkout.',
        variant: 'error',
      });
      return;
    }

    setIsCreatingInvoice(true);

    try {
      const payment = buildPendingPayment();

      if (!payment) {
        return;
      }

      if (!payment.serviceCode || typeof payment.resellerPrice !== 'number') {
        setPaymentNotice({
          message: 'Produk ini belum siap untuk checkout otomatis. Pilih produk lain terlebih dahulu.',
          variant: 'error',
        });
        return;
      }

      await onStartPayment(payment);
    } catch (error) {
      setPaymentNotice({
        message: error instanceof Error ? error.message : 'Gagal membuat invoice pembayaran.',
        variant: 'error',
      });
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  return (
    <section className="detail-section">
      <div className="detail-container">
        <button type="button" className="detail-back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Kembali ke daftar game</span>
        </button>

        <div className="detail-layout">
          <aside className="detail-sidebar">
            <div className={`detail-hero-card ${game.accent}`}>
              <div
                className={`detail-hero-art ${isPosterHero ? 'is-poster' : ''}`.trim()}
                style={{ minHeight: isPosterHero ? undefined : game.heroMinHeight }}
              >
                <div className="detail-hero-badge">{game.category}</div>
                {game.image ? (
                  <img
                    src={game.image}
                    alt={game.title}
                    className={`detail-hero-image detail-hero-image-full ${game.imageFit === 'contain' ? 'is-contain' : 'is-cover'} ${isPosterHero ? 'is-poster' : ''}`.trim()}
                    style={{
                      objectPosition: game.imagePosition ?? 'center',
                      transform: `scale(${Number.parseFloat(game.imageScale ?? '100%') / 100})`,
                    }}
                  />
                ) : null}
                <div className="detail-hero-pattern" />
                <div className="detail-hero-copy">
                  <p className="detail-hero-label">{game.heroLabel}</p>
                  <h1>{game.title}</h1>
                </div>
              </div>

              <div className="detail-feature-grid">
                <div><ShieldCheck size={18} /> Jaminan layanan</div>
                <div><BadgeHelp size={18} /> Bantuan responsif</div>
                <div><Wallet size={18} /> Pembayaran aman</div>
                <div><Zap size={18} /> Proses instan</div>
              </div>

              <div className="detail-sidebar-copy">
                <h2>Top up {game.title} cepat dan aman</h2>
                <p>{game.description}</p>
              </div>

              <div className="detail-benefit-list">
                {game.benefits.map((benefit) => (
                  <span key={benefit}>{benefit}</span>
                ))}
              </div>
            </div>
          </aside>

          <div className="detail-main">
            <section ref={customerSectionRef} className="detail-panel">
              <div className="detail-panel-header">
                <span className="detail-step">1</span>
                <div>
                  <h2>Informasi Pelanggan</h2>
                  <p>Masukkan data akun untuk melanjutkan top up.</p>
                </div>
              </div>

              <div className="detail-form-grid">
                <label>
                  <span>{game.playerIdLabel ?? 'User ID'}</span>
                  <input
                    ref={playerIdInputRef}
                    type="text"
                    inputMode={game.playerIdInputMode ?? 'numeric'}
                    placeholder={game.playerIdPlaceholder ?? 'Masukkan user ID'}
                    value={playerId}
                    onChange={(event) =>
                      setPlayerId(
                        sanitizeInput(
                          event.target.value,
                          game.playerIdInputMode,
                          game.playerIdMaxLength,
                        ),
                      )
                    }
                  />
                </label>
                {game.secondaryField ? (
                  <label>
                    <span>{game.secondaryField.label}</span>
                    <input
                      ref={serverZoneInputRef}
                      type="text"
                      inputMode={game.secondaryField.inputMode ?? 'numeric'}
                      maxLength={game.secondaryField.maxLength}
                      placeholder={game.secondaryField.placeholder}
                      value={secondaryFieldValue}
                      onChange={(event) =>
                        setSecondaryFieldValue(
                          sanitizeInput(
                            event.target.value,
                            game.secondaryField?.inputMode,
                            game.secondaryField?.maxLength,
                          ),
                        )
                      }
                    />
                  </label>
                ) : null}
                <div className="detail-form-feedback detail-form-feedback-full" aria-live="polite">
                  {nicknameLookup.status === 'loading' ? (
                    <p className="detail-nickname-state is-loading">Sedang mengecek nickname...</p>
                  ) : null}

                  {nicknameLookup.status === 'success' ? (
                    <p className="detail-nickname-state is-success">
                      Nickname: <strong>{nicknameLookup.nickname}</strong>
                    </p>
                  ) : null}

                  {nicknameLookup.status === 'error' ? (
                    <p className="detail-nickname-state is-error">
                      Nickname tidak ditemukan, pastikan User ID dan Zone/Server benar.
                    </p>
                  ) : null}
                </div>
                <label className="detail-form-full">
                  <span>Nomor WhatsApp</span>
                  <input
                    ref={whatsAppInputRef}
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    inputMode="numeric"
                    maxLength={13}
                    value={whatsAppNumber}
                    onChange={(event) => setWhatsAppNumber(sanitizeInput(event.target.value, 'numeric', 13))}
                  />
                </label>
              </div>

              {game.accountInstructions?.length ? (
                <div className="detail-payment-note">
                  {game.accountInstructions.map((instruction) => (
                    <p key={instruction}>{instruction}</p>
                  ))}
                </div>
              ) : null}
            </section>

            <section ref={packageSectionRef} className="detail-panel">
              <div className="detail-panel-header">
                <span className="detail-step">2</span>
                <div>
                  <h2>Pilih Nominal Top Up</h2>
                  <p>{packageDescription}</p>
                </div>
              </div>

              {hasPackageGroups ? (
                <div className="detail-package-groups" role="tablist" aria-label={`Kategori top up ${game.title}`}>
                  {packageGroups.map((group) => (
                    <button
                      key={group}
                      type="button"
                      role="tab"
                      aria-selected={selectedPackageGroup === group}
                      className={`detail-package-group-tab ${selectedPackageGroup === group ? 'is-active' : ''}`}
                      onClick={() => {
                        setSelectedPackageGroup(group);
                        setSelectedPackageId('');
                        setSelectedPaymentMethodId('');
                      }}
                    >
                      <span>{formatPackageGroupLabel(group)}</span>
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="detail-package-grid">
                {visiblePackages.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`detail-package-card ${selectedPackageId === item.id ? 'is-selected' : ''}`}
                    onClick={() => {
                      const isSamePackage = selectedPackageId === item.id;
                      setSelectedPackageId(isSamePackage ? '' : item.id);
                      setSelectedPaymentMethodId('');
                    }}
                  >
                    <div className="detail-package-top">
                      <p>{item.name}</p>
                      {item.discount ? <span>{item.discount}</span> : null}
                    </div>
                    {item.bonus ? <small>{item.bonus}</small> : null}
                    <strong>{item.price}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section className="detail-panel detail-payment-panel">
              <div className="detail-panel-header">
                <span className="detail-step">3</span>
                <div>
                  <h2>Pilih Pembayaran</h2>
                  <p>Pilih metode pembayaran yang paling nyaman untuk checkout top up kamu.</p>
                </div>
              </div>

              <div className="detail-payment-groups">
                {paymentGroups.map((group) => {
                  const isExpanded = expandedPaymentId === group.id;
                  const togglePaymentGroup = () => {
                    if (!selectedPackage) {
                      showMissingPackageNotice();
                      return;
                    }

                    setExpandedPaymentId((current) => (current === group.id ? '' : group.id));
                  };

                  const trigger = (
                    <button
                      type="button"
                      className={`detail-payment-card-body ${isExpanded ? 'is-expanded' : ''}`}
                      onClick={togglePaymentGroup}
                    >
                      <div className="detail-payment-methods">
                        {group.methods.map((method) => (
                          <span key={method.id} className="detail-payment-method-visual">
                            {renderPaymentMethodVisual(group.id, method, 'detail-payment-logo detail-payment-logo-inline')}
                          </span>
                        ))}
                      </div>

                      <span className="detail-payment-chevron" aria-hidden="true">
                        {isExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                      </span>
                    </button>
                  );

                  return (
                    <div
                      key={group.id}
                      className={`detail-payment-card ${isExpanded ? 'is-expanded' : ''}`}
                    >
                      <div className="detail-payment-card-header">
                        <h3>{group.title}</h3>
                      </div>

                      {!isExpanded ? trigger : null}

                      {isExpanded ? (
                        <div className="detail-payment-dropdown">
                          <div className="detail-payment-options">
                            {group.methods.map((method) => {
                              const totalPrice = basePrice + method.fee;

                              return (
                                <button
                                  key={method.id}
                                  type="button"
                                  className={`detail-payment-option ${selectedPaymentMethodId === method.id ? 'is-selected' : ''}`}
                                  disabled={!selectedPackage}
                                  onClick={() => {
                                    if (!hasCustomerData) {
                                      showMissingCustomerNotice();
                                      return;
                                    }

                                    setSelectedPaymentMethodId((current) =>
                                      current === method.id ? '' : method.id,
                                    );
                                  }}
                                >
                                  <span className="detail-payment-option-brand">
                                    {renderPaymentMethodVisual(group.id, method)}
                                  </span>
                                  <strong>{selectedPackage ? formatPrice(totalPrice) : 'Pilih item terlebih dahulu'}</strong>
                                  <small>{method.label}</small>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      {isExpanded ? trigger : null}
                    </div>
                  );
                })}
              </div>

              <p className="detail-payment-note">
                {selectedPackage ? (
                  <>
                    Harga pembayaran otomatis mengikuti nominal <strong>{selectedPackage.name}</strong> dengan dasar harga{' '}
                    <strong>{formatPrice(basePrice)}</strong>.
                  </>
                ) : (
                  <>Pilih nominal top up dulu supaya harga di metode pembayaran muncul sesuai produk yang dipilih.</>
                )}
              </p>

              {checkoutReady ? (
                <div className="detail-checkout-bar">
                  <div className="detail-checkout-summary">
                    <span className="detail-checkout-icon" aria-hidden="true">
                      {formatPackageGroupBadge(selectedPackage?.group)}
                    </span>
                    <div className="detail-checkout-copy">
                      <strong>{selectedPackage?.name}</strong>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="detail-checkout-button"
                    onClick={() => setIsCheckoutDialogOpen(true)}
                  >
                    <span>Konfirmasi Pembelian</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              ) : null}
            </section>
          </div>
        </div>

        {paymentNotice ? (
          <div className={`detail-toast is-${paymentNotice.variant}`} role="status" aria-live="polite">
            <span className="detail-toast-icon">
              <Info size={18} />
            </span>
            <p>{paymentNotice.message}</p>
            <button
              type="button"
              className="detail-toast-close"
              aria-label="Tutup notifikasi"
              onClick={() => setPaymentNotice(null)}
            >
              <X size={18} />
            </button>
            <span className="detail-toast-progress" aria-hidden="true" />
          </div>
        ) : null}

        {isCheckoutDialogOpen && checkoutReady ? (
          <div className="detail-dialog-backdrop" role="presentation" onClick={() => setIsCheckoutDialogOpen(false)}>
            <div
              className="detail-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-dialog-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="detail-dialog-header">
                <div>
                  <h2 id="checkout-dialog-title">Detail Pesanan</h2>
                  <p>Jika data pesanan kamu sudah benar, klik beli sekarang.</p>
                </div>
                <button
                  type="button"
                  className="detail-dialog-close"
                  aria-label="Tutup dialog"
                  onClick={() => setIsCheckoutDialogOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="detail-dialog-section">
                <h3>Data Player</h3>
                <div className="detail-dialog-grid">
                  <span>{game.playerIdLabel ?? 'User ID'}</span>
                  <strong>{playerId}</strong>

                  <span>Nickname</span>
                  <strong>{nicknameLookup.nickname || '-'}</strong>

                  {game.secondaryField ? (
                    <>
                      <span>{game.secondaryField.label}</span>
                      <strong>{secondaryFieldValue}</strong>
                    </>
                  ) : null}

                  <span>Nomor Handphone</span>
                  <strong>{whatsAppNumber}</strong>
                </div>
              </div>

              <div className="detail-dialog-section">
                <h3>Ringkasan Pembelian</h3>
                <div className="detail-dialog-grid">
                  <span>Item</span>
                  <strong>{selectedPackage?.name}</strong>

                  <span>Harga</span>
                  <strong>{formatPrice(basePrice)}</strong>

                  <span>Fee</span>
                  <strong>{formatPrice(selectedPaymentMethod?.fee ?? 0)}</strong>

                  <span>Sistem Pembayaran</span>
                  <strong>{selectedPaymentMethod?.label}</strong>

                  <span>Total Pembayaran</span>
                  <strong>{formatPrice(totalPrice)}</strong>
                </div>
              </div>

              <div className="detail-dialog-actions">
                <button
                  type="button"
                  className="detail-dialog-cancel"
                  onClick={() => setIsCheckoutDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="detail-dialog-confirm"
                  disabled={isCreatingInvoice || !isNicknameVerified}
                  onClick={() => {
                    setIsCheckoutDialogOpen(false);
                    void handleCreateInvoice();
                  }}
                >
                  <span>Beli Sekarang</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default GameDetailPage;
