# Stay or Go: A Simple App To Help You Decide

## Summary
Set your preferences regarding weather, city and national crime rates, foot traffic, and driving time/distance. Then, set a starting address and a destination address. The app will then suggest whether or not it is a good idea to visit that destination based on your preferences. In cases where the app is unable to provide a clear suggestion either way, it will provide you with the average fuel cost in your area to help you decide on your own on whether or not the trip is worth your while.

Use of the app requires registration with an email and password.

## Tech stack
- [PostgreSQL](https://github.com/topics/postgresql)
- [React.js](https://github.com/topics/react)
- [Django](https://github.com/topics/django)
- [Mojolicious](https://github.com/mojolicious/)

## APIs
- OpenWeather (https://openweathermap.org/api)
- Google Distance Matrix API (https://developers.google.com/maps/documentation/distance-matrix/)
- BestTime (https://besttime.app/)
- Custom API ([crime.pl](https://github.com/w0bbit/crime)) served on port 3000 with Mojo's development server, morbo.
  - This scrapes AreaVibes.com for crime rate data.