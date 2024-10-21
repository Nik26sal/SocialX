import { Router } from "express";

const router = Router();

router.post("/register",async(req,res)=>{
    console.log(req.body);
})

export default router;