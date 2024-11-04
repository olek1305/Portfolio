export default function Home() {
  return (
    <body>
      <div className="h-screen bg-gray-900 text-gray-300 p-4 ">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-4">
          {/* Sidebar */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-lg font-bold text-white">
                Hello! I'm Aleksander Żak
              </h2>
              <p>A passionate developer PHP</p>
            </div>

            <div className="bg-gray-800 p-4 rounded space-y-2">
              <h3 className="text-md font-semibold text-orange-400">
                Experience
              </h3>
              <ul className="space-y-1">
                <li></li>
                <li></li>
                {/* Add more experiences as needed */}
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded space-y-2">
              <h3 className="text-md font-semibold text-orange-400">Skills</h3>
              <ul className="space-y-1">
                <li></li>
                <li></li>
                {/* Add more experiences as needed */}
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded space-y-2">
              <h3 className="text-md font-semibold text-orange-400">
                Projects
              </h3>
              <ul className="space-y-1">
                <li></li>
                <li></li>
                {/* Add more projects as needed */}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-2 bg-gray-800 p-6 rounded space-y-4 h-full">
            {/* pick from nav */}
          </div>
        </div>
      </div>
    </body>
  );
}
