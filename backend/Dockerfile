#Base image
FROM docker.io/node:18
#Python install
RUN apt-get update || : && apt-get install python -y
RUN apt-get install python3-pip -y
#Path to the project
WORKDIR /app
#Node configuration
COPY package.json ./
RUN npm install && npm i -g amazon-buddy
COPY ./ ./
#Python configuration
RUN cd predictor/ && python3 -m pip install -r requirements.txt

CMD [ "npm", "run", "start" ]