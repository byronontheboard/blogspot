const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');

// Prevent non logged in users from viewing the homepage
router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']],
        });
    
        const users = userData.map((project) => project.get({ plain: true }));
    
        res.render('homepage', {
            users,
            // Pass the logged in flag to the template
            logged_in: req.session.logged_in,
        });
        } catch (err) {
        res.status(500).json(err);
    }
});
  
router.get('/login', (req, res) => {
    // If a session exists, redirect the request to the homepage
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    // If a session exists, redirect the request to the homepage
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
        res.render('create');
    });
  
  router.get('/post', withAuth, (req, res) => {
    // If a session exists, redirect the request to the homepage
    if (!req.session.logged_in) {
      res.redirect('/');
      return;
    } else {
        res.render('post', {
            logged_in: req.session.logged_in
        });
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    if (!req.session.logged_in) {
      res.redirect('/');
    } else {
        try {
        const postData = await Post.findAll({
            include: [
            {
                model: User
            }, 
            {
                model: Comment
            }     
        ],
            where: {
                user_id: req.session.user_id
            }
        });
        var current_user = req.session.user_id;
        const posts = postData.map((project) => project.get({ plain: true }));
        console.log(posts);
        res.render('browse', {
            posts,
            logged_in: req.session.logged_in,
            current_user: current_user,
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }
});
  
// Browse other posts when you navigate home
router.get('/home', async (req, res) => {
    try {
        const postData = await Post.findAll({
        include: [
        {
            model: User
        }, 
        {
            model: Comment
        }     
        ],
        order: [['id', 'DESC']]
      });
        var current_user = req.session.user_id;
        const posts = postData.map((project) => project.get({ plain: true }));
        console.log(posts);
        res.render('browse', {
            posts,
            logged_in: req.session.logged_in,
            current_user: current_user,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// Use withAuth middleware to prevent access to route
// Will possibly edit to take to user posts
router.get('/profile', withAuth, async (req, res) => {
    try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Project }],
        });
  
        const user = userData.get({ plain: true });
  
        res.render('profile', {
            ...user,
            logged_in: true
        });
        } catch (err) {

        res.status(500).json(err);
    }
});

module.exports = router;