We want to create basic online clipboard web app. the agenda is to have a web app where user comes, login / signup. add any text to the page, we save it in db. We also want to have a feature where I can share my text with some other user via have a code

things you have 
- server dict 
- web dict


in the web dict
- you need to create a react + vite project + shadcn
- have following pages
    - home (/)
    - login (/login)
    - signup (/signup)
    - dashboard (/dashboard)

home page
 - contains for my profile information like, name email linkedin etc
 - and a link to dashboard
 - a "share your code" section where for a valid code, we show user the associted data linked to that code.

login / signup
 - login and signup page

dashboard
- we will have a textarea and a list of all the texts that user have already saved
- user will be able to perform all the CURD operations


in server dict
 - we need a python + fastapi backed server that will communicate with out web app, have our entire busness logic + auth etc
 -
 
 
 for db, we have a local pg instance running on
 
 postgresql://postgres:root@localhost:5432/online_clipboard
 
 use this
 
 
 
 
 for auth, lets keep it simple, we only want to have email + password auth, no JWT needed, make sure to hash the pass
 
 
 
 
 