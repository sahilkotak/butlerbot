# update linux
sudo apt update
# install git
sudo apt install git -y
git version
sudo apt install gh
echo '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' > git-credentials.txt
gh auth login --with-token < git-credentials.txt
gh repo clone sahilkotak/butlerbot
git checkout development
# Username: PatelKeviin
# spin up local server
sudo apt install python3-pip -y
sudo apt install nodejs -y
sudo apt install npm -y
cd butlerbot/butlerbot/backend
pip install fastapi
pip install uvicorn
pip3 install -r requirements.txt
cd ../frontend
echo 'BUTLERBOT_API_ENDPOINT = http://127.0.0.1:8000
DEMO_BUTLERBOT_APP_SESSION_TOKEN = ABCDEF12345' > .env
npm i

# install apache/nginx server
# install ffmpeg dependency
# download project files -> development branch
# configure server spin up
# configure server autostart