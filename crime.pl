use Mojolicious::Lite -signatures;

# /crime?city={city name}&state={state abbrev}
any ['GET', 'OPTIONS'] => '/crime' => sub ($c) {

  my $city = $c->param('city');
  my $state = $c->param('state');

  my $url = "https://www.areavibes.com/\L$city\E-\L$state\E/crime/";
  my $res = Mojo::UserAgent->new->get($url);

  my $crime_summary = $res->result->dom->find('tr.summary');
  my @crime_stats = ${$crime_summary}[1] =~ /[,0-9]+/g;

  $c->render(json => {
    city => $crime_stats[1],
    state => $crime_stats[2],
    nation => $crime_stats[3],
    });
};  

app->start;