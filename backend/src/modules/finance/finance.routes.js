const express = require('express');
const router = express.Router();
const validate = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const db = require('../../config/db');
const { sendSuccess, sendError } = require('../../utils/response');

router.use(requireAuth);

const incomeSchema = {
    entry_date: (val) => !val || !/^\d{4}-\d{2}-\d{2}$/.test(val) ? 'Valid date required' : null,
    source: (val) => !val ? 'Source required' : null,
    category: (val) => !val ? 'Category required' : null,
    amount: (val) => !val || isNaN(val) || val <= 0 ? 'Positive amount required' : null
};

const expenseSchema = {
    entry_date: (val) => !val || !/^\d{4}-\d{2}-\d{2}$/.test(val) ? 'Valid date required' : null,
    description: (val) => !val ? 'Description required' : null,
    category: (val) => !val ? 'Category required' : null,
    amount: (val) => !val || isNaN(val) || val <= 0 ? 'Positive amount required' : null,
    payment_method: (val) => !val ? 'Payment method required' : null
};

// INCOME ROUTES
router.get('/income', async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM income WHERE user_id = $1 ORDER BY entry_date DESC', [req.user.userId]);
        sendSuccess(res, result.rows);
    } catch (err) { next(err); }
});

router.post('/income', validate(incomeSchema), async (req, res, next) => {
    try {
        const { entry_date, source, category, amount, notes } = req.body;
        const result = await db.query(
            'INSERT INTO income (user_id, entry_date, source, category, amount, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.user.userId, entry_date, source, category, amount, notes || null]
        );
        sendSuccess(res, result.rows[0], 'Income recorded', 201);
    } catch (err) { next(err); }
});

router.put('/income/:id', validate(incomeSchema), async (req, res, next) => {
    try {
        const { entry_date, source, category, amount, notes } = req.body;
        const result = await db.query(
            'UPDATE income SET entry_date=$1, source=$2, category=$3, amount=$4, notes=$5 WHERE id=$6 AND user_id=$7 RETURNING *',
            [entry_date, source, category, amount, notes || null, req.params.id, req.user.userId]
        );
        if (result.rows.length === 0) return sendError(res, 'Income not found', 404);
        sendSuccess(res, result.rows[0]);
    } catch (err) { next(err); }
});

router.delete('/income/:id', async (req, res, next) => {
    try {
        const result = await db.query('DELETE FROM income WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.userId]);
        if (result.rows.length === 0) return sendError(res, 'Income not found', 404);
        sendSuccess(res, null, 'Income deleted');
    } catch (err) { next(err); }
});

// EXPENSE ROUTES
router.get('/expenses', async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY entry_date DESC', [req.user.userId]);
        sendSuccess(res, result.rows);
    } catch (err) { next(err); }
});

router.post('/expenses', validate(expenseSchema), async (req, res, next) => {
    try {
        const { entry_date, description, category, amount, payment_method, notes } = req.body;
        const result = await db.query(
            'INSERT INTO expenses (user_id, entry_date, description, category, amount, payment_method, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [req.user.userId, entry_date, description, category, amount, payment_method, notes || null]
        );
        sendSuccess(res, result.rows[0], 'Expense recorded', 201);
    } catch (err) { next(err); }
});

router.put('/expenses/:id', validate(expenseSchema), async (req, res, next) => {
    try {
        const { entry_date, description, category, amount, payment_method, notes } = req.body;
        const result = await db.query(
            'UPDATE expenses SET entry_date=$1, description=$2, category=$3, amount=$4, payment_method=$5, notes=$6 WHERE id=$7 AND user_id=$8 RETURNING *',
            [entry_date, description, category, amount, payment_method, notes || null, req.params.id, req.user.userId]
        );
        if (result.rows.length === 0) return sendError(res, 'Expense not found', 404);
        sendSuccess(res, result.rows[0]);
    } catch (err) { next(err); }
});

router.delete('/expenses/:id', async (req, res, next) => {
    try {
        const result = await db.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.userId]);
        if (result.rows.length === 0) return sendError(res, 'Expense not found', 404);
        sendSuccess(res, null, 'Expense deleted');
    } catch (err) { next(err); }
});

// SUMMARY ROUTE
router.get('/summary', async (req, res, next) => {
    try {
        // Mock summary response for now
        sendSuccess(res, {
            totalIncome: 0,
            totalExpenses: 0,
            balance: 0,
            expensesByCategory: {},
            incomeByCategory: {},
            monthlyTrend: []
        });
    } catch (err) { next(err); }
});

module.exports = router;
