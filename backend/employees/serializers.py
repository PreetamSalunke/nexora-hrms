
from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employee

        fields = [
            "id",
            "employee_id",
            "full_name",
            "email",
            "phone",
            "department",
            "designation",
            "salary",
            "date_of_joining",
            "employment_status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_full_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Employee name must contain at least 2 characters."
            )

        return value

    def validate_salary(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Salary cannot be negative."
            )

        return value

    def validate_employee_id(self, value):
        value = value.strip().upper()

        if not value:
            raise serializers.ValidationError(
                "Employee ID is required."
            )

        return value
