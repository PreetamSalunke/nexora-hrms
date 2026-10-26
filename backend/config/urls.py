from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),

    # Employee Management API
    path("api/", include("employees.urls")),

    # Authentication API
    path("api/auth/", include("accounts.urls")),
]