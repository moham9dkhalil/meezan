export interface StandardQA {
  q: string;
  a: string;
}

export interface AccountingStandard {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  family: string;
  effective?: string;
  status?: string;
  summaryAr: string;
  scopeAr: string;
  pointsAr: string[];
  recognitionAr?: string;
  measurementAr?: string;
  disclosureAr?: string;
  examplesAr?: string[];
  entryAr?: string;
  numbersAr?: string[];
  qaAr?: StandardQA[];
  notesAr?: string;
  keywords?: string[];
}

export interface StandardsFamily {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  color: string;
  introAr: string;
  introEn: string;
  standards: AccountingStandard[];
}
