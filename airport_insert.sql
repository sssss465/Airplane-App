/* a. One Airline name "China Eastern". */
insert into airline values ('China Eastern');
/* b. At least Two airports named "JFK" in NYC and "PVG" in Shanghai. */
insert into airport values ('JFK', 'NYC');
insert into airport values ('PVG', 'SHC');
/* c. Insert at least two customers with appropriate names and other attributes. */
insert into customer values ('sssss465@gmail.com', 'andrew', 'awefawef', '123',
                             'birch', 'nyc', 'ny', '235', '6969', '2018-07-03', 'usa', '1997-07-03');
insert into customer values ('coolcats@gmail.com', 'steve', 'smith', '123 lane',
                              'birch', 'nyc', 'ny', '235', '6969', '2018-07-03', 'usa', '1997-07-03');
/* Insert one booking agent with appropriate name and other attributes. */
insert into booking_agent values ('cool@sw.com', '123', '456');
/* d. Insert at least two airplanes. */
insert into airplane values ('China Eastern','ce135', 100); #swap name id
insert into airplane values ('China Eastern', 'ce682', 100);
/* e. Insert At least One airline Staff working for China Eastern. */
insert into airline_staff values ( 'joe123', '12', 'joe', 'smith', '1998-10-12', 'China Eastern');
/* f. Insert several flights with upcoming, in-progress, delayed statuses. */
insert into flight values ('China Eastern', 'ce8484',  'JFK',  '2018-01-01 00:00:00','PVG', '2018-01-02 00:00:00',  700, 'upcoming', 'ce135');
insert into flight values ('China Eastern', 'ce8485', 'JFK', '2018-01-01 00:00:00',  'PVG', '2018-01-02 00:00:00',  900, 'in-progress', 'ce682');
insert into flight values ('China Eastern', 'ce8486', 'JFK', '2018-01-01 00:00:00',  'PVG', '2018-01-02 00:00:00',  800, 'delayed', 'ce135');
/* g. Insert some tickets for corresponding flights. One customer buy ticket directly
and one customer buy ticket using a booking agent. */
insert into ticket values('ti-1234', 'China Eastern', 'ce8484');
insert into ticket values('ti-1235', 'China Eastern', 'ce8484');
insert into ticket values('ti-1236', 'China Eastern', 'ce8485');
insert into ticket values('ti-1237', 'China Eastern', 'ce8485');

insert into purchases values ('ti-1234', 'coolcats@gmail.com', NULL, '2018-10-30');
insert into purchases values ('ti-1235','coolcats@gmail.com', 'cool@sw.com',  '2018-10-30');
insert into purchases values ('ti-1234', 'sssss465@gmail.com', NULL, '2018-10-30');
