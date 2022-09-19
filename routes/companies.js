const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

// GET /companies Returns list of companies, like {companies: [{code, name}, ...]}

router.get("/", async (req,res,next)=>{
    try {
        const results = await db.query('SELECT * FROM companies');
    
        return res.json({companies:results.rows})
        
    } catch (error) {
        return next(error);
    }

});

// GET /companies/[code]
// Return obj of company: {company: {code, name, description}}

router.get('/:code', async (req,res,next)=>{
    
    try {
        const {code} =  req.params;
        const results = await db.query(`SELECT * FROM companies WHERE code = $1`,
        [code]);
        if(results.rows.length === 0){
          throw new ExpressError("Can't find user with that ID", 404)
        }
        return res.json({company:results.rows[0]});
    
    } catch (error) {
        return next(error)
        
    }
    
    })

// POST /companies
// Adds a company.

// Needs to be given JSON like: {code, name, description}

// Returns obj of new company: {company: {code, name, description}}

router.post('/', async (req,res,next)=>{
    try {
        const {code, name, description} = req.body;
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING  code, name, description`, [code, name, description]);
        return res.status(201).json({company:results.rows[0]})
    
    } catch (error) {
        return next(error)
        
    }
    
    })

// UPDATE /companies/[code]
// Edit existing company.

// Should return 404 if company cannot be found.

// Needs to be given JSON like: {name, description}

// Returns update company object: {company: {code, name, description}}
router.patch('/:code', async (req,res,next)=>{
    let {code} = req.params;

    try {
        const {name, description} = req.body;
        const results = await db.query(`UPDATE companies SET code=$1, name=$2, description=$3 
        WHERE code = $1 
        RETURNING  code, name, description`,
        [code, name, description]);
        if(results.rows.length === 0){
            throw new ExpressError("Can't find user with that ID", 404)
          }
        return res.json({company:results.rows[0]});
    
    } catch (error) {
        return next(error)
        
    }
    
    })
    // DELETE /companies/[code]
    // Deletes company.
    
    // Should return 404 if company cannot be found.
    
    // Returns {status: "deleted"}

    router.delete('/:code', async (req,res,next)=>{
    
        try {
            const {code} =  req.params;
            let results = await db.query('DELETE FROM companies WHERE id=$1',
            [code]);
            if(results.rows.length === 0){
                throw new ExpressError("Can't find user with that ID", 404)
              }
            return res.send({status:"deleted"});
        
        } catch (error) {
            return next(error)
            
        }
        
        })



module.exports = router