from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header,Request 
from fastapi.responses import JSONResponse
from typing import Optional
from models import *
from service import * 
from settings import *
import boto3
import io
import torch
from torchvision.transforms import transforms
from PIL import Image
from Torch.model import Model,transform,device 
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware 
import os


app = FastAPI(title="Deep Fake Detection")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Specifies which methods can be used in requests
    allow_headers=["*"],  # Allows all headers
)


@app.post("/signup")
async def signup(user_create: UserCreate):
    hashed_password = hash_password(user_create.password)
    table =  dynamodb.Table(table_name)
    response = table.get_item(Key={"user_name": user_create.user_name})
    if 'Item' in response:
            return {"detail": "User Already exists"}
    table.put_item(Item={"user_name":user_create.user_name, "password":hashed_password})
    return {"message": "Registration successful"}

@app.post("/login", response_model=Token)
async def login(user_auth: UserAuth):
    token = await get_token(user_auth) 

    return {"access_token": token, "token_type": "bearer"}



def predict_image(image):
    image_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = Model.model(image_tensor)
        prob = outputs[0].item()
        return prob > 0.5

@app.post("/predict")
async def predict(file: UploadFile = File(...),Token: str = Header(...)):
    decoded_token = await verify_token(Token)
    contents = await file.read() 
    img = Image.open(io.BytesIO(contents))  
    img_save_path = f"./{file.filename}"
    # os.makedirs(os.path.dirname(img_save_path), exist_ok=True)
    img.save(img_save_path)
    try: 
         res=predict_image(img) 
         return {"prediction": res} 
    except Exception as e:
         print(e)
         return {"detail" : str(e)}


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": detail},
    ) 
@app.exception_handler(Exception)
async def http_exception_handler(request: Request, exc: Exception):
     error_details = str(exc) 
     return JSONResponse(
        content={"detail": error_details},
    ) 
