// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express, {json} from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

const radioResponse = await fetch ('https://fdnd-agency.directus.app/items/mh_shows?fields=*.*.*')
const radioResponseJSON = await radioResponse.json()

const allShowsinner = [];
 
radioResponseJSON.data.forEach(function(show) {
 
  allShowsinner.push({
      ...show.show,
      from: show.from,
      until: show.until,
    });

    // console.log(radioResponseJSON.data)
  });

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')


// console.log('Let op: Er zijn nog geen routes. Voeg hier dus eerst jouw GET en POST routes toe.')

// -c- I'm going to make a GET route for index
app.get('/', async function (request, response) {
  const programmaUrl = "https://fdnd-agency.directus.app/items/mh_day?fields=date,shows.mh_shows_id.from,shows.mh_shows_id.until,shows.mh_shows_id.show.name,shows.mh_shows_id.show.radiostation.name,shows.mh_shows_id.show.radiostation.logo,shows.mh_shows_id.show.users.mh_users_id.full_name"
  const programmaResponse = await fetch (programmaUrl)
  const {data: programmaResponseJSON} = await programmaResponse.json()
// console.log(programmaResponseJSON[0].shows[0]);

  response.render('index.liquid', {programmas: programmaResponseJSON[0].shows})
  // console.log(programmaResponseJSON.data)
})

// DAY 1
app.get('/maandag', async function (request, response) {
  const programmaResponse = await fetch('https://fdnd-agency.directus.app/items/mh_day?fields=date,shows.mh_shows_id.from,shows.mh_shows_id.until,shows.mh_shows_id.show.name,shows.mh_shows_id.show.radiostation.*,shows.mh_shows_id.show.users.mh_users_id.*&filter=%7B%"22"_and%"22":[%7B%"22"weekday(date)%"22":%"22"1%"22"%7D,%7B%"22"shows%"22":%7B%"22"mh_shows_id%"22":%7B%"22"show%"22":%7B%"22"radiostation%"22":%7B%"22"name%"22":%"22"Radio%20Veronica%"22"%7D%7D%7D%7D%7D]%7D')
  const programmaResponseJSON = await programmaResponse.json()
  response.render('index.liquid', { calendar: programmaResponse.data })
})

/*
// Zie https://expressjs.com/en/5x/api.html#app.get.method over app.get()
app.get(…, async function (request, response) {
  
  // Zie https://expressjs.com/en/5x/api.html#res.render over response.render()
  response.render(…)
})
*/

/*
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post(…, async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  await fetch(…, {
    method: …,
    body: JSON.stringify(…),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, …)
})
*/


// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})


app.post('/', async function (request, response) {
  response.redirect(303, '/')
})