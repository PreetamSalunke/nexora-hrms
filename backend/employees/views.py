
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination

from .models import Employee
from .serializers import EmployeeSerializer


class EmployeePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    pagination_class = EmployeePagination

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "employee_id",
        "full_name",
        "email",
        "department",
        "designation",
    ]

    ordering_fields = [
        "employee_id",
        "full_name",
        "department",
        "designation",
        "salary",
        "date_of_joining",
        "created_at",
    ]

    ordering = ["-created_at"]
