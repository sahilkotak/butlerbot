from fastapi import Header, HTTPException

async def get_merchant_id(X_ButlerBot_Merchant_Id: str = Header(default=None)):
    if X_ButlerBot_Merchant_Id is None:
        raise HTTPException(status_code=400, detail="X-ButlerBot-Merchant-Id header is missing")
    return X_ButlerBot_Merchant_Id