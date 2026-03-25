/* ═══════════════════════════════════════
   LEARNSPHERE – Quiz Data by Topic
   ═══════════════════════════════════════ */

const QUIZ_DATA = {
  "Python Basics": [
    { q: "What is the output of print(type([]))?", o: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], a: 0 },
    { q: "Which keyword is used to define a function in Python?", o: ["func", "define", "def", "function"], a: 2 },
    { q: "What does 'len()' function do?", o: ["Returns the length", "Returns the type", "Returns the sum", "Returns the max"], a: 0 },
    { q: "Which operator is used for exponentiation?", o: ["^", "**", "//", "%"], a: 1 },
    { q: "What is a correct syntax to output 'Hello' in Python?", o: ["echo('Hello')", "print('Hello')", "p('Hello')", "console.log('Hello')"], a: 1 },
    { q: "Which is NOT a Python data type?", o: ["int", "float", "char", "str"], a: 2 },
    { q: "How do you create a variable x with value 5?", o: ["int x = 5", "x = 5", "var x = 5", "let x = 5"], a: 1 },
    { q: "What is the result of 10 // 3?", o: ["3.33", "3", "4", "3.0"], a: 1 },
    { q: "Which method adds an element to a list?", o: ["add()", "push()", "append()", "insert()"], a: 2 },
    { q: "How do you start a comment in Python?", o: ["//", "#", "/*", "--"], a: 1 }
  ],
  "HTML & CSS": [
    { q: "What does HTML stand for?", o: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], a: 0 },
    { q: "Which tag is used for the largest heading?", o: ["<h6>", "<heading>", "<h1>", "<head>"], a: 2 },
    { q: "Which CSS property changes text color?", o: ["text-color", "font-color", "color", "text-style"], a: 2 },
    { q: "Which is the correct CSS syntax?", o: ["body:color=black", "{body;color:black}", "body {color: black;}", "{body:color=black}"], a: 2 },
    { q: "Which HTML element defines an unordered list?", o: ["<ol>", "<ul>", "<li>", "<list>"], a: 1 },
    { q: "What does CSS stand for?", o: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], a: 1 },
    { q: "Which property controls the text size?", o: ["text-size", "font-style", "font-size", "text-style"], a: 2 },
    { q: "How do you select an element with id 'demo'?", o: [".demo", "#demo", "demo", "*demo"], a: 1 },
    { q: "Which tag creates a hyperlink?", o: ["<link>", "<a>", "<href>", "<url>"], a: 1 },
    { q: "Which CSS property adds space inside an element?", o: ["margin", "padding", "spacing", "border"], a: 1 }
  ],
  "JavaScript": [
    { q: "Which company developed JavaScript?", o: ["Microsoft", "Netscape", "Google", "Apple"], a: 1 },
    { q: "How do you declare a variable in modern JS?", o: ["var x", "let x", "int x", "variable x"], a: 1 },
    { q: "What is '===' in JavaScript?", o: ["Assignment", "Loose equality", "Strict equality", "Not equal"], a: 2 },
    { q: "Which method converts a string to an integer?", o: ["Integer.parse()", "parseInt()", "str.toInt()", "Number.int()"], a: 1 },
    { q: "Which event occurs when the user clicks an element?", o: ["onmouseover", "onchange", "onclick", "onmouseclick"], a: 2 },
    { q: "How do you create an array in JavaScript?", o: ["var arr = (1,2,3)", "var arr = [1,2,3]", "var arr = {1,2,3}", "var arr = '1,2,3'"], a: 1 },
    { q: "What does 'NaN' stand for?", o: ["Not a Null", "Not a Number", "Null and None", "Number and Null"], a: 1 },
    { q: "Which method adds an element to the end of an array?", o: ["push()", "pop()", "shift()", "unshift()"], a: 0 },
    { q: "What is the output of typeof null?", o: ["null", "undefined", "object", "boolean"], a: 2 },
    { q: "Which loop executes at least once?", o: ["for", "while", "do...while", "for...in"], a: 2 }
  ],
  "React": [
    { q: "What is React?", o: ["A database", "A JS library for UI", "A CSS framework", "A server language"], a: 1 },
    { q: "What is JSX?", o: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"], a: 0 },
    { q: "Which hook manages state in functional components?", o: ["useEffect", "useState", "useContext", "useReducer"], a: 1 },
    { q: "What is the virtual DOM?", o: ["A browser feature", "A lightweight copy of the real DOM", "A CSS property", "A Node.js module"], a: 1 },
    { q: "How do you pass data to a child component?", o: ["state", "refs", "props", "context"], a: 2 },
    { q: "Which method renders a React component?", o: ["ReactDOM.render()", "React.mount()", "React.display()", "ReactDOM.show()"], a: 0 },
    { q: "What is the purpose of useEffect?", o: ["State management", "Side effects", "Routing", "Styling"], a: 1 },
    { q: "Which is NOT a React lifecycle phase?", o: ["Mounting", "Updating", "Compiling", "Unmounting"], a: 2 },
    { q: "What does 'key' prop help with?", o: ["Styling", "List rendering optimization", "Event handling", "API calls"], a: 1 },
    { q: "What is a React Fragment?", o: ["A broken component", "Grouping elements without extra DOM", "A type of hook", "A CSS module"], a: 1 }
  ],
  "Node.js": [
    { q: "What is Node.js?", o: ["A browser", "A JS runtime", "A database", "A CSS framework"], a: 1 },
    { q: "Which module is used to create an HTTP server?", o: ["url", "http", "path", "fs"], a: 1 },
    { q: "What does npm stand for?", o: ["Node Package Manager", "New Project Manager", "Node Program Maker", "Network Package Manager"], a: 0 },
    { q: "Which function reads a file asynchronously?", o: ["fs.readFile()", "fs.read()", "file.read()", "fs.open()"], a: 0 },
    { q: "What is Express.js?", o: ["A database", "A web framework for Node", "A testing library", "A CSS preprocessor"], a: 1 },
    { q: "Which method starts a server listening?", o: ["server.start()", "app.listen()", "server.run()", "app.begin()"], a: 1 },
    { q: "What is middleware in Express?", o: ["A database layer", "Functions that process requests", "A frontend library", "A CSS module"], a: 1 },
    { q: "How do you import a module in Node.js?", o: ["import mod", "require('mod')", "#include mod", "using mod"], a: 1 },
    { q: "What is the event loop in Node.js?", o: ["A for loop", "Async execution mechanism", "A CSS animation", "A database query"], a: 1 },
    { q: "Which is the default package file?", o: ["node.json", "package.json", "config.json", "app.json"], a: 1 }
  ],
  "Cloud Computing": [
    { q: "What does IaaS stand for?", o: ["Internet as a Service", "Infrastructure as a Service", "Information as a Service", "Integration as a Service"], a: 1 },
    { q: "Which is NOT a cloud provider?", o: ["AWS", "Azure", "GCP", "React"], a: 3 },
    { q: "What is an EC2 instance?", o: ["A database", "A virtual server", "A storage bucket", "A network"], a: 1 },
    { q: "What does S3 stand for?", o: ["Simple Storage Service", "Secure Server System", "Standard Storage Solution", "Smart Service System"], a: 0 },
    { q: "What is cloud elasticity?", o: ["Flexible pricing", "Auto-scaling resources", "Data backup", "Network speed"], a: 1 },
    { q: "Which service is serverless on AWS?", o: ["EC2", "Lambda", "RDS", "VPC"], a: 1 },
    { q: "What is a VPC?", o: ["Virtual Private Cloud", "Virtual Public Computer", "Very Private Connection", "Virtual Process Control"], a: 0 },
    { q: "What does SaaS mean?", o: ["Software as a Service", "Storage as a Service", "Security as a System", "Server as a Service"], a: 0 },
    { q: "Which is a container orchestration tool?", o: ["Docker", "Kubernetes", "Nginx", "Apache"], a: 1 },
    { q: "What is a load balancer?", o: ["Distributes traffic across servers", "Stores data", "Encrypts traffic", "Monitors logs"], a: 0 }
  ],
  "Cybersecurity": [
    { q: "What does CIA stand for in security?", o: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Cyber Intelligence Analysis", "Computer Information Access"], a: 1 },
    { q: "What is phishing?", o: ["A fishing app", "Social engineering attack", "A type of malware", "A firewall type"], a: 1 },
    { q: "What does a firewall do?", o: ["Speeds up internet", "Filters network traffic", "Encrypts data", "Stores passwords"], a: 1 },
    { q: "What is encryption?", o: ["Deleting data", "Converting data to unreadable format", "Compressing files", "Backing up data"], a: 1 },
    { q: "Which is a common vulnerability scanner?", o: ["Photoshop", "Nessus", "Excel", "Slack"], a: 1 },
    { q: "What is two-factor authentication?", o: ["Two passwords", "Two verification methods", "Two usernames", "Two devices"], a: 1 },
    { q: "What is a DDoS attack?", o: ["Data theft", "Overwhelming a server with traffic", "Password cracking", "Software piracy"], a: 1 },
    { q: "What does VPN stand for?", o: ["Virtual Private Network", "Very Private Node", "Virtual Public Network", "Verified Personal Network"], a: 0 },
    { q: "What is malware?", o: ["Good software", "Malicious software", "Mail software", "Management software"], a: 1 },
    { q: "What is the OWASP Top 10?", o: ["A programming language", "Top web security risks", "A cloud service", "A database type"], a: 1 }
  ],
  "Data Science": [
    { q: "What is a DataFrame in pandas?", o: ["A graph", "A 2D data structure", "A function", "A loop"], a: 1 },
    { q: "Which library is used for data visualization?", o: ["NumPy", "Matplotlib", "Requests", "Flask"], a: 1 },
    { q: "What does EDA stand for?", o: ["Extended Data Analysis", "Exploratory Data Analysis", "Electronic Data Access", "External Data Application"], a: 1 },
    { q: "Which method shows first 5 rows of a DataFrame?", o: ["df.first()", "df.head()", "df.top()", "df.show()"], a: 1 },
    { q: "What is a null value?", o: ["Zero", "Missing/undefined data", "Negative number", "Empty string"], a: 1 },
    { q: "Which is used for statistical analysis in Python?", o: ["Django", "SciPy", "Flask", "Tkinter"], a: 1 },
    { q: "What is feature engineering?", o: ["Building hardware", "Creating input variables for ML", "Designing UI", "Writing tests"], a: 1 },
    { q: "What does SQL stand for?", o: ["Simple Query Language", "Structured Query Language", "Standard Question Language", "System Query Logic"], a: 1 },
    { q: "Which chart shows distribution?", o: ["Pie chart", "Histogram", "Line chart", "Scatter plot"], a: 1 },
    { q: "What is correlation?", o: ["Difference between variables", "Statistical relationship between variables", "Sum of variables", "Product of variables"], a: 1 }
  ],
  "Machine Learning": [
    { q: "What is supervised learning?", o: ["Learning without labels", "Learning with labeled data", "Reinforcement learning", "Transfer learning"], a: 1 },
    { q: "Which is a classification algorithm?", o: ["Linear Regression", "K-Means", "Decision Tree", "PCA"], a: 2 },
    { q: "What is overfitting?", o: ["Model too simple", "Model memorizes training data", "Model underfits", "Model crashes"], a: 1 },
    { q: "What does the 'fit' method do?", o: ["Tests the model", "Trains the model", "Deletes the model", "Visualizes the model"], a: 1 },
    { q: "What is a confusion matrix?", o: ["A random grid", "A performance evaluation table", "A data type", "An algorithm"], a: 1 },
    { q: "Which metric measures classification accuracy?", o: ["MSE", "R-squared", "F1 Score", "MAE"], a: 2 },
    { q: "What is cross-validation?", o: ["A password check", "Model validation technique", "Data cleaning", "Feature selection"], a: 1 },
    { q: "What is a neural network?", o: ["A type of database", "A computing system inspired by brain", "A web browser", "A file system"], a: 1 },
    { q: "Which is an unsupervised algorithm?", o: ["Linear Regression", "Logistic Regression", "K-Means Clustering", "Random Forest"], a: 2 },
    { q: "What is gradient descent?", o: ["A hiking technique", "An optimization algorithm", "A data structure", "A sorting method"], a: 1 }
  ],
  "AWS": [
    { q: "What is AWS?", o: ["A web browser", "Amazon Web Services", "A programming language", "An operating system"], a: 1 },
    { q: "Which AWS service is for object storage?", o: ["EC2", "S3", "RDS", "Lambda"], a: 1 },
    { q: "What is IAM in AWS?", o: ["Internet Access Manager", "Identity and Access Management", "Internal Application Module", "Integrated API Manager"], a: 1 },
    { q: "Which database service is managed by AWS?", o: ["MongoDB Atlas", "RDS", "MySQL Local", "SQLite"], a: 1 },
    { q: "What is CloudFront?", o: ["A CDN service", "A compute service", "A storage service", "A database service"], a: 0 },
    { q: "What is an AMI?", o: ["Amazon Machine Image", "AWS Module Instance", "Auto Managed Infrastructure", "Application Management Interface"], a: 0 },
    { q: "Which service sends notifications?", o: ["SQS", "SNS", "SES", "S3"], a: 1 },
    { q: "What is Route 53?", o: ["A DNS service", "A routing protocol", "An API gateway", "A load balancer"], a: 0 },
    { q: "What is an Availability Zone?", o: ["A time zone", "An isolated data center location", "A pricing tier", "A security group"], a: 1 },
    { q: "Which service is used for container deployment?", o: ["ECS", "S3", "SNS", "CloudWatch"], a: 0 }
  ],
  "Networking": [
    { q: "What does TCP stand for?", o: ["Transfer Control Protocol", "Transmission Control Protocol", "Total Connection Protocol", "Transport Communication Protocol"], a: 1 },
    { q: "Which layer is HTTP in the OSI model?", o: ["Physical", "Transport", "Application", "Network"], a: 2 },
    { q: "What is an IP address?", o: ["A website name", "A unique device identifier", "A password", "A file type"], a: 1 },
    { q: "What does DNS do?", o: ["Encrypts data", "Translates domain names to IPs", "Stores files", "Sends emails"], a: 1 },
    { q: "What is a subnet?", o: ["A submarine network", "A subdivision of an IP network", "A web browser", "A protocol"], a: 1 },
    { q: "Which port does HTTPS use?", o: ["80", "443", "22", "21"], a: 1 },
    { q: "What is a MAC address?", o: ["An Apple computer address", "A hardware identifier", "A software license", "An IP type"], a: 1 },
    { q: "What does DHCP do?", o: ["Assigns IP addresses automatically", "Encrypts traffic", "Routes packets", "Stores data"], a: 0 },
    { q: "What is a router?", o: ["A storage device", "A device that forwards packets between networks", "A monitor", "A keyboard"], a: 1 },
    { q: "What is latency?", o: ["Download speed", "Delay in data transmission", "Upload speed", "Bandwidth"], a: 1 }
  ],
  "Default": [
    { q: "What is an algorithm?", o: ["A programming language", "A step-by-step procedure", "A data type", "A hardware component"], a: 1 },
    { q: "What does API stand for?", o: ["Application Programming Interface", "Applied Program Integration", "Automated Process Input", "Application Process Interface"], a: 0 },
    { q: "What is version control?", o: ["Software pricing", "Tracking changes in code", "Testing software", "Designing UI"], a: 1 },
    { q: "Which is a popular version control system?", o: ["Excel", "Git", "Word", "Photoshop"], a: 1 },
    { q: "What is debugging?", o: ["Adding bugs", "Finding and fixing errors", "Writing code", "Deleting code"], a: 1 },
    { q: "What does IDE stand for?", o: ["Internet Development Engine", "Integrated Development Environment", "Internal Data Exchange", "Intelligent Design Editor"], a: 1 },
    { q: "What is open source software?", o: ["Free software with source code available", "Paid software", "Hardware", "A virus"], a: 0 },
    { q: "What is agile methodology?", o: ["A programming language", "Iterative development approach", "A database type", "A testing tool"], a: 1 },
    { q: "What is a database?", o: ["A web browser", "An organized collection of data", "A programming language", "An operating system"], a: 1 },
    { q: "What is cloud computing?", o: ["Weather forecasting", "Delivering computing services over the internet", "A type of hardware", "A programming paradigm"], a: 1 }
  ]
};

// Map certifications/domains to quiz topics
const CERT_QUIZ_MAP = {
  "AWS Solutions Architect": ["AWS", "Cloud Computing", "Networking"],
  "Azure Administrator": ["Cloud Computing", "Networking", "Cybersecurity"],
  "Google Cloud Professional": ["Cloud Computing", "Networking", "Python Basics"],
  "CompTIA Security+": ["Cybersecurity", "Networking", "Default"],
  "CEH": ["Cybersecurity", "Networking", "Default"],
  "CISSP": ["Cybersecurity", "Networking", "Cloud Computing"],
  "IBM Data Science": ["Data Science", "Python Basics", "Machine Learning"],
  "Google Data Analytics": ["Data Science", "Python Basics", "Default"],
  "Microsoft DP-900": ["Data Science", "Cloud Computing", "Default"],
  "TensorFlow Developer": ["Machine Learning", "Python Basics", "Data Science"],
  "AWS ML Specialty": ["Machine Learning", "AWS", "Python Basics"],
  "Azure AI Engineer": ["Machine Learning", "Cloud Computing", "Python Basics"],
  "CCNA": ["Networking", "Cybersecurity", "Default"],
  "CompTIA Network+": ["Networking", "Default", "Cybersecurity"],
  "Juniper JNCIA": ["Networking", "Default", "Cybersecurity"],
  "Meta Frontend Developer": ["React", "JavaScript", "HTML & CSS"],
  "Google UX Design": ["HTML & CSS", "JavaScript", "Default"],
  "PMP": ["Default", "Default", "Default"],
  "Scrum Master": ["Default", "Default", "Default"],
  "AWS Cloud Practitioner": ["AWS", "Cloud Computing", "Default"],
  "Azure Fundamentals": ["Cloud Computing", "Default", "Networking"]
};

function getQuizForCert(certName) {
  const topics = CERT_QUIZ_MAP[certName] || ["Default"];
  let questions = [];
  topics.forEach(topic => {
    const pool = QUIZ_DATA[topic] || QUIZ_DATA["Default"];
    questions = questions.concat(pool);
  });
  // Shuffle and pick 10
  questions = questions.sort(() => Math.random() - 0.5);
  return questions.slice(0, 10);
}
