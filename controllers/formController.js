
const { encrypt, compare } = require('n-krypta');
const supabase = require('../utils/supabase')
const uniqid = require('uniqid');
const jwt = require("jsonwebtoken");


const validateUser = (email, password) => {
    let error = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        error.email = "invalid email"
    }
    if (!password || password.length < 8) {
        error.password = "must be 8 characters";
    }
    return (Object.keys(error).length == 0) ? "" : error;
};

const signup = async (req, res) => {

    const { f_name, l_name, email, password, birthdate, gender } = req.body;

    let tmp_error = validateUser(email, password);

    if (tmp_error) {
        return res.status(400).json({ error: tmp_error });
    }

    const secret = 'pickering-431';
    const ncrypt = encrypt(password, secret);
    const user_id = uniqid();

    const { error } = await supabase
        .from('user')
        .insert({ user_id, f_name, l_name, email, password: ncrypt, gender, birthdate });

    const token = jwt.sign({ user_id, email }, 'pickering-user', { expiresIn: '24h' });
    res.cookie('user', token, { expire: 24000 + Date.now() });
    res.status(200).json({ success: 'ok' });

    if (error) {
        if (error.message.includes('violates unique constraint')) {
            return res.status(400).json({ error: { email: 'email already exist', password: '' } });
        }
    }

}

const login = async (req, res) => {

    const { email, password } = req.body;

    let tmp_error = validateUser(email, password);
    if (tmp_error) {
        console.log(tmp_error)
        return res.status(400).json({ error: tmp_error });
    }

    const { data, error } = await supabase
        .from('user').select('user_id, password').ilike('email', email);

    if (data.length === 0) {
        return res.status(400).json({ error: { email: 'email does not exist', password: '' } })
    }

    const secret = 'pickering-431';
    const authpassword = compare(password, data[0].password, secret);

    if(!authpassword){
        return res.status(400).json({ error: { email: '', password: 'password incorrect' } })
    }

    const token = jwt.sign({ user_id: data[0].user_id, email }, 'pickering-user', { expiresIn: '24h' });
    res.cookie('user', token, { expire: 24000 + Date.now() });
    res.status(200).json({success: 'ok'});


}


module.exports = {
    signup,
    login
}