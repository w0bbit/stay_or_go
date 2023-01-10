import json
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from os import getenv
from dotenv import load_dotenv
from .models import AppUser, Address, Preference
import json, re, requests
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt


load_dotenv()
WX_KEY = getenv('WX_KEY')
GGL_KEY = getenv('GGL_KEY')
BT_KEY = getenv('BT_KEY')


@csrf_exempt
def add_address(request):
  data = json.loads(request.body)
  if request.method == 'POST':

    placename = data['placename']
    street = data['street']
    city = data['city']
    state = data['state']
    zip = data['zip']

    crime_url = 'http://127.0.0.1:3000/crime'
    crime_params = {'city': city, 'state': state,}
    crime_response = requests.request('GET', crime_url, params=crime_params)
    crime_stats = {
      'city': crime_response.json()['city'],
      'state': crime_response.json()['state'],
      'nation': crime_response.json()['nation'],}

    besttime_url = 'https://besttime.app/api/v1/forecasts'
    besttime_params = {
      'api_key_private': BT_KEY,
      'venue_name': placename,
      'venue_address': f"{street}, {city}, {state} {zip}",}

    try:
      besttime_response = requests.request('POST', besttime_url, params=besttime_params)
      hour_analysis = besttime_response.json()['analysis'][0]['hour_analysis']
      foot_traffic = json.dumps(hour_analysis)
    except:
      foot_traffic = None
  
    current_user = AppUser.objects.get(username=request.user)
    new_address = Address.objects.create(
      placename=placename,
      street=street,
      city=city,
      state=state,
      zip=zip,
      lat=data['lat'],
      lng=data['lng'],
      city_crime=crime_stats['city'],
      state_crime=crime_stats['state'],
      nation_crime=crime_stats['nation'],
      foot_traffic=foot_traffic,
      avg_gas=data['avg_gas'],
      notes=data['notes'],
      user=current_user,)
    new_address.save()
    return JsonResponse({'success': True})

  else:
    return JsonResponse({'success': False})


@api_view(['GET'])
def view_addresses(request):
  current_user = AppUser.objects.get(username=request.user)
  addresses = [address for address in Address.objects.all() if address.user == current_user]
  address_dict = []
  for address in addresses:
    address_dict.append({
      'id': str(address.id),
      'placename': str(address.placename).title(),
      'street': str(address.street).title(),
      'city': str(address.city).title(),
      'zip': str(address.zip),
      'state': str(address.state).upper(),
      'lat': address.lat,
      'lng': address.lng,
      'city_crime': address.city_crime,
      'state_crime': address.state_crime,
      'nation_crime': address.nation_crime,
      'foot_traffic': address.foot_traffic,
      'avg_gas': address.avg_gas, 
      'notes': address.notes,
      'last_update': address.last_update,})
  return JsonResponse({'addresses': address_dict})


@csrf_exempt
def update_address(request):
  address_id = json.loads(request.body)['address_id']
  if request.method == 'POST':
    address_to_delete = Address.objects.get(id=address_id)
    address_to_delete.delete()
    return JsonResponse({'status': 'address deleted'})
  if request.method == 'PUT':
    address_to_update = Address.objects.get(id=address_id)
    address_to_update.notes = json.loads(request.body)['notes']
    address_to_update.save()
    return JsonResponse({'status': 'address updated'})
  else:
    return JsonResponse({'status': 'fail'})


@api_view(['GET'])
def view_prefs(request):
  current_user = AppUser.objects.get(username=request.user)
  current_user_prefs = Preference.objects.get(user=current_user)
  prefs = {
    'crime_national': current_user_prefs.crime_national,
    'crime_city': current_user_prefs.crime_city,
    'gas_cost': current_user_prefs.gas_cost,
    'temperature': current_user_prefs.temperature,
    'weather_descriptors': current_user_prefs.weather_descriptors,
    'travel_time': current_user_prefs.travel_time,
    'travel_distance': current_user_prefs.travel_distance,
    'foot_traffic': current_user_prefs.foot_traffic,}
  return JsonResponse(prefs)


