import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ExpenseCategoryGetDTO } from '../dto/expense-category-get-dto';
import { ExpenseCategoryService } from '../expense-service';


@Component({
  selector: 'app-expense-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './expense-category-list.html'
})
export class ExpenseCategoryListComponent implements OnInit {
  private readonly expenseCategoryService = inject(ExpenseCategoryService);
  private readonly router = inject(Router);

  expenseCategories: ExpenseCategoryGetDTO[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadExpenseCategories();
  }

  loadExpenseCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.expenseCategoryService.findAll().subscribe({
      next: (response) => {
        this.expenseCategories = response;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load expense categories.';
        this.isLoading = false;
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/expense-categories/new']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/expense-categories/edit', id]);
  }

  onDelete(id: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this expense category?');

    if (!confirmed) {
      return;
    }

    this.expenseCategoryService.delete(id).subscribe({
      next: () => {
        this.loadExpenseCategories();
      },
      error: () => {
        this.errorMessage = 'Could not delete expense category.';
      }
    });
  }
}