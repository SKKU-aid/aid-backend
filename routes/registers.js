// url: /register
const express = require('express');
const router = express.Router();
const User = require('../models/user');

app.use(express.json());

// registerUser
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);

        // Sending a success response
        return res.status(200).json({
            success: true,
            message: '회원가입 성공',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: '회원가입에 실패했습니다',
            data: null
        })
    }
});

router.get('/checkID', async (req, res) => {
    try {
        const {
            userID
        } = req.body;

        if (!userID) {
            return res.status(400).json({
                success: true,
                message: '아이디를 입력해주세요',
                data: null
            });
        }
        
        const user = await User.find(req.body);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 아이디입니다',
                data: user
            });
        }
        
        return res.status(200).json({
            success: true,
            message: '사용 가능한 아이디입니다',
            data: user
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
            data: null
        });
    }
});

module.exports = router;