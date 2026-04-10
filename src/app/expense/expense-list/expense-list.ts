import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExpenseGetDTO } from '../dto/expense-get-dto';
import { ExpenseService } from '../expense-service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './expense-list.html'
})
export class ExpenseListComponent implements OnInit {
  private readonly expenseService = inject(ExpenseService);
  private readonly router = inject(Router);

  expenses: ExpenseGetDTO[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.expenseService.findAll().subscribe({
      next: (response) => {
        this.expenses = response;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load expenses.';
        this.isLoading = false;
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/expenses/new']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/expenses/edit', id]);
  }

  onDelete(id: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this expense?');

    if (!confirmed) {
      return;
    }

    this.expenseService.delete(id).subscribe({
      next: () => {
        this.loadExpenses();
      },
      error: () => {
        this.errorMessage = 'Could not delete expense.';
      }
    });
  }
}