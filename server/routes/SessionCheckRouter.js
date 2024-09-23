const express = require('express');
const router = express.Router();

router.get('/check-session', (req, res) => {
    if(req.session.user){
        res.json({isLogin : true});
    }else{
        res.json({isLogin : false});
    }
});

module.exports = router;