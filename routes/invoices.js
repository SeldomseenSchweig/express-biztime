const express = require("express");
const router = express.Router();
const db = require("../db")




// Step 3: Add Invoices
// Add routes/invoices.js. All routes in this file should be prefixed by /invoices.

// GET /invoices
// Return info on invoices: like {invoices: [{id, comp_code}, ...]}
router.get("/", async (req,res,next)=>{
    try {
        const results = await db.query('SELECT * FROM invoices');
    
        return res.json({invoices:results.rows})
        
    } catch (error) {
        return next(error);
    }

});


// GET /invoices/[id]
// Returns obj on given invoice.

// If invoice cannot be found, returns 404.

router.get('/:id', async (req,res,next)=>{
    
    try {
        const {id} =  req.params;
        const results = await db.query(`SELECT * FROM invoices WHERE id = $1`,
        [id]);
        if(results.rows.length === 0){
          throw new ExpressError("Can't find invoice with that ID", 404)
        }
        return res.json({company:results.rows[0]});
    
    } catch (error) {
        return next(error)
        
    }
    
    })

// Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}

// POST /invoices
// Adds an invoice.

// Needs to be passed in JSON body of: {comp_code, amt}

// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.post('/', async (req,res,next)=>{
    try {
        const {comp_code, amt} = req.body;
        const results = await db.query(`INSERT INTO companies (comp_code, amt) VALUES ($1,$2) RETURNING  id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        return res.status(201).json({invoice:results.rows[0]})
    
    } catch (error) {
        return next(error)
        
    }
    
    })

    

// PUT /invoices/[id]
// Updates an invoice.

// If invoice cannot be found, returns a 404.

// Needs to be passed in a JSON body of {amt}

// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.patch('/:id', async (req,res,next)=>{
    let {id} = req.params;

    try {
        const {amt} = req.body;
        const results = await db.query(`UPDATE invoices SET amt=$1 
        WHERE id = $2 
        RETURNING id,amt, comp_code  `,
        [amt, id]);
        if(results.rows.length === 0){
            throw new ExpressError("Can't find invoice with that ID", 404)
          }
        return res.json({invoice:results.rows[0]});
    
    } catch (error) {
        return next(error)
        
    }
    
    })

// DELETE /invoices/[id]
// Deletes an invoice.

// If invoice cannot be found, returns a 404.

// Returns: {status: "deleted"}

router.delete('/:id', async (req,res,next)=>{
    
    try {
        const {id} =  req.params;
        let results = await db.query('DELETE FROM invoices WHERE id=$1',
        [id]);
        if(results.rows.length === 0){
            throw new ExpressError("Can't find invoice with that ID", 404)
          }
        return res.send({status:"deleted"});
    
    } catch (error) {
        return next(error)
        
    }
    
    })

// Also, one route from the previous part should be updated:

// GET /companies/[code]
// Return obj of company: {company: {code, name, description, invoices: [id, ...]}}

// If the company given cannot be found, this should return a 404 status response.




module.exports = router




