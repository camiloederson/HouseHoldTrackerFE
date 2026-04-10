export interface ExpensePostDTO {
  title: string;
  description: string | null;
  amount: number;
  expenseDate: string;
  monthlyBudgetId: number;
  categoryId: number;
  createdByUserId: number;
}