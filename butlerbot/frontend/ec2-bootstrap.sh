### update ubuntu
sudo apt update
### install git
sudo apt install git -y
git version
sudo apt install gh
echo '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' > git-credentials.txt
gh auth login --with-token < git-credentials.txt
gh repo clone sahilkotak/butlerbot
git checkout development
# Username: PatelKeviin
### install ffmpeg dependencyno
sudo apt install ffmpeg -y
### install python3.11
sudo apt install wget build-essential libncursesw5-dev libssl-dev \
libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev -y
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt install python3.11
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11 
### spin up local server
cd butlerbot/butlerbot/backend
curl -sSL https://install.python-poetry.org | python3.11 -
nano ~/.bashrc
# export PATH="/home/ubuntu/.local/bin:$PATH"
source ~/.bashrc
poetry install
pip3.11 install fastapi
pip3.11 install uvicorn
### install apache/nginx server
sudo apt install nginx
cd /etc/nginx/sites-enabled/
sudo nano butlerbot_site
# server {
#     listen 80;
#     server_name 54.82.249.3;
#     location / {
#         proxy_pass http://127.0.0.1:8000;
#     }
# }
sudo service nginx restart
### configure environment credentials
nano ~/butlerbotai-credentials.json
# {
#   "type": "service_account",
#   "project_id": "butlerbotai",
#   "private_key_id": "5722438492a540620169499b45cb68050f9dcd8c",
#   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDRDGw6CFURgxxY\nm55WyZqF6lTCFk9eFaYqwLavJjBOFaCDB/VfhfkePezLBbeXwvs/VDULCOXVA7Fx\n7wJwUyUGorZ+fwvJTEY1vXGbccav1i4keYdmGNMKej5+0yTQGvy3aBreU31iWMIK\n3W2TDx3c6n/Jq86SsS1KgnAH0736xTWSUwNVvcoO7BQeIO2fGInilffI4aQkoWDA\nJZAvbrpUMzbLp2+/l26NTv1kGK03SKPx3eDeDP6T8mdObTVlJV1ExUa7njPfiRz6\nBS44RWRGRSUTJmNt1MK5gpTau/3xE5pbequb3fD9IO5aP5VGDdraIgRTnLlgmKVr\n62ycEyzzAgMBAAECggEASTCBP7wlFHGD3h31zMret933+M/Yz8bim3tHOoEzTlNS\nFC4YIW6FbqodmmMRCSgx0NVJkOh3lyGo4YvdnbfucalMHXObi8mRl0URXmvyNSPW\nmdyWpA8y7CsqcDq6W8XnDst7BLXUYzdSEH2/3EnhmbPcM55cP42ansiWMpdWn1ID\noVYt/AIzB1ir6OJCPO3/rWxBJhySORDyNb8vGpgsPr1Cb2Hz5WQ7zp9BzN6rc42R\njHFGqdXRCUurT54EwZrmzOatwVQGWfknuebOc9vzeDHIQ2JL/JqKRZA56FwOIOs0\n41Zr9RpeUfsj25rpOUkzOlgIck5e7+DeHJtUYSo6cQKBgQD+EyVIzp8/g7tk4s8D\n6LGqXnXZsdYyLIPzdiwbMBMyqpn8+ZOD69tJ8KbOmcveDZM5AK4I5UCcvXDoE07B\noQ4bLQMWo4ghXOu3SqcFq17H7IoyOdu4UDYB1j2yqYiApQqP/u9yXVIdTUOu/5Oo\nVbSDe6osCNgJMPaJwhoLULAFKwKBgQDSoe9mwhJKTl1r8rf/ylNoiC0ez6dIttgM\ng/yu3zX3OTURBeX2QVGURiIAqlGJSI7QIDosh8hYQLD/SgKRAHc/3RPzd1v5pvWE\n+ugct2epUxmiSuX4qKSfnbiiJNEwl5ZqGDmx/e6EnNM4Eklr2U4IjJEBq4Zco4kY\nCwwWxUWjWQKBgQCWFUcr9+n4Ad/bW2NAAt+YLQ5elv9ZShRz53VsZfyhLEekOOVb\nwyIZTk+qsQzNUaWKwY0Mcie1ru4YGPenx3RmtzMg117dnl8bObzpy25EmMSVoLna\n6X7NnPl7JUwd+eAAaW6WVuvfpTl7ETvu7xmfpZhDRMIgw8yOWZs63eHsWwKBgQCm\nJslDRNnKtbBqA8fzRbWv4qO9B07NRDZ/AOqlQzw9rWnX6NAzBemFTiFqZu/0nEDT\nmmhpUh7OxxEYAFiv6y8mOI2RY1kxQOuxn37TkDV8UyoIZI6uLNHXe0H23ZYKf7lO\nLZfteQLapx7Sv1IdeghdJA0KxTQzBWmShrxdhfXd2QKBgQCIE3X8m/kz1PTJ9uD6\nSos3tm3GBp4OYKkSVJPT9qRCkCq2nzxOX5vkBk2ohlfe92pyRq8K4zrbchs5ihTP\ndO/0zGnSa0pq040TYxvIZy7jC1pdwUcHs7QleGsBJfApr2h3kqkwPKsJ1T+AT/dq\nxR2m/3NOTpYaNi9GBWn4oju/kQ==\n-----END PRIVATE KEY-----\n",
#   "client_email": "butlerbotai@butlerbotai.iam.gserviceaccount.com",
#   "client_id": "107776220952606767457",
#   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#   "token_uri": "https://oauth2.googleapis.com/token",
#   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
#   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/butlerbotai%40butlerbotai.iam.gserviceaccount.com",
#   "universe_domain": "googleapis.com"
# }
nano ~/.bash_profile
# export GOOGLE_APPLICATION_CREDENTIALS=~/butlerbotai-credentials.json
# export OPENAI_API_KEY=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
# export PATH=$PATH:/home/ubuntu/.local/bin
source ~/.bash_profile
### build frontend dist folder
sudo apt install nodejs -y
sudo apt install npm -y

cd ~/butlerbot/butlerbot/frontend
echo 'BUTLERBOT_API_ENDPOINT = /
DEMO_BUTLERBOT_APP_SESSION_TOKEN = ABCDEF12345' > .env
### run backend server
cd ~/butlerbot/butlerbot/backend
python3.11 -m uvicorn main:app
# configure service autostart