from django.urls import path
from . import views

urlpatterns = [
    path('view_addresses/', views.view_addresses),
    path('add_address/', views.add_address),
    path('update_address/', views.update_address),
    path('view_prefs/', views.view_prefs),
    path('set_prefs/', views.set_prefs),
    path('update_prefs/', views.update_prefs),
    path('get_data/', views.get_data),
]