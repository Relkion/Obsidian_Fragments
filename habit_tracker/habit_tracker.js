/*credit https://github.com/adamhl8/dataviewjs-habit-tracker */

const habits = [] // Array of objects for each page's tasks.
const defaultHeaders = ["Day"]
const headers = new Set(defaultHeaders) // Set of task names to be used as table headers.
const rows = []

const noteDay = dv.current().file.day
const pages = dv
	.pages('"0Home/01 Daily Notes"')
	.where((p) => p.file.day < noteDay) // Excludes current note in table.
	.where((p) => p.file.day >= noteDay.minus({ days: 7 })) // Only include previous week in table.
	.sort((p) => p.file.day, "desc") // Sort table by most recent day.

for (const page of pages) {
	// Only include tasks with "%% config %%".
	const pageHabits = page.file.tasks
		.filter((t) => t.text.match("%% config %%"))
	
	const noteLink = page.file.link
	noteLink.display = page.file.day.weekdayLong // Set display name of the note link to the day of the week.
	const habitsObject = { noteLink }

	for (const habit of pageHabits) {
		const habitStr = habit.text.split(' ✅')[0]; // Prevents ✅ Completion dates from Tasks plugin from spawning new habits
		habitsObject[habitStr] = habit.completed // Build habitsObject. Key is the task's text. Value is tasks's completion.
		let headerText = habitStr;
		headers.add(headerText) // Build headers set where each header is the task's text.
	}
	
	habits.push(habitsObject)
}

for (const habitsObject of habits) {
	const row = [habitsObject.noteLink] // Start building row data. Fill in first value (Day) with note link.
	for (const header of headers) {
		if (defaultHeaders.includes(header)) continue // Don't overwrite default headers.
		
		let habitStatus = "–" // This emoji is seen if a corresponding task doesn't exist for a header (e.g. task didn't previously exist).
		if (habitsObject.hasOwnProperty(header)) // If task exists, we know it must be complete or incomplete.
			habitStatus = habitsObject[header] ? "●" : " "
		row.push(habitStatus)
	}
	rows.push(row)
}

let replacedHeaders = new Set();
for (let header of headers) {
    const replacedHeader = 
	    header.match("Coffee") ? "☕️" :
	    header.match("Chores") ? "🧹" :
	    header.match("Walk") ? "🚶🏻‍♀️" :
	    header.match("Read") ? "📚" :
	    header.match("Write") ? "🖋" :
	    header.match("Note") ? "📝" :
	    header.match("Play") ? "🪁" :
	    header.match("Nap") ? "🛏" :
	    header.match("Vitamin") ? "💊" :
	    header;
	replacedHeaders.add(replacedHeader)
}

dv.table(replacedHeaders, rows)
