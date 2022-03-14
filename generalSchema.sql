PRAGMA foreign_keys = ON;

--delete tables if already exist
drop table if exists Stock;
drop table if exists Shelf;
drop table if exists Expiration;
drop table if exists WishList;
drop table if exists Location;
drop table if exists Product;
drop table if exists Section;

--schema
create table Section(
    sectionID integer primary key,
    sectionName text
);
create table Product(
    productID integer primary key,
    productName text,
    notes text,
    sectionID integer,
    foreign key (sectionID) references Section(sectionID)
);

create table Location(
    locationID integer primary key,
    locationName text
);

create table WishList(
    productID integer primary key,
    foreign key (productID) references Product(productID) 
);

create table Expiration(
    productID integer primary key,
    expirationDate text check (expirationDate glob '[0-9][0-9]/[0-9][0-9]/[0-9][0-9]'),
    foreign key (productID) references Product (productID) 
);

create table Shelf(
    shelfID integer,
    locationID integer,
    shelfName text,
    primary key (shelfID, locationID),
    foreign key (locationID) references Location (locationID)
);

create table Stock(
    productID integer,
    shelfID integer,
    locationID integer,
    datePurchased text check (datePurchased glob '[0-9][0-9]/[0-9][0-9]/[0-9][0-9]'),
    quantity integer check (quantity >= 0),
    primary key(productID,shelfID,locationID),
    foreign key (productID) references Product(productID),
    foreign key (shelfID, locationID) references Shelf(shelfID,locationID)
);
