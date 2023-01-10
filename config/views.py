from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from api.models import AppUser
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json
from api.models import AppUser

def react(request):
  react_page = open('static/index.html').read()
  return HttpResponse(react_page)


@api_view(['POST'])
def signup(request):
  try:
    user_email = request.data['userEmail']
    user_password = request.data['userPassword']
    AppUser.objects.create_user(
      username=user_email,
      email=user_email,
      password=user_password,
    )
    user = authenticate(username=user_email, password=user_password)
    login(request, user)
    return JsonResponse({'success': True})
  except Exception as e:
    return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
@api_view(['POST'])
def signin(request):
  email = request.data['userEmail']
  password = request.data['userPassword']
  user = authenticate(username=email, password=password)
  try: 
    if user is not None:
      if user.is_active:
        try:
          login(request, user)
          return JsonResponse({'success': True})
        except Exception as e:
          return JsonResponse({'success': False, 'error': str(e)})
    else:
      return JsonResponse({'success': False, 'error': 'unable to authenticate'})
  except Exception as e:
    return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
def set_origin(request):
  if request.method == 'PUT':
    address_id = int(json.loads(request.body)['address_id'])
    user = request.user
    user.last_origin_id = address_id
    user.save()
    print(user.last_origin_id)
    return JsonResponse({'success': True})


@api_view(['POST'])
def signout(request):
  try:
    logout(request._request)
    return JsonResponse({'success': True})
  except Exception as e:
    print(str(e))
    return JsonResponse({'success': False})


## test this
@csrf_exempt
@api_view(['POST'])
def whoami(request):
  print('hi')
  # if request.user.is_authenticated:
    # user_email = request.user.email
    # user_street = request.user.street
    # user_city = request.user.city
    # user_zip = request.user.zip
    # user_state = request.user.state
    # crime_national = request.user.crime_national
    # crime_city = request.user.crime_city
    # gas_cost = request.user.gas_cost
    # temperature = request.user.temperature
    # weather_descriptors = request.user.weather_descriptors
    # travel_time = request.user.travel_time
    # travel_distance = request.user.travel_distance
    # foottraffic = request.user.foottraffic
  return JsonResponse({'msg': 'hi'})