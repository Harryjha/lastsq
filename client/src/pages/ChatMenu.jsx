import React, { useState } from "react";

const ChatMenu = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    rollNumber: "",
    dateOfBirth: "",
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

  const handleUserInput = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitUserInfo = async () => {
    // Here you can add validation if needed
    if (!userInfo.name || !userInfo.rollNumber || !userInfo.dateOfBirth) {
      return;
    }

    setChatHistory((prev) => [
      ...prev,
      {
        type: "user",
        text: `Name: ${userInfo.name}, Roll: ${userInfo.rollNumber}, DOB: ${userInfo.dateOfBirth}`,
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
            title: "Please provide your details",
            isUserInput: true,
            inputFields: [
              { label: "Name", key: "name", type: "text" },
              { label: "Roll Number", key: "rollNumber", type: "text" },
              { label: "Date of Birth", key: "dateOfBirth", type: "date" },
            ],
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
          `http://localhost:5000/api/student/${userInfo.rollNumber}/results`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        const semesterResult = data.results.find(
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

        // Create a formatted table-like display
        const resultDisplay = `
Semester ${semesterNumber} Results
----------------------------------------
Total Marks: ${semesterResult.totalMarks}
Percentage: ${semesterResult.percentage}%
Result: ${semesterResult.result}

Subject-wise Marks:
${semesterResult.subjects
  .map(
    (subject) =>
      `${subject.name.padEnd(20)} | ${subject.marks.toString().padEnd(5)} | ${
        subject.grade
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
        setChatHistory((prev) => [
          ...prev,
          {
            type: "bot",
            title: "Error",
            text: "Failed to fetch results. Please try again.",
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
          endpoint = `/fees`;
          break;
        case "Student Details":
          endpoint = ``;
          break;
        default:
          return;
      }

      const response = await fetch(
        `http://localhost:5000/api/student/${userInfo.rollNumber}${endpoint}`,
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
      name: "",
      rollNumber: "",
      dateOfBirth: "",
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
                    {chat.isUserInput ? (
                      <div className="flex flex-col space-y-3">
                        {chat.inputFields.map((field) => (
                          <input
                            key={field.key}
                            type={field.type}
                            placeholder={field.label}
                            value={userInfo[field.key]}
                            onChange={(e) =>
                              handleUserInput(field.key, e.target.value)
                            }
                            className="border p-2 rounded-lg"
                          />
                        ))}
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSubmitUserInfo}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700"
                          >
                            Submit
                          </button>
                          <button
                            onClick={handleClearChat}
                            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600"
                          >
                            Clear Chat
                          </button>
                        </div>
                      </div>
                    ) : chat.options ? (
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
                              // Disable if option is in disabledOptions array
                              disabledOptions.includes(option) ||
                              // Disable main menu options (Student, News, Event) after selection
                              (!option.startsWith("Semester") &&
                                ![
                                  "Results",
                                  "Fee Details",
                                  "Student Details",
                                ].includes(option) &&
                                (option === selectedOption ||
                                  (selectedOption &&
                                    selectedOption !== option)))
                            }
                            className={`px-4 py-2 rounded-full text-sm ${
                              chat.options.length === 8 ? "w-full" : "w-fit"
                            } ${
                              disabledOptions.includes(option) ||
                              (!option.startsWith("Semester") &&
                                ![
                                  "Results",
                                  "Fee Details",
                                  "Student Details",
                                ].includes(option) &&
                                (option === selectedOption ||
                                  (selectedOption &&
                                    selectedOption !== option)))
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
        </div>
      </div>
    </div>
  );
};

export default ChatMenu;
