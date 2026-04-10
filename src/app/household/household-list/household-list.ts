import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HouseholdGetDTO, HouseholdService } from '../household-service';

@Component({
  selector: 'app-household-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './household-list.html'
})
export class HouseholdListComponent implements OnInit {
  private readonly householdService = inject(HouseholdService);
  private readonly router = inject(Router);

  households: HouseholdGetDTO[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadHouseholds();
  }

  loadHouseholds(): void {
    this.isLoading = true;
    this.householdService.findAll().subscribe({
      next: (data) => {
        this.households = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load the household list.';
        this.isLoading = false;
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/households/create']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/households/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this household?')) {
      this.householdService.delete(id).subscribe({
        next: () => this.loadHouseholds(), // Refresh the list
        error: () => this.errorMessage = 'Error deleting record.'
      });
    }
  }
}