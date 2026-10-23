
from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):

    list_display = (
        "employee_id",
        "full_name",
        "email",
        "department",
        "designation",
        "salary",
        "employment_status",
        "date_of_joining",
    )

    list_filter = (
        "department",
        "employment_status",
        "date_of_joining",
    )

    search_fields = (
        "employee_id",
        "full_name",
        "email",
        "designation",
    )

    ordering = ("-created_at",)

    list_per_page = 10

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        ("Personal Information", {
            "fields": (
                "employee_id",
                "full_name",
                "email",
                "phone",
            )
        }),

        ("Employment Details", {
            "fields": (
                "department",
                "designation",
                "salary",
                "date_of_joining",
                "employment_status",
            )
        }),

        ("System Information", {
            "fields": (
                "created_at",
                "updated_at",
            ),
            "classes": ("collapse",),
        }),
    )
