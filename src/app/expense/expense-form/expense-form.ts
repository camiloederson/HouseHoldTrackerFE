import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../expense-service';
import { ExpenseCategoryGetDTO } from '../../expenseCategory/dto/expense-category-get-dto';
import { ExpenseCategoryService } from '../../expenseCategory/expense-service';
import { MonthlyBudgetGetDTO } from '../../monthlyBudget/dto/monthly-budget-get-dto';
import { MonthlyBudgetService } from '../../monthlyBudget/monthly-budget-service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.html'
})
export class ExpenseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly expenseService = inject(ExpenseService);
  private readonly budgetService = inject(MonthlyBudgetService);
  private readonly categoryService = inject(ExpenseCategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  expenseId: number | null = null;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';

  // Data for selects
  budgets: MonthlyBudgetGetDTO[] = [];
  categories: ExpenseCategoryGetDTO[] = [];

  expenseForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    expenseDate: [new Date().toISOString().split('T')[0], [Validators.required]],
    monthlyBudgetId: [null as any, [Validators.required]],
    categoryId: [null as any, [Validators.required]],
    createdByUserId: [1] // Hardcoded User ID for now
  });

  ngOnInit(): void {
    this.loadInitialData();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.expenseId = Number(idParam);
      this.isEditMode = true;
      this.loadExpense(this.expenseId);
    }
  }

  loadInitialData(): void {
    // We load both lists to populate the dropdowns
    this.budgetService.findAll().subscribe(data => this.budgets = data);
    this.categoryService.findAll().subscribe(data => this.categories = data);
  }

loadExpense(id: number): void {
  this.isLoading = true;
  this.expenseService.findById(id).subscribe({
    next: (res) => {
      this.expenseForm.patchValue({
        title: res.title,
        description: res.description ?? '',
        amount: res.amount,
        expenseDate: res.expenseDate,
        monthlyBudgetId: res.monthlyBudgetId,
        categoryId: res.categoryId,
        createdByUserId: res.createdByUserId
      });
      this.isLoading = false;
    },
    error: () => {
      this.errorMessage = 'Could not load expense.';
      this.isLoading = false;
    }
  });
}

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const request = this.expenseForm.getRawValue();

    const action$ = (this.isEditMode && this.expenseId)
      ? this.expenseService.update(this.expenseId, request)
      : this.expenseService.save(request);

    action$.subscribe({
      next: () => this.router.navigate(['/expenses']),
      error: () => {
        this.errorMessage = 'An error occurred while saving.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/expenses']);
  }
}