@csrf_exempt
def set_prefs(request):
  if request.method == 'POST':
    prefs = json.loads(request.body)
    current_user = AppUser.objects.get(username=request.user)
    try:
      current_user_prefs = Preference.objects.create(
        user=current_user,
        crime_national=prefs['crime_national'],
        crime_city=prefs['crime_city'],
        gas_cost=prefs['gas_cost'],
        temperature=prefs['temperature'],
        weather_descriptors=prefs['weather_descriptors'],
        travel_time=prefs['travel_time'],
        travel_distance=prefs['travel_distance'],
        foot_traffic=prefs['foot_traffic'],)
      current_user_prefs.save()
    except:
      current_user_prefs = Preference.objects.get(user=current_user)
      current_user_prefs.crime_national = prefs['crime_national']
      current_user_prefs.crime_city = prefs['crime_city']
      current_user_prefs.gas_cost = prefs['gas_cost']
      current_user_prefs.temperature = prefs['temperature']
      current_user_prefs.weather_descriptors = prefs['weather_descriptors']
      current_user_prefs.travel_time = prefs['travel_time']
      current_user_prefs.travel_distance = prefs['travel_distance']
      current_user_prefs.foot_traffic = prefs['foot_traffic']
      current_user_prefs.save()
    return JsonResponse({'msg': 'you are setting prefs'})


@api_view(['PUT'])
def update_prefs(request):
  '''this is unnecessary'''
  pass


@csrf_exempt
def get_data(request):
  try:
    action = json.loads(request.body)['action']

    # done through JS
    if action == 'gas':
      # stick with request thru JS; getting 403 errors this route
      res = {'area_name': '', 'average_gas': ''}
      return JsonResponse({'success': True, 'action': action, 'results': res})

    # #stick with mojo api call; that one is cooler
    # if action == 'crime':
    #   city = json.loads(request.body)['city'].lower()
    #   state = json.loads(request.body)['state'].lower()
    #   crime_url = f"https://www.areavibes.com/{city}-{state}/crime"
    #   crime_response = requests.get(crime_url)
    #   soup = BeautifulSoup(crime_response.text, 'html.parser')
    #   crime_summary = soup.find_all(class_="summary")
    #   crime_summary_stats = re.findall('[,0-9]+', str(crime_summary[1]))
    #   city_crime = crime_summary_stats[1]
    #   state_crime = crime_summary_stats[2]
    #   nation_crime = crime_summary_stats[3]
    #   res = {'city': city_crime, 'state': state_crime, 'nation': nation_crime}
    #   return JsonResponse({'success': True, 'action': action, 'results': res})

    #DONE
    if action == 'weather':
      lat = json.loads(request.body)['lat']
      lng = json.loads(request.body)['lng']
      weather_url = 'https://api.openweathermap.org/data/2.5/weather'
      weather_params = {'lat': lat, 'lon': lng, 'appid': WX_KEY,}
      weather_response = requests.request('GET', weather_url, params=weather_params)
      weather_summary = weather_response.json()['weather']
      temps = weather_response.json()['main']
      current_temp_kelvin = temps['temp']
      current_temp_fahr = round((current_temp_kelvin-273.15)*(9/5)+32, 2)
      res = {'summary': weather_summary, 'temps': current_temp_fahr}
      return JsonResponse({'success': True, 'action': action, 'results': res})

    #DONE
    if action == 'travel':
      origin_address = json.loads(request.body)['originAddress']
      destination_address = json.loads(request.body)['destinationAddress']
      distance_url = 'https://maps.googleapis.com/maps/api/distancematrix/json'
      distance_params = {
        'origins': origin_address,
        'destinations': destination_address,
        'units': 'imperial',
        'key': GGL_KEY,}
      distance_response = requests.request('GET', distance_url, params=distance_params)
      distance = distance_response.json()['rows'][0]['elements'][0]['distance']['text']
      distance_float = float(re.findall(r'([.0-9]+)', distance)[0])
      duration = distance_response.json()['rows'][0]['elements'][0]['duration']['text']
      # duration_float = float(re.findall(r'([.0-9]+)', duration)[0])
      res = {'distance': distance_float, 'duration': duration}
      return JsonResponse({'success': True, 'action': action, 'results': res})

    # DONE
    if action == 'geocode':
      '''input full address: street, city, state, zip'''
      address = json.loads(request.body)['address']
      geo_url = 'https://maps.googleapis.com/maps/api/geocode/json'
      geo_params = {'address': address, 'key': GGL_KEY,}
      geo_response = requests.request('GET', geo_url, params=geo_params)
      lat_lng = geo_response.json()['results'][0]['geometry']['location']
      res = {'lat': lat_lng['lat'], 'lng': lat_lng['lng']}
      return JsonResponse({'success': True, 'action': action, 'results': res})

    else:
      return JsonResponse({'success': False})
  except:
    return JsonResponse({'success': False})

