import { useEffect, useState } from "react";

export default function FetchAPI() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickedItems, setTickedItems] = useState(new Set());

  useEffect(() => {
    console.log("useEffect started 🟢");
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        // console.log(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        console.log("useEffect finished 🔴");
      }
    };
    fetchData();
  }, []);

  //   console.log(data);

  const handleTick = (id) => {
    setTickedItems((prev) => {
      const newTickedItems = new Set(prev);
      if (newTickedItems.has(id)) {
        newTickedItems.delete(id);
      } else {
        newTickedItems.add(id);
      }
      return newTickedItems;
    });
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Fetched Data from JSONPlaceholder
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
              tickedItems.has(item.id) ? "bg-green-100 shadow-xl" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold mb-2 text-violet-700 pr-4">
                {item.title}
              </h2>
              <input
                type="checkbox"
                onChange={() => handleTick(item.id)}
                checked={tickedItems.has(item.id)}
              />
            </div>
            <p className="text-gray-700 mt-2">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
