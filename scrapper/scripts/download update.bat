@echo off 
CMD /k "cd .. && git pull origin master && docker build -t enchingue/searchlock-scrapper ."