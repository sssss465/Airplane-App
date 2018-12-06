/* a. One Airline name "China Eastern". */
insert into airline values ('China Eastern');
insert into airline values ('United');
/* b. At least Two airports named "JFK" in NYC and "PVG" in Shanghai. */
insert into airport values ('JFK', 'New York City');
insert into airport values ('PVG', 'Shanghai');
insert into airport values ('SFO', 'San Francisco');
/* c. Insert at least two customers with appropriate names and other attributes. */
insert into customer values ('sssss465@gmail.com', 'andrew', 'awefawef', '123',
                              'birch', 'nyc', 'ny', '235', '6969', '2018-07-03', 'usa', '1997-07-03');
insert into customer values ('coolcats@gmail.com', 'steve', 'smith', '123 lane',
                              'birch', 'nyc', 'ny', '235', '6969', '2018-07-03', 'usa', '1997-07-03');
/* Insert one booking agent with appropriate name and other attributes. */
insert into booking_agent values ('cool@sw.com', '123', '456');
/* e. Insert At least One airline Staff working for China Eastern. */
insert into airline_staff values ( 'joe123', '12', 'joe', 'smith', '1998-10-12', 'China Eastern');
/* d. Insert at least two airplanes. */
insert into airplane values ('China Eastern','ce135', 100); #swap name id
insert into airplane values ('China Eastern', 'ce682', 100);
insert into airplane values ('United', 'un123', 100);
/* f. Insert several flights with upcoming, in-progress, delayed statuses. */
insert into flight values ('China Eastern', 'ce-8482', 'JFK', '2018-01-01', 'PVG', '2018-01-02', 700, 'upcoming', 'ce135');
insert into flight values ('China Eastern', 'ce-8483', 'JFK', '2018-01-01', 'PVG', '2018-01-02', 700, 'upcoming', 'ce135');
insert into flight values ('China Eastern', 'ce-8484', 'JFK', '2018-01-01', 'PVG', '2018-01-02', 700, 'upcoming', 'ce135');
insert into flight values ('China Eastern', 'ce-8485', 'JFK', '2018-01-01', 'PVG', '2018-01-02', 900, 'in-progress', 'ce682');
insert into flight values ('China Eastern', 'ce-8486', 'JFK', '2018-01-01', 'PVG', '2018-01-02', 800, 'delayed', 'ce135');
insert into flight values ('United'       , 'un-8271', 'SFO', '2018-12-01', 'JFK', '2018-12-02', 600, 'upcoming', 'un123');
/* g. Insert some tickets for corresponding flights. One customer buy ticket directly
and one customer buy ticket using a booking agent. */
insert into ticket values('ti-1234', 'China Eastern', 'ce-8484');
insert into ticket values('ti-1111', 'China Eastern', 'ce-8484');
insert into ticket values('ti-1112', 'China Eastern', 'ce-8485');
insert into ticket values('ti-1113', 'China Eastern', 'ce-8486');
insert into ticket values('ti-1114', 'China Eastern', 'ce-8483');
insert into ticket values('ti-1235', 'China Eastern', 'ce-8482');
insert into ticket values('ti-1236', 'China Eastern', 'ce-8485');
insert into ticket values('ti-1237', 'China Eastern', 'ce-8485');

insert into purchases values ('ti-1234', 'coolcats@gmail.com', NULL, '2018-10-29');
insert into purchases values ('ti-1111', 'coolcats@gmail.com', NULL, '2018-9-29');
insert into purchases values ('ti-1112', 'coolcats@gmail.com', NULL, '2018-9-9');
insert into purchases values ('ti-1113', 'coolcats@gmail.com', NULL, '2018-9-10');
insert into purchases values ('ti-1114', 'coolcats@gmail.com', NULL, '2018-8-9');
insert into purchases values ('ti-1235', 'coolcats@gmail.com', 'cool@sw.com',  '2018-10-30');
insert into purchases values ('ti-1234', 'sssss465@gmail.com', NULL, '2018-10-31');
