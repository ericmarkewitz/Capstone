PRAGMA foreign_keys = ON;

--delete tables if already exist
drop table if exists CannedGoods;
drop table if exists Jars;
drop table if exists Batch;
drop table if exists Shelves;
drop table if exists Storage;

--schema
create table Storage(
    locationID integer primary key,
    locationName text
);

create table Shelves(
    shelfID integer primary key,
    locationID integer,
    shelfName text,
    foreign key (locationID) references Storage (locationID)
);

create table Batch(
    batchID integer primary key,
    product text,
    datePlaced text check (datePlaced glob '[0-9][0-9]/[0-9][0-9]/[0-9][0-9]'),
    shelfID integer, 
    quantity integer check (quantity >= 0),
    foreign key (shelfID) references Shelves(shelfID)
);

create table Jars(
    jarID integer primary key,
    size text,
    mouth text check (mouth = 'regular' or mouth = 'wide')
);

create table CannedGoods(
    jarID integer,
    batchID integer,
    primary key (jarID, batchID),
    foreign key (jarID) references Jars(jarID),
    foreign key (batchID) references Batch(batchID)
);