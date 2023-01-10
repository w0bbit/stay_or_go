from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime


class AppUser(AbstractUser):
  email = models.EmailField(
    verbose_name='email address',
    max_length=255,
    unique=True,)
  last_origin_id = models.IntegerField(null=True)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = []


class Address(models.Model):
  placename = models.CharField(max_length=64, null=True)
  street = models.CharField(max_length=64, null=True)
  city = models.CharField(max_length=64, null=True)
  zip = models.CharField(max_length=10, null=True)
  state = models.CharField(max_length=2, null=True)
  lat = models.CharField(max_length=255, null=True)
  lng = models.CharField(max_length=255, null=True)
  city_crime = models.IntegerField(default=0)
  state_crime = models.IntegerField(default=0)
  nation_crime = models.IntegerField(default=0)
  foot_traffic = models.TextField(null=True)
  avg_gas = models.CharField(max_length=10, null=True)
  notes = models.TextField(null=True)
  last_update = models.DateField(default=datetime.date.today)
  user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name="addresses")


class Preference(models.Model):
  crime_national = models.IntegerField(default=0)
  crime_city = models.IntegerField(default=0)
  gas_cost = models.IntegerField(default=0)
  temperature = models.IntegerField(default=0)
  weather_descriptors = models.CharField(max_length=255, default='')
  travel_time = models.IntegerField(default=0)
  travel_distance = models.IntegerField(default=0)
  foot_traffic = models.IntegerField(default=0)
  user = models.OneToOneField(AppUser, on_delete=models.CASCADE)