/*credit pseudometa*/

const config = dv.current().file.tasks 
	.filter(t => t.text.includes("config")) 
	.filter (t => t.completed) 
	.map (t => t.text.split("%%")[0].trim()); 
	
const coffee = config.find(e => e.includes("Coffee") );
const chores = config.find(e => e.includes("Chores") );
const walk = config.find(e => e.includes("Walk") );
const read = config.find(e => e.includes("Read") );
const write = config.find(e => e.includes("Write") );
const note = config.find(e => e.includes("Note") );
const play = config.find(e => e.includes("Play") );
const nap = config.find(e => e.includes("Nap") );
const vitamin = config.find(e => e.includes("Vitamin") );

if (coffee) dv.span ("βοΈ ");
if (chores) dv.span ("π§Ή ");
if (walk) dv.span ("πΆπ»ββοΈ ");
if (read) dv.span ("π ");
if (write) dv.span ("π ");
if (note) dv.span ("π ");
if (play) dv.span ("πͺ ");
if (nap) dv.span ("π ");
if (vitamin) dv.span ("π ");
