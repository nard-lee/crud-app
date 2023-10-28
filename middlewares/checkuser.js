
const checkuser =(req, res, next)=>{
    const token = req.cookies.user;
    if(!token){
        return res.status(403).redirect('/login');
    }
	// const user = jwt.verify(token, 'pickering-user');

    next();
}

module.exports = checkuser;