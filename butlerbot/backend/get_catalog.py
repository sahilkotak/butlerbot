import requests

def get_catalog_items(authorization_code):
    token_url = "https://connect.squareup.com/oauth2/token"

    # Token request data
    token_data = {
        "client_id": "sq0idp-6aYBSQ_b6TCjM0iJ2viLFw",
        "client_secret": "sq0csp-CusXW-fZIE25jo29D-GjUNa6dwPOZ02NiIjLKltrjbQ",
        "code": authorization_code,
        "redirect_uri": "https://ntibnportal.powerappsportals.com/",
        "grant_type": "authorization_code",
    }

   

    # Square Catalog API endpoint
    catalog_url = "https://connect.squareup.com/v2/catalog/list"

    try:
        # Step 1: Exchange authorization code for an access token
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        access_token = token_response.json()["access_token"]
        print(f"Access Token: {access_token}")

         # Headers for API requests
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }

        # Step 2: Use the obtained access token to fetch catalog items
        catalog_response = requests.get(catalog_url, headers=headers)
        catalog_response.raise_for_status()
        catalog_data = catalog_response.json()


        # Extract and return the list of catalog items
        catalog_items = catalog_data.get("objects", [])
        
        return catalog_items
    except Exception as e:
        raise Exception(f"Error fetching catalog items: {e}")
