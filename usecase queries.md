## Usecase Queries

### Agent

#### commissions

```sql
select date_format(purchase_date, '%Y-%m-%d') `date`, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where booking_agent_id = ? and
  purchase_date <= curdate() and
  purchase_date >= curdate() - interval 30 day
group by date_format(purchase_date, '%Y-%m-%d'), month(purchase_date)
```
This query shows the total amount of commission received in the past 30 days.

```sql
select date_format(purchase_date, '%Y-%m-%d') `date`, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where booking_agent_id = ? and
  purchase_date <= ? and
  purchase_date >= ?
group by date_format(purchase_date, '%Y-%m-%d'), month(purchase_date)
order by `date`
```
This query shows the total amount of commission recived in the range selected by users.

#### customers

```sql
select customer_email, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where booking_agent_id = ? and
  purchase_date <= curdate() and
  purchase_date >= curdate() - interval 6 month
group by customer_email
order by sum(price) desc limit 5
```
This query gives data of top 5 customer by ticket.

```sql
select customer_email, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where booking_agent_id = ? and
  purchase_date <= curdate() and
  purchase_date >= curdate() - interval 6 month
group by customer_email
order by count(price) desc limit 5
```

This query gives data of top 5 customer by ticket.

#### buy

```sql
select flight_num, airline_name, seats 
from flight natural join airplane 
where flight_num = ?
```
This query gets specific flight info.

```sql
select count(ticket_id) as c from ticket
```
This query gets ticket count.

```sql
select count(ticket_id) as d 
from ticket 
where flight_num = ? group by flight_num 
```
This query get ticket count for flight.

```sql
insert into ticket values (?,?,?)
```
This query inserts a ticket.

```sql
insert into purchases values (?, ?, ?, ?)
```
This query inserts a purchase.

#### flights

```sql
select *
from flight natural join
         (select distinct flight_num
          from ticket natural join purchases
          where booking_agent_id = ?
         ) customer_flights\n" +
where status = 'upcoming'
```
This query gets flights with status upcoming.

```sql
select *
from flight natural join
         (select distinct flight_num
          from ticket natural join purchases
          where booking_agent_id = ?
         ) customer_flights
where status = ?
```
This query gets flights with user selected status.

#### spending

```sql
select date_format(purchase_date, '%Y-%m') `date`, sum(price) value
from (purchases natural join ticket) natural join flight
where customer_email = ? and
  purchase_date <= curdate() and
  purchase_date >= curdate() - interval 6 month
group by date_format(purchase_date, '%Y-%m'), month(purchase_date)
order by `date`
```
This query gets data to draw graph.

```sql
select sum(price) as price
from (purchases natural join ticket) natural join flight
where customer_email = ? and
  purchase_date >= CURDATE() - interval 1 year
```
This query gets sum of price.

```sql
select date_format(purchase_date, '%Y-%m') `date`, sum(price) value
from (purchases natural join ticket) natural join flight
where customer_email = ? and
  purchase_date <= ?
  purchase_date >= ?
group by date_format(purchase_date, '%Y-%m'), month(purchase_date)
order by `date`
```
This query gets data in a range to draw graph.

```sql
select sum(price) as price
from (purchases natural join ticket) natural join flight
where customer_email = ? and
  purchase_date >= ? and
  purchase_date <= ?
```
This query gets sum of price in a range.

### Customer

#### buy

```sql
select flight_num, airline_name, seats 
from flight natural join airplane 
where flight_num = ?
```
This query gets specific flight information.

```sql
select count(ticket_id) as c from ticket
```
This query gets ticket count.

```sql
select count(ticket_id) as d 
from ticket 
where flight_num = ?
group by flight_num
```
This query get ticket count of flight.

```sql
insert into ticket values (?,?,?)
```
This query inserts ticket.

```sql
insert into purchases values (?, ?, ?, ?)
```
This query inserts purchase.

#### flights

```sql
select *
from flight natural join
         (select distinct flight_num
          from ticket natural join purchases
          where customer_email = ?
         ) customer_flights\n" +
where status = 'upcoming'
```
This query gets flights with status upcoming.

```sql
select *
from flight natural join
         (select distinct flight_num
          from ticket natural join purchases
          where customer_email = ?
         ) customer_flights
where status = ?
```
This query gets flights with user selected status.

#### spending

```sql
select date_format(purchase_date, '%Y-%m') `date`, sum(price) value
from (purchases natural join ticket) natural join flight
where customer_email = ? and
  purchase_date <= curdate() and
  purchase_date >= curdate() - interval 6 month
group by date_format(purchase_date, '%Y-%m'), month(purchase_date)
order by `date`
```
This query gets data for a graph.

```sql
select sum(price) as price
from (purchases natural join ticket) natural join flight
where customer_email = ? and
  purchase_date >= CURDATE() - interval 1 year'
```
This query gets sum value to display.

