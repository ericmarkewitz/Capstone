--replace 0 with whatever's needed

select * from Storage; --Returns all locations

select shelfID, shelfName from shelves natural join storage where locationID = 0; --Returns all shelves in a location

select batchID, product, datePlaced, quantity from batch natural join shelves where shelfID = 0; --Returns all items in a shelf (full details)

select batchID, product from batch natural join shelves where shelfID = 0; --Same as above but just batchID and product name

select * from batch where batchID = 0; --Returns all data for a particular batch (except jar data)

select * from batch natural join CannedGoods natural join Jars where batchID = 0; --Same as above but with jar data included

with locItems as (select batchID from Batch natural join Shelves natural join Storage where locationID = 0) 
select count(*) as numGoods from locItems natural join CannedGoods;--Returns number of items in a location

with shelfItems as (select batchID from Batch natural join Shelves where shelfID = 0) 
select count(*) as numGoods from shelfItems natural join CannedGoods; --Same as above but with one shelf instead of an entire location

select * from jars natural join CannedGoods where mouth = 'regular'; --Returns all regular mouth jars in use