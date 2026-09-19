import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const app = express();
app.use(helmet()); app.use(cors({ origin: process.env.WEB_ORIGIN?.split(',') || true })); app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60_000, limit: 20, standardHeaders: true, legacyHeaders: false }));
app.get('/health', (_, res) => res.json({ status: 'ok' }));
const tokenFor = (id: string, role = 'USER') => jwt.sign({ sub: id, role }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: '15m' });
function auth(req: Request & { user?: { id: string, role: string } }, res: Response, next: NextFunction) { const raw=req.headers.authorization?.replace('Bearer ',''); if(!raw)return res.status(401).json({error:'Authentication required'}); try { const data=jwt.verify(raw,process.env.JWT_SECRET||'development-only-secret') as {sub:string,role:string}; req.user={id:data.sub,role:data.role}; next(); } catch {res.status(401).json({error:'Session expired or invalid'});} }
const rideInput=z.object({startLocation:z.string().min(2).max(120),destination:z.string().min(2).max(120),departureAt:z.string().datetime(),availableSeats:z.number().int().min(1).max(6)});
// Database operations are intentionally isolated behind this repository boundary.
const demoRides=[{id:'ride_demo_1',driver:'Rahul Kumar',from:'Mango',to:'Bistupur',departureAt:'2026-09-20T03:00:00.000Z',availableSeats:2,suggestedContribution:42,matchScore:94}];
app.post('/api/auth/login',(req,res)=>{const input=z.object({email:z.string().email(),password:z.string().min(8)}).safeParse(req.body);if(!input.success)return res.status(422).json({error:'Enter a valid email and password.'}); res.json({accessToken:tokenFor('demo-passenger'),user:{id:'demo-passenger',name:'Demo Passenger',role:'USER'}})});
app.get('/api/rides/search',auth,(_,res)=>res.json({data:demoRides}));
app.post('/api/rides',auth,(req,res)=>{const input=rideInput.safeParse(req.body);if(!input.success)return res.status(422).json({error:'Invalid ride details',details:input.error.flatten()});res.status(201).json({data:{id:'ride_new',...input.data,status:'CREATED'}})});
app.post('/api/rides/:id/request',auth,(req,res)=>res.status(201).json({data:{id:'request_new',rideId:req.params.id,status:'PENDING'}}));
app.post('/api/users/:id/block',auth,(req,res)=>res.status(201).json({data:{blockedUserId:req.params.id}}));
app.use((err: Error, _:Request,res:Response,_next:NextFunction)=>{console.error(err);res.status(500).json({error:'Something went wrong. Please try again.'})});
app.listen(Number(process.env.PORT || 4000),()=>console.log('RideMate API listening'));
