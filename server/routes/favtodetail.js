// const express = require('express');
// const router = express.Router();
// const mysql = require('mysql2/promise'); // promise 기반으로 mysql2를 가져옵니다.

// const pool = mysql.createPool({
//     host: "project-db-stu3.smhrd.com",
//     user: "Insa5_JSB_hacksim_1",
//     password: "aischool1",
//     database: "Insa5_JSB_hacksim_1"
// });

// router.get('/:food_idx', async (req, res) => {
//     const food_idx = req.params.food_idx;

//     try {
//         const [rows] = await pool.query('SELECT * FROM Foods WHERE food_idx = ?', [food_idx]);
//         if (rows.length === 0) {
//             return res.status(404).json({ message: '식사를 찾을 수 없습니다.' });
//         }
//         res.json(rows[0]); // 첫 번째 결과를 반환합니다.
//     } catch (error) {
//         console.error('DB 조회 오류:', error);
//         res.status(500).json({ error: '서버 오류 발생' });
//     }
// });

// module.exports = router;