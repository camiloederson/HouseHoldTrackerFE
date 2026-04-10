import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseholdService, HouseholdPutDTO, HouseholdPostDTO } from '../household-service';


@Component({
  selector: 'app-household-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  // This must match your HTML file name exactly!
  templateUrl: './house-hold-form-component.html' 
})
export class HouseholdFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly householdService = inject(HouseholdService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  householdId: number | null = null;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';

  householdForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.householdId = Number(idParam);
      this.isEditMode = true;
      this.loadHousehold(this.householdId);
    }
  }

  loadHousehold(id: number): void {
    this.isLoading = true;
    this.householdService.findById(id).subscribe({
      next: (data) => {
        this.householdForm.patchValue(data);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load household data.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.householdForm.invalid) {
      this.householdForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const request = this.householdForm.getRawValue();

    const request$ = this.isEditMode && this.householdId
      ? this.householdService.update(this.householdId, request as HouseholdPutDTO)
      : this.householdService.save(request as HouseholdPostDTO);

    request$.subscribe({
      next: () => this.router.navigate(['/households']),
      error: () => {
        this.errorMessage = 'An error occurred while saving.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/households']);
  }
}