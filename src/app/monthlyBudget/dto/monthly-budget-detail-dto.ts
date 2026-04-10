import { MonthlyBudgetCategorySummaryDTO } from "./monthly-budget-category-summary-dto";

export interface MonthlyBudgetDetailDTO {
  id: number;
  year: number;
  month: number;
  plannedAmount: number;
  householdId: number;
  householdName: string;
  totalAllocated: number;
  totalSpent: number;
  totalAvailable: number;
  categories: MonthlyBudgetCategorySummaryDTO[];
}