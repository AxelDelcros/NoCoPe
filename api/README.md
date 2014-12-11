# API : Ressourses usages and management


## Port : 5555


## ROUTES DESCRIPTION




### POST : /recipes
#### Form :
##### name:STRING
##### description:STRING
##### duration: ex 1H15, 2H06, 42, 5H
##### steps:STEPS
##### ingredients:["_id_ingredients_1", "_id_ingredients_2", "_id_ingredients_n"]
##### products:["_id_products_1", "_id_products_2", "_id_products_n"]
##### TAGS:["_id_tags_1", "_id_tags_2", "_id_tags_n"]



### GET : /recipes/id/ID



### PUT : /recipes/id/ID
#### Form :
##### Every field you want to update



### DELETE : /recipes/id/ID

