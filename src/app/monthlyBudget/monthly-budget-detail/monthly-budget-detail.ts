import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MonthlyBudgetDetailDTO } from '../dto/monthly-budget-detail-dto';
import { MonthlyBudgetService } from '../monthly-budget-service';

type BudgetFilter = 'all' | 'available' | 'completed' | 'overspent';

@Component({
  selector: 'app-monthly-budget-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './monthly-budget-detail.html'
})
export class MonthlyBudgetDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly monthlyBudgetService = inject(MonthlyBudgetService);

  monthlyBudgetDetail: MonthlyBudgetDetailDTO | null = null;
  loading = true;
  errorMessage = '';
  
  // 2. This must be inside the class body
  currentFilter: BudgetFilter = 'all';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'Monthly budget id is missing';
      this.loading = false;
      return;
    }

    const id = Number(idParam);

    if (isNaN(id)) {
      this.errorMessage = 'Invalid monthly budget id';
      this.loading = false;
      return;
    }

    this.loadMonthlyBudgetDetail(id);
  }

  private loadMonthlyBudgetDetail(id: number): void {
    this.monthlyBudgetService.findDetailById(id).subscribe({
      next: (response) => {
        this.monthlyBudgetDetail = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load monthly budget detail';
        this.loading = false;
      }
    });
  }

  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1] ?? 'Unknown';
  }

get filteredCategories() {
  const categories = this.monthlyBudgetDetail?.categories || [];
  
  switch (this.currentFilter) {
    case 'available':
      return categories.filter(c => c.available > 0);
    case 'completed':
      return categories.filter(c => c.available === 0);
    case 'overspent':
      // CHANGE THIS LINE:
      return categories.filter(c => c.available < 0); 
    default:
      return categories;
  }
}

  setFilter(filter: BudgetFilter): void {
    this.currentFilter = filter;
  }
}