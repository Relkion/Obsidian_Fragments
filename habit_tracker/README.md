---
title:  Habit Tracker Walkthrough
author: Relkion
created: 2022-08-12 05:16
modified: 2022-08-12 05:54
aliases: []
universe: reality
type: guide
category: walkthrough
tags: []
status: 🌳
priority: ✅
---

# [[Habit Tracker Walkthrough]]

## Requirements

### Absolutely Needed

- [Dataview](https://github.com/blacksmithgu/obsidian-dataview) : have JavaScript enabled under settings

Scripts:
- [pseudometa hack](https://discord.com/channels/686053708261228577/744933215063638183/1006683032293490760) : the emoji from tasks is from here.
- [pyrochlore/obsidian-tracker · GitHub](https://github.com/pyrochlore/obsidian-tracker/blob/master/examples/TestCalendar.md) : the habit tracker script is

### For Aethetics

- [Modular CSS layout](https://github.com/efemkay/obsidian-modular-css-layout) : this is needed to get the columns.
- [GitHub - mgmeyers/obsidian-style-settings: A dynamic user interface for adjusting theme, plugin, and snippet CSS variables within Obsidian](https://github.com/mgmeyers/obsidian-style-settings) : to control the aforementioned modular layout
- [Noto Emoji](https://fonts.google.com/noto/specimen/Noto+Emoji) : for the black and white emoji

## The Template

Put this wherever in your daily notes and it should work as long as your date format is YYYY-MM-DD. You can rename the header and add or subtract as many habits as you like as long as they have `%% config %%` at the end. You can also place your habit checkboxes wherever in your note if you want to go that route.

%%Template starts here%%
## 🌟 Daily Trackers

> [!multi-column]
>
>> [!track-box]
>> - [ ] Coffee %% config %%
>> - [ ] Chores %% config %%
>> - [ ] Walk %% config %%
>
>> [!track-box]
>> - [ ] Read %% config %%
>> - [ ] Write %% config %%
>> - [ ] Note %% config %%
>
>> [!track-box]
>> - [ ] Play %% config %%
>> - [ ] Nap %% config %%
>> - [ ] Vitamin %% config %%
>
>> [!track-tog]
>> ![image|100](https://cdn-icons-png.flaticon.com/512/2608/2608888.png)
>> 

> [!track-tog]
> ```dataviewjs
> dv.view("⼼The Underside/996 Scripts/Dataview Scripts/tracker_toggles", "")
>```

> [!table] Last 7 Days
>```dataviewjs
> dv.view("⼼The Underside/996 Scripts/Dataview Scripts/habit_tracker", "")
>```

%%Template ends here%%

## Breaking it Down
### CSS
1. [Modular CSS layout](https://github.com/efemkay/obsidian-modular-css-layout) : have the width for "Mininum Subcallout Width" under Style Settings as low as possible.

2. For the `[!track-box]` and `[!track-tog]` callouts, use the following CSS saved in a snippet. Its purpose is to have the checkbox columns aligned more aesthetically and style the emoji bar with enlarged icons respectively.

```css

div[data-callout="track-box"].callout, div[data-callout="track-box"].callout > .callout-content {
	border: 0 !important;
	margin: 0;
	padding: 0;
	background: unset !important;
	align-self: center;
}
div[data-callout="track-box"].callout > .callout-title { display: none; }

div[data-callout="track-tog"].callout, div[data-callout="track-tog"].callout > .callout-content {
	border: 0 !important;
	margin: 0;
	padding: 0;
	background: unset !important;
	text-align: center;
	font-size: 18px;
}
div[data-callout="track-tog"].callout > .callout-title { display: none; }

```
 [Noto Emoji](https://fonts.google.com/noto/specimen/Noto+Emoji) : in your yaml, add `periodic-note` to cssclass and save this as a snippet. It should also work lumped with the previous css in one file.

```css
.periodic-note {
	--font-text: var(--font-text-override), var(--font-text-theme), var(--custom-emoji-font), var(--font-default);

}
```

### The Scripts

There are two different code blocks, and to prevent having a huge block of code within your daily note, they are linked via `dv.view`. Save the two scripts as separate .js files and place them within your vault somewhere. Make sure to replace the in the correct paths in the code block.

#### Tracker Toggles

3. Replace the different habits with your respective habits and assign emojis.

```js
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


if (coffee) dv.span ("☕️ ");
if (chores) dv.span ("🧹 ");
if (walk) dv.span ("🚶🏻‍♀️ ");
if (read) dv.span ("📚 ");
if (write) dv.span ("🖋 ");
if (note) dv.span ("📝 ");
if (play) dv.span ("🪁 ");
if (nap) dv.span ("🛏 ");
if (vitamin) dv.span ("💊 ");
```

#### Habit Tracker

4. Replace the correct path to the file in your vault and label your tasks with whatever emoji. 

**Disclaimer:** I can't take credit for this, my husband was kind enough to rewrite everything for me. ❤️

```js
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

//replace these with whatever emojis are needed
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
```

---

Have fun!