import React, { useState } from "react";

const ChatMenu = () => {

const [userInfo, setUserInfo] = useState({
rollNumber: "",
});
const [isUserVerified, setIsUserVerified] = useState(false);
const [menuItems, setMenuItems] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [currentKey, setCurrentKey] = useState(null);
const [navigationHistory, setNavigationHistory] = useState([]);
const [chatHistory, setChatHistory] = useState([
{
type: "bot",
title: "Welcome to Student Portal",
options: ["Student", "News", "Event"],
},
]);
const [selectedOption, setSelectedOption] = useState(null);
const [disabledOptions, setDisabledOptions] = useState([]);
const [inputEnabled, setInputEnabled] = useState(false);

const handleUserInput = (field, value) => {
setUserInfo((prev) => ({
...prev,
[field]: value,
}));
};

const handleSubmitUserInfo = async () => {
if (!userInfo.rollNumber) {
return;
}

setInputEnabled(false);
setChatHistory((prev) => [
...prev,
{
type: "user",
text: `Appl: ${userInfo.rollNumber}`,
},
{
type: "bot",
title: "Select an option",
options: ["Results", "Fee Details", "Student Details"],
},
]);
setIsUserVerified(true);
};

const handleOptionClick = async (optionText) => {
if (!optionText) return;

setSelectedOption(optionText);

// If one of the main options is clicked, disable all three
if (["Results", "Fee Details", "Student Details"].includes(optionText)) {
setDisabledOptions((prev) => [
...prev,
"Results",
"Fee Details",
"Student Details",
]);
}
// If one of the program options is clicked, disable all program options
else if (["B.Tech", "M.Tech", "Others"].includes(optionText)) {
setDisabledOptions((prev) => [...prev, "B.Tech", "M.Tech", "Others"]);
}
// For other non-semester options, just disable the clicked one
else if (!optionText.startsWith("Semester")) {
setDisabledOptions((prev) => [...prev, optionText]);
}

// Add user's selection to chat
setChatHistory((prev) => [
...prev,
{
type: "user",
text: optionText,
},
]);

// Handle main menu options
switch (optionText) {
case "Student":
setChatHistory((prev) => [
...prev,
{
type: "bot",
title: "Select your program",
options: ["B.Tech", "M.Tech", "Others"],
},
]);
return;
case "B.Tech":
case "M.Tech":
case "Others":
setInputEnabled(true);
setChatHistory((prev) => [
...prev,
{
type: "bot",
title: "Please provide your Application Number",
},
]);
return;
case "News":
setChatHistory((prev) => [
...prev,
{
type: "bot",
title: "News",
text: "Latest news will be displayed here.",
},
]);
return;
case "Event":
setChatHistory((prev) => [
...prev,
{
type: "bot",
title: "Events",
text: "Upcoming events will be displayed here.",
},
]);
return;
}

// If Results is clicked, show semester options
if (optionText === "Results") {
setChatHistory((prev) => [
...prev,
{
type: "bot",
title: "Select Semester",
options: [
"Semester 1",
"Semester 2",
"Semester 3",
"Semester 4",
"Semester 5",
"Semester 6",
"Semester 7",
"Semester 8",
],
},
]);
return;
}

// Handle semester selection
if (optionText.startsWith("Semester")) {
const semesterNumber = optionText.split(" ")[1];
try {
const response = await fetch(
  `http://localhost:8080/api/v1/student/getresults?Rollno=${userInfo.rollNumber}`,
{
method: "GET",
headers: {
"Content-Type": "application/json",
},
}
);

const data = await response.json();
console.log('API Response:', data);

// Check if data exists and has the expected structure
if (!data) {
throw new Error('No data received from server');
}

// Adjust this based on your actual API response structure
const results = data.results || data.data || data;

if (!Array.isArray(results)) {
throw new Error(`Invalid data format. Expected array, got: ${typeof results}`);
}

const semesterResult = results.find(
(result) => result.semester === parseInt(semesterNumber)
);

if (!semesterResult) {
setChatHistory((prev) => [
...prev,
{
type: "bot",
title: "No Results Found",
text: `No results available for ${optionText}`,
},
]);
return;
}

// Add null check before accessing properties
const resultDisplay = `
Semester ${semesterNumber} Results
----------------------------------------
Total Marks: ${semesterResult.totalMarks || 'N/A'}
Percentage: ${semesterResult.percentage || 'N/A'}%
Result: ${semesterResult.result || 'N/A'}

Subject-wise Marks:
${(semesterResult.subjects || [])
  .map(
    (subject) =>
      `${(subject.name || 'Unknown').padEnd(20)} | ${(subject.marks || 'N/A').toString().padEnd(5)} | ${
        subject.grade || 'N/A'
      }`
  )
  .join("\n")}
`;

setChatHistory((prev) => [
...prev,
{
type: "bot",
title: `Semester ${semesterNumber} Results`,
text: resultDisplay,
},
]);
} catch (error) {
console.error("Error fetching results:", error);
console.error("Full error details:", {
message: error.message,
stack: error.stack
});
setChatHistory((prev) => [
...prev,
{
type: "bot",
title: "Error",
text: `Failed to fetch results: ${error.message}. Please check the console for more details.`,
},
]);
}
return;
}

// Handle other options (Fee Details, Student Details)
try {
let endpoint;
switch (optionText) {
case "Fee Details":
endpoint = `/getfees`;
break;
case "Student Details":
endpoint = `/getall`;
break;
default:
return;
}

const response = await fetch(
`http://localhost:8080/api/v1/student/${endpoint}?Rollno=${userInfo.rollNumber}`,
{
method: "GET",
headers: {
"Content-Type": "application/json",
},
}
);

const data = await response.json();

setChatHistory((prev) => [
...prev,
{
type: "bot",
title: `${optionText} Information`,
text: JSON.stringify(data, null, 2),
},
]);
} catch (error) {
console.error("Error fetching data:", error);
setChatHistory((prev) => [
...prev,
{
type: "bot",
title: "Error",
text: "Failed to fetch data. Please try again.",
},
]);
}
};

const handleClearChat = () => {
setSelectedOption(null);
setDisabledOptions([]); // Reset disabled options
setChatHistory([
{
type: "bot",
title: "Welcome to Student Portal",
options: ["Student", "News", "Event"],
},
]);
setUserInfo({
rollNumber: "",
});
setIsUserVerified(false);
};

return (
<div className="flex flex-col min-h-screen relative">
<div className="flex justify-center items-start pt-8 flex-1 bg-indigo-50">
<div className="w-[90%] max-w-[540px] h-[560px] bg-white rounded-3xl p-6 shadow-lg relative">
<div className="flex flex-col space-y-6 h-full overflow-y-auto pr-2 pb-16">
{chatHistory.map((chat, index) => (
<div key={index} className="flex flex-col space-y-3">
{chat.type === "bot" && (
<>
<div className="bg-emerald-600 text-white px-6 py-3 rounded-full w-fit">
{chat.title}
</div>
{chat.options ? (
<div
className={`grid ${
chat.options.length === 8
? "grid-cols-2 gap-3"
: "flex flex-col space-y-2"
}`}
>
{chat.options.map((option, optIndex) => (
<button
key={optIndex}
onClick={() => handleOptionClick(option)}
disabled={
// Disable if any option in the same group has been selected
selectedOption &&
(
// For program options (B.Tech, M.Tech, Others)
(["B.Tech", "M.Tech", "Others"].includes(option) &&
["B.Tech", "M.Tech", "Others"].includes(selectedOption)) ||
// For main menu options (Student, News, Event)
(["Student", "News", "Event"].includes(option) &&
["Student", "News", "Event"].includes(selectedOption)) ||
// For result options (Results, Fee Details, Student Details)
(["Results", "Fee Details", "Student Details"].includes(option) &&
["Results", "Fee Details", "Student Details"].includes(selectedOption))
) &&
option !== selectedOption
}
className={`px-4 py-2 rounded-full text-sm ${
chat.options.length === 8 ? "w-full" : "w-fit"
} ${
selectedOption &&
(
(["B.Tech", "M.Tech", "Others"].includes(option) &&
["B.Tech", "M.Tech", "Others"].includes(selectedOption)) ||
(["Student", "News", "Event"].includes(option) &&
["Student", "News", "Event"].includes(selectedOption)) ||
(["Results", "Fee Details", "Student Details"].includes(option) &&
["Results", "Fee Details", "Student Details"].includes(selectedOption))
) &&
option !== selectedOption
? "bg-gray-400 cursor-not-allowed"
: "bg-indigo-600 hover:bg-indigo-700"
} text-white`}
>
{option}
</button>
))}
</div>
) : (
<pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded font-mono text-sm">
{chat.text}
</pre>
)}
</>
)}
{chat.type === "user" && (
<div className="flex justify-end">
<div className="bg-violet-600 text-white px-6 py-3 rounded-full w-fit">
{chat.text}
</div>
</div>
)}
</div>
))}
</div>

<div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
<div className="flex space-x-3">
<input
type="text"
placeholder="Enter Here"
value={userInfo.rollNumber}
onChange={(e) => handleUserInput('rollNumber', e.target.value)}
disabled={!inputEnabled}
className={`border p-2 rounded-lg flex-grow ${
!inputEnabled ? 'bg-gray-100' : 'bg-white'
}`}
/>
<button
onClick={handleSubmitUserInfo}
disabled={!inputEnabled}
className={`px-6 py-2 rounded-full ${
!inputEnabled
? 'bg-gray-400 cursor-not-allowed'
: 'bg-indigo-600 hover:bg-indigo-700'
} text-white`}
>
Submit
</button>
</div>
</div>
</div>
</div>
</div>
);
};

export default ChatMenu;