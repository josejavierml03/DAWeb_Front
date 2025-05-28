const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const distPath = path.join(__dirname, '..', 'reserva-eventos', 'dist');


app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'], 
  credentials: true
}));

app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('bienvenida', { layout: false });
});

app.use('/app', express.static(distPath));

app.get('/app/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('/oauth-success', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('/redirigir', (req, res) => {
  res.redirect('/app');
});

app.listen(PORT, () => {
  console.log(`Servidor backend activo en http://localhost:${PORT}`);
});
