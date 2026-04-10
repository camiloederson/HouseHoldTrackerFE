import { Routes } from '@angular/router';
import { ExpenseFormComponent } from './expense/expense-form/expense-form';
import { ExpenseListComponent } from './expense/expense-list/expense-list';
import { ExpenseCategoryFormComponent } from './expenseCategory/expense-category-form/expense-category-form';
import { ExpenseCategoryListComponent } from './expenseCategory/expense-category-list/expense-category-list';
import { AuthLayoutComponent } from './layout/auth-layout-component/auth-layout-component';
import { MainLayoutComponent } from './layout/main-layout-component/main-layout-component';
import { MonthlyBudgetFormComponent } from './monthlyBudget/monthly-budget-form-component/monthly-budget-form-component';
import { MonthlyBudgetListComponent } from './monthlyBudget/monthly-budget-list-component/monthly-budget-list-component';
import { Login } from './login/login';
import { authGuard } from './utils/auth-guard-guard';
import { MonthlyBudgetDetailComponent } from './monthlyBudget/monthly-budget-detail/monthly-budget-detail';

export const routes: Routes = [
  // PUBLIC ROUTES
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: Login },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // PROTECTED ROUTES
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // MONTHLY BUDGETS
      { path: 'monthly-budgets', component: MonthlyBudgetListComponent },
      { path: 'monthly-budgets/new', component: MonthlyBudgetFormComponent },
      { path: 'monthly-budgets/edit/:id', component: MonthlyBudgetFormComponent },

      // 👇 NEW DETAIL ROUTE
      { path: 'monthly-budgets/:id', component: MonthlyBudgetDetailComponent },

      // EXPENSE CATEGORIES
      { path: 'expense-categories', component: ExpenseCategoryListComponent },
      { path: 'expense-categories/new', component: ExpenseCategoryFormComponent },
      { path: 'expense-categories/edit/:id', component: ExpenseCategoryFormComponent },

      // EXPENSES
      { path: 'expenses', component: ExpenseListComponent },
      { path: 'expenses/new', component: ExpenseFormComponent },
      { path: 'expenses/edit/:id', component: ExpenseFormComponent },

      // DEFAULT
      { path: '', redirectTo: 'monthly-budgets', pathMatch: 'full' }
    ]
  },

  // FALLBACK
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];