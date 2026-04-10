export interface MonthlyBudgetGetDTO {
  id: number;
  year: number;
  month: number;
  plannedAmount: number;
  householdId: number;
  householdName: string;
  createdAt: string;
  updatedAt: string;
}