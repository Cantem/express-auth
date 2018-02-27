create table customers (
	id serial primary key,
	username varchar(50) unique,
	password varchar(50)
);
