export interface MonthlyBudgetCategorySummaryDTO {
  id: number;
  name: string;
  allocatedAmount: number;
  spentSoFar: number;
  available: number;
}