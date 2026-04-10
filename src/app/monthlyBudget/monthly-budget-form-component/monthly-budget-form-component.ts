import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthlyBudgetService } from '../monthly-budget-service';
import { MonthlyBudgetPostDTO } from '../dto/monthly-budget-post-dto';
import { MonthlyBudgetPutDTO } from '../dto/monthly-budget-put-dto';
import { HouseholdService } from '../../household/household-service';

@Component({
  selector: 'app-monthly-budget-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './monthly-budget-form-component.html' 
})
export class MonthlyBudgetFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly monthlyBudgetService = inject(MonthlyBudgetService);
  private readonly householdService = inject(HouseholdService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  monthlyBudgetId: number | null = null;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  
  households: any[] = []; // Using any[] if DTO is not imported, but better use HouseholdGetDTO
  months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];

  monthlyBudgetForm = this.fb.nonNullable.group({
    year: [new Date().getFullYear(), [Validators.required]],
    month: [new Date().getMonth() + 1, [Validators.required]],
    plannedAmount: [0, [Validators.required, Validators.min(0.01)]],
    householdId: [null as any, [Validators.required]]
  });

  ngOnInit(): void {
    this.loadHouseholds();
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.monthlyBudgetId = Number(idParam);
      this.isEditMode = true;
      this.loadMonthlyBudget(this.monthlyBudgetId);
    }
  }

  loadHouseholds(): void {
    this.householdService.findAll().subscribe({
      next: (data) => this.households = data,
      error: () => this.errorMessage = 'Failed to load households.'
    });
  }

  loadMonthlyBudget(id: number): void {
    this.isLoading = true;
    this.monthlyBudgetService.findById(id).subscribe({
      next: (response) => {
        this.monthlyBudgetForm.patchValue({
          year: response.year,
          month: response.month,
          plannedAmount: response.plannedAmount,
          householdId: response.householdId
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load budget.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.monthlyBudgetForm.invalid) {
      this.monthlyBudgetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.monthlyBudgetForm.getRawValue();

    if (this.isEditMode && this.monthlyBudgetId) {
      this.monthlyBudgetService.update(this.monthlyBudgetId, formValue as MonthlyBudgetPutDTO).subscribe({
        next: () => this.router.navigate(['/monthly-budgets']),
        error: () => { this.errorMessage = 'Update failed'; this.isLoading = false; }
      });
    } else {
      this.monthlyBudgetService.save(formValue as MonthlyBudgetPostDTO).subscribe({
        next: () => this.router.navigate(['/monthly-budgets']),
        error: () => { this.errorMessage = 'Creation failed'; this.isLoading = false; }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/monthly-budgets']);
  }
}