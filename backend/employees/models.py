
from django.db import models
from django.core.validators import MinValueValidator


class Employee(models.Model):
    DEPARTMENT_CHOICES = [
        ("Engineering", "Engineering"),
        ("Human Resources", "Human Resources"),
        ("Marketing", "Marketing"),
        ("Finance", "Finance"),
        ("Sales", "Sales"),
        ("Operations", "Operations"),
        ("Customer Support", "Customer Support"),
    ]

    EMPLOYMENT_STATUS_CHOICES = [
        ("Active", "Active"),
        ("On Leave", "On Leave"),
        ("Inactive", "Inactive"),
    ]

    employee_id = models.CharField(
        max_length=20,
        unique=True
    )

    full_name = models.CharField(max_length=150)

    email = models.EmailField(unique=True)

    phone = models.CharField(
        max_length=15,
        blank=True
    )

    department = models.CharField(
        max_length=50,
        choices=DEPARTMENT_CHOICES
    )

    designation = models.CharField(max_length=100)

    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    date_of_joining = models.DateField()

    employment_status = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_STATUS_CHOICES,
        default="Active"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"
