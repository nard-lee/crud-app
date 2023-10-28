const express = require('express')
const app = express()
const port = process.env.PORT || 7000;
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const supabase = require('./utils/supabase');
const router = express.Router();

const { signup, login } = require('./controllers/formController');
const checkuser = require('./middlewares/checkuser');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


router.get('/', checkuser , async (req, res) => {
	const token = req.cookies.user;
	const user = jwt.verify(token, 'pickering-user');
	res.render('index', { title: 'pickering', _id: user.user_id });
})

router.get('/signup', (req, res)=>{
	res.render('signup', { title: 'signup' });
})

router.post('/signup', signup)
router.post('/login', login);

router.get('/login', (req, res)=>{
	res.render('login', { title: 'login' });
})

router.get('/search', async (req, res)=>{
	const { term } = req.query;
	const { data, error } = await supabase
		.from('user')
		.select('f_name, l_name')
		.ilike('f_name, l_name', `%${term}%`);
	if(data) res.json(data);
})

router.get('/:id', (req, res)=>{
	res.send("Profile");
})

app.use('/', router);

app.listen(port, console.log(`Example app listening on port localhost:${port}`))