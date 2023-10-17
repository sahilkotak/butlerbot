from fastapi import HTTPException, Request

async def get_merchant_id(request: Request):
    X_ButlerBot_Merchant_Id = request.cookies.get('X-ButlerBot-Merchant-Id')
    if X_ButlerBot_Merchant_Id is None:
        raise HTTPException(status_code=400, detail="X-ButlerBot-Merchant-Id cookie is missing")
    return X_ButlerBot_Merchant_Id