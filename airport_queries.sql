/* a. Show all the upcoming flights in the system. */
select * from flight where status='upcoming';
/* b. Show all of the delayed flights in the system. */
select * from flight where status='delayed';
/* c. Show the customer names who used booking agent to buy the tickets. */
select customer.name 
from customer join purchases on (customer.email = purchases.customer_email) 
where booking_agent_id is not null;
/* d. Show all of the airplanes owned by the airline (such as "Emirates") */
select * from airplane where airline_name='China Eastern';