```sql
select date_format(purchase_date, '%Y-%m') `date`, sum(price) value
from (purchases natural join ticket) natural join flight
where customer_email = ? and
  purchase_date <= ?
  purchase_date >= ?
group by date_format(purchase_date, '%Y-%m'), month(purchase_date)
order by `date`
```
This query gets data for a graph of a range.

```sql
select sum(price) as price
from (purchases natural join ticket) natural join flight
where customer_email = ? and
  purchase_date >= CURDATE() - interval 1 year'
```
This query gets sum value of a range to display.

### Staff

#### flights

```sql
select *
from flight
        natural join (select c.name, flight_num
                     from customer c
                            join purchases p on c.email = p.customer_email
                            join ticket t on p.ticket_id = t.ticket_id) customer_flight
where arrival_time <= curdate() + interval 1 month
  and departure_time >= curdate()
  and airline_name = ?
```
This query gets flights with all user in a month.

```sql
select *
from flight
       natural join (select c.name, flight_num
                     from customer c
                            join purchases p on c.email = p.customer_email
                            join ticket t on p.ticket_id = t.ticket_id) customer_flight
where arrival_time <= ?
  and departure_time >= ?
  and arrival_airport = ?
  and departure_airport = ?
  and airline_name = ?
```
This query gets flights with all user in a time range.

#### create flight

```sql
select * from flight 
where airline_name=?
```
This query gets flight by airline.
```sql
insert into flight values (?,?,?,?,?,?,?,?,?)
```
This query creates flight.

#### change status

```sql
update flight set status=? where flight_num =?
```
This query change flight status.

#### create plane

```sql
select * from airplane where airline_name=?
```
This query gets planes.

```sql
insert into airplane values(?,?,?)
```
This query inserts planes.

#### create airport

```sql
insert into airport values (?,?)
```
This query creates airports.

#### view booking agents

```sql
select booking_agent_id, sum(price) total, count(price) value 
from (purchases natural join ticket) natural join flight
where purchase_date <= curdate() and
  purchase_date >= curdate() - interval 12 month and
  booking_agent_id is not null
group by booking_agent_id
order by sum(price) desc limit 5
```
This query gets agent revenue by total.

```sql
select booking_agent_id, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where purchase_date <= curdate() and
  purchase_date >= curdate() - interval 1 month and 
  booking_agent_id is not null
group by booking_agent_id
order by count(price) desc limit 5
```
This query gets agent sorted by month.

```sql
select booking_agent_id, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where purchase_date <= curdate() and
  purchase_date >= curdate() - interval 12 month and 
  booking_agent_id is not null
group by booking_agent_id
order by count(price) desc limit 5
```
This query gets agent sorted by a year.

#### view customer

```sql
select customer_email, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where purchase_date <= curdate() and
  purchase_date >= curdate() - interval 12 month
group by customer_email
order by count(price) desc limit 1
```
This query gets top most customer.

```sql
select airline_name, flight_num, departure_airport, departure_time, arrival_airport, arrival_time, price, status, airplane_id 
from (purchases natural join ticket) natural join flight 
where customer_email = ? and airline_name= ?
```
This query gets data to graph customers.

#### report

```sql
select date_format(purchase_date, '%Y-%m') `date`, count(price) value
from (purchases natural join ticket) natural join flight
where
  purchase_date <= ? and
  purchase_date >= ?
group by date_format(purchase_date, '%Y-%m'), month(purchase_date)
order by `date`
```
This query gets data for graph.

#### revenue

```sql
select date_format(purchase_date, '%Y') `date`, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where
  purchase_date <= curdate() and
  purchase_date >= curdate() - interval 1 month and booking_agent_id is not null
group by date_format(purchase_date, '%Y'), year(purchase_date)
order by `date`
```

This query gets data by a month.

```sql
select date_format(purchase_date, '%Y') `date`, sum(price) total, count(price) value
from (purchases natural join ticket) natural join flight
where
  purchase_date <= curdate() and
  purchase_date >= curdate() - interval 12 month and booking_agent_id is not null
group by date_format(purchase_date, '%Y'), year(purchase_date)
order by `date`
```

This query gets data by a year.

#### top destinations

```sql
select arrival_airport, count(ticket_id) 
from (purchases natural join ticket) natural join flight 
where purchase_date <= curdate() and purchase_date >= curdate() - interval 3 month 
group by arrival_airport 
order by count(ticket_id) desc limit 3
```
This query gets top 3 destinations in 3 months.

```sql
select arrival_airport, count(ticket_id) 
from (purchases natural join ticket) natural join flight 
where purchase_date <= curdate() and purchase_date >= curdate() - interval 12 month 
group by arrival_airport 
order by count(ticket_id) desc limit 3
```
This query gets top 3 destinations in a year.

### searches for all user types

```sql
select * 
from flight 
where departure_airport = ? and 
  arrival_airport = ? and 
  (departure_time >=  ? and arrival_time <= ?)
```
This query gets flights based on user input.

### user creation

This query is created dynamically on the fly, see code for reference.