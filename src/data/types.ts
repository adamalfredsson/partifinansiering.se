export interface PartyYear {
  year: number;
  revenue: Record<string, number>;
  total: number;
}

export interface Party {
  id: number;
  name: string;
  slug: string;
  years: PartyYear[];
}

export interface Organization {
  orgNumber: string;
  name: string;
  slug: string;
  partyId: number;
  level: string;
  municipality?: string;
  municipalityCode?: string;
  region?: string;
  years: PartyYear[];
}

export interface RevenueGroup {
  code: number;
  nameSv: string;
  nameEn: string;
}

export interface Meta {
  years: number[];
  parties: Array<{ id: number; name: string; slug: string }>;
  revenueGroups: RevenueGroup[];
  lastUpdated: string;
}
