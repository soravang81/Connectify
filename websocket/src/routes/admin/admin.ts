import express from 'express';

const admin = express.Router();

admin.use((req, res, next) => {
  console.log(`Admin API Request - Method: ${req.method}, Path: ${req.path}`);
  next();
});
admin.get("/" , (req,res)=>{

})

export default admin;