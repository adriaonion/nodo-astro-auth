import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID, randomBytes } from 'node:crypto';
import { writeFileSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require=createRequire(new URL('../back/package.json',import.meta.url));
const {PrismaClient}=require('@prisma/client');
const bcrypt=require('bcryptjs');
const {JwtService}=require('@nestjs/jwt');
const root=fileURLToPath(new URL('..',import.meta.url));
const back=fileURLToPath(new URL('../back',import.meta.url));
const name=`test-${randomUUID()}.db`,dbFile=fileURLToPath(new URL(`../back/prisma/${name}`,import.meta.url));
const secret=randomBytes(48).toString('hex');
const databaseUrl=`file:./${name}`;
const env={...process.env,DATABASE_URL:databaseUrl,JWT_SECRET:secret,PORT:'3301',NODE_ENV:'test',FRONTEND_ORIGIN:'http://localhost:4321'};
const password='PruebaLocal2026!';
let child,db;
async function gql(query,variables={},token){const r=await fetch('http://127.0.0.1:3301/graphql',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({query,variables})});assert.equal(r.status,200);return r.json();}
const login='mutation($input:LoginInput!){login(input:$input){accessToken user{id role}}}';
const register='mutation($input:RegisterInput!){register(input:$input){accessToken user{id role email}}}';
const productMutation='mutation($input:ProductInput!){createProduct(input:$input){id name priceCents stock}}';
const orderMutation='mutation($input:CreateOrderInput!){createOrder(input:$input){id totalCents items{name priceCents quantity}}}';
await test('API completa con base de datos aislada',async t=>{
 try {
  writeFileSync(dbFile,'');
  const setup=spawnSync(process.execPath,[fileURLToPath(new URL('../node_modules/prisma/build/index.js',import.meta.url)),'db','push','--skip-generate'],{cwd:back,env,encoding:'utf8'});
  assert.equal(setup.status,0,setup.stderr);
  db=new PrismaClient({datasourceUrl:databaseUrl});
  const admin=await db.user.create({data:{name:'Admin prueba',email:'admin@test.example',passwordHash:await bcrypt.hash(password,10),role:'ADMIN'}});
  const category=await db.category.create({data:{name:'Prueba'}});
  let serverLog='';child=spawn(process.execPath,['dist/main.js'],{cwd:back,env,stdio:['ignore','pipe','pipe']});child.stdout.on('data',x=>{serverLog+=x});child.stderr.on('data',x=>{serverLog+=x});
  let ready=false;for(let i=0;i<60;i++){try{const r=await gql('{categories{id}}');if(r.data){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}
  assert.ok(ready,serverLog);
  let clientToken,clientId,adminToken,product;
  await t.test('Registro asigna CLIENTE y guarda hash, no contraseña',async()=>{
    const r=await gql(register,{input:{name:'Cliente prueba',email:'CLIENTE@Test.Example',password}});assert.ok(!r.errors,JSON.stringify(r.errors));clientToken=r.data.register.accessToken;clientId=r.data.register.user.id;assert.equal(r.data.register.user.role,'CLIENTE');assert.equal(r.data.register.user.email,'cliente@test.example');const u=await db.user.findUnique({where:{id:clientId}});assert.notEqual(u.passwordHash,password);assert.ok(await bcrypt.compare(password,u.passwordHash));
  });
  await t.test('Registro duplicado, contraseña corta y vacíos se rechazan',async()=>{
    assert.ok((await gql(register,{input:{name:'Otro',email:'cliente@test.example',password}})).errors);
    assert.ok((await gql(register,{input:{name:'Otro',email:'nuevo@test.example',password:'123'}})).errors);
    assert.ok((await gql(register,{input:{name:'  ',email:'vacio@test.example',password}})).errors);
  });
  await t.test('Login correcto y rechazo de contraseña incorrecta',async()=>{assert.ok((await gql(login,{input:{email:'cliente@test.example',password:'Incorrecta1234'}})).errors);const r=await gql(login,{input:{email:'admin@test.example',password}});assert.ok(!r.errors);adminToken=r.data.login.accessToken;});
  await t.test('Autenticación rechaza token ausente, alterado y vencido',async()=>{
    assert.ok((await gql('{me{id}}')).errors);assert.ok((await gql('{me{id}}',{},clientToken+'alterado')).errors);
    const expired=new JwtService().sign({sub:clientId,sid:randomUUID()},{secret,expiresIn:-10,issuer:'nodo-api',audience:'nodo-web'});assert.ok((await gql('{me{id}}',{},expired)).errors);
  });
  const input={name:'Producto prueba',description:'Descripción de prueba funcional',priceCents:12345,stock:4,categoryId:category.id};
  await t.test('Cliente y visitante no pueden crear productos',async()=>{assert.ok((await gql(productMutation,{input},clientToken)).errors);assert.ok((await gql(productMutation,{input})).errors);});
  await t.test('Administrador crea y actualiza productos; valida precio y stock',async()=>{
    const r=await gql(productMutation,{input},adminToken);assert.ok(!r.errors,JSON.stringify(r.errors));product=r.data.createProduct;
    const q='mutation($id:String!,$input:ProductInput!){updateProduct(id:$id,input:$input){id name}}';assert.ok(!(await gql(q,{id:product.id,input:{...input,name:'Producto actualizado'}},adminToken)).errors);
    assert.ok((await gql(productMutation,{input:{...input,stock:-1}},adminToken)).errors);assert.ok((await gql(productMutation,{input:{...input,priceCents:0}},adminToken)).errors);
  });
  let key=randomUUID(),orderId;
  await t.test('Pedido exige sesión y toma precio e identidad del servidor',async()=>{
    const input={requestKey:key,items:[{productId:product.id,quantity:2}]};assert.ok((await gql(orderMutation,{input})).errors);
    const r=await gql(orderMutation,{input},clientToken);assert.ok(!r.errors,JSON.stringify(r.errors));assert.equal(r.data.createOrder.totalCents,24690);orderId=r.data.createOrder.id;
    assert.equal((await db.product.findUnique({where:{id:product.id}})).stock,2);assert.equal((await db.order.findUnique({where:{id:orderId}})).userId,clientId);
  });
  await t.test('Reintentar el mismo pedido no duplica ni descuenta otra vez',async()=>{const r=await gql(orderMutation,{input:{requestKey:key,items:[{productId:product.id,quantity:2}]}},clientToken);assert.equal(r.data.createOrder.id,orderId);assert.equal((await db.product.findUnique({where:{id:product.id}})).stock,2);});
  await t.test('Pedidos ajenos no aparecen en el historial',async()=>{const r=await gql('{myOrders{id}}',{},adminToken);assert.deepEqual(r.data.myOrders,[]);assert.equal((await gql('{myOrders{id}}',{},clientToken)).data.myOrders.length,1);});
  await t.test('Sin stock, cantidades negativas, carrito vacío y duplicados se rechazan',async()=>{
    for(const items of [[{productId:product.id,quantity:8}],[{productId:product.id,quantity:-1}],[],[{productId:product.id,quantity:1},{productId:product.id,quantity:1}]])assert.ok((await gql(orderMutation,{input:{requestKey:randomUUID(),items}},clientToken)).errors);
    assert.equal((await db.product.findUnique({where:{id:product.id}})).stock,2);
  });
  await t.test('Rollback restaura stock si falla otra línea del pedido',async()=>{const r=await gql(orderMutation,{input:{requestKey:randomUUID(),items:[{productId:product.id,quantity:1},{productId:randomUUID(),quantity:1}]}},clientToken);assert.ok(r.errors);assert.equal((await db.product.findUnique({where:{id:product.id}})).stock,2);});
  await t.test('Dos pedidos concurrentes no sobrevendEN la última unidad',async()=>{
    await db.product.update({where:{id:product.id},data:{stock:1}});
    const results=await Promise.all([1,2].map(()=>gql(orderMutation,{input:{requestKey:randomUUID(),items:[{productId:product.id,quantity:1}]}},clientToken)));
    assert.equal(results.filter(r=>r.data?.createOrder).length,1);assert.equal((await db.product.findUnique({where:{id:product.id}})).stock,0);
  });
  await t.test('Eliminar producto preserva las líneas históricas',async()=>{assert.ok(!(await gql('mutation($id:String!){deleteProduct(id:$id)}',{id:product.id},adminToken)).errors);assert.ok((await gql('{myOrders{items{name}}}',{},clientToken)).data.myOrders[0].items.length);});
  await t.test('Logout revoca el token también en el servidor',async()=>{assert.ok((await gql('mutation {logout}',{},clientToken)).data.logout);assert.ok((await gql('{me{id}}',{},clientToken)).errors);});
 } finally {
  if(child){child.kill();await new Promise(r=>child.once('exit',r));}
  await db?.$disconnect();for(const suffix of ['', '-journal']){try{unlinkSync(dbFile+suffix)}catch{}}
 }
});
