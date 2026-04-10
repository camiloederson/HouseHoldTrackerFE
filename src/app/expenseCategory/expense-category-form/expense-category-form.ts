import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseCategoryPostDTO } from '../dto/expense-category-postt-dto';
import { ExpenseCategoryPutDTO } from '../dto/expense-category-put-dto';
import { ExpenseCategoryService } from '../expense-service';
import { MonthlyBudgetGetDTO } from '../../monthlyBudget/dto/monthly-budget-get-dto';
import { MonthlyBudgetService } from '../../monthlyBudget/monthly-budget-service';

@Component({
  selector: 'app-expense-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-category-form.html'
})
export class ExpenseCategoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly expenseCategoryService = inject(ExpenseCategoryService);
  private readonly monthlyBudgetService = inject(MonthlyBudgetService); // Injected
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  expenseCategoryId: number | null = null;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';

  // Data for the dropdown
  monthlyBudgets: MonthlyBudgetGetDTO[] = [];

  expenseCategoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    allocatedAmount: [0, [Validators.required, Validators.min(0.01)]],
    monthlyBudgetId: [null as any, [Validators.required]] // Set to null initially
  });

  ngOnInit(): void {
    this.loadMonthlyBudgets(); // Fetch budgets on init
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.expenseCategoryId = Number(idParam);
      this.isEditMode = true;
      this.loadExpenseCategory(this.expenseCategoryId);
    }
  }

  loadMonthlyBudgets(): void {
    this.monthlyBudgetService.findAll().subscribe({
      next: (data) => this.monthlyBudgets = data,
      error: () => this.errorMessage = 'Could not load monthly budgets.'
    });
  }

  loadExpenseCategory(id: number): void {
    this.isLoading = true;
    this.expenseCategoryService.findById(id).subscribe({
      next: (response) => {
        this.expenseCategoryForm.patchValue({
          name: response.name,
          allocatedAmount: response.allocatedAmount,
          monthlyBudgetId: response.monthlyBudgetId
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load expense category.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.expenseCategoryForm.invalid) {
      this.expenseCategoryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const request = this.expenseCategoryForm.getRawValue();

    const action$ = (this.isEditMode && this.expenseCategoryId)
      ? this.expenseCategoryService.update(this.expenseCategoryId, request as ExpenseCategoryPutDTO)
      : this.expenseCategoryService.save(request as ExpenseCategoryPostDTO);

    action$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/expense-categories']);
      },
      error: () => {
        this.errorMessage = 'Error saving category.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/expense-categories']);
  }
}