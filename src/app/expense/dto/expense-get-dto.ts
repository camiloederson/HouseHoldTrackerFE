export interface ExpenseGetDTO {
  id: number;
  title: string;
  description: string | null;
  amount: number;
  expenseDate: string;
  monthlyBudgetId: number;
  budgetYear: number;
  budgetMonth: number;
  categoryId: number;
  categoryName: string;
  createdByUserId: number;
  createdByUserEmail: string;
  createdAt: string;
  updatedAt: string | null;
}