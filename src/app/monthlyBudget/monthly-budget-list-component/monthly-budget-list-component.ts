import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MonthlyBudgetGetDTO } from '../dto/monthly-budget-get-dto';
import { MonthlyBudgetService } from '../monthly-budget-service';


@Component({
  selector: 'app-monthly-budget-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './monthly-budget-list-component.html'
})
export class MonthlyBudgetListComponent implements OnInit {
  private readonly monthlyBudgetService = inject(MonthlyBudgetService);
  private readonly router = inject(Router);

  monthlyBudgets: MonthlyBudgetGetDTO[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMonthlyBudgets();
  }

  loadMonthlyBudgets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.monthlyBudgetService.findAll().subscribe({
      next: (response) => {
        this.monthlyBudgets = response;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load monthly budgets.';
        this.isLoading = false;
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/monthly-budgets/new']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/monthly-budgets/edit', id]);
  }

  onDelete(id: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this monthly budget?');

    if (!confirmed) {
      return;
    }

    this.monthlyBudgetService.delete(id).subscribe({
      next: () => this.loadMonthlyBudgets(),
      error: () => {
        this.errorMessage = 'Could not delete monthly budget.';
      }
    });
  }

  goToDetail(id: number): void {
  this.router.navigate(['/monthly-budgets', id]);
}
}