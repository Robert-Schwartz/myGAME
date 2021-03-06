const router = require('express').Router();
const { stat } = require('fs');
const multer = require('multer');
const path = require('path')

const { User, Post, Comment, Games } = require('../../models');
const Stat = require('../../models/Stat');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../../public/tmp/upload'))
    },
    filename: function (req, file, cb) {
      cb(null, "" + req.session.user_id + "." + file.originalname.split(".")[1])
    }
  })

const upload = multer({ storage: storage });

//User create route, username is passed in from the event call on the front end.
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    }).then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }  
    }).then(dbUserData => {
        Stat.findAll({
            where: {
                user_id: req.params.id
            },
            include: [
                {
                    model: Games,
                    attributes: [ 'id', 'title' ] 
                }
            ]
        }).then(dbStatData => {
        const stats = dbStatData.map(user => user.get({plain: true}))

        console.log(stats)
        console.log(dbUserData)
        
        res.render('otherUser', {user: dbUserData, Stat: stats})
    })
})
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// make a new user

router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    }).then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.firstName = dbUserData.firstName;
            req.session.lastName = dbUserData.lastName;
            req.session.username = dbUserData.username;


            res.json(dbUserData);
        });

    })
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'email provided not found!' });
            return;
        }
        const validatePassword = dbUserData.checkPassword(req.body.password);
        if (!validatePassword) {
            res.status(400).json({ message: 'Password Incorrect' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are logged in!' });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.post('/prof', upload.single("avatar"), (req, res) => {
    console.log(req.file);
    res.send()
    
})

router.delete('/delete/:id', (req, res) => {
    User.destroy({
        where: {
            user_id: req.params.id
        }
    }).then(result => {
        res.json(result)
    })
});


module.exports = router;