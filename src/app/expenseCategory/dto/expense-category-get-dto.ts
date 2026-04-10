export interface ExpenseCategoryGetDTO {
  id: number;
  name: string;
  allocatedAmount: number;
  monthlyBudgetId: number;
  budgetYear: number;
  budgetMonth: number;
  createdAt: string;
  updatedAt: string;
}