#DONE
def index(request):
  
  sample = open('sample_response.json').read()
  data = json.loads(sample)

  return JsonResponse(data)

  # # SAMPLE INPUT
  # # THESE SHOULD BE INCLUDED IN REQUEST FROM A FORM
  # origin_street = '777 Creekside Lane'
  # origin_city = 'Moorhead'
  # origin_state = 'MN'
  # origin_zip = '56560'
  # destination_name = 'Dennys'
  # destination_street = '4437 13th Ave SW'
  # destination_city = 'Fargo'
  # destination_state = 'ND'
  # destination_zip = '58103'
  # origin_address = f"{origin_street}, {origin_city}, {origin_state} {origin_zip}"
  # destination_address = f"{destination_street}, {destination_city}, {destination_state} {destination_zip}"

  # # GEOCODING THE LOCATION INFO
  # geo_url = 'https://maps.googleapis.com/maps/api/geocode/json'
  # geo_params = {
  # 'address': origin_address,
  # 'key': GGL_KEY,
  # }
  # geo_response = requests.request('GET', geo_url, params=geo_params)
  # lat_lng = geo_response.json()['results'][0]['geometry']['location']
  # lat = lat_lng['lat']
  # lng = lat_lng['lng']

  # # FETCHING FOOTTRAFFIC DATA
  # besttime_url = 'https://besttime.app/api/v1/forecasts'
  # besttime_params = {
  #   'api_key_private': BT_KEY,
  #   'venue_name': destination_name,
  #   'venue_address': destination_address,
  # }
  # besttime_response = requests.request('POST', besttime_url, params=besttime_params)
  # hour_analysis = besttime_response.json()['analysis'][0]['hour_analysis']

  # # FETCHING DRIVING DATA (DISTANCE/DURATION)
  # distance_url = 'https://maps.googleapis.com/maps/api/distancematrix/json'
  # distance_params = {
  #   'origins': origin_address,
  #   'destinations': destination_address,
  #   'units': 'imperial',
  #   'key': GGL_KEY,
  # }
  # distance_response = requests.request('GET', distance_url, params=distance_params)
  # distance = distance_response.json()['rows'][0]['elements'][0]['distance']['text']
  # distance_float = float(re.findall(r'([.0-9]+)', distance)[0])
  # duration = distance_response.json()['rows'][0]['elements'][0]['duration']['text']
  # duration_float = float(re.findall(r'([.0-9]+)', duration)[0])

  # # FETCHING WX DATA
  # weather_url = 'https://api.openweathermap.org/data/2.5/weather'
  # weather_params = {
  #   'lat': lat,
  #   'lon': lng,
  #   'appid': WX_KEY,
  # }
  # weather_response = requests.request('GET', weather_url, params=weather_params)
  # weather_summary = weather_response.json()['weather']
  # temps_kelvin = weather_response.json()['main']

  # # FETCHING GAS DATA (crime_gas.pl)
  # AVG_FUEL_ECONOMY = 24.2
  # gas_url = 'http://127.0.0.1:3000/gas'
  # gas_params = {
  #   'lat': lat,
  #   'lng': lng,
  # }
  # gas_response = requests.request('GET', gas_url, params=gas_params)
  # gas_price = gas_response.json()['price']

  # # FETCHING CRIME DATA (crime_gas.pl)
  # crime_url = 'http://127.0.0.1:3000/crime'
  # origin_crime_params = {
  #   'city': origin_city,
  #   'state': origin_state,
  # }
  # destination_crime_params = {
  #   'city': destination_city,
  #   'state': destination_state,
  # }
  # origin_crime_response = requests.request('GET', crime_url, params=origin_crime_params)
  # origin_crime = {
  #   'city': origin_crime_response.json()['city'],
  #   'state': origin_crime_response.json()['state'],
  #   'nation': origin_crime_response.json()['nation'],
  # }
  # destination_crime_response = requests.request('GET', crime_url, params=destination_crime_params)
  # destination_crime = {
  #   'city': destination_crime_response.json()['city'],
  #   'state': destination_crime_response.json()['state'],
  #   'nation': destination_crime_response.json()['nation'],
  # }
  # nation_crime = origin_crime_response.json()['nation'] or destination_crime_response.json()['nation']

  # # JSON DATA TO BE OUTPUT
  # data = {
  #   'travel_distance': distance_float,
  #   'travel_duration': duration_float,
  #   'gas_price': gas_price,
  #   'origin_crime': origin_crime,
  #   'nation_crime': nation_crime,
  #   'destination_crime': destination_crime,
  #   'weather_summary': weather_summary,
  #   'temps_kelvin': temps_kelvin,
  #   'foot_traffic': hour_analysis,
  